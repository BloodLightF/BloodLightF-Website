// 背景管理功能
let backgroundData = {
    currentEditing: 'global', // 当前正在编辑的背景类型
    tempBackgrounds: {} // 临时存储上传的背景图片
};

// 初始化背景管理
function initBackgroundManager() {
    // 背景类型选择
    const bgTypeRadios = document.querySelectorAll('input[name="bg-type"]');
    bgTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            backgroundData.currentEditing = this.value;
            updateBackgroundPreview();
            updateUploadSection();
        });
    });
    
    // 背景上传
    const bgUploadArea = document.getElementById('background-upload-area');
    const bgFileInput = document.getElementById('background-file');
    const uploadBgBtn = document.getElementById('upload-background-btn');
    
    if (bgUploadArea && bgFileInput) {
        // 上传区域点击事件
        bgUploadArea.addEventListener('click', function() {
            bgFileInput.click();
        });
        
        // 文件选择事件
        bgFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                handleBackgroundFile(file);
            }
        });
        
        // 上传按钮事件
        if (uploadBgBtn) {
            uploadBgBtn.addEventListener('click', function() {
                if (backgroundData.tempBackgrounds[backgroundData.currentEditing]) {
                    saveBackground();
                } else {
                    alert('请先选择背景图片！');
                }
            });
        }
        
        // 拖放功能
        bgUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            bgUploadArea.style.background = '#f0f8ff';
            bgUploadArea.style.borderColor = '#3498db';
        });
        
        bgUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            bgUploadArea.style.background = '';
            bgUploadArea.style.borderColor = '#3498db';
        });
        
        bgUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            bgUploadArea.style.background = '';
            bgUploadArea.style.borderColor = '#3498db';
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                handleBackgroundFile(file);
            }
        });
    }
    
    // 重置背景按钮
    const resetBgBtn = document.getElementById('reset-background-btn');
    if (resetBgBtn) {
        resetBgBtn.addEventListener('click', function() {
            if (confirm('确定要重置当前选择的背景吗？')) {
                resetBackground();
            }
        });
    }
    
    // 重置所有背景按钮
    const resetAllBgBtn = document.getElementById('reset-all-backgrounds-btn');
    if (resetAllBgBtn) {
        resetAllBgBtn.addEventListener('click', function() {
            if (confirm('确定要重置所有背景图片吗？')) {
                resetAllBackgrounds();
            }
        });
    }
    
    // 初始化预览
    updateBackgroundPreview();
}

// 处理背景文件上传
function handleBackgroundFile(file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    // 验证文件大小（限制为 3MB）
    if (file.size > 3 * 1024 * 1024) {
        alert('背景图片大小不能超过 3MB！');
        return;
    }
    
    // 预览图片
    const reader = new FileReader();
    reader.onload = function(e) {
        backgroundData.tempBackgrounds[backgroundData.currentEditing] = e.target.result;
        updateBackgroundPreview();
        
        // 更新上传区域显示
        const bgUploadArea = document.getElementById('background-upload-area');
        if (bgUploadArea) {
            bgUploadArea.innerHTML = `
                <div style="text-align: center;">
                    <img src="${e.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 5px; margin-bottom: 10px;">
                    <p>背景预览 - 点击确认上传</p>
                </div>
            `;
        }
    };
    reader.readAsDataURL(file);
}

// 更新背景预览
function updateBackgroundPreview() {
    const previewElement = document.getElementById('background-preview');
    if (!previewElement) return;
    
    const currentBg = siteData.backgrounds[backgroundData.currentEditing] || 
                     backgroundData.tempBackgrounds[backgroundData.currentEditing];
    
    if (currentBg) {
        previewElement.style.backgroundImage = `url(${currentBg})`;
        previewElement.innerHTML = '<p>当前预览背景</p>';
    } else {
        previewElement.style.backgroundImage = '';
        previewElement.innerHTML = '<p>暂无背景</p>';
    }
    
    // 更新所有背景预览
    updateAllBackgroundPreviews();
}

// 更新所有背景预览
function updateAllBackgroundPreviews() {
    const bgTypes = ['global', 'intro', 'skills', 'links'];
    
    bgTypes.forEach(bgType => {
        const previewElement = document.getElementById(`${bgType}-preview`);
        if (previewElement) {
            const bgUrl = siteData.backgrounds[bgType];
            if (bgUrl) {
                previewElement.style.backgroundImage = `url(${bgUrl})`;
            } else {
                previewElement.style.backgroundImage = '';
                previewElement.innerHTML = '<span>无背景</span>';
            }
        }
    });
}

// 更新上传区域显示
function updateUploadSection() {
    const bgTypeLabels = {
        'global': '全局背景',
        'intro': '个人简介区域背景', 
        'skills': '技能区域背景',
        'links': '导航区域背景'
    };
    
    const uploadSection = document.getElementById('background-upload-section');
    if (uploadSection) {
        const title = uploadSection.querySelector('h3');
        if (title) {
            title.textContent = `上传${bgTypeLabels[backgroundData.currentEditing]}`;
        }
    }
    
    // 重置上传区域显示
    const bgUploadArea = document.getElementById('background-upload-area');
    if (bgUploadArea && !backgroundData.tempBackgrounds[backgroundData.currentEditing]) {
        bgUploadArea.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>点击或拖拽背景图片到此处</p>
            <input type="file" id="background-file" accept="image/*">
        `;
        // 重新绑定事件
        document.getElementById('background-file').addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                handleBackgroundFile(file);
            }
        });
    }
}

// 保存背景
function saveBackground() {
    if (backgroundData.tempBackgrounds[backgroundData.currentEditing]) {
        siteData.backgrounds[backgroundData.currentEditing] = backgroundData.tempBackgrounds[backgroundData.currentEditing];
        delete backgroundData.tempBackgrounds[backgroundData.currentEditing];
        
        saveSiteData();
        applyBackgrounds();
        updateBackgroundPreview();
        updateUploadSection();
        
        alert('背景图片保存成功！');
    }
}

// 重置当前背景
function resetBackground() {
    siteData.backgrounds[backgroundData.currentEditing] = "";
    delete backgroundData.tempBackgrounds[backgroundData.currentEditing];
    
    saveSiteData();
    applyBackgrounds();
    updateBackgroundPreview();
    updateUploadSection();
    
    alert('背景图片已重置！');
}

// 重置所有背景
function resetAllBackgrounds() {
    siteData.backgrounds = {
        global: "",
        intro: "",
        skills: "", 
        links: ""
    };
    backgroundData.tempBackgrounds = {};
    
    saveSiteData();
    applyBackgrounds();
    updateBackgroundPreview();
    updateUploadSection();
    
    alert('所有背景图片已重置！');
}

// 页面加载时初始化背景管理
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('background-upload-area')) {
        initBackgroundManager();
    }
});