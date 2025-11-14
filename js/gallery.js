// 绘图合集数据
let galleryData = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储加载数据
    loadGalleryData();
    
    // 初始化上传功能
    initGalleryUpload();
    
    // 检查是否在编辑模式
    checkEditMode();
    
    // 渲染图片库
    renderGallery();
});

// 从本地存储加载图片数据
function loadGalleryData() {
    const savedData = localStorage.getItem('galleryData');
    if (savedData) {
        galleryData = JSON.parse(savedData);
    }
}

// 保存图片数据到本地存储
function saveGalleryData() {
    localStorage.setItem('galleryData', JSON.stringify(galleryData));
}

// 初始化图片上传功能
function initGalleryUpload() {
    const uploadArea = document.getElementById('gallery-upload-area');
    const galleryInput = document.getElementById('gallery-input');
    const uploadBtn = document.getElementById('upload-gallery-btn');
    
    let selectedFiles = [];
    
    // 上传区域点击事件
    uploadArea.addEventListener('click', function() {
        galleryInput.click();
    });
    
    // 文件选择事件
    galleryInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            selectedFiles = Array.from(e.target.files);
            updateUploadArea();
        }
    });
    
    // 更新上传区域显示
    function updateUploadArea() {
        if (selectedFiles.length === 0) {
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>点击或拖拽图片到此处上传</p>
                <input type="file" id="gallery-input" accept="image/*" multiple>
            `;
            // 重新绑定事件
            document.getElementById('gallery-input').addEventListener('change', function(e) {
                selectedFiles = Array.from(e.target.files);
                updateUploadArea();
            });
        } else {
            uploadArea.innerHTML = `
                <p>已选择 ${selectedFiles.length} 张图片</p>
                <ul style="text-align: left; margin-top: 10px;">
                    ${selectedFiles.map(file => `<li>${file.name}</li>`).join('')}
                </ul>
            `;
        }
    }
    
    // 上传按钮事件
    uploadBtn.addEventListener('click', function() {
        if (selectedFiles.length === 0) {
            alert('请先选择图片！');
            return;
        }
        
        const title = document.getElementById('image-title').value || '未命名图片';
        const description = document.getElementById('image-desc').value || '';
        
        // 处理所有选中的文件
        selectedFiles.forEach(file => {
            // 验证文件类型和大小
            if (!file.type.startsWith('image/')) {
                alert(`文件 ${file.name} 不是图片格式！`);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert(`文件 ${file.name} 太大，请选择小于5MB的图片！`);
                return;
            }
            
            // 转换为Base64
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    id: Date.now() + Math.random(),
                    title: title,
                    description: description,
                    data: e.target.result,
                    fileName: file.name,
                    uploadTime: new Date().toLocaleString(),
                    size: file.size
                };
                
                galleryData.push(imageData);
                saveGalleryData();
                renderGallery();
                
                // 重置表单
                document.getElementById('image-title').value = '';
                document.getElementById('image-desc').value = '';
                selectedFiles = [];
                updateUploadArea();
                
                alert('图片上传成功！');
            };
            reader.readAsDataURL(file);
        });
    });
    
    // 拖放功能
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
            selectedFiles = Array.from(e.dataTransfer.files);
            updateUploadArea();
        }
    });
}

// 渲染图片库
function renderGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (galleryData.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-images" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                <p>暂无图片，请在编辑模式下上传图片</p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = galleryData.map(image => `
        <div class="gallery-item">
            <img src="${image.data}" alt="${image.title}" class="gallery-img">
            <button class="delete-btn" onclick="deleteImage('${image.id}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="gallery-info">
                <div class="gallery-title">${image.title}</div>
                <div class="gallery-date">${image.uploadTime}</div>
                ${image.description ? `<p style="margin-top: 10px; font-size: 0.9em;">${image.description}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// 删除图片
function deleteImage(imageId) {
    if (confirm('确定要删除这张图片吗？')) {
        galleryData = galleryData.filter(image => image.id !== imageId);
        saveGalleryData();
        renderGallery();
    }
}

// 检查编辑模式
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';
    
    if (isEditMode) {
        document.body.classList.add('edit-mode');
    }
}