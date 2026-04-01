## 🚀 QUICKSTART - JNMT v3 (5 PHÚT TỚI CHẠY)

### Bước 1: Chuẩn bị
```bash
# 1. Giải nén file: jnmt-v3.zip
unzip jnmt-v3.zip
cd jnmt-v3

# 2. Install dependencies
npm install
```

### Bước 2: Tạo file .env
```bash
# Copy từ template
cp .env.example .env

# Mở .env và THAY ĐỔI:
# - JWT_SECRET = một chuỗi ngẫu nhiên (ít nhất 32 ký tự)
# - GROQ_API_KEY = API key từ https://console.groq.com
```

**Ví dụ .env:**
```
NODE_ENV=development
PORT=3001
JWT_SECRET=my_super_secret_random_key_12345678901234567890
GROQ_API_KEY=gsk_abc123xyz789...
CORS_ORIGIN=*
```

### Bước 3: Chạy server
```bash
# Cách 1: Chạy bình thường
npm start

# Cách 2: Chạy với hot reload (phát triển)
npm run dev
```

### Bước 4: Truy cập ứng dụng
```
Mở browser: http://localhost:3001
```

---

## ✅ Kiểm tra hoạt động

1. **Trang chủ**: Bạn thấy banner JNMT + các nút?
2. **Đăng ký**: Click "Đăng ký" → Tạo tài khoản → Đăng nhập
3. **Chat**: Vào mục Chat → Gửi tin nhắn → Lưu vào database
4. **AI**: Vào mục AI → Hỏi AI → Nhận reply từ Groq

---

## 🆘 Lỗi phổ biến

| Lỗi | Giải pháp |
|-----|----------|
| `Cannot find module 'express'` | `npm install` |
| `GROQ_API_KEY not configured` | Kiểm tra `.env` có `GROQ_API_KEY` chưa |
| `Port 3001 already in use` | Thay `PORT=3002` trong `.env` |
| `Token not valid` | Clear localStorage → Đăng nhập lại |

---

## 📁 Cấu trúc project

```
jnmt-v3/
├── server.js              ← Backend chính
├── package.json           ← Dependencies
├── .env                   ← Config (GHI NHỚ: Tạo file này)
├── .env.example           ← Template
├── README.md              ← Hướng dẫn chi tiết
└── frontend/
    ├── index.html         ← HTML
    ├── style.css          ← CSS
    ├── app.js             ← JavaScript
    └── i18n.js            ← Translations
```

---

## 🔧 Các lệnh hữu ích

```bash
# Start server
npm start

# Dev mode (auto-restart khi thay đổi file)
npm run dev

# Xóa database (reset data)
rm db.json

# Kiểm tra server chạy
curl http://localhost:3001/api
```

---

## 🌐 API Test nhanh

```bash
# Test server
curl http://localhost:3001/api

# Health check
curl http://localhost:3001/api/health

# Lấy danh sách tin nhắn
curl http://localhost:3001/api/messages

# Tạo tài khoản
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'
```

---

## 📝 Các file có sửa gì?

✅ **server.js**
- Thêm validation cho tất cả inputs
- Thêm rate limiting
- Thêm error handling toàn diện
- Thêm timeout cho Groq API
- Thêm health check endpoint
- Thêm backup database

✅ **app.js**
- Sửa all API calls
- Thêm better error messages
- Thêm loading states
- Thêm user info display

✅ **style.css**
- Responsive design
- Dark mode support
- Better animations
- Mobile optimized

✅ **i18n.js**
- Support 6 ngôn ngữ (Vi, Ko, En, Mn, Kk, Ru)
- Better translations

✅ **index.html**
- Modern structure
- Better accessibility
- Mobile friendly

✅ **package.json**
- Thêm `express-rate-limit` package
- Updated dependencies

---

## ⚡ Tips

1. **Phát triển**: Sử dụng `npm run dev` để auto-reload
2. **Production**: Sử dụng `npm start` + `NODE_ENV=production`
3. **Database**: File `db.json` được tự động tạo
4. **Backups**: Server tự động backup data
5. **Logs**: Tất cả lỗi log ra console

---

## 🎉 Done!

Xong rồi! Dự án của bạn giờ đã:
- ✅ Secure (validation, rate limiting, JWT)
- ✅ Scalable (error handling, backups)
- ✅ User-friendly (multi-language, dark mode)
- ✅ Fully functional (auth, chat, AI)

**Chúc bạn nộp đúng hạn! 🚀**

---

**Còn câu hỏi?** → Kiểm tra file `README.md` để biết chi tiết hơn
