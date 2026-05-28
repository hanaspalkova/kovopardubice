document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Zavření menu po kliknutí na odkaz
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Number counter animation (countdown)
    const countElements = document.querySelectorAll('.stat-number-value');
    
    const countOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };
    
    const countOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000; // Délka animace v ms
                const frameDuration = 1000 / 60; // 60 FPS
                const totalFrames = Math.round(duration / frameDuration);
                let frame = 0;
                
                const counter = setInterval(() => {
                    frame++;
                    const progress = frame / totalFrames;
                    // easeOutExpo animace pro hezčí zpomalení na konci
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    let currentCount = Math.round(targetValue * easeProgress);
                    
                    // Formátování pro velká čísla (mezera u tisíců)
                    if (targetValue >= 1000) {
                        currentCount = currentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    }
                    
                    target.textContent = currentCount;
                    
                    if (frame === totalFrames) {
                        clearInterval(counter);
                        // Nastavení finální hodnoty napevno
                        target.textContent = targetValue >= 1000 ? targetValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : targetValue;
                    }
                }, frameDuration);
                
                observer.unobserve(target); // Zastaví sledování po spuštění animace
            }
        });
    }, countOptions);
    
    countElements.forEach(el => {
        countOnScroll.observe(el);
    });

    // Hero welding sparks (canvas particle system) — desktop only
    const heroSection = document.querySelector('.hero');
    if (heroSection && window.innerWidth >= 768) {
        const canvas = document.createElement('canvas');
        canvas.classList.add('hero-sparks');
        heroSection.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            canvas.width = heroSection.offsetWidth;
            canvas.height = heroSection.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const sparkColors = ['#ffffff', '#fff5b0', '#ffcc44', '#ff9900', '#ff6600'];
        let particles = [];

        function spawnParticle() {
            // Origin: bottom-right where the welder/sparks are in the photo
            const ox = canvas.width * (0.67 + Math.random() * 0.1);
            const oy = canvas.height * (0.65 + Math.random() * 0.2);
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7; // more upward
            const speed = Math.random() * 1.2 + 0.4;
            particles.push({
                x: ox, y: oy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 1.8 + 0.4,
                color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
                life: 0,
                maxLife: Math.random() * 70 + 35,
            });
        }

        function animateSparks() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.15) spawnParticle();

            particles = particles.filter(p => p.life < p.maxLife);
            particles.forEach(p => {
                p.life++;
                p.x += p.vx;
                p.y += p.vy;
                p.vy -= 0.01;                        // mírné zrychlení nahoru
                p.vx += (Math.random() - 0.5) * 0.08; // slight flicker
                const alpha = 1 - p.life / p.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.shadowBlur = 5;
                ctx.shadowColor = p.color;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(animateSparks);
        }
        animateSparks();
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            // Initialization for already active item
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
            
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Zavřeme všechny ostatní
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    // Sparks & Confetti explosion on the last timeline item (Dnes)
    const todayCard = document.querySelector('.timeline-content.highlight');
    if (todayCard) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        const padding = 450; 
        canvas.style.top = `-${padding}px`;
        canvas.style.left = `-${padding}px`;
        canvas.style.width = `calc(100% + ${padding * 2}px)`;
        canvas.style.height = `calc(100% + ${padding * 2}px)`;
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '10';
        todayCard.style.position = 'relative';
        todayCard.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId = null;
        let isHovered = false;

        function resizeCanvas() {
            canvas.width = todayCard.offsetWidth + padding * 2;
            canvas.height = todayCard.offsetHeight + padding * 2;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const colors = [
            '#FF6900', // brand orange
            '#FF8533', // lighter orange
            '#FFB380', // soft orange
            '#ffffff', // white hot spark
            '#FFD700', // gold
            '#FFA500'  // orange
        ];

        class Particle {
            constructor(x, y, isExplosion = false) {
                this.x = x;
                this.y = y;
                this.type = Math.random() > 0.4 ? 'spark' : 'confetti';
                
                // Usměrnění úhlu výrazně více do stran (vlevo/vpravo) pro široký rozptyl
                let angle;
                if (Math.random() > 0.5) {
                    // Do pravé strany: -50° až +50°
                    angle = (Math.random() - 0.5) * (Math.PI * 100 / 180);
                } else {
                    // Do levé strany: 130° až 230°
                    angle = Math.PI + (Math.random() - 0.5) * (Math.PI * 100 / 180);
                }
                
                const speed = isExplosion 
                    ? (Math.random() * 11 + 4) // Vyšší rychlost pro dynamičtější explozi
                    : (Math.random() * 4 + 1.5);
                    
                // Výrazné horizontální roztažení a mírný počáteční impulz nahoru
                this.vx = Math.cos(angle) * speed * 2.4;
                this.vy = Math.sin(angle) * speed * 0.7 - (isExplosion ? 2.5 : 0.8);
                
                this.size = Math.random() * 3 + 1.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = 0;
                // Delší životnost částic, aby mohly doletět dál do široka
                this.maxLife = isExplosion
                    ? (Math.random() * 60 + 70) // 70 až 130 snímků
                    : (Math.random() * 40 + 40); // 40 až 80 snímků
                
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.25;
                this.width = Math.random() * 8 + 4;
                this.height = Math.random() * 5 + 2;
            }

            update() {
                this.life++;
                this.x += this.vx;
                this.y += this.vy;
                // Velmi nízké tření horizontálně pro maximální dolet do široka
                this.vx *= 0.982;
                this.vy *= 0.975;
                this.vy += 0.09; // Jemná gravitace pro lehký a elegantní pád
                this.rotation += this.rotationSpeed;
            }

            draw() {
                const alpha = 1 - this.life / this.maxLife;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = this.color;
                
                if (this.type === 'spark') {
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                }
                ctx.restore();
            }
        }

        function triggerExplosion() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const count = Math.floor(Math.random() * 30) + 80; // 80-110 particles
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(centerX, centerY, true));
            }
            startAnimation();
        }

        function spawnContinuous() {
            if (isHovered && Math.random() < 0.25) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                particles.push(new Particle(centerX, centerY, false));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            spawnContinuous();

            particles = particles.filter(p => p.life < p.maxLife);
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            if (particles.length > 0 || isHovered) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                animationFrameId = null;
            }
        }

        function startAnimation() {
            if (!animationFrameId) {
                animate();
            }
        }

        todayCard.addEventListener('mouseenter', () => {
            isHovered = true;
            triggerExplosion();
        });

        todayCard.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        todayCard.addEventListener('touchstart', () => {
            triggerExplosion();
        }, { passive: true });
    }
});
