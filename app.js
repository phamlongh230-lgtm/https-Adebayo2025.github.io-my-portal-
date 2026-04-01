const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'jnmt_secret_2025_minimum_32_characters_length!';

// ===== MIDDLEWARE =====
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// ===== RATE LIMITING =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request
  message: 'Quá nhiều yêu cầu, vui lòng thử lại sau!'
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 lần login/register
  message: 'Quá nhiều lần thử, vui lòng đợi 15 phút!'
});

app.use('/api/', limiter);
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

// ===== VALIDATION HELPERS =====
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

function isValidUsername(username) {
  return username && username.length >= 3 && username.length <= 30;
}

// ===== DATABASE =====
const DB_FILE = path.join(__dirname, 'db.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = { users: [], messages: [], backups: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error('Database read error:', e);
    return { users: [], messages: [], backups: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Database write error:', e);
    return false;
  }
}

function backupDB(data) {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      data: { ...data }
    };
    if (data.backups && data.backups.length >= 10) {
      data.backups.shift();
    }
    if (!data.backups) data.backups = [];
    data.backups.push(backup);
  } catch (e) {
    console.error('Backup error:', e);
  }
}

// ===== AUTH MIDDLEWARE =====
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Không có token!' });
  }
  
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn!' });
    }
    return res.status(401).json({ message: 'Token không hợp lệ!' });
  }
}

// ===== TEST ENDPOINT =====
app.get('/api', function(req, res) {
  res.json({ 
    message: 'JNMT Server đang chạy!', 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ===== REGISTER =====
app.post('/api/register', function(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ!' });
    }

    if (!isValidUsername(username)) {
      return res.status(400).json({ message: 'Tên người dùng phải từ 3-30 ký tự!' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ!' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Mật khẩu ít nhất 6 ký tự!' });
    }

    const db = readDB();
    const exists = db.users.find(u => 
      u.email === email.toLowerCase() || u.username === username.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ message: 'Email hoặc tên người dùng đã tồn tại!' });
    }

    bcrypt.hash(password, 10, function(err, hashed) {
      if (err) {
        return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu!' });
      }

      const user = {
        id: Date.now().toString(),
        username: username,
        email: email.toLowerCase(),
        password: hashed,
        avatar: '',
        role: 'user',
        createdAt: new Date().toISOString()
      };

      db.users.push(user);
      backupDB(db);
      writeDB(db);

      const token = jwt.sign(
        { id: user.id, username: username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Đăng ký thành công!',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        }
      });
    });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== LOGIN =====
app.post('/api/login', function(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ!' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ!' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu sai!' });
    }

    bcrypt.compare(password, user.password, function(err, match) {
      if (err || !match) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu sai!' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Đăng nhập thành công!',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar || ''
        }
      });
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== GET USER INFO =====
app.get('/api/me', auth, function(req, res) {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || '',
      role: user.role
    });
  } catch (e) {
    console.error('Get user error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== CHANGE PASSWORD =====
app.post('/api/change-password', auth, function(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ!' });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'Mật khẩu mới ít nhất 6 ký tự!' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'Mật khẩu mới phải khác mật khẩu cũ!' });
    }

    const db = readDB();
    const userIdx = db.users.findIndex(u => u.id === req.user.id);

    if (userIdx === -1) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    bcrypt.compare(oldPassword, db.users[userIdx].password, function(err, match) {
      if (err || !match) {
        return res.status(401).json({ message: 'Mật khẩu cũ không đúng!' });
      }

      bcrypt.hash(newPassword, 10, function(err2, hashed) {
        if (err2) {
          return res.status(500).json({ message: 'Lỗi mã hóa mật khẩu!' });
        }

        db.users[userIdx].password = hashed;
        db.users[userIdx].passwordChangedAt = new Date().toISOString();
        backupDB(db);
        writeDB(db);

        res.json({ message: 'Đổi mật khẩu thành công!' });
      });
    });
  } catch (e) {
    console.error('Change password error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== GET MESSAGES =====
app.get('/api/messages', function(req, res) {
  try {
    const db = readDB();
    const limit = parseInt(req.query.limit) || 100;
    const messages = db.messages.slice(-Math.min(limit, 500));
    
    res.json({
      count: messages.length,
      messages: messages
    });
  } catch (e) {
    console.error('Get messages error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== POST MESSAGE =====
app.post('/api/messages', auth, function(req, res) {
  try {
    let { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Tin nhắn không được để trống!' });
    }

    text = text.trim().substring(0, 1000); // Giới hạn 1000 ký tự

    const db = readDB();
    const msg = {
      id: Date.now().toString(),
      userId: req.user.id,
      username: req.user.username,
      text: text,
      createdAt: new Date().toISOString()
    };

    db.messages.push(msg);
    
    // Giữ tối đa 1000 tin nhắn
    if (db.messages.length > 1000) {
      db.messages = db.messages.slice(-1000);
    }

    backupDB(db);
    writeDB(db);

    res.status(201).json(msg);
  } catch (e) {
    console.error('Post message error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== DELETE MESSAGE =====
app.delete('/api/messages/:id', auth, function(req, res) {
  try {
    const db = readDB();
    const msgIdx = db.messages.findIndex(m => m.id === req.params.id);

    if (msgIdx === -1) {
      return res.status(404).json({ message: 'Không tìm thấy tin nhắn!' });
    }

    const msg = db.messages[msgIdx];
    if (msg.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa tin nhắn này!' });
    }

    db.messages.splice(msgIdx, 1);
    backupDB(db);
    writeDB(db);

    res.json({ message: 'Đã xóa tin nhắn!' });
  } catch (e) {
    console.error('Delete message error:', e);
    res.status(500).json({ message: 'Lỗi server!' });
  }
});

// ===== AI PROXY - GROQ =====
app.post('/api/ai', async function(req, res) {
  try {
    let { messages, system } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Vui lòng gửi tin nhắn!' });
    }

    // Giới hạn số lượng tin nhắn
    if (messages.length > 20) {
      messages = messages.slice(-20);
    }

    // Validate message format
    messages = messages.filter(m => 
      m.role && (m.role === 'user' || m.role === 'assistant') && m.content
    );

    if (messages.length === 0) {
      return res.status(400).json({ message: 'Định dạng tin nhắn không hợp lệ!' });
    }

    system = system || 'Bạn là trợ lý AI của trường JNMT. Hỗ trợ học sinh người Việt, Hàn, Mông Cổ, Kazakhstan, Nga. Trả lời ngắn gọn, hữu ích, thân thiện.';

    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ message: 'Chưa cấu hình GROQ_API_KEY trên server!' });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'system', content: system }].concat(messages),
          max_tokens: 1024,
          temperature: 0.7,
          top_p: 1
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        return res.status(response.status).json({ 
          message: 'Lỗi API Groq!',
          error: errorData.error?.message || 'Unknown error'
        });
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        return res.status(500).json({ message: 'Phản hồi không hợp lệ từ Groq!' });
      }

      const reply = data.choices[0].message.content;
      res.json({ reply: reply });

    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({ message: 'Yêu cầu hết thời gian chờ!' });
      }
      console.error('Fetch error:', fetchErr);
      res.status(500).json({ message: 'Lỗi kết nối API!', error: fetchErr.message });
    }

  } catch (e) {
    console.error('AI endpoint error:', e);
    res.status(500).json({ message: 'Lỗi server!', error: e.message });
  }
});

// ===== HEALTH CHECK =====
app.get('/api/health', function(req, res) {
  try {
    const db = readDB();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      users: db.users.length,
      messages: db.messages.length
    });
  } catch (e) {
    res.status(500).json({ status: 'unhealthy', error: e.message });
  }
});

// ===== 404 HANDLER =====
app.use(function(req, res) {
  res.status(404).json({ message: 'Endpoint không tồn tại!' });
});

// ===== ERROR HANDLER =====
app.use(function(err, req, res, next) {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: 'Lỗi server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== START SERVER =====
const server = app.listen(PORT, '0.0.0.0', function() {
  console.log(`✓ JNMT Server chạy tại http://localhost:${PORT}`);
  console.log(`✓ Thời gian khởi động: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', function() {
  console.log('SIGTERM nhận được, đóng server...');
  server.close(function() {
    console.log('Server đã đóng');
    process.exit(0);
  });
});

module.exports = app;
