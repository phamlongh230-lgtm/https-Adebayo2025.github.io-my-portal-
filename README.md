# JNMT Student Hub v3.0.1

🎓 **Nền tảng học tập đa ngôn ngữ cho 전남미래국제고등학교**

## 📋 Mục lục
- [Tính năng](#tính-năng)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)
- [Triển khai](#triển-khai)
- [Khắc phục sự cố](#khắc-phục-sự-cố)

## ✨ Tính năng

### 🔐 Xác thực
- ✅ Đăng ký người dùng với xác thực email
- ✅ Đăng nhập an toàn với JWT
- ✅ Đổi mật khẩu
- ✅ Session quản lý

### 💬 Messaging
- ✅ Chat cộng đồng theo thời gian thực
- ✅ Xóa tin nhắn của bản thân
- ✅ Lưu trữ 1000 tin nhắn gần nhất
- ✅ Hiển thị thời gian gửi

### 🤖 AI Assistant
- ✅ Trợ lý AI sử dụng Groq API
- ✅ Hỗ trợ cuộc hội thoại liên tục
- ✅ Timeout & error handling
- ✅ System prompt tùy chỉnh

### 🌍 Đa ngôn ngữ
- ✅ Tiếng Việt (vi)
- ✅ Tiếng Hàn (ko)
- ✅ Tiếng Anh (en)
- ✅ Tiếng Mông Cổ (mn)
- ✅ Tiếng Kazakh (kk)
- ✅ Tiếng Nga (ru)

### 🎨 Giao diện
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Mobile-friendly

### 🛡️ Bảo mật
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection
- ✅ Password hashing (bcryptjs)

## 📦 Yêu cầu

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0
- **Groq API Key**: Lấy từ https://console.groq.com

## 🚀 Cài đặt

### 1. Clone hoặc tải dự án
```bash
cd jnmt-v3
npm install
```

### 2. Tạo file `.env`
```bash
cp .env.example .env
```

### 3. Cấu hình `.env`
```env
# Server
NODE_ENV=development
PORT=3001

# JWT Secret (THAY ĐỔI GIÁ TRỊ NÀY!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_change_this_please_2025

# Groq API Key
GROQ_API_KEY=your_groq_api_key_here

# CORS
CORS_ORIGIN=*
```

### 4. Cấu trúc thư mục
```
jnmt-v3/
├── server.js           # Backend Express
├── package.json        # Dependencies
├── .env                # Environment variables
├── .env.example        # Template .env
├── .gitignore          # Git ignore file
├── db.json             # Database (auto-generated)
└── frontend/
    ├── index.html      # HTML chính
    ├── style.css       # Stylesheet
    ├── app.js          # Frontend logic
    └── i18n.js         # Translations
```

## ⚙️ Chạy ứng dụng

### Mode phát triển (với hot reload)
```bash
npm run dev
```

### Mode sản xuất
```bash
npm start
```

Truy cập: http://localhost:3001

## 📚 API Endpoints

### Authentication

#### POST `/api/register`
Đăng ký người dùng mới
```json
{
  "username": "string (3-30 ký tự)",
  "email": "string",
  "password": "string (ít nhất 6 ký tự)"
}
```

#### POST `/api/login`
Đăng nhập
```json
{
  "email": "string",
  "password": "string"
}
```

#### GET `/api/me`
Lấy thông tin người dùng (require auth)
```
Headers: Authorization: Bearer <token>
```

#### POST `/api/change-password`
Đổi mật khẩu (require auth)
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### Messages

#### GET `/api/messages`
Lấy 100 tin nhắn gần nhất
```
Query params: ?limit=50
```

#### POST `/api/messages`
Gửi tin nhắn mới (require auth)
```json
{
  "text": "string (max 1000 ký tự)"
}
```

#### DELETE `/api/messages/:id`
Xóa tin nhắn (require auth, chỉ chủ sở hữu)

### AI

#### POST `/api/ai`
Gọi AI assistant
```json
{
  "messages": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ],
  "system": "string (optional)"
}
```

### Health Check

#### GET `/api/health`
Kiểm tra trạng thái server

## 🌐 Triển khai

### Triển khai với Heroku

```bash
# 1. Tạo Procfile
echo "web: node server.js" > Procfile

# 2. Push lên Heroku
heroku create jnmt-v3
heroku config:set JWT_SECRET=your_secret_key
heroku config:set GROQ_API_KEY=your_groq_key
git push heroku main
```

### Triển khai với PM2

```bash
npm install -g pm2

# Start
pm2 start server.js --name "jnmt"

# Monitor
pm2 monit

# Stop
pm2 stop jnmt

# Logs
pm2 logs jnmt
```

### Triển khai với Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

Build và run:
```bash
docker build -t jnmt-v3 .
docker run -p 3001:3001 -e JWT_SECRET=xxx -e GROQ_API_KEY=xxx jnmt-v3
```

### Triển khai với Render.com

1. Push code lên GitHub
2. Kết nối GitHub với Render
3. Tạo Web Service
4. Thêm environment variables:
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `NODE_ENV=production`
5. Deploy

## 🔧 Khắc phục sự cố

### Lỗi: "Cannot find module 'express'"
```bash
npm install
```

### Lỗi: "GROQ_API_KEY not configured"
- Kiểm tra file `.env` có `GROQ_API_KEY`
- Restart server

### Lỗi: "Token not valid"
- Clear localStorage
- Đăng nhập lại
- Kiểm tra `JWT_SECRET` trùng với lúc tạo token

### Database bị lỗi
- Xóa file `db.json`
- Restart server (sẽ tạo file mới)

### Port 3001 đã được sử dụng
```bash
# Thay đổi PORT trong .env
PORT=3002
```

## 📊 Database Schema

### Users
```json
{
  "id": "timestamp",
  "username": "string",
  "email": "string",
  "password": "bcrypt hash",
  "avatar": "string",
  "role": "user|admin",
  "createdAt": "ISO timestamp",
  "passwordChangedAt": "ISO timestamp"
}
```

### Messages
```json
{
  "id": "timestamp",
  "userId": "string",
  "username": "string",
  "text": "string",
  "createdAt": "ISO timestamp"
}
```

## 🔐 Bảo mật

### Best Practices
1. ✅ Luôn sử dụng HTTPS trên production
2. ✅ Thay đổi `JWT_SECRET` thành giá trị ngẫu nhiên 32+ ký tự
3. ✅ Giữ `GROQ_API_KEY` bí mật (không commit)
4. ✅ Enable CORS với specific origins
5. ✅ Use rate limiting
6. ✅ Validate tất cả inputs
7. ✅ Hash passwords với bcryptjs
8. ✅ Set `NODE_ENV=production`

### Tạo JWT Secret an toàn
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📈 Cải thiện hiệu suất

1. **Caching**: Thêm Redis cho messages
2. **Database**: Migrate từ JSON sang MongoDB
3. **CDN**: Serve static files qua CDN
4. **Compression**: Enable gzip
5. **Pagination**: Load messages theo trang

## 📝 Changelog

### v3.0.1
- ✅ Fix lỗi validation
- ✅ Thêm rate limiting
- ✅ Cải thiện error handling
- ✅ Thêm health check endpoint
- ✅ Backup database functionality
- ✅ Timeout cho Groq API

### v3.0.0
- 🎉 Khởi tạo dự án
- ✅ Authentication system
- ✅ Chat messaging
- ✅ AI assistant
- ✅ Multi-language support

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `console.log` hoặc `pm2 logs`
2. Kiểm tra `.env` configuration
3. Kiểm tra network requests trong DevTools
4. Xem trong browser console

## 📄 License

MIT License - Tự do sử dụng

## 👨‍💻 Tác giả

**Vũ Tâm** - Học sinh 전남미래국제고등학교

---

**Last Updated**: 31/03/2026
