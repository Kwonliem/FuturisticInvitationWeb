document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // === BAGIAN 1: DEKLARASI ELEMEN DOM
    // =============================================

    // Elemen Navigasi dan Umum
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const revealElements = document.querySelectorAll(".reveal");
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Elemen Wedding Gift (Copy Rekening)
    const copyButton = document.getElementById("copy-button");
    const copyText = document.getElementById("copy-text");
    const accountNumberEl = document.getElementById("account-number");

    // Elemen RSVP, Toast, dan Modal
    const rsvpForm = document.getElementById('rsvp-form');
    const attendanceSelect = document.getElementById('attendance');
    const guestCountWrapper = document.getElementById('guest-count-wrapper');
    const submitButton = document.getElementById('submit-button');
    const toastElement = document.getElementById('toast');
    const adToastElement = document.getElementById('ad-toast');
    const qrModal = document.getElementById('qr-modal');
    const qrCodeContainer = document.getElementById('qrcode-container');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Elemen Splash Screen
    const splashScreen = document.getElementById('splash-screen');
    const openInvitationBtn = document.getElementById('open-invitation-btn');
    const guestNameElement = document.getElementById('guest-name');

    // Elemen Music Player
    const audio = document.getElementById('background-music');
    // Kontrol Desktop
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const nextSongBtn = document.getElementById('next-song-btn');
    const prevSongBtn = document.getElementById('prev-song-btn');
    // Kontrol Mobile
    const playPauseBtnMobile = document.getElementById('play-pause-btn-mobile');
    const playPauseIconMobile = playPauseBtnMobile.querySelector('i');
    const nextSongBtnMobile = document.getElementById('next-song-btn-mobile');
    const prevSongBtnMobile = document.getElementById('prev-song-btn-mobile');


    // =============================================
    // === BAGIAN 2: VARIABEL & KONSTANTA
    // =============================================

    let toastTimeout;

    // INI KODE YANG BENAR DENGAN URL ANDA
    // Pastikan Anda menggunakan blok ini
    // =================================================================
    const SCRIPT_URL_POST = "https://script.google.com/macros/s/AKfycbzMV1Xxe_q2n3qiTqWo87zS1eBdkpHB8veMGTrZdWQPzhvHRqybFfH354Z5PMDSTYyc/exec";
    const SCRIPT_URL_GET_WISHES = "https://script.google.com/macros/s/AKfycbzMV1Xxe_q2n3qiTqWo87zS1eBdkpHB8veMGTrZdWQPzhvHRqybFfH354Z5PMDSTYyc/exec?action=getWishes";
    // =================================================================

    // Daftar Lagu
    const songs = [
        'assets/audio/song 1.mp3',
        'assets/audio/song 2.mp3',
        'assets/audio/song 3.mp3',
        'assets/audio/song 4.mp3',
        'assets/audio/song 5.mp3',
        'assets/audio/song 6.mp3'
    ];
    let currentSongIndex = 0;


    // =============================================
    // === BAGIAN 3: FUNGSI-FUNGSI
    // =============================================

    // Fungsi untuk Splash Screen
    const initSplashScreen = () => {
        // Bagian untuk menampilkan nama tamu tetap berjalan seperti biasa
        const urlParams = new URLSearchParams(window.location.search);
        const guest = urlParams.get('to');
        guestNameElement.textContent = guest ? guest.replace(/_/g, ' ') : "Tamu Undangan";

        // --- LOGIKA BARU DIMULAI DI SINI ---

        // 1. Cek apakah splash screen sudah pernah dilihat di sesi ini
        const splashWasViewed = sessionStorage.getItem('splashScreenViewed');

        if (splashWasViewed === 'true') {
            // Jika sudah pernah dilihat, langsung sembunyikan splash screen
            const splashScreen = document.getElementById('splash-screen');
            splashScreen.style.display = 'none'; // Sembunyikan instan tanpa animasi
            document.body.classList.remove('body-no-scroll');

            // Tetap jalankan fungsi penting lainnya
            handleScroll();
            // Jadwalkan iklan (jika perlu)
            setTimeout(showAdToast, 30000);
            setInterval(showAdToast, 60000);

        } else {
            // Jika belum pernah dilihat, tampilkan splash screen dan tambahkan event listener
            const openInvitationBtn = document.getElementById('open-invitation-btn');
            openInvitationBtn.addEventListener('click', () => {
                const splashScreen = document.getElementById('splash-screen');
                splashScreen.classList.add('hidden'); // Sembunyikan dengan animasi
                document.body.classList.remove('body-no-scroll');

                handleScroll();
                playSong(); // Putar musik karena ada interaksi klik

                // Jadwalkan iklan
                setTimeout(showAdToast, 30000);
                setInterval(showAdToast, 60000);

                // 2. Simpan status bahwa splash screen sudah dilihat di sesi ini
                sessionStorage.setItem('splashScreenViewed', 'true');
            });
        }
    };

    // Fungsi untuk Music Player
    const loadSong = (songIndex) => {
        audio.src = songs[songIndex];
    };

    const playSong = () => {
        audio.play().catch(error => console.log("Autoplay ditolak.", error));
        playPauseIcon.classList.replace('fa-play', 'fa-pause');
        playPauseIconMobile.classList.replace('fa-play', 'fa-pause');
    };

    const pauseSong = () => {
        audio.pause();
        playPauseIcon.classList.replace('fa-pause', 'fa-play');
        playPauseIconMobile.classList.replace('fa-pause', 'fa-play');
    };

    const prevSong = () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    };

    const nextSong = () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    };

    // Fungsi untuk Buku Tamu Digital
    const loadWishes = () => {
        const container = document.getElementById('wishes-container');
        const loader = document.getElementById('wishes-loader');

        fetch(SCRIPT_URL_GET_WISHES)
            .then(response => response.json())
            .then(data => {
                if (loader) loader.remove();
                if (data.wishes && data.wishes.length > 0) {
                    data.wishes.forEach(wish => {
                        const wishElement = document.createElement('div');
                        wishElement.className = 'glass-effect p-5 rounded-lg';
                        wishElement.innerHTML = `
                            <p class="text-slate-300 italic">"${wish.text}"</p>
                            <p class="text-right font-bold text-gold-theme mt-3">- ${wish.name}</p>
                        `;
                        container.appendChild(wishElement);
                    });
                } else {
                    container.innerHTML = '<p class="text-slate-400">Jadilah yang pertama memberikan ucapan!</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching wishes:', error);
                if (loader) loader.innerHTML = '<p class="text-red-400">Gagal memuat ucapan.</p>';
            });
    };

    // Fungsi untuk Scroll & Animasi Reveal
    const handleScroll = () => {
        const isScrolled = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
        const windowHeight = window.innerHeight;

        navbar.classList.toggle("scrolled", isScrolled);
        mobileMenu.classList.toggle("scrolled", isScrolled);

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();

            // --- LOGIKA BARU UNTUK ANIMASI DUA ARAH ---

            // Kondisi untuk MEMUNCULKAN elemen (fade up):
            // 1. Bagian ATAS elemen sudah masuk ke layar dari BAWAH (diberi offset 100px).
            // 2. Bagian BAWAH elemen masih berada di dalam layar (belum hilang ke ATAS).
            if (rect.top < windowHeight - 100 && rect.bottom > 0) {
                // Jika elemen berada di dalam viewport, tambahkan class 'visible'
                el.classList.add("visible");
            } else {
                // Jika elemen berada di LUAR viewport (baik di atas maupun di bawah),
                // hapus class 'visible' agar menganimasikan fade down.
                el.classList.remove("visible");
            }
        });

        scrollToTopBtn.classList.toggle('show', isScrolled);
    };

    // Fungsi untuk Notifikasi
    function showToast(title, message, type = 'success') {
        clearTimeout(toastTimeout);
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle' };
        toastElement.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><div><p class="font-bold">${title}</p><p class="text-sm">${message}</p></div>`;
        toastElement.className = 'show';
        toastElement.classList.add(type);
        toastTimeout = setTimeout(() => { toastElement.classList.remove('show'); }, 8000);
    }

    function showAdToast() {
        if (adToastElement.classList.contains('show')) return;
        adToastElement.innerHTML = `
            <i class="fas fa-bullhorn ad-icon"></i>
            <div><p class="font-bold">Ingin membuat website seperti ini ?</p><p class="text-sm">Hubungi Liem via WA: 087725995018 atau klik iklan ini :)</p></div>
            <button id="ad-toast-close" class="ad-toast-close-btn">&times;</button>
        `;
        adToastElement.classList.add('show');
        document.getElementById('ad-toast-close').addEventListener('click', (e) => {
            e.stopPropagation();
            adToastElement.classList.remove('show');
        });
    }


    // =============================================
    // === BAGIAN 4: EVENT LISTENERS
    // =============================================

    // Navigasi Mobile
    mobileMenuButton.addEventListener("click", () => {
        const isHidden = mobileMenu.classList.toggle("hidden");
        mobileMenuIcon.classList.toggle("fa-bars", isHidden);
        mobileMenuIcon.classList.toggle("fa-times", !isHidden);
    });
    document.querySelectorAll("#mobile-menu a, nav a[href^='#']").forEach(link => {
        link.addEventListener("click", () => {
            if (!mobileMenu.classList.contains("hidden")) {
                mobileMenu.classList.add("hidden");
                mobileMenuIcon.classList.add("fa-bars");
                mobileMenuIcon.classList.remove("fa-times");
            }
        });
    });

    // Copy nomor rekening
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(accountNumberEl.innerText).then(() => {
            copyText.innerText = "Nomor Tersalin!";
            copyButton.classList.add("success");
            setTimeout(() => {
                copyText.innerText = "Salin Nomor Rekening";
                copyButton.classList.remove("success");
            }, 2000);
        }).catch(err => showToast("Gagal Menyalin", "Gagal menyalin nomor.", "error"));
    });

    // Kontrol Music Player
    playPauseBtn.addEventListener('click', () => audio.paused ? playSong() : pauseSong());
    nextSongBtn.addEventListener('click', nextSong);
    prevSongBtn.addEventListener('click', prevSong);
    playPauseBtnMobile.addEventListener('click', () => audio.paused ? playSong() : pauseSong());
    nextSongBtnMobile.addEventListener('click', nextSong);
    prevSongBtnMobile.addEventListener('click', prevSong);
    audio.addEventListener('ended', nextSong);

    // Scroll
    window.addEventListener("scroll", handleScroll);
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Iklan
    adToastElement.addEventListener('click', () => window.open('https://wa.me/6287725995018', '_blank'));

    // Form RSVP
    attendanceSelect.addEventListener('change', function () {
        guestCountWrapper.classList.toggle('hidden', this.value !== 'Hadir');
    });
    rsvpForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            showToast('Wahh Gagal nih', 'Diisi dulu ya form nya, ga ribet kok heheh.', 'error');
            return;
        }
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sabar kak bentar...`;

        const formData = new FormData(rsvpForm);
        const guestId = "LN-" + Date.now();
        formData.append('guestId', guestId);

        fetch(SCRIPT_URL_POST, { method: 'POST', body: formData })
            .then(res => res.json())
            .then(serverData => {
                if (serverData.status === 'success') {
                    const email = formData.get('email');
                    showToast('YEYYYY Thank you!', `QR Code juga udah dikirim ke <strong>${email}</strong> yaaa.`);
                    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(serverData.guestId)}`;
                    qrCodeContainer.innerHTML = `<img src="${qrApiUrl}" alt="QR Code">`;
                    qrModal.classList.add('show');
                } else if (serverData.status === 'success_not_attending') {
                    showToast('Terimakasih Kak !', 'Yahh Kenapa tidak hadir? Aku nikah sekali doang lohhh hihihi', 'success');
                } else {
                    showToast('Gagal', serverData.message || 'Terjadi kesalahan pada server.', 'error');
                }
                rsvpForm.reset();
                guestCountWrapper.classList.add('hidden');
            })
            .catch(error => {
                console.error('Error!', error.message);
                showToast('Gagal', 'Bentar kak, ada kesalahan jaringan. Coba lagi.', 'error');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send';
            });
    });

    // Modal QR Code
    closeModalBtn.addEventListener('click', () => { qrModal.classList.remove('show'); });

    // =============================================
    // === BAGIAN BARU: TEMA & ANIMASI DINAMIS
    // =============================================

    let animationFrameId; // Untuk mengontrol loop animasi

    // Konfigurasi untuk setiap tema
    const THEME_CONFIGS = {
        bunga: {
            particleChar: '🌸',
            particleCount: 25,
            sparkleShape: 'star',
            colors: ['#e2c08d', '#c8a776', '#f1f5f9', '#FFFFFF']
        },
        salju: {
            particleChar: '❄️',
            particleCount: 50,
            sparkleShape: 'circle',
            colors: ['#FFFFFF', '#eef2f7', '#dbeafe', '#bfdbfe']
        },
        kemarau: {
            particleChar: '🍂',
            particleCount: 25,
            sparkleShape: 'star',
            colors: ['#ff8c00', '#f5e9dd', '#d3c5b9', '#8B4513']
        }
    };

    const initDynamicAnimation = (config) => {
        // Hentikan animasi sebelumnya jika ada
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        const canvas = document.getElementById('petal-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Sesuaikan warna background jejak dengan tema
        const currentTheme = document.body.dataset.theme || 'bunga';
        const trailColor = {
            bunga: 'rgba(8, 14, 18, 0.1)',
            salju: 'rgba(238, 242, 247, 0.2)',
            kemarau: 'rgba(77, 44, 29, 0.1)'
        }[currentTheme];

        let particles = [];
        let sparkles = [];

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle { // Untuk Bunga/Salju/Daun yang jatuh
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.size = Math.random() * 15 + 10;
                this.speed = Math.random() * 1 + 0.5;
                this.sway = Math.random() * 0.5 - 0.25;
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                this.opacity = Math.random() * 0.5 + 0.5;
            }
            update() {
                this.y += this.speed;
                this.x += this.sway;
                if (this.y > canvas.height + this.size) this.reset();
            }
            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.size}px Arial`;
                ctx.fillStyle = this.color;
                ctx.fillText(config.particleChar, this.x, this.y);
            }
        }

        class Sparkle { // Untuk Jejak Kursor
            constructor(x, y) {
                this.x = x; this.y = y;
                this.size = Math.random() * 6 + 2;
                this.speedX = Math.random() * 3 - 1.5; this.speedY = Math.random() * 3 - 1.5;
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                this.life = 100;
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.08;
                this.life--;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = Math.max(0, this.life / 100);
                if (config.sparkleShape === 'circle') {
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
                } else if (config.sparkleShape === 'star') {
                    const spikes = 5; let rot = Math.PI / 2 * 3; let step = Math.PI / spikes;
                    ctx.beginPath(); ctx.moveTo(this.x, this.y - this.size);
                    for (let i = 0; i < spikes; i++) {
                        ctx.lineTo(this.x + Math.cos(rot) * this.size, this.y + Math.sin(rot) * this.size); rot += step;
                        ctx.lineTo(this.x + Math.cos(rot) * (this.size / 2.5), this.y + Math.sin(rot) * (this.size / 2.5)); rot += step;
                    }
                    ctx.closePath(); ctx.fill();
                }
            }
        }

        const createInitialParticles = () => {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        }

        const animate = () => {
            ctx.fillStyle = trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = sparkles.length - 1; i >= 0; i--) {
                sparkles[i].update(); sparkles[i].draw();
                if (sparkles[i].life <= 0) sparkles.splice(i, 1);
            }
            ctx.globalAlpha = 1;
            animationFrameId = requestAnimationFrame(animate);
        };

        setCanvasSize();
        createInitialParticles();
        animate();

        window.onmousemove = (e) => {
            for (let i = 0; i < 2; i++) {
                sparkles.push(new Sparkle(e.x, e.y));
            }
        };
        window.onresize = () => { setCanvasSize(); createInitialParticles(); };
    };

    const applyTheme = (themeName) => {
        // Set atribut di body
        document.body.dataset.theme = themeName;
        // Simpan pilihan ke browser
        localStorage.setItem('weddingTheme', themeName);
        // Perbarui class 'active' di tombol
        document.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeSet === themeName);
        });
        // Mulai ulang animasi dengan konfigurasi tema yang baru
        initDynamicAnimation(THEME_CONFIGS[themeName]);
    };

    // Event listener untuk tombol tema
    document.getElementById('theme-switcher').addEventListener('click', (e) => {
        if (e.target.matches('.theme-button')) {
            const theme = e.target.dataset.themeSet;
            applyTheme(theme);
        }
    });
    // === AKHIR BAGIAN BARU ===

    // =============================================
    // === BAGIAN BARU: FUNGSI EFEK PARALLAX
    // =============================================
    const initParallax = () => {
        const header = document.getElementById('main-header');
        if (!header) return; // Hentikan jika header tidak ditemukan

        // --- PENGATURAN YANG BISA ANDA UBAH ---
        const PARALLAX_SPEED = 0.5; // Kecepatan parallax. 0.5 = setengah kecepatan scroll.
        // Angka lebih kecil = lebih lambat. Coba antara 0.3 sampai 0.7.
        // ------------------------------------

        // Set posisi awal background secara eksplisit
        header.style.backgroundPosition = 'center 0px';

        window.addEventListener('scroll', () => {
            // Hanya jalankan jika lebar layar cukup besar (misal > 768px) untuk menghindari efek aneh di mobile
            if (window.innerWidth > 768) {
                let scrollPos = window.scrollY;

                // Kalkulasi posisi Y baru untuk background
                let newYPos = scrollPos * PARALLAX_SPEED;

                // Terapkan posisi baru ke background
                header.style.backgroundPosition = `center ${newYPos}px`;
            }
        });
    };
    // === AKHIR BAGIAN BARU ===


    // =============================================
    // === BAGIAN 5: INISIALISASI
    // =============================================

    // Countdown Timer
    const countdownDate = new Date("Jun 08, 2026 00:00:00").getTime();
    const countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        if (distance > 0) {
            document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000);
        } else {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "<p class='text-xl'>The day is here!</p>";
        }
    }, 1000);

    // Inisialisasi Lightbox2
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'alwaysShowNavOnTouchDevices': true
        });
    }

    // Jalankan fungsi-fungsi awal
    initSplashScreen();
    loadSong(currentSongIndex);
    loadWishes();
    // LOGIKA BARU UNTUK MEMUAT TEMA
    const savedTheme = localStorage.getItem('weddingTheme') || 'bunga';
    applyTheme(savedTheme);
});