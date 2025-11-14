// 管理员密码 - 在实际应用中应该更复杂，并且从服务器获取
const ADMIN_PASSWORD = "135792qaq";

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经登录
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
    } else {
        showPasswordPrompt();
    }
    
    // 登录按钮事件
    document.getElementById('login-btn').addEventListener('click', function() {
        const password = document.getElementById('admin-password').value;
        
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    });
    
    // 加载当前数据到表单
    loadCurrentData();
    
    // 保存基本信息
    document.getElementById('save-basic').addEventListener('click', saveBasicInfo);
    
    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        showPasswordPrompt();
    });
});

// 显示密码输入界面
function showPasswordPrompt() {
    document.getElementById('password-prompt').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
}

// 显示管理面板
function showAdminPanel() {
    document.getElementById('password-prompt').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

// 加载当前数据到表单
function loadCurrentData() {
    const siteData = JSON.parse(localStorage.getItem('siteData') || '{}');
    
    if (siteData.userName) {
        document.getElementById('edit-name').value = siteData.userName;
    }
    
    if (siteData.userTitle) {
        document.getElementById('edit-title').value = siteData.userTitle;
    }
    
    if (siteData.userBio) {
        document.getElementById('edit-bio').value = siteData.userBio;
    }
    
    if (siteData.introText) {
        document.getElementById('edit-intro').value = siteData.introText;
    }
    
    // 特别注意：不要在这里加载头像数据到表单，因为头像数据很大
    // 头像应该在主页面通过 main.js 处理
}

// 保存基本信息时，确保不覆盖头像数据
function saveBasicInfo() {
    const existingData = JSON.parse(localStorage.getItem('siteData') || '{}');
    
    const newData = {
        ...existingData, // 保留现有数据（包括头像）
        userName: document.getElementById('edit-name').value,
        userTitle: document.getElementById('edit-title').value,
        userBio: document.getElementById('edit-bio').value,
        introText: document.getElementById('edit-intro').value
    };
    
    localStorage.setItem('siteData', JSON.stringify(newData));
    
    alert('基本信息已保存！');
}