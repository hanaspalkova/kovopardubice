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
});
