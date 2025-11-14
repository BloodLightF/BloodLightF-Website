// 链接数据
let linksData = [];

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储加载数据
    loadLinksData();
    
    // 初始化表单功能
    initLinkForm();
    
    // 检查是否在编辑模式
    checkEditMode();
    
    // 渲染链接列表
    renderLinks();
    
    // 渲染分类筛选
    renderCategoryFilter();
});

// 从本地存储加载链接数据
function loadLinksData() {
    const savedData = localStorage.getItem('linksData');
    if (savedData) {
        linksData = JSON.parse(savedData);
    } else {
        // 如果没有数据，添加一些示例链接
        linksData = [
            {
                id: 1,
                title: "GitHub",
                url: "https://github.com",
                description: "全球最大的代码托管平台",
                category: "开发",
                icon: "fab fa-github",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                title: "MDN Web Docs",
                url: "https://developer.mozilla.org",
                description: "Web开发技术文档和教程",
                category: "学习",
                icon: "fas fa-book",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                title: "Stack Overflow",
                url: "https://stackoverflow.com",
                description: "程序员问答社区",
                category: "开发",
                icon: "fab fa-stack-overflow",
                createdAt: new Date().toISOString()
            }
        ];
        saveLinksData();
    }
}

// 保存链接数据到本地存储
function saveLinksData() {
    localStorage.setItem('linksData', JSON.stringify(linksData));
}

// 初始化链接表单
function initLinkForm() {
    const linkForm = document.getElementById('link-form');
    const cancelBtn = document.getElementById('cancel-edit');
    
    if (linkForm) {
        linkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewLink();
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            document.getElementById('link-form').reset();
        });
    }
}

// 添加新链接
function addNewLink() {
    const title = document.getElementById('link-title').value;
    const url = document.getElementById('link-url').value;
    const category = document.getElementById('link-category').value || "未分类";
    const description = document.getElementById('link-description').value;
    const icon = document.getElementById('link-icon').value;
    
    // 验证URL格式
    if (!isValidUrl(url)) {
        alert('请输入有效的URL地址！');
        return;
    }
    
    const newLink = {
        id: Date.now(),
        title: title,
        url: url,
        category: category,
        description: description,
        icon: icon,
        createdAt: new Date().toISOString()
    };
    
    linksData.push(newLink);
    saveLinksData();
    renderLinks();
    renderCategoryFilter();
    
    // 重置表单
    document.getElementById('link-form').reset();
    
    alert('链接添加成功！');
}

// 验证URL格式
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// 渲染链接列表
function renderLinks(filterCategory = 'all') {
    const linksGrid = document.getElementById('links-grid');
    
    // 过滤链接
    let filteredLinks = linksData;
    if (filterCategory !== 'all') {
        filteredLinks = linksData.filter(link => link.category === filterCategory);
    }
    
    if (filteredLinks.length === 0) {
        linksGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link"></i>
                <h3>暂无链接</h3>
                <p>${filterCategory === 'all' ? '请在编辑模式下添加链接' : '该分类下暂无链接'}</p>
            </div>
        `;
        return;
    }
    
    linksGrid.innerHTML = filteredLinks.map(link => `
        <div class="link-item">
            <div class="link-header">
                <div class="link-icon">
                    <i class="${link.icon}"></i>
                </div>
                <div>
                    <h3 class="link-title">${link.title}</h3>
                    <div class="link-url">${link.url}</div>
                </div>
            </div>
            
            ${link.category ? `<div class="link-category">${link.category}</div>` : ''}
            
            ${link.description ? `<div class="link-description">${link.description}</div>` : ''}
            
            <div class="link-actions">
                <a href="${link.url}" target="_blank" class="visit-btn">
                    <i class="fas fa-external-link-alt"></i> 访问链接
                </a>
                <button class="delete-btn" onclick="deleteLink(${link.id})">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `).join('');
}

// 渲染分类筛选
function renderCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    
    // 获取所有分类
    const categories = ['all', ...new Set(linksData.map(link => link.category))];
    
    const categoryLabels = {
        'all': '全部',
        '未分类': '未分类'
    };
    
    categoryFilter.innerHTML = categories.map(category => `
        <button class="category-btn ${category === 'all' ? 'active' : ''}" 
                onclick="filterByCategory('${category}')">
            ${categoryLabels[category] || category}
        </button>
    `).join('');
}

// 按分类筛选
function filterByCategory(category) {
    // 更新激活状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 渲染筛选后的链接
    renderLinks(category === 'all' ? 'all' : category);
}

// 删除链接
function deleteLink(linkId) {
    if (confirm('确定要删除这个链接吗？')) {
        linksData = linksData.filter(link => link.id !== linkId);
        saveLinksData();
        renderLinks();
        renderCategoryFilter();
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

// 获取网站favicon（备用功能）
function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (e) {
        return '';
    }
}