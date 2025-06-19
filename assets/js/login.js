document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // BAGIAN 1: LOGIKA LOGIN
    // =============================================
    
    // !! GANTI DENGAN KATA SANDI RAHASIA ANDA !!
    const CORRECT_PASSWORD = "liemganteng123";

    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredPassword = passwordInput.value;

            if (enteredPassword === CORRECT_PASSWORD) {
                sessionStorage.setItem('scannerAuthenticated', 'true');
                errorMessage.textContent = 'Berhasil! Mengalihkan...';
                errorMessage.style.color = 'var(--text-gold)';
                setTimeout(() => {
                    window.location.href = 'scanner.html';
                }, 1000);
            } else {
                errorMessage.textContent = 'Kata sandi salah. Coba lagi.';
                passwordInput.value = '';
                // Efek getar sederhana untuk feedback
                loginForm.parentElement.classList.add('animate-shake');
                setTimeout(() => {
                    loginForm.parentElement.classList.remove('animate-shake');
                }, 500);
            }
        });
    }

    // =============================================
    // BAGIAN 2: LOGIKA TEMA & ANIMASI (DARI main.js)
    // =============================================
    
    // Kode ini sama persis dengan yang ada di main.js untuk konsistensi
    let animationFrameId;

    const THEME_CONFIGS = {
        bunga: { particleChar: '🌸', particleCount: 25, sparkleShape: 'star', colors: ['#e2c08d', '#c8a776', '#f1f5f9', '#FFFFFF'] },
        salju: { particleChar: '❄️', particleCount: 50, sparkleShape: 'circle', colors: ['#FFFFFF', '#eef2f7', '#dbeafe', '#bfdbfe'] },
        kemarau: { particleChar: '🍂', particleCount: 25, sparkleShape: 'star', colors: ['#ff8c00', '#f5e9dd', '#d3c5b9', '#8B4513'] }
    };

    const initDynamicAnimation = (config) => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        const canvas = document.getElementById('petal-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const currentTheme = document.body.dataset.theme || 'bunga';
        const trailColor = { bunga: 'rgba(8, 14, 18, 0.1)', salju: 'rgba(238, 242, 247, 0.2)', kemarau: 'rgba(77, 44, 29, 0.1)' }[currentTheme];
        let particles = [], sparkles = [];
        const setCanvasSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        class Particle { constructor() { this.reset(); } reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * -canvas.height; this.size = Math.random() * 15 + 10; this.speed = Math.random() * 1 + 0.5; this.sway = Math.random() * 0.5 - 0.25; this.color = config.colors[Math.floor(Math.random() * config.colors.length)]; this.opacity = Math.random() * 0.5 + 0.5; } update() { this.y += this.speed; this.x += this.sway; if (this.y > canvas.height + this.size) this.reset(); } draw() { ctx.globalAlpha = this.opacity; ctx.font = `${this.size}px Arial`; ctx.fillStyle = this.color; ctx.fillText(config.particleChar, this.x, this.y); } }
        class Sparkle { constructor(x, y) { this.x = x; this.y = y; this.size = Math.random() * 6 + 2; this.speedX = Math.random() * 3 - 1.5; this.speedY = Math.random() * 3 - 1.5; this.color = config.colors[Math.floor(Math.random() * config.colors.length)]; this.life = 100; } update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.1) this.size -= 0.08; this.life--; } draw() { ctx.fillStyle = this.color; ctx.globalAlpha = Math.max(0, this.life / 100); if (config.sparkleShape === 'circle') { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } else if (config.sparkleShape === 'star') { const spikes = 5; let rot = Math.PI / 2 * 3; let step = Math.PI / spikes; ctx.beginPath(); ctx.moveTo(this.x, this.y - this.size); for (let i = 0; i < spikes; i++) { ctx.lineTo(this.x + Math.cos(rot) * this.size, this.y + Math.sin(rot) * this.size); rot += step; ctx.lineTo(this.x + Math.cos(rot) * (this.size / 2.5), this.y + Math.sin(rot) * (this.size / 2.5)); rot += step; } ctx.closePath(); ctx.fill(); } } }
        const createInitialParticles = () => { particles = []; for (let i = 0; i < config.particleCount; i++) { particles.push(new Particle()); } }
        const animate = () => { ctx.fillStyle = trailColor; ctx.fillRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); for (let i = sparkles.length - 1; i >= 0; i--) { sparkles[i].update(); sparkles[i].draw(); if (sparkles[i].life <= 0) sparkles.splice(i, 1); } ctx.globalAlpha = 1; animationFrameId = requestAnimationFrame(animate); };
        setCanvasSize(); createInitialParticles(); animate();
        window.onmousemove = (e) => { for (let i = 0; i < 2; i++) sparkles.push(new Sparkle(e.x, e.y)); };
        window.onresize = () => { setCanvasSize(); createInitialParticles(); };
    };

    const applyTheme = (themeName) => {
        document.body.dataset.theme = themeName;
        localStorage.setItem('weddingTheme', themeName);
        document.querySelectorAll('.theme-button').forEach(btn => btn.classList.toggle('active', btn.dataset.themeSet === themeName));
        initDynamicAnimation(THEME_CONFIGS[themeName]);
    };

    document.getElementById('theme-switcher').addEventListener('click', (e) => {
        if (e.target.matches('.theme-button')) applyTheme(e.target.dataset.themeSet);
    });

    // Muat tema yang tersimpan atau tema default
    const savedTheme = localStorage.getItem('weddingTheme') || 'bunga';
    applyTheme(savedTheme);

    // Animasi Reveal untuk card login
    const revealElement = document.querySelector('.reveal');
    if(revealElement) {
        setTimeout(() => {
            revealElement.classList.add('visible');
        }, 100);
    }
});