// ===== API CONFIGURATION =====
const API_BASE_URL = '/api';
let authToken = localStorage.getItem('authToken') || null;
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ===== UTILITY FUNCTIONS =====
function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
    setTimeout(() => {
      errorEl.classList.remove('show');
    }, 5000);
  }
}

function showSuccess(message) {
  console.log('✓', message);
}

async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ===== PAGE NAVIGATION =====
function goToPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  
  const page = document.getElementById(pageName);
  const navLink = document.querySelector(`[data-page="${pageName}"]`);
  
  if (page) page.classList.add('active');
  if (navLink) navLink.classList.add('active');
  
  // Close mobile menu
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.remove('active');
}

// ===== MODAL FUNCTIONS =====
function openModal(modalName) {
  const modal = document.getElementById(`${modalName}Modal`);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalName) {
  const modal = document.getElementById(`${modalName}Modal`);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// ===== AUTHENTICATION =====
function updateUserUI() {
  const userMenuContent = document.getElementById('userMenuContent');
  const homeUserInfo = document.getElementById('homeUserInfo');
  
  if (currentUser) {
    // Logged in state
    userMenuContent.innerHTML = `
      <div style="padding: 1rem; border-bottom: 1px solid var(--border);">
        <div style="font-weight: 700; color: var(--text);">${currentUser.username}</div>
        <div style="font-size: 0.85rem; color: var(--text2); margin-top: 0.2rem;">${currentUser.email}</div>
      </div>
      <a href="#" onclick="logoutUser(event)" style="display: block; padding: 0.75rem 1rem; color: var(--error); text-decoration: none; font-weight: 500;">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
      </a>
      <a href="#" onclick="openModal('changePassword')" style="display: block; padding: 0.75rem 1rem; color: var(--primary); text-decoration: none; font-weight: 500;">
        <i class="fas fa-key"></i> Đổi mật khẩu
      </a>
    `;
    
    homeUserInfo.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.1rem; flex-shrink: 0;">
          ${currentUser.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-weight: 700; color: var(--text);">${currentUser.username}</div>
          <div style="font-size: 0.85rem; color: var(--text2);">${currentUser.email}</div>
        </div>
      </div>
    `;
  } else {
    // Not logged in state
    userMenuContent.innerHTML = `
      <button onclick="openModal('login')" style="display: block; width: 100%; padding: 0.75rem 1rem; color: var(--primary); background: none; border: none; text-decoration: none; font-weight: 500; text-align: left; cursor: pointer;">
        <i class="fas fa-sign-in-alt"></i> Đăng nhập
      </button>
      <button onclick="openModal('register')" style="display: block; width: 100%; padding: 0.75rem 1rem; color: var(--primary); background: none; border: none; text-decoration: none; font-weight: 500; text-align: left; cursor: pointer;">
        <i class="fas fa-user-plus"></i> Đăng ký
      </button>
    `;
    
    homeUserInfo.innerHTML = `
      <span>${getTranslation('not_logged')}</span>
      <button class="link-btn" onclick="openModal('login'">${getTranslation('login_now')}</button>
    `;
  }
}

document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showError('loginError', 'Vui lòng điền đầy đủ!');
    return;
  }
  
  try {
    const response = await apiCall('/login', 'POST', { email, password });
    authToken = response.token;
    currentUser = response.user;
    
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showSuccess('Đăng nhập thành công!');
    updateUserUI();
    closeModal('login');
    
    this.reset();
    goToPage('home');
  } catch (error) {
    showError('loginError', error.message);
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const username = document.getElementById('registerUsername').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  
  if (!username || !email || !password) {
    showError('registerError', 'Vui lòng điền đầy đủ!');
    return;
  }
  
  try {
    const response = await apiCall('/register', 'POST', { username, email, password });
    authToken = response.token;
    currentUser = response.user;
    
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showSuccess('Đăng ký thành công!');
    updateUserUI();
    closeModal('register');
    
    this.reset();
    goToPage('home');
  } catch (error) {
    showError('registerError', error.message);
  }
});

function logoutUser(event) {
  event.preventDefault();
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  
  updateUserUI();
  closeModal('userMenu');
  goToPage('home');
  showSuccess('Đã đăng xuất!');
}

// ===== AI CHAT =====
const aiMessages = [];

document.getElementById('aiSendBtn')?.addEventListener('click', async function() {
  const input = document.getElementById('aiInput');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message to UI
  const chatBox = document.getElementById('chatBox');
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'chat-message user';
  userMsgEl.textContent = message;
  chatBox.appendChild(userMsgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  aiMessages.push({ role: 'user', content: message });
  input.value = '';
  
  // Show loading
  const loadingEl = document.createElement('div');
  loadingEl.className = 'chat-message assistant';
  loadingEl.innerHTML = '<i class="fas fa-circle-notch"></i> Đang suy nghĩ...';
  chatBox.appendChild(loadingEl);
  
  try {
    const response = await apiCall('/ai', 'POST', {
      messages: aiMessages,
      system: 'Bạn là trợ lý AI của trường JNMT. Hỗ trợ học sinh người Việt, Hàn, Mông Cổ, Kazakhstan, Nga. Trả lời ngắn gọn, hữu ích, thân thiện.'
    });
    
    loadingEl.remove();
    
    const aiReply = response.reply;
    aiMessages.push({ role: 'assistant', content: aiReply });
    
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-message assistant';
    aiMsgEl.textContent = aiReply;
    chatBox.appendChild(aiMsgEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    loadingEl.textContent = 'Lỗi: ' + error.message;
    showError('aiError', error.message);
  }
});

// ===== MESSAGES/CHAT =====
async function loadMessages() {
  try {
    const response = await apiCall('/messages');
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    if (response.messages.length === 0) {
      messagesList.innerHTML = '<div class="placeholder-message"><p>Chưa có tin nhắn nào</p></div>';
      return;
    }
    
    response.messages.forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.className = 'message-item';
      
      const date = new Date(msg.createdAt);
      const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      let deleteBtn = '';
      if (currentUser && currentUser.id === msg.userId) {
        deleteBtn = `<button class="message-delete-btn" onclick="deleteMessage('${msg.id}')">Xóa</button>`;
      }
      
      msgEl.innerHTML = `
        <div class="message-header">
          <span class="message-username">${msg.username}</span>
          <span class="message-time">${timeStr}</span>
        </div>
        <div class="message-text">${escapeHtml(msg.text)}</div>
        <div class="message-actions">
          ${deleteBtn}
        </div>
      `;
      
      messagesList.appendChild(msgEl);
    });
    
    messagesList.scrollTop = messagesList.scrollHeight;
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

document.getElementById('messageSendBtn')?.addEventListener('click', async function() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (!currentUser) {
    showError('messageError', 'Vui lòng đăng nhập!');
    return;
  }
  
  if (!message) return;
  
  try {
    await apiCall('/messages', 'POST', { text: message });
    input.value = '';
    await loadMessages();
  } catch (error) {
    showError('messageError', error.message);
  }
});

async function deleteMessage(messageId) {
  if (!confirm('Bạn chắc chắn muốn xóa tin nhắn này?')) return;
  
  try {
    await apiCall(`/messages/${messageId}`, 'DELETE');
    await loadMessages();
  } catch (error) {
    showError('messageError', error.message);
  }
}

// ===== HELPER FUNCTIONS =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== THEME TOGGLE =====
function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  
  document.getElementById('themeToggle')?.addEventListener('click', function() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }
}

// ===== CLOCK =====
function updateClock() {
  const timeDisplay = document.getElementById('timeDisplay');
  const dateDisplay = document.getElementById('dateDisplay');
  
  if (timeDisplay && dateDisplay) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const dateStr = now.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    
    timeDisplay.textContent = timeStr;
    dateDisplay.textContent = dateStr;
  }
}

// ===== MOBILE MENU TOGGLE =====
document.getElementById('navToggle')?.addEventListener('click', function() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
});

// ===== USER MENU TOGGLE =====
document.getElementById('userMenuBtn')?.addEventListener('click', function(e) {
  e.stopPropagation();
  const userMenu = document.getElementById('userMenu');
  if (userMenu) {
    userMenu.classList.toggle('active');
  }
});

document.addEventListener('click', function(e) {
  const userMenu = document.getElementById('userMenu');
  const userMenuBtn = document.getElementById('userMenuBtn');
  if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
    userMenu.classList.remove('active');
  }
});

// ===== NAV LINKS =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');
    goToPage(page);
  });
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize
  initTheme();
  updateClock();
  setInterval(updateClock, 1000);
  updateUserUI();
  
  // Load messages when chat page is visited
  const chatLink = document.querySelector('[data-page="chat"]');
  if (chatLink) {
    chatLink.addEventListener('click', loadMessages);
  }
  
  // Auto-load messages periodically
  setInterval(loadMessages, 5000);
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    apiCall,
    goToPage,
    openModal,
    closeModal,
    showError,
    updateUserUI
  };
}

