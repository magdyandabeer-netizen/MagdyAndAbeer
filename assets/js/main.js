/**
 * Magdy & Abeer Wedding Invitation — Main JS
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── DOM Elements ─────────────────────────────────
    const openBtn       = document.getElementById('open-invitation-btn');
    const welcomeModal  = document.getElementById('welcome-modal');
    const mainContent   = document.getElementById('main-content');
    const musicBtn      = document.getElementById('music-toggle');
    const addCalBtn     = document.getElementById('add-to-calendar-btn');
    const bgAudio       = document.getElementById('bg-music');
    const toast         = document.getElementById('toast');
    const toastMessage  = document.getElementById('toast-message');

    // Set initial volume for background track
    if (bgAudio) {
        bgAudio.volume = 0.6;
    }

    // ── Open Invitation (Heart Burst) ────────────────
    openBtn.addEventListener('click', (e) => {
        // Ripple
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const rect = openBtn.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 5) + 'px';
        ripple.style.top  = (e.clientY - rect.top  - 5) + 'px';
        openBtn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);

        // Hearts burst
        const hearts   = ['💍','✨','💕','🌸','❤️','💖','🌺','💫'];
        const burstEl  = document.createElement('div');
        burstEl.className = 'heart-burst-container';
        document.body.appendChild(burstEl);

        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;

        for (let i = 0; i < 18; i++) {
            const h = document.createElement('span');
            h.className  = 'floating-heart';
            h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            const spread  = (Math.random() - 0.5) * window.innerWidth * 0.6;
            h.style.left  = (cx + spread) + 'px';
            h.style.top   = cy + 'px';
            h.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
            h.style.animationDelay = (Math.random() * 0.4) + 's';
            h.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
            burstEl.appendChild(h);
        }

        // Loading state
        openBtn.classList.add('loading');
        openBtn.innerHTML = '💕 Opening... <i class="fa-solid fa-heart fa-beat"></i>';

        setTimeout(() => {
            burstEl.remove();
            welcomeModal.classList.add('fade-out');
            setTimeout(() => {
                welcomeModal.style.display = 'none';
                mainContent.classList.remove('hidden');
                initScrollReveal();
                initParticles();
            }, 550);
            playMusic();
        }, 900);
    });

    // ── Scroll Reveal ─────────────────────────────────
    function initScrollReveal() {
        const reveals  = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => observer.observe(el));
    }

    // ── Background Music ──────────────────────────────
    function playMusic() {
        if (!bgAudio) return;

        bgAudio.play().then(() => {
            musicBtn.classList.add('playing');
        }).catch(err => {
            console.log('Audio autoplay prevented:', err);
        });
    }

    musicBtn.addEventListener('click', () => {
        if (!bgAudio) return;

        if (bgAudio.paused) {
            bgAudio.play();
            musicBtn.classList.add('playing');
            showToast('Music playing 🎵');
        } else {
            bgAudio.pause();
            musicBtn.classList.remove('playing');
            showToast('Music paused 🔇');
        }
    });

    // ── Gold Particle Canvas ──────────────────────────
    function initParticles() {
        const canvas = document.getElementById('sparkle-canvas');
        const ctx    = canvas.getContext('2d');
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 40 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            size:     Math.random() * 2.2 + 0.8,
            speedY:   Math.random() * 0.35 + 0.1,
            speedX:   (Math.random() - 0.5) * 0.18,
            opacity:  Math.random() * 0.7 + 0.25,
            fadeSpeed:Math.random() * 0.01 + 0.004,
            growing:  Math.random() > 0.5,
            isPetal:  Math.random() > 0.6,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.018,
        }));

        function draw() {
            ctx.clearRect(0, 0, W, H);

            particles.forEach(p => {
                p.y -= p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotSpeed;

                if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }

                if (p.growing) {
                    p.opacity += p.fadeSpeed;
                    if (p.opacity >= 0.9) p.growing = false;
                } else {
                    p.opacity -= p.fadeSpeed;
                    if (p.opacity <= 0.2) p.growing = true;
                }

                if (p.isPetal) {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.size * 2.8, p.size * 1.4, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity * 0.65})`;
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(226, 194, 125, ${p.opacity})`;
                    ctx.shadowBlur  = 7;
                    ctx.shadowColor = 'rgba(201, 169, 110, 0.6)';
                    ctx.fill();
                    ctx.shadowBlur  = 0;
                }
            });

            requestAnimationFrame(draw);
        }

        draw();
    }

    // ── Countdown Timer ───────────────────────────────
    // Target: Friday 12 September 2026 at 20:00 (8 PM)
    const targetDate = new Date('2026-09-12T20:00:00').getTime();

    function updateCountdown() {
        const now  = Date.now();
        const diff = targetDate - now;

        const d = Math.max(0, Math.floor(diff / (1000*60*60*24)));
        const h = Math.max(0, Math.floor((diff % (1000*60*60*24)) / (1000*60*60)));
        const m = Math.max(0, Math.floor((diff % (1000*60*60)) / (1000*60)));
        const s = Math.max(0, Math.floor((diff % (1000*60)) / 1000));

        document.getElementById('days').innerText    = String(d).padStart(2,'0');
        document.getElementById('hours').innerText   = String(h).padStart(2,'0');
        document.getElementById('minutes').innerText = String(m).padStart(2,'0');
        document.getElementById('seconds').innerText = String(s).padStart(2,'0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ── Add to Calendar ───────────────────────────────
    addCalBtn.addEventListener('click', () => {
        const title    = encodeURIComponent('Magdy & Abeer Wedding 💍✨');
        const details  = encodeURIComponent('Join us to celebrate the wedding of Magdy & Abeer at New Rondin Hall.');
        const location = encodeURIComponent('New Rondin Hall');
        const start    = '20260912T200000';
        const end      = '20260912T235900';
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
        window.open(url, '_blank');
        showToast('Opening Google Calendar 📅');
    });

    // ── Toast ─────────────────────────────────────────
    function showToast(msg) {
        toastMessage.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2800);
    }

});
