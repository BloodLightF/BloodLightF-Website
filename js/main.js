// 网站数据
let siteData = {
    userName: "血夜临霜[弦月初十][BloodLightF]",
    userTitle: "计算机科学与技术",
    userBio: "画画、听歌、玩模型",
    avatar: "images/avatar.jpg",
    introText: "虽然不知道你们是怎么找到这个网页的，不过我喜欢你（棍音）",
     // 新增背景设置
    backgrounds: {
        global: "", // 全局背景
        intro: "",  // 个人简介区域背景
        skills: "", // 技能区域背景  
        links: ""   // 导航区域背景
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储加载数据
    loadSiteData();
    
    // 初始化头像点击事件
    initAvatarUpload();
    
    // 更新页面内容
    updatePageContent();

    // 应用背景设置
    applyBackgrounds();
});

// 从本地存储加载网站数据
function loadSiteData() {
    const savedData = localStorage.getItem('siteData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        siteData = {...siteData, ...parsedData};
        
        // 特别处理头像数据
        if (parsedData.avatar && parsedData.avatar.startsWith('data:image')) {
            siteData.avatar = parsedData.avatar;
        }
    }
}

// 保存网站数据到本地存储
function saveSiteData() {
    localStorage.setItem('siteData', JSON.stringify(siteData));
}

// 更新页面内容
function updatePageContent() {
    // 更新头像
    const avatarImg = document.getElementById('avatar-img');
    if (avatarImg && siteData.avatar) {
        avatarImg.src = siteData.avatar;
    }
    
    // 更新用户名
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = siteData.userName;
    }
    
    // 更新用户标题
    const userTitle = document.getElementById('user-title');
    if (userTitle) {
        userTitle.textContent = siteData.userTitle;
    }
    
    // 更新用户简介
    const userBio = document.getElementById('user-bio');
    if (userBio) {
        userBio.textContent = siteData.userBio;
    }
    
    // 更新个人简介文本
    const introText = document.getElementById('intro-text');
    if (introText) {
        introText.textContent = siteData.introText;
    }
}

// 应用背景设置
function applyBackgrounds() {
    // 全局背景
    const globalBg = document.getElementById('global-background');
    if (globalBg && siteData.backgrounds.global) {
        globalBg.style.backgroundImage = `url(${siteData.backgrounds.global})`;
    }
    
    // 各区域背景
    const sectionBackgrounds = {
        'intro-bg': siteData.backgrounds.intro,
        'skills-bg': siteData.backgrounds.skills,
        'links-bg': siteData.backgrounds.links
    };
    
    for (const [elementId, backgroundUrl] of Object.entries(sectionBackgrounds)) {
        const element = document.getElementById(elementId);
        if (element && backgroundUrl) {
            element.style.backgroundImage = `url(${backgroundUrl})`;
        }
    }
}

// 初始化头像上传功能
function initAvatarUpload() {
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarModal = document.getElementById('avatar-modal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-avatar');
    const uploadArea = document.getElementById('avatar-upload-area');
    const avatarInput = document.getElementById('avatar-input');
    const confirmBtn = document.getElementById('confirm-avatar');
    
    let selectedFile = null;
    
    // 打开模态框
    if (avatarContainer) {
        avatarContainer.addEventListener('click', function() {
            avatarModal.style.display = 'flex';
            // 重置上传区域
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>点击或拖拽图片到此处</p>
                <input type="file" id="avatar-input" accept="image/*">
            `;
            // 重新绑定文件输入事件
            document.getElementById('avatar-input').addEventListener('change', handleFileSelect);
        });
    }
    
    // 关闭模态框
    function closeModal() {
        avatarModal.style.display = 'none';
        selectedFile = null;
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === avatarModal) {
            closeModal();
        }
    });
    
    // 文件选择处理函数
    function handleFileSelect(e) {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            
            // 验证文件类型
            if (!selectedFile.type.startsWith('image/')) {
                alert('请选择图片文件！');
                return;
            }
            
            // 验证文件大小（限制为 2MB）
            if (selectedFile.size > 2 * 1024 * 1024) {
                alert('图片大小不能超过 2MB！');
                return;
            }
            
            // 预览图片
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadArea.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 5px; margin-bottom: 10px;">
                        <p>图片预览</p>
                    </div>
                `;
            };
            reader.readAsDataURL(selectedFile);
        }
    }
    
    // 上传区域点击事件
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            avatarInput.click();
        });
    }
    
    // 文件选择事件
    if (avatarInput) {
        avatarInput.addEventListener('change', handleFileSelect);
    }
    
    // 确认更换头像
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (selectedFile) {
                // 使用 FileReader 将图片转换为 Base64
                const reader = new FileReader();
                reader.onload = function(e) {
                    // 保存 Base64 数据到 siteData
                    siteData.avatar = e.target.result;
                    
                    // 更新头像显示
                    const avatarImg = document.getElementById('avatar-img');
                    if (avatarImg) {
                        avatarImg.src = siteData.avatar;
                    }
                    
                    // 保存数据到本地存储
                    saveSiteData();
                    
                    // 关闭模态框
                    closeModal();
                    
                    alert('头像更换成功！刷新页面后也会保持。');
                };
                reader.readAsDataURL(selectedFile);
            } else {
                alert('请先选择一张图片！');
            }
        });
    }
    
    // 拖放功能
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.background = '#f0f8ff';
            uploadArea.style.borderColor = '#3498db';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '#3498db';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.background = '';
            uploadArea.style.borderColor = '#3498db';
            
            if (e.dataTransfer.files.length > 0) {
                selectedFile = e.dataTransfer.files[0];
                
                // 验证文件类型和大小
                if (!selectedFile.type.startsWith('image/')) {
                    alert('请拖拽图片文件！');
                    return;
                }
                
                if (selectedFile.size > 2 * 1024 * 1024) {
                    alert('图片大小不能超过 2MB！');
                    return;
                }
                
                // 预览图片
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadArea.innerHTML = `
                        <div style="text-align: center;">
                            <img src="${e.target.result}" style="max-width: 100%; max-height: 200px; border-radius: 5px; margin-bottom: 10px;">
                            <p>图片预览</p>
                        </div>
                    `;
                };
                reader.readAsDataURL(selectedFile);
            }
        });
    }
}

// 添加控制台提示（开发用）
console.log('个人主页已加载，使用管理员密码访问管理功能');