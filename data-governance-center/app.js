const sampleData = [
    { id: 'DT-001', name: '工地监控视频_001.mp4', type: '视频数据', source: 'A企业节点', time: '2026-06-20 14:30:25', size: '2.3GB', status: 'pending', preview: 'https://picsum.photos/seed/site01/640/360', desc: 'A区主入口监控，记录施工人员进出及安全装备佩戴情况', resolution: '1920×1080', duration: '02:15:30', fps: 25, codec: 'H.264', tags: ['人员检测', '安全帽', '入口监控'] },
    { id: 'DT-002', name: '安全帽检测_015.jpg', type: '图片数据', source: 'A企业节点', time: '2026-06-20 14:28:12', size: '4.5MB', status: 'cleaning', preview: 'https://picsum.photos/seed/helmet15/640/360', desc: 'B区材料堆放区安全帽佩戴检测样本，包含3名施工人员', resolution: '4032×3024', format: 'JPEG', camera: 'DS-2CD2T47', tags: ['安全帽', '人员', 'B区'] },
    { id: 'DT-003', name: '温度传感器_数据包', type: '传感器数据', source: 'A企业节点', time: '2026-06-20 14:25:08', size: '156MB', status: 'completed', preview: null, desc: '混凝土养护区温度传感器连续24h数据采集，采样间隔5分钟', sensorType: 'PT100', range: '-50~200°C', accuracy: '±0.5°C', sampleRate: '5min', tags: ['温度', '混凝土养护', 'IoT'] },
    { id: 'DT-004', name: 'IoT设备日志_0620', type: 'IoT设备数据', source: 'A企业节点', time: '2026-06-20 14:22:45', size: '89MB', status: 'pending', preview: null, desc: '塔吊运行状态日志，包含载重、角度、风速等参数', deviceModel: 'TC6013', protocol: 'MQTT', fields: 28, tags: ['塔吊', '运行日志', '设备状态'] },
    { id: 'DT-005', name: '高空作业监控_008.mp4', type: '视频数据', source: 'A企业节点', time: '2026-06-20 14:20:33', size: '3.1GB', status: 'error', preview: 'https://picsum.photos/seed/high08/640/360', desc: 'C区脚手架高空作业监控，视频流中断告警', resolution: '2560×1440', duration: '01:42:18', fps: 30, codec: 'H.265', tags: ['高空作业', '脚手架', '告警'] },
    { id: 'DT-006', name: '反光衣检测_042.jpg', type: '图片数据', source: 'A企业节点', time: '2026-06-20 14:18:21', size: '5.2MB', status: 'completed', preview: 'https://picsum.photos/seed/vest42/640/360', desc: '夜间施工反光衣穿着检测，低光照环境增强样本', resolution: '3840×2160', format: 'JPEG', camera: 'DS-2CD2T87', tags: ['反光衣', '夜间施工', '低光照'] },
    { id: 'DT-007', name: '噪音传感器_数据包', type: '传感器数据', source: 'A企业节点', time: '2026-06-20 14:15:09', size: '234MB', status: 'cleaning', preview: null, desc: '施工区域边界噪音监测，用于环保合规评估', sensorType: '声级计', range: '30~130dB', accuracy: '±1.5dB', sampleRate: '1s', tags: ['噪音', '环保', '合规'] },
    { id: 'DT-008', name: '车辆进出记录_IoT', type: 'IoT设备数据', source: 'A企业节点', time: '2026-06-20 14:12:56', size: '67MB', status: 'completed', preview: null, desc: '工地出入口车牌识别与车辆进出时间记录', deviceModel: 'HK-IC402', protocol: 'HTTP', fields: 12, tags: ['车牌识别', '车辆管理', '出入口'] },
];

const datasetData = [
    { id: 'DS-001', name: '工地监控视频_001.mp4', type: '视频数据', source: 'A企业节点', size: '2.3GB', sampleType: '正样本', status: 'completed', preview: 'https://picsum.photos/seed/ds01/640/360', desc: '规范施工场景，人员正确佩戴安全帽、反光衣，操作符合安全规程', resolution: '1920×1080', duration: '02:15:30', fps: 25, codec: 'H.264', tags: ['安全帽', '反光衣', '规范操作'] },
    { id: 'DS-002', name: '工地监控视频_001.mp4', type: '视频数据', source: 'A企业节点', size: '2.3GB', sampleType: '负样本', status: 'completed', preview: 'https://picsum.photos/seed/ds02/640/360', desc: '违规施工场景，存在未戴安全帽、进入危险区域等违规行为', resolution: '1920×1080', duration: '02:15:30', fps: 25, codec: 'H.264', tags: ['违规', '未戴安全帽', '危险区域'] },
];

let currentFilter = 'all';

const statusMap = {
    pending: { text: '待清洗', class: 'status-pending' },
    cleaning: { text: '清洗中', class: 'status-cleaning' },
    completed: { text: '已完成', class: 'status-completed' },
    error: { text: '异常', class: 'status-error' }
};

function initSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    const modules = document.querySelectorAll('.module');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const moduleId = item.dataset.module;

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            modules.forEach(m => m.classList.remove('active'));
            document.getElementById(`module${moduleId}`).classList.add('active');
        });
    });
}

function initDataTable(filterType = 'all') {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    const filteredData = filterType === 'all' 
        ? sampleData 
        : sampleData.filter(item => item.type === filterType);

    filteredData.forEach(item => {
        const status = statusMap[item.status];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.id}</strong></td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.source}</td>
            <td>${item.time}</td>
            <td>${item.size}</td>
            <td><span class="status-badge ${status.class}">${status.text}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewDetail('${item.id}')">
                    <i class="fas fa-eye"></i> 查看详情
                </button>
                <button class="btn btn-success btn-sm" onclick="governRow('${item.id}')" style="margin-left:6px;">
                    <i class="fas fa-play"></i> 开始治理
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function initDatasetTable() {
    const tbody = document.getElementById('datasetTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const sampleTypeMap = {
        '正样本': { class: 'sample-positive', icon: 'fa-check-circle' },
        '负样本': { class: 'sample-negative', icon: 'fa-times-circle' }
    };

    datasetData.forEach(item => {
        const status = statusMap[item.status];
        const sample = sampleTypeMap[item.sampleType];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.id}</strong></td>
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.source}</td>
            <td>${item.size}</td>
            <td><span class="sample-badge ${sample.class}"><i class="fas ${sample.icon}"></i> ${item.sampleType}</span></td>
            <td><span class="status-badge ${status.class}">${status.text}</span></td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewDatasetDetail('${item.id}')">
                    <i class="fas fa-eye"></i> 查看详情
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewDatasetDetail(id) {
    const item = datasetData.find(d => d.id === id);
    if (!item) return;
    const status = statusMap[item.status];
    const sampleClass = item.sampleType === '正样本' ? 'sample-positive' : 'sample-negative';
    let html = `<div class="detail-grid">
        <div class="detail-field"><span class="label">数据ID</span><span class="value">${item.id}</span></div>
        <div class="detail-field"><span class="label">数据名称</span><span class="value">${item.name}</span></div>
        <div class="detail-field"><span class="label">数据类型</span><span class="value">${item.type}</span></div>
        <div class="detail-field"><span class="label">来源节点</span><span class="value">${item.source}</span></div>
        <div class="detail-field"><span class="label">数据大小</span><span class="value">${item.size}</span></div>
        <div class="detail-field"><span class="label">样本类型</span><span class="value"><span class="sample-badge ${sampleClass}">${item.sampleType}</span></span></div>
        <div class="detail-field"><span class="label">状态</span><span class="value"><span class="status-badge ${status.class}">${status.text}</span></span></div>`;

    if (item.resolution) html += `<div class="detail-field"><span class="label">分辨率</span><span class="value">${item.resolution}</span></div>`;
    if (item.duration) html += `<div class="detail-field"><span class="label">时长</span><span class="value">${item.duration}</span></div>`;
    if (item.fps) html += `<div class="detail-field"><span class="label">帧率</span><span class="value">${item.fps} fps</span></div>`;
    if (item.codec) html += `<div class="detail-field"><span class="label">编码格式</span><span class="value">${item.codec}</span></div>`;

    html += `</div>`;
    html += `<div class="detail-section-title">数据描述</div><p style="font-size:14px;color:#555;line-height:1.6">${item.desc}</p>`;

    if (item.tags && item.tags.length) {
        html += `<div class="detail-section-title">数据标签</div><div class="detail-tags">`;
        item.tags.forEach(t => html += `<span class="detail-tag">${t}</span>`);
        html += `</div>`;
    }

    if (item.preview) {
        html += `<div class="detail-section-title">数据预览</div><div class="detail-preview"><img src="${item.preview}" alt="${item.name}"></div>`;
    }

    document.getElementById('detailContent').innerHTML = html;
    document.getElementById('detailModal').classList.add('show');
}

function simulateRealtimeUpdates() {
    setInterval(() => {
        const nodes = document.getElementById('onlineNodes');
        const current = parseInt(nodes.textContent);
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = Math.max(8, Math.min(16, current + change));
        nodes.textContent = newVal;
    }, 5000);

    setInterval(() => {
        const processed = document.getElementById('dataProcessed');
        const current = parseFloat(processed.textContent);
        const newVal = (current + Math.random() * 0.1).toFixed(1);
        processed.textContent = `${newVal}TB`;
    }, 3000);

    setInterval(() => {
        const quality = document.getElementById('qualityScore');
        const current = parseFloat(quality.textContent);
        const change = (Math.random() - 0.5) * 0.2;
        const newVal = Math.max(95, Math.min(98, current + change)).toFixed(1);
        quality.textContent = `${newVal}%`;
    }, 4000);
}

function governRow(id) {
    const item = sampleData.find(d => d.id === id);
    if (!item) return;
    if (item.status === 'completed') { alert(`${item.name} 已完成治理，无需重复操作`); return; }
    item.status = 'cleaning';
    initDataTable(currentFilter);
    setTimeout(() => {
        item.status = 'completed';
        initDataTable(currentFilter);
        alert(`${item.name} 治理完成！`);
    }, 2000);
}

function startGovernance() {
    alert('开始治理任务已启动！');
    const rows = document.querySelectorAll('#dataTableBody tr');
    rows.forEach((row, index) => {
        if (index < 3) {
            const statusCell = row.querySelector('.status-badge');
            statusCell.className = 'status-badge status-cleaning';
            statusCell.textContent = '清洗中';
        }
    });
}

function batchProcess() {
    alert('批量处理已启动，正在处理所有待清洗数据...');
}

function viewDetail(id) {
    const item = sampleData.find(d => d.id === id);
    if (!item) return;
    const status = statusMap[item.status];
    let html = `<div class="detail-grid">
        <div class="detail-field"><span class="label">数据ID</span><span class="value">${item.id}</span></div>
        <div class="detail-field"><span class="label">数据名称</span><span class="value">${item.name}</span></div>
        <div class="detail-field"><span class="label">数据类型</span><span class="value">${item.type}</span></div>
        <div class="detail-field"><span class="label">来源节点</span><span class="value">${item.source}</span></div>
        <div class="detail-field"><span class="label">上传时间</span><span class="value">${item.time}</span></div>
        <div class="detail-field"><span class="label">数据大小</span><span class="value">${item.size}</span></div>
        <div class="detail-field"><span class="label">状态</span><span class="value"><span class="status-badge ${status.class}">${status.text}</span></span></div>`;

    if (item.resolution) html += `<div class="detail-field"><span class="label">分辨率</span><span class="value">${item.resolution}</span></div>`;
    if (item.duration) html += `<div class="detail-field"><span class="label">时长</span><span class="value">${item.duration}</span></div>`;
    if (item.fps) html += `<div class="detail-field"><span class="label">帧率</span><span class="value">${item.fps} fps</span></div>`;
    if (item.codec) html += `<div class="detail-field"><span class="label">编码格式</span><span class="value">${item.codec}</span></div>`;
    if (item.format) html += `<div class="detail-field"><span class="label">图片格式</span><span class="value">${item.format}</span></div>`;
    if (item.camera) html += `<div class="detail-field"><span class="label">摄像头型号</span><span class="value">${item.camera}</span></div>`;
    if (item.sensorType) html += `<div class="detail-field"><span class="label">传感器类型</span><span class="value">${item.sensorType}</span></div>`;
    if (item.range) html += `<div class="detail-field"><span class="label">量程</span><span class="value">${item.range}</span></div>`;
    if (item.accuracy) html += `<div class="detail-field"><span class="label">精度</span><span class="value">${item.accuracy}</span></div>`;
    if (item.sampleRate) html += `<div class="detail-field"><span class="label">采样率</span><span class="value">${item.sampleRate}</span></div>`;
    if (item.deviceModel) html += `<div class="detail-field"><span class="label">设备型号</span><span class="value">${item.deviceModel}</span></div>`;
    if (item.protocol) html += `<div class="detail-field"><span class="label">通信协议</span><span class="value">${item.protocol}</span></div>`;
    if (item.fields) html += `<div class="detail-field"><span class="label">字段数</span><span class="value">${item.fields} 个</span></div>`;

    html += `</div>`;
    html += `<div class="detail-section-title">数据描述</div><p style="font-size:14px;color:#555;line-height:1.6">${item.desc}</p>`;

    if (item.tags && item.tags.length) {
        html += `<div class="detail-section-title">数据标签</div><div class="detail-tags">`;
        item.tags.forEach(t => html += `<span class="detail-tag">${t}</span>`);
        html += `</div>`;
    }

    if (item.preview) {
        html += `<div class="detail-section-title">数据预览</div><div class="detail-preview"><img src="${item.preview}" alt="${item.name}"></div>`;
    }

    document.getElementById('detailContent').innerHTML = html;
    document.getElementById('detailModal').classList.add('show');
}

function closeDetail() {
    document.getElementById('detailModal').classList.remove('show');
}

function autoFilter() {
    alert('自动筛选已启动，正在应用筛选规则...');
    setTimeout(() => {
        document.getElementById('validSamples').textContent = '10234';
        document.getElementById('rejectedSamples').textContent = '2111';
        document.getElementById('passRate').textContent = '83%';
        alert('自动筛选完成！');
    }, 2000);
}

function manualReview() {
    alert('进入人工复核模式...');
}

function exportSamples() {
    alert('正在导出样本数据...');
}

function generateDataset() {
    alert('数据集生成任务已启动！');
}

function exportDataset() {
    alert('正在下载数据集...');
}

function syncToNodeB() {
    alert('正在同步数据至B企业节点...');
}

function enterTrainingCenter() {
    window.location.href = '../模型训练中心/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initDataTable();
    initDatasetTable();
    simulateRealtimeUpdates();

    document.getElementById('detailModal').addEventListener('click', function(e) {
        if (e.target === this) closeDetail();
    });

    // 为数据类型卡片添加点击筛选功能
    const dataTypeCards = document.querySelectorAll('.data-type-card');
    dataTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            const filterType = card.dataset.type;
            currentFilter = filterType;
            
            // 更新卡片选中状态
            dataTypeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // 重新渲染表格
            initDataTable(filterType);
        });
    });

    const modules = document.querySelectorAll('.module');
    modules.forEach((module, index) => {
        module.style.opacity = '0';
        module.style.transform = 'translateY(10px)';
        module.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            module.style.opacity = '1';
            module.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

function animateProgress(targetPercent) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    if (!progressFill || !progressText) return;

    let current = 0;
    const interval = setInterval(() => {
        if (current >= targetPercent) {
            clearInterval(interval);
            return;
        }
        current += 1;
        progressFill.style.width = `${current}%`;
        progressText.textContent = `${current}%`;
    }, 20);
}

setTimeout(() => {
    animateProgress(87);
}, 500);
