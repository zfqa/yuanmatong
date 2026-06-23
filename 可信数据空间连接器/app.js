// 模块切换
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

// 实时时钟
function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('currentTime').textContent = 
        `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 每秒更新时钟
setInterval(updateClock, 1000);
updateClock();

// 进度条动画
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// 页面加载时执行动画
document.addEventListener('DOMContentLoaded', function() {
    animateProgressBars();
});

// 按钮点击效果
document.querySelectorAll('.btn-outline, .action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});
