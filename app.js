/* =============================================
   FlowDesk - Interactive Website Engine
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── Loading Screen ──
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.add('loaded');
            initRevealObserver();
            startCounters();
        }, 800);
    });

    // ── Particle Canvas Background ──
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - (mouse.y + window.scrollY);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x += dx * force * 0.03;
                    this.y += dy * force * 0.03;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        // Use fewer particles on mobile to save battery/CPU
        const isMobile = window.innerWidth < 768;
        const count = isMobile
            ? Math.min(30, Math.floor(window.innerWidth / 25))
            : Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.strokeStyle = `rgba(0, 180, 216, ${0.06 * (1 - dist / 140)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });


    // ── Scroll-Reveal Animation System ──
    function initRevealObserver() {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger children if they're in the same parent
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach((el, i) => {
            // Auto-stagger sibling reveals
            const parent = el.parentElement;
            const siblings = [...parent.querySelectorAll(':scope > .reveal')];
            const index = siblings.indexOf(el);
            if (index > 0) {
                el.dataset.revealDelay = index * 120;
            }
            observer.observe(el);
        });
    }


    // ── Typing Effect ──
    const typedTextEl = document.getElementById('typed-text');
    const phrases = ['Stay in the Flow.', 'Build Consistency.', 'Own Your Day.', 'Track Everything.'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        typingTimeout = setTimeout(typeEffect, speed);
    }

    // Start after loading
    setTimeout(typeEffect, 1200);


    // ── Animated Counters ──
    function startCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }


    // ── Navbar Scroll Behavior ──
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });


    // ── Mobile Menu ──
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('open');
        });
    });


    // ── Smooth Active Nav Link Highlighting ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // ── Back to Top Button ──
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ── Hero Showcase 3D Tilt (desktop only) ──
    const showcase = document.getElementById('hero-showcase');
    const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

    if (showcase && !isTouchDevice()) {
        showcase.addEventListener('mousemove', (e) => {
            const rect = showcase.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            showcase.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        showcase.addEventListener('mouseleave', () => {
            showcase.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        });
    }


    // ── Generate Interactive Hero Heatmap ──
    const container = document.getElementById('heatmap-container');
    const weeks = 14;
    const days = 7;

    const levels = ['level-0', 'level-1', 'level-2', 'level-3', 'level-4'];

    for (let col = 0; col < weeks; col++) {
        const column = document.createElement('div');
        column.className = 'heatmap-col';

        for (let row = 0; row < days; row++) {
            const cell = document.createElement('div');

            const randomVal = Math.random();
            let levelIndex = 0;
            if (randomVal > 0.8) levelIndex = 4;
            else if (randomVal > 0.6) levelIndex = 3;
            else if (randomVal > 0.4) levelIndex = 2;
            else if (randomVal > 0.2) levelIndex = 1;

            cell.className = `heatmap-cell ${levels[levelIndex]}`;

            // Interactive: click to toggle cell
            cell.addEventListener('click', () => {
                const currentLevel = parseInt(cell.className.match(/level-(\d)/)?.[1] || 0);
                const nextLevel = (currentLevel + 1) % 5;
                cell.className = `heatmap-cell level-${nextLevel}`;
                cell.style.transform = 'scale(1.6)';
                setTimeout(() => cell.style.transform = 'scale(1)', 200);
            });

            cell.addEventListener('mouseenter', () => {
                cell.style.transform = 'scale(1.4)';
                cell.style.zIndex = '10';
                cell.style.boxShadow = '0 0 12px var(--primary-bright)';
            });

            cell.addEventListener('mouseleave', () => {
                cell.style.transform = 'scale(1)';
                cell.style.zIndex = '1';
                cell.style.boxShadow = 'none';
            });

            column.appendChild(cell);
        }
        container.appendChild(column);
    }


    // ── Interactive Demo: Multiple Trackers ──
    const trackersContainer = document.getElementById('trackers-container');
    const habitInput = document.getElementById('habit-name-input');
    const addTrackerBtn = document.getElementById('add-tracker-btn');

    function createTracker(name) {
        const demoWeeks = 6;
        let streak = 0;
        let currentDayCell = null;
        let logged = false;

        const mockup = document.createElement('div');
        mockup.className = 'widget-mockup reveal revealed';

        // Entrance animation
        mockup.style.opacity = '0';
        mockup.style.transform = 'translateY(30px) scale(0.95)';
        setTimeout(() => {
            mockup.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            mockup.style.opacity = '1';
            mockup.style.transform = 'translateY(0) scale(1)';
        }, 50);

        mockup.innerHTML = `
            <div class="widget-header">
                <div>
                    <span class="widget-title">${name}</span>
                    <span class="widget-streak streak-counter">${streak} Day Streak</span>
                </div>
                <button class="widget-delete-btn" title="Remove tracker" aria-label="Remove tracker">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="widget-body">
                <div class="widget-heatmap"></div>
                <button class="widget-add-btn" aria-label="Log habit">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
            </div>
        `;

        const heatmapContainer = mockup.querySelector('.widget-heatmap');
        const addBtn = mockup.querySelector('.widget-add-btn');
        const streakCounter = mockup.querySelector('.streak-counter');
        const deleteBtn = mockup.querySelector('.widget-delete-btn');

        for (let col = 0; col < demoWeeks; col++) {
            const column = document.createElement('div');
            column.className = 'heatmap-col';
            for (let row = 0; row < days; row++) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';

                if (col < demoWeeks - 1 || (col === demoWeeks - 1 && row < 3)) {
                    const randomVal = Math.random();
                    if (randomVal > 0.8) cell.classList.add('level-4');
                    else if (randomVal > 0.4) cell.classList.add('level-3');
                    else if (randomVal > 0.1) cell.classList.add('level-2');
                    else cell.classList.add('level-0');

                    if (randomVal > 0.1) streak++;
                } else if (col === demoWeeks - 1 && row === 3) {
                    cell.classList.add('level-0', 'today-cell');
                    currentDayCell = cell;
                } else {
                    cell.classList.add('level-0');
                }
                column.appendChild(cell);
            }
            heatmapContainer.appendChild(column);
        }

        streakCounter.textContent = `${streak} Day Streak`;

        addBtn.addEventListener('click', () => {
            if (currentDayCell && !logged) {
                logged = true;

                // Button feedback
                addBtn.style.transform = 'scale(0.85) rotate(-90deg)';
                addBtn.style.background = 'var(--primary-base)';
                addBtn.style.color = 'white';
                setTimeout(() => {
                    addBtn.style.transform = 'scale(1) rotate(0deg)';
                    // Change + to checkmark
                    addBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                }, 200);

                currentDayCell.className = 'heatmap-cell level-4 logged pulse-anim';
                streak++;
                streakCounter.textContent = `${streak} Day Streak`;
                currentDayCell.classList.remove('today-cell');

                // Confetti burst on the cell
                createMicroConfetti(currentDayCell);
            }
        });

        // Delete tracker with animation
        deleteBtn.addEventListener('click', () => {
            mockup.style.transition = 'all 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
            mockup.style.opacity = '0';
            mockup.style.transform = 'scale(0.8) translateY(20px)';
            setTimeout(() => mockup.remove(), 400);
        });

        trackersContainer.appendChild(mockup);
    }

    // Mini confetti burst effect
    function createMicroConfetti(target) {
        const rect = target.getBoundingClientRect();
        const colors = ['#00b4d8', '#90e0ef', '#0077b6', '#ffffff'];
        const scrollY = window.scrollY || window.pageYOffset;

        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            dot.className = 'confetti-dot';
            // Use fixed positioning with the viewport-relative coords from getBoundingClientRect
            dot.style.left = rect.left + rect.width / 2 + 'px';
            dot.style.top = rect.top + rect.height / 2 + 'px';
            dot.style.background = colors[Math.floor(Math.random() * colors.length)];
            dot.style.setProperty('--tx', (Math.random() - 0.5) * 60 + 'px');
            dot.style.setProperty('--ty', (Math.random() - 0.5) * 60 + 'px');
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 650);
        }
    }

    // Initialize default demo trackers
    createTracker('Daily Study');

    // Form handling
    addTrackerBtn.addEventListener('click', () => {
        const val = habitInput.value.trim();
        if (val) {
            createTracker(val);
            habitInput.value = '';
            habitInput.focus();
        } else {
            // Shake animation on empty input
            habitInput.classList.add('shake');
            setTimeout(() => habitInput.classList.remove('shake'), 500);
        }
    });

    habitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTrackerBtn.click();
    });


    // ── Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
