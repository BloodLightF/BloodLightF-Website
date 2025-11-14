// 文件资源数据
let resourcesData = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储加载数据
    loadResourcesData();
    
    // 初始化上传功能
    initResourcesUpload();
    
    // 检查是否在编辑模式
    checkEditMode();
    
    // 渲染文件列表
    renderResources();
});

// 从本地存储加载文件数据
function loadResourcesData() {
    const savedData = localStorage.getItem('resourcesData');
    if (savedData) {
        resourcesData = JSON.parse(savedData);
    }
}

// 保存文件数据到本地存储
function saveResourcesData() {
    localStorage.setItem('resourcesData', JSON.stringify(resourcesData));
}

// 初始化文件上传功能
function initResourcesUpload() {
    const uploadArea = document.getElementById('file-upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-file-btn');
    
    let selectedFiles = [];
    
    // 上传区域点击事件
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 文件选择事件
    fileInput.addEventListener('change', function(e) {
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
                <p>点击或拖拽文件到此处上传</p>
                <input type="file" id="file-input" multiple>
            `;
            // 重新绑定事件
            document.getElementById('file-input').addEventListener('change', function(e) {
                selectedFiles = Array.from(e.target.files);
                updateUploadArea();
            });
        } else {
            uploadArea.innerHTML = `
                <p>已选择 ${selectedFiles.length} 个文件</p>
                <ul style="text-align: left; margin-top: 10px;">
                    ${selectedFiles.map(file => `<li>${file.name} (${formatFileSize(file.size)})</li>`).join('')}
                </ul>
            `;
        }
    }
    
    // 上传按钮事件
    uploadBtn.addEventListener('click', function() {
        if (selectedFiles.length === 0) {
            alert('请先选择文件！');
            return;
        }
        
        const description = document.getElementById('file-desc').value || '';
        
        // 处理所有选中的文件
        selectedFiles.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`文件 ${file.name} 太大，请选择小于10MB的文件！`);
                return;
            }
            
            // 转换为Base64
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    description: description,
                    data: e.target.result,
                    uploadTime: new Date().toLocaleString(),
                    size: file.size,
                    type: file.type
                };
                
                resourcesData.push(fileData);
                saveResourcesData();
                renderResources();
                
                // 重置表单
                document.getElementById('file-desc').value = '';
                selectedFiles = [];
                updateUploadArea();
                
                alert('文件上传成功！');
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

// 渲染文件列表
function renderResources() {
    const filesGrid = document.getElementById('files-grid');
    
    if (resourcesData.length === 0) {
        filesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-file-alt" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                <p>暂无文件，请在编辑模式下上传文件</p>
            </div>
        `;
        return;
    }
    
    filesGrid.innerHTML = resourcesData.map(file => `
        <div class="file-item">
            <div class="file-icon">
                ${getFileIcon(file.type)}
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    ${formatFileSize(file.size)} • ${file.uploadTime}
                    ${file.description ? `<br>${file.description}` : ''}
                </div>
            </div>
            <div>
                <a href="${file.data}" download="${file.name}" class="download-btn">
                    <i class="fas fa-download"></i> 下载
                </a>
                <button class="delete-btn" onclick="deleteFile('${file.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 删除文件
function deleteFile(fileId) {
    if (confirm('确定要删除这个文件吗？')) {
        resourcesData = resourcesData.filter(file => file.id !== fileId);
        saveResourcesData();
        renderResources();
    }
}

// 获取文件类型图标
function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return '<i class="fas fa-file-pdf"></i>';
    if (fileType.includes('word') || fileType.includes('document')) return '<i class="fas fa-file-word"></i>';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '<i class="fas fa-file-excel"></i>';
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) return '<i class="fas fa-file-archive"></i>';
    if (fileType.includes('image')) return '<i class="fas fa-file-image"></i>';
    if (fileType.includes('video')) return '<i class="fas fa-file-video"></i>';
    if (fileType.includes('audio')) return '<i class="fas fa-file-audio"></i>';
    return '<i class="fas fa-file"></i>';
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 检查编辑模式
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';
    
    if (isEditMode) {
        document.body.classList.add('edit-mode');
    }
}