// 数据存储
let registrationData = [
    { id: 'DQ-2026-001', name: '城市交通流量数据', applicant: '交通管理局', type: '公共数据', status: '公示中', date: '2026-06-19', industry: '交通运输', desc: '覆盖全市主要道路的实时交通流量数据', source: '交通监控系统', rights: '公共数据，市政府持有' },
    { id: 'DQ-2026-002', name: '企业征信报告数据', applicant: '金融数据中心', type: '企业数据', status: '已登记', date: '2026-06-18', industry: '金融', desc: '包含企业信用评级、财务数据等', source: '金融机构报送', rights: '金融数据中心持有和加工' },
    { id: 'DQ-2026-003', name: '医疗健康档案数据', applicant: '卫生健康委', type: '个人数据', status: '已注销', date: '2026-06-17', industry: '医疗健康', desc: '居民健康档案和诊疗记录', source: '医疗机构', rights: '卫健委持有，脱敏后可共享' },
    { id: 'DQ-2026-004', name: '教育资源分布数据', applicant: '教育局', type: '公共数据', status: '公示中', date: '2026-06-16', industry: '教育', desc: '全市教育资源配置情况', source: '教育统计系统', rights: '教育局持有' },
    { id: 'DQ-2026-005', name: '环境监测数据', applicant: '生态环境局', type: '公共数据', status: '已登记', date: '2026-06-15', industry: '公共管理', desc: '空气质量和水质监测数据', source: '环境监测站', rights: '生态环境局持有' }
];

let pendingData = [
    { name: '气象观测数据', applicant: '气象局', time: '2026-06-19 10:30' },
    { name: '社保缴费数据', applicant: '人社局', time: '2026-06-19 09:15' },
    { name: '房地产交易数据', applicant: '住建局', time: '2026-06-18 16:45' }
];

let reviewedData = [
    { name: '人口普查数据', applicant: '统计局', time: '2026-06-18', result: '已通过' },
    { name: '食品安全检测数据', applicant: '市场监管局', time: '2026-06-17', result: '已驳回' }
];

// 页面切换
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const module = this.dataset.module;
        
        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // 切换模块
        document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
        document.getElementById(module).classList.add('active');
    });
});

// Tab切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
    });
});

// 初始化图表
function initCharts() {
    // 折线图
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19'],
            datasets: [{
                label: '登记数量',
                data: [12, 19, 15, 25, 22, 30, 23],
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // 饼图
    const typeCtx = document.getElementById('typeChart').getContext('2d');
    new Chart(typeCtx, {
        type: 'doughnut',
        data: {
            labels: ['公共数据', '企业数据', '个人数据', '其他'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 渲染产权公示表格
function renderPublicityTable() {
    const tbody = document.getElementById('publicityBody');
    tbody.innerHTML = registrationData.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.applicant}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            <td>${item.date}</td>
            <td><button class="btn btn-primary btn-sm" onclick="viewDetail('${item.id}')">查看</button></td>
        </tr>
    `).join('');
}

// 渲染待审核表格
function renderPendingTable() {
    const tbody = document.getElementById('pendingBody');
    tbody.innerHTML = pendingData.map((item, index) => `
        <tr data-index="${index}">
            <td>${item.name}</td>
            <td>${item.applicant}</td>
            <td>${item.time}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="reviewItem(${index}, 'pass')">通过</button>
                <button class="btn btn-danger btn-sm" onclick="reviewItem(${index}, 'reject')">驳回</button>
            </td>
        </tr>
    `).join('');
    updatePendingCount();
}

// 渲染已审核表格
function renderReviewedTable() {
    const tbody = document.getElementById('reviewedBody');
    tbody.innerHTML = reviewedData.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.applicant}</td>
            <td>${item.time}</td>
            <td><span class="status-badge ${item.result === '已通过' ? 'green' : 'gray'}">${item.result}</span></td>
        </tr>
    `).join('');
}

// 渲染查询表格
function renderQueryTable(data) {
    const tbody = document.getElementById('queryBody');
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.applicant}</td>
            <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            <td>${item.date}</td>
        </tr>
    `).join('');
}

// 获取状态样式类
function getStatusClass(status) {
    switch(status) {
        case '公示中': return 'blue';
        case '已登记': return 'green';
        case '已注销': return 'gray';
        default: return 'blue';
    }
}

// 查看详情
function viewDetail(id) {
    const item = registrationData.find(d => d.id === id);
    if (!item) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">登记编号</span>
            <span class="detail-value">${item.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">数据名称</span>
            <span class="detail-value">${item.name}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">申请人</span>
            <span class="detail-value">${item.applicant}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">数据类型</span>
            <span class="detail-value">${item.type}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">所属行业</span>
            <span class="detail-value">${item.industry}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">当前状态</span>
            <span class="detail-value"><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></span>
        </div>
        <div class="detail-row">
            <span class="detail-label">公示日期</span>
            <span class="detail-value">${item.date}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">数据简介</span>
            <span class="detail-value">${item.desc}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">数据来源</span>
            <span class="detail-value">${item.source}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">权利声明</span>
            <span class="detail-value">${item.rights}</span>
        </div>
    `;
    
    document.getElementById('detailModal').classList.add('active');
}

// 关闭弹窗
function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// 点击遮罩层关闭弹窗
document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// 审核操作
function reviewItem(index, action) {
    const row = document.querySelector(`tr[data-index="${index}"]`);
    const item = pendingData[index];
    
    // 添加淡出动画
    row.classList.add('fade-out');
    
    setTimeout(() => {
        // 从待审核列表移除
        pendingData.splice(index, 1);
        
        // 添加到已审核列表
        reviewedData.unshift({
            name: item.name,
            applicant: item.applicant,
            time: new Date().toLocaleString('zh-CN'),
            result: action === 'pass' ? '已通过' : '已驳回'
        });
        
        // 重新渲染表格
        renderPendingTable();
        renderReviewedTable();
        
        // 显示提示
        if (action === 'pass') {
            showToast('审核通过', 'success');
        } else {
            showToast('已驳回申请', 'error');
        }
    }, 300);
}

// 更新待审核数量
function updatePendingCount() {
    document.getElementById('pendingCount').textContent = pendingData.length;
}

// 表单提交
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('dataName').value.trim();
    if (!name) {
        showToast('请填写数据名称', 'error');
        return;
    }
    
    // 生成登记编号
    const id = 'DQ-2026-' + String(registrationData.length + 1).padStart(3, '0');
    
    // 添加到数据
    registrationData.unshift({
        id: id,
        name: name,
        applicant: '管理员',
        type: '待分类',
        status: '公示中',
        date: new Date().toISOString().split('T')[0],
        industry: document.getElementById('industry').value || '未选择',
        desc: document.getElementById('dataDesc').value || '暂无描述',
        source: document.getElementById('dataSource').value || '暂无来源',
        rights: document.getElementById('rightsStatement').value || '暂无声明'
    });
    
    // 重新渲染表格
    renderPublicityTable();
    renderQueryTable(registrationData);
    
    // 清空表单
    clearForm();
    
    showToast('登记提交成功', 'success');
});

// 清空表单
function clearForm() {
    document.getElementById('registerForm').reset();
    showToast('表单已清空', 'info');
}

// 搜索功能
function searchData() {
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!keyword) {
        showToast('请输入搜索关键词', 'info');
        return;
    }
    
    const results = registrationData.filter(item => 
        item.id.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.applicant.toLowerCase().includes(keyword)
    );
    
    renderQueryTable(results);
    
    const info = document.getElementById('searchResultInfo');
    if (results.length > 0) {
        info.textContent = `找到 ${results.length} 条匹配记录`;
        showToast(`找到 ${results.length} 条记录`, 'success');
    } else {
        info.textContent = '未找到匹配记录';
        showToast('无匹配结果', 'info');
    }
}

// 重置搜索
function resetSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResultInfo').textContent = '';
    renderQueryTable(registrationData);
    showToast('搜索已重置', 'info');
}

// 回车搜索
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchData();
    }
});

// Toast提示
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    renderPublicityTable();
    renderPendingTable();
    renderReviewedTable();
    renderQueryTable(registrationData);
});
