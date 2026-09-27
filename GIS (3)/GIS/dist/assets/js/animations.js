document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Navbar Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('navbar-scrolled', 'bg-white/80', 'dark:bg-background-dark/80');
        } else {
            header.classList.remove('navbar-scrolled', 'bg-white/40', 'dark:bg-background-dark/40');
        }
    });

    // --- Hero Section Animations ---
    const hero = document.getElementById('hero');
    if(hero) {
        // Floating Particles
        const particlesContainer = document.getElementById('particles-container');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute bg-accent/20 rounded-full blur-xl';
            const size = Math.random() * 100 + 50;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particlesContainer.appendChild(particle);

            gsap.to(particle, {
                x: 'random(-100, 100)',
                y: 'random(-100, 100)',
                duration: 'random(10, 20)',
                repeat: -1,
                yoyo: true,
                ease: 'none'
            });
        }

        // Hero Content Animation
        gsap.from(".hero-content > *", {
            opacity: 0,
            y: 50,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out"
        });

        // Hero Parallax
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            gsap.to(".hero-content", {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: "power2.out"
            });
        });

        // Floating Stats Cards Animation
        gsap.from(".stats-row .stat-card", {
            opacity: 0,
            y: 100,
            duration: 1,
            stagger: 0.15,
            delay: 0.8,
            ease: 'power3.out'
        });

        // Animated Counters
        const counters = { temp: 0, air: 0, zones: 0 };
        gsap.to(counters, {
            duration: 3,
            delay: 1.5,
            temp: -3.4,
            air: 28,
            zones: 147,
            ease: 'power4.out',
            onUpdate: () => {
                const tempEl = document.getElementById('temp-reduction');
                const airEl = document.getElementById('air-quality');
                const zoneEl = document.getElementById('plantation-zones');
                if(tempEl) tempEl.textContent = `${counters.temp.toFixed(1)}°C`;
                if(airEl) airEl.textContent = `+${Math.round(counters.air)}%`;
                if(zoneEl) zoneEl.textContent = Math.round(counters.zones);
            }
        });
    }

    // --- General Scroll-Triggered Animations ---

    // Problem section specific
    gsap.from("#problem img", {
        scrollTrigger: {
            trigger: "#problem",
            start: "top 70%",
        },
        opacity: 0,
        x: -100,
        duration: 1.2,
        ease: "power3.out"
    });

    gsap.from(".problem-card", {
        scrollTrigger: {
            trigger: "#problem",
            start: "top 60%",
        },
        opacity: 0,
        x: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    // --- Dashboard specific animations ---
    if (window.location.pathname.includes('dashboard.html')) {
        // 1. Entrance Stagger
        gsap.from("main > div > *", {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        });

        // 2. Animated Count-up for stats
        const animateStat = (id, target) => {
            const el = document.getElementById(id);
            if(!el) return;
            
            // Apply premium styling class
            el.classList.add('stat-value');
            
            const startValue = 0;
            const obj = { val: startValue };
            
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power4.out",
                onUpdate: () => {
                    if (id === 'metric-temp') el.innerText = obj.val.toFixed(1) + "°C";
                    else if (id === 'metric-ndvi') el.innerText = obj.val.toFixed(2);
                    else if (id === 'metric-aqi') el.innerText = Math.round(obj.val);
                    else if (id === 'metric-cooling') el.innerText = obj.val.toFixed(1) + "/10";
                }
            });
        };

        // Trigger animations with slight delay for impact
        setTimeout(() => {
            animateStat('metric-temp', 27.4);
            animateStat('metric-ndvi', 0.54);
            animateStat('metric-aqi', 112);
            animateStat('metric-cooling', 6.8);
        }, 300);

        // 3. Pulse Glow for Optimize Button
        const optimizeBtn = document.querySelector('.btn-primary');
        if(optimizeBtn) {
            optimizeBtn.classList.add('btn-shine');
            gsap.to(optimizeBtn, {
                boxShadow: "0 0 20px rgba(31, 167, 116, 0.4)",
                repeat: -1,
                yoyo: true,
                duration: 2,
                ease: "sine.inOut"
            });
        }
    }

});
    const stepsTrigger = {
        trigger: "#how-it-works",
        start: "top center",
    };

    gsap.to("#steps-progress", {
        scrollTrigger: stepsTrigger,
        width: "100%",
        duration: 2,
        ease: "none"
    });

    gsap.from(".step-item", {
        scrollTrigger: stepsTrigger,
        opacity: 0,
        y: 40,
        stagger: 0.3,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    // --- AI Recommendations ---
    gsap.from(".recommendation-card", {
        scrollTrigger: {
            trigger: "#ai-recommendations",
            start: "top 75%",
        },
        opacity: 0,
        scale: 0.9,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
    });

    // --- Tech stack ---
    gsap.from(".tech-card", {
        scrollTrigger: {
            trigger: "#tech-stack",
            start: "top 80%",
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    });

});
