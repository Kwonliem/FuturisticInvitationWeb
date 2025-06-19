document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // BAGIAN 1: LOGIKA SCANNER QR CODE
    // =============================================
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMV1Xxe_q2n3qiTqWo87zS1eBdkpHB8veMGTrZdWQPzhvHRqybFfH354Z5PMDSTYyc/exec";
    let html5Qr;

    const messageEl = document.getElementById('message');
    const restartBtn = document.getElementById('restart');

    function showMessage(text, type) {
        if (!messageEl) return;
        messageEl.innerText = text;
        // Kita gunakan variabel CSS untuk warna agar sesuai tema
        const colorVar = 
            type === 'success' ? 'var(--text-gold)' :
            type === 'warning' ? 'orange' :
            type === 'error'   ? 'red' :
                                 'var(--text-primary)';
        messageEl.style.color = colorVar;
    }

    function onScanSuccess(decodedText) {
        showMessage("Memvalidasi...", 'info');
        html5Qr.stop().then(() => {
            fetch(`${SCRIPT_URL}?action=checkIn&guestId=${encodeURIComponent(decodedText)}`)
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success')          showMessage(data.message, 'success');
                else if (data.status === 'already_scanned') showMessage(data.message, 'warning');
                else if (data.status === 'not_found')     showMessage(data.message, 'error');
                else                                      showMessage('Respon tak terduga: '+data.message, 'error');
            })
            .catch(e => showMessage('Error jaringan: '+e, 'error'))
            .finally(() => {
                if(restartBtn) restartBtn.style.display = 'block';
            });
        });
    }

    function onScanError(err) { /* Biarkan kosong */ }

    function initScanner() {
        showMessage('Arahkan kamera ke QR Code', 'info');
        if(restartBtn) restartBtn.style.display = 'none';
        
        // Cek apakah elemen 'reader' ada di halaman
        if (document.getElementById('reader')) {
            html5Qr = new Html5Qrcode("reader");
            html5Qr.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: {width: 250, height: 250} },
                onScanSuccess,
                onScanError
            ).catch(err => {
                showMessage("Gagal akses kamera: " + err, 'error');
            });
        }
    }

    if(restartBtn) restartBtn.addEventListener('click', initScanner);
    

    // =============================================
    // BAGIAN 2: LOGIKA TEMA DAN ANIMASI (DARI main.js)
    // =============================================

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
        const trailColor = {
            bunga: 'rgba(8, 14, 18, 0.1)',
            salju: 'rgba(238, 242, 247, 0.2)',
            kemarau: 'rgba(77, 44, 29, 0.1)'
        }[currentTheme];

        let particles = [], sparkles = [];

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() { this.reset(); }
            reset() { this.x = Math.random() * canvas.width; this.y = Math.random() * -canvas.height; this.size = Math.random() * 15 + 10; this.speed = Math.random() * 1 + 0.5; this.sway = Math.random() * 0.5 - 0.25; this.color = config.colors[Math.floor(Math.random() * config.colors.length)]; this.opacity = Math.random() * 0.5 + 0.5; }
            update() { this.y += this.speed; this.x += this.sway; if (this.y > canvas.height + this.size) this.reset(); }
            draw() { ctx.globalAlpha = this.opacity; ctx.font = `${this.size}px Arial`; ctx.fillStyle = this.color; ctx.fillText(config.particleChar, this.x, this.y); }
        }

        class Sparkle {
             constructor(x, y) { this.x = x; this.y = y; this.size = Math.random() * 6 + 2; this.speedX = Math.random() * 3 - 1.5; this.speedY = Math.random() * 3 - 1.5; this.color = config.colors[Math.floor(Math.random() * config.colors.length)]; this.life = 100; }
            update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.1) this.size -= 0.08; this.life--; }
            draw() { ctx.fillStyle = this.color; ctx.globalAlpha = Math.max(0, this.life / 100); if (config.sparkleShape === 'circle') { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); } else if (config.sparkleShape === 'star') { const spikes = 5; let rot = Math.PI / 2 * 3; let step = Math.PI / spikes; ctx.beginPath(); ctx.moveTo(this.x, this.y - this.size); for (let i = 0; i < spikes; i++) { ctx.lineTo(this.x + Math.cos(rot) * this.size, this.y + Math.sin(rot) * this.size); rot += step; ctx.lineTo(this.x + Math.cos(rot) * (this.size / 2.5), this.y + Math.sin(rot) * (this.size / 2.5)); rot += step; } ctx.closePath(); ctx.fill(); } }
        }
        
        const createInitialParticles = () => { particles = []; for (let i = 0; i < config.particleCount; i++) { particles.push(new Particle()); } }
        
        const animate = () => {
            ctx.fillStyle = trailColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = sparkles.length - 1; i >= 0; i--) { sparkles[i].update(); sparkles[i].draw(); if (sparkles[i].life <= 0) sparkles.splice(i, 1); }
            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(animate);
        };
        
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

    // =============================================
    // BAGIAN 3: INISIALISASI HALAMAN
    // =============================================
    
    // Muat tema yang tersimpan atau tema default
    const savedTheme = localStorage.getItem('weddingTheme') || 'bunga';
    applyTheme(savedTheme);

    // Jalankan scanner
    initScanner();
});