/**
 * GREENSCAPE AI — GLOBAL BACKGROUND SYSTEM
 * background.js
 *
 * Generates:
 *  • Floating atmosphere particles
 *  • Falling eco leaves
 *
 * Insert: <script src="assets/js/background.js"></script>
 *         at the BOTTOM of every page's <body>
 */

(function () {
    'use strict';

    /* ─── CONFIG ─────────────────────────────────────── */
    const CFG = {
        particles: {
            count: 38,
            minSize: 2,   // px
            maxSize: 6,   // px
            minDuration: 18, // seconds
            maxDuration: 40,
            minDelay: 0,
            maxDelay: 20,
        },
        leaves: {
            count: 18,
            minSize: 12,  // px
            maxSize: 28,  // px
            minDuration: 14, // seconds
            maxDuration: 32,
            minDelay: 0,
            maxDelay: 18,
        }
    };

    /* ─── UTIL ───────────────────────────────────────── */
    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(rand(min, max));
    const pick = arr => arr[randInt(0, arr.length)];

    /* ─── LEAF SVG PATHS ─────────────────────────────── */
    // Three different leaf shapes for variety
    const leafPaths = [
        // Oval leaf
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32" width="WIDTH" height="HEIGHT">
            <path d="M10 0 C16 4 20 12 18 20 C16 28 10 32 10 32 C10 32 4 28 2 20 C0 12 4 4 10 0Z"/>
        </svg>`,
        // Maple-style leaf
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="WIDTH" height="HEIGHT">
            <path d="M12 0 L14 7 L20 4 L16 10 L24 10 L18 15 L22 22 L12 18 L2 22 L6 15 L0 10 L8 10 L4 4 L10 7 Z"/>
        </svg>`,
        // Simple rounded leaf
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" width="WIDTH" height="HEIGHT">
            <path d="M12 2 Q22 8 20 18 Q18 26 12 28 Q6 26 4 18 Q2 8 12 2Z"/>
        </svg>`,
    ];

    // Eco-themed leaf colours (low saturation, nature tones)
    const leafColors = [
        '#3a7d44', '#4a9e5c', '#2d6a3f', '#6bb87a',
        '#b7e778', '#5cb85c', '#52994a', '#7dc67a',
    ];

    /* ─── PARTICLE GENERATOR ─────────────────────────── */
    function spawnParticles() {
        const container = document.getElementById('gs-particle-container');
        if (!container) return;

        for (let i = 0; i < CFG.particles.count; i++) {
            const el = document.createElement('div');
            el.classList.add('gs-particle');

            const size = rand(CFG.particles.minSize, CFG.particles.maxSize);
            const duration = rand(CFG.particles.minDuration, CFG.particles.maxDuration);
            const delay = rand(CFG.particles.minDelay, CFG.particles.maxDelay);
            const left = rand(0, 100); // %
            const drift = (Math.random() > 0.5 ? 1 : -1) * rand(10, 60); // px

            el.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                bottom: -${size}px;
                --drift: ${drift}px;
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
                opacity: ${rand(0.08, 0.28)};
            `;

            container.appendChild(el);
        }
    }

    /* ─── LEAF GENERATOR ─────────────────────────────── */
    function spawnLeaves() {
        const container = document.getElementById('gs-leaf-container');
        if (!container) return;

        for (let i = 0; i < CFG.leaves.count; i++) {
            const el = document.createElement('div');
            el.classList.add('gs-leaf');

            const size = randInt(CFG.leaves.minSize, CFG.leaves.maxSize);
            const duration = rand(CFG.leaves.minDuration, CFG.leaves.maxDuration);
            const delay = rand(CFG.leaves.minDelay, CFG.leaves.maxDelay);
            const left = rand(0, 100); // %
            const drift = (Math.random() > 0.5 ? 1 : -1) * rand(30, 120);
            const rotate = (Math.random() > 0.5 ? 1 : -1) * randInt(180, 540);
            const opacity = rand(0.10, 0.28);
            const color = pick(leafColors);
            const svgTemplate = pick(leafPaths);
            const svg = svgTemplate
                .replace(/WIDTH/g, size)
                .replace(/HEIGHT/g, size);

            el.style.cssText = `
                left: ${left}%;
                color: ${color};
                --leaf-drift: ${drift}px;
                --leaf-rotate: ${rotate}deg;
                --leaf-opacity: ${opacity};
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
            `;
            el.innerHTML = svg;

            container.appendChild(el);
        }
    }

    /* ─── BOOT ───────────────────────────────────────── */
    function init() {
        spawnParticles();
        spawnLeaves();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
