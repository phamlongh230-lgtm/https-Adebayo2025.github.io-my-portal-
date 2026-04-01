# ✅ JNMT v3 - CHECKLIST PRE-DEPLOYMENT

## 🔒 Bảo mật
- [ ] Đã tạo file `.env` (không commit)
- [ ] `JWT_SECRET` được đặt thành giá trị ngẫu nhiên 32+ ký tự
- [ ] `GROQ_API_KEY` được tạo từ Groq Console
- [ ] `.env` không có trong git
- [ ] Kiểm tra `.gitignore` có bao gồm `.env`
- [ ] Tất cả passwords được hash (bcryptjs)
- [ ] Rate limiting được enable
- [ ] Input validation được bật

## 🧪 Testing
- [ ] Server khởi động không lỗi: `npm start`
- [ ] Có thể truy cập http://localhost:3001
- [ ] Trang chủ hiển thị bình thường
- [ ] Đăng ký tài khoản mới thành công
- [ ] Đăng nhập với tài khoản vừa tạo thành công
- [ ] Chat gửi tin nhắn được lưu vào database
- [ ] AI chat hoạt động (nếu có GROQ_API_KEY)
- [ ] Dark mode toggle hoạt động
- [ ] Language select thay đổi ngôn ngữ
- [ ] Responsive design OK trên mobile

## 📦 Frontend
- [ ] Tất cả 6 ngôn ngữ được dịch
- [ ] Không có lỗi console (F12 → Console)
- [ ] Không có broken links
- [ ] Images/icons hiển thị đúng
- [ ] Animations mượt mà
- [ ] Buttons tất cả hoạt động

## 🔧 Backend
- [ ] Server response nhanh
- [ ] Database (db.json) được tạo tự động
- [ ] Error messages có ý nghĩa
- [ ] Rate limiting working
- [ ] CORS configured
- [ ] Timeout cho API requests

## 📋 Documentation
- [ ] README.md hoàn chỉnh
- [ ] QUICKSTART.md có hướng dẫn rõ ràng
- [ ] Comments trong code thích hợp
- [ ] API endpoints có document

## 🚀 Deployment Ready
- [ ] `npm install` chạy không lỗi
- [ ] Không có dependency warnings
- [ ] `NODE_ENV` có thể set thành production
- [ ] Port 3001 có thể thay đổi qua env

## 📝 Code Quality
- [ ] Không có console.log spam (dev logs OK)
- [ ] Không có lỗi typo cơ bản
- [ ] Consistent code style
- [ ] Modular code (functions tách biệt)
- [ ] Error handling đủ

## 🎯 Features Checklist

### Auth System
- [ ] Register endpoint hoạt động
- [ ] Login endpoint hoạt động
- [ ] JWT token được issue
- [ ] Password change hoạt động
- [ ] Token expiration (7 days)

### Chat System
- [ ] Get messages endpoint
- [ ] Post message endpoint
- [ ] Delete message endpoint
- [ ] Only owner can delete own messages
- [ ] Messages saved to db.json

### AI System
- [ ] AI endpoint hoạt động
- [ ] Groq API integration OK
- [ ] Timeout handling
- [ ] Error messages meaningful

### UI/UX
- [ ] Navigation menu clear
- [ ] Modal dialogs work
- [ ] Form validation feedback
- [ ] Loading states visible
- [ ] Error states visible

## 🌍 Multi-language Support
- [ ] Vietnamese (vi)
- [ ] Korean (ko)
- [ ] English (en)
- [ ] Mongolian (mn)
- [ ] Kazakh (kk)
- [ ] Russian (ru)
- [ ] Language selector works
- [ ] Translations complete

## 📱 Responsive Design
- [ ] Desktop (1920px+) ✓
- [ ] Tablet (768px - 1024px) ✓
- [ ] Mobile (320px - 480px) ✓
- [ ] Menu collapse on mobile
- [ ] Forms readable on mobile

## 🔍 Final Checks

### Before Submission
1. [ ] Git status clean (only .env removed)
2. [ ] No console errors in browser
3. [ ] No server errors in terminal
4. [ ] Database file not in git
5. [ ] All features working

### Files to Submit
- [ ] server.js ✓
- [ ] package.json ✓
- [ ] .env.example ✓ (not .env)
- [ ] .gitignore ✓
- [ ] README.md ✓
- [ ] QUICKSTART.md ✓
- [ ] frontend/index.html ✓
- [ ] frontend/style.css ✓
- [ ] frontend/app.js ✓
- [ ] frontend/i18n.js ✓

## 🚨 Emergency Fixes

If something breaks:

1. **Server won't start**
   ```bash
   npm install
   npm start
   ```

2. **Port already in use**
   ```bash
   PORT=3002 npm start
   ```

3. **Database corrupted**
   ```bash
   rm db.json
   npm start  # Creates new db.json
   ```

4. **API calls failing**
   - Check `.env` file exists
   - Verify GROQ_API_KEY
   - Check network tab (F12)

5. **Frontend issues**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Hard refresh (Ctrl+Shift+R)
   - Check console (F12)

## 📞 Quick Support Links

- [Express.js Docs](https://expressjs.com/)
- [JWT Docs](https://jwt.io/)
- [Groq API Docs](https://console.groq.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)

## ✨ Final Tips

1. Keep your `.env` file PRIVATE
2. Use `npm run dev` during development
3. Always check browser console (F12)
4. Read error messages carefully
5. Test on mobile device
6. Ask for help if stuck!

---

## 🎉 Ready to Submit?

When you're confident everything works:

1. Run all tests above ✓
2. Review code one more time
3. Test on different browsers (Chrome, Firefox, Safari)
4. Test on mobile phone
5. Submit with confidence! 🚀

**Good luck! You've got this! 💪**

---

Last Updated: 31/03/2026
