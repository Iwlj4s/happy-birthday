(function() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let MAX_PARTICLES = window.innerWidth < 600 ? 520 : 1200;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        MAX_PARTICLES = window.innerWidth < 600 ? 220 : 700;
    }
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor(x, y, options = {}) {
            this.x = x;
            this.y = y;
            this.size = options.size || (Math.random() * 8 + 4);
            const speedXRange = options.speedXRange != null ? options.speedXRange : 8;
            this.speedX = (Math.random() - 0.5) * speedXRange;
            this.speedY = options.speedY != null ? options.speedY : (Math.random() - 0.5) * 8 - 3;
            this.gravity = options.gravity != null ? options.gravity : 0.25;
            this.opacity = 1;
            this.color = options.color || `hsl(${Math.random() * 360}, 85%, 65%)`;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 0.2;
            this.life = 1;
            this.decay = options.decay != null ? options.decay : 0.015 + Math.random() * 0.008;
        }
        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotSpeed;
            this.life -= this.decay;
            this.opacity = Math.max(0, this.life);
            return this.life > 0 && this.y < height + 800;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }

    function explodeConfetti(centerX, centerY, count = 120) {
        const factor = window.innerWidth < 600 ? 0.45 : (window.innerWidth < 900 ? 0.75 : 1);
        count = Math.max(6, Math.round(count * factor));
        for (let i = 0; i < count; i++) {
            if (particles.length > MAX_PARTICLES) break;
            particles.push(new ConfettiParticle(centerX, centerY));
        }
    }

    let bgConfettiRunning = false;
    let bgConfettiInterval = null;
    function startBackgroundConfetti() {
        if (bgConfettiRunning) return;
        bgConfettiRunning = true;
        bgConfettiInterval = setInterval(() => {
            const spawnCount = 3 + Math.floor(Math.random()*4);
            for (let i = 0; i < spawnCount; i++) {
                if (particles.length > MAX_PARTICLES) break;
                const x = Math.random() * width;
                particles.push(new ConfettiParticle(x, -10, {
                    size: 6 + Math.random() * 6,
                    speedXRange: 1.2,
                    speedY: 0.6 + Math.random() * 1.0,
                    gravity: 0.03,
                    decay: 0.005,
                    color: `hsl(${Math.random() * 360}, 70%, 60%)`
                }));
            }
            if (Math.random() < 0.06) {
                const cx = Math.random() * width;
                explodeConfetti(cx, 50, 16);
            }
        }, 260);
    }

    function animateConfetti() {
        requestAnimationFrame(animateConfetti);
        ctx.clearRect(0, 0, width, height);
        for (let i = particles.length-1; i >= 0; i--) {
            const alive = particles[i].update();
            particles[i].draw();
            if (!alive) particles.splice(i, 1);
        }
    }
    animateConfetti();

    function getCenter(el) {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
    }

    const leftHamster = document.getElementById('hamsterLeft');
    const rightHamster = document.getElementById('hamsterRight');
    const mainHamster = document.getElementById('hamsterMain');
    const birthdayText = document.getElementById('birthdayText');

    let step1completed = false;

    function moveToRight() {
        if (step1completed) return;
        step1completed = true;
        leftHamster.style.opacity = '0';
        leftHamster.style.pointerEvents = 'none';
        rightHamster.style.opacity = '1';
        rightHamster.style.pointerEvents = 'auto';
        rightHamster.style.transform = 'translateX(0) translateY(0)';
        const card = document.querySelector('.card');
        card.style.transform = 'scale(1.01)';
        setTimeout(() => card.style.transform = '', 200);
    }

    function showMainHamster() {
        if (mainHamster.classList.contains('show')) return;
        mainHamster.classList.add('show');
        setTimeout(() => {
            mainHamster.classList.add('attention');
        }, 100);
        birthdayText.classList.add('show');
        startBackgroundConfetti();

        leftHamster.style.opacity = '';
        leftHamster.style.pointerEvents = '';
        leftHamster.style.visibility = '';
        leftHamster.style.display = '';
        leftHamster.style.transform = '';
        leftHamster.style.bottom = '';

        rightHamster.style.opacity = '';
        rightHamster.style.pointerEvents = '';
        rightHamster.style.visibility = '';
        rightHamster.style.display = '';
        rightHamster.style.transform = '';
        rightHamster.style.bottom = '';

        leftHamster.src = 'hamster-left.png';
        rightHamster.src = 'hamster-right.png';

        leftHamster.classList.add('final');
        rightHamster.classList.add('final');
        leftHamster.classList.remove('jump-bottom');
        rightHamster.classList.remove('jump-bottom');

        if (!window._leftHamsterEmitter) {
            window._leftHamsterEmitter = setInterval(() => {
                const c = getCenter(leftHamster);
                for (let i = 0; i < 1; i++) {
                    if (particles.length > MAX_PARTICLES) break;
                    particles.push(new ConfettiParticle(c.x + (Math.random()*36-18), c.y - 6, {
                        size: 4 + Math.random()*3,
                        speedXRange: 1.0,
                        speedY: 0.3 + Math.random()*0.6,
                        gravity: 0.04,
                        decay: 0.01,
                        color: `hsl(${Math.random()*60+20},70%,60%)`
                    }));
                }
            }, 420);
        }
        if (!window._rightHamsterEmitter) {
            window._rightHamsterEmitter = setInterval(() => {
                const c = getCenter(rightHamster);
                for (let i = 0; i < 2; i++) {
                    if (particles.length > MAX_PARTICLES) break;
                    particles.push(new ConfettiParticle(c.x + (Math.random()*36-18), c.y - 6, {
                        size: 4 + Math.random()*3,
                        speedXRange: 1.0,
                        speedY: 0.3 + Math.random()*0.6,
                        gravity: 0.04,
                        decay: 0.01,
                        color: `hsl(${Math.random()*60+180},70%,60%)`
                    }));
                }
            }, 420);
        }

        setTimeout(() => {
            const center = getCenter(mainHamster);
            explodeConfetti(center.x, center.y, 150);
            setTimeout(() => {
                const center2 = getCenter(mainHamster);
                explodeConfetti(center2.x, center2.y, 80);
            }, 200);
        }, 100);

        mainHamster.style.cursor = 'pointer';
        let mainFirstClick = false;
        mainHamster.addEventListener('pointerdown', (e) => {
            mainHamster.classList.remove('attention');
            triggerJump(mainHamster);
            const c = getCenter(mainHamster);
            explodeConfetti(c.x, c.y, 100);
            if (!mainFirstClick) {
                mainFirstClick = true;
                const pass = document.getElementById('passImage');
                if (pass) {
                    pass.classList.add('show');
                    if (!window._passEmitter) {
                        window._passEmitter = setInterval(() => {
                            const p = document.getElementById('passImage');
                            if (!p) return;
                            const c = getCenter(p);
                            for (let i = 0; i < 3; i++) {
                                particles.push(new ConfettiParticle(c.x + (Math.random()*80-40), c.y + (Math.random()*-30), {
                                    size: 4 + Math.random()*5,
                                    speedXRange: 1.6,
                                    speedY: -1 - Math.random()*1.5,
                                    gravity: 0.04,
                                    decay: 0.01,
                                    color: `hsl(${Math.random()*360},70%,60%)`
                                }));
                            }
                        }, 350);
                    }
                }
            }
            e.stopPropagation();
        });
    }

    leftHamster.addEventListener('pointerdown', (ev) => {
        if (!mainHamster.classList.contains('show')) {
            moveToRight();
        } else {
            mainHamster.classList.remove('attention');
            triggerJump(leftHamster);
            const c = getCenter(leftHamster);
            explodeConfetti(c.x, c.y - 10, 30);
        }
        ev.stopPropagation();
    });

    leftHamster.addEventListener('touchstart', (ev) => {
        ev.preventDefault();
        if (!mainHamster.classList.contains('show')) {
            moveToRight();
        } else {
            mainHamster.classList.remove('attention');
            triggerJump(leftHamster);
            const c = getCenter(leftHamster);
            explodeConfetti(c.x, c.y - 10, 30);
        }
        ev.stopPropagation();
    });

    rightHamster.addEventListener('pointerdown', (ev) => {
        if (!step1completed) {
            moveToRight();
        } else if (!mainHamster.classList.contains('show')) {
            showMainHamster();
        } else {
            mainHamster.classList.remove('attention');
            triggerJump(rightHamster);
            const c = getCenter(rightHamster);
            explodeConfetti(c.x, c.y - 10, 30);
        }
        ev.stopPropagation();
    });
    rightHamster.addEventListener('touchstart', (ev) => {
        ev.preventDefault();
        if (!step1completed) {
            moveToRight();
        } else if (!mainHamster.classList.contains('show')) {
            showMainHamster();
        } else {
            mainHamster.classList.remove('attention');
            triggerJump(rightHamster);
            const c = getCenter(rightHamster);
            explodeConfetti(c.x, c.y - 10, 30);
        }
        ev.stopPropagation();
    });

    leftHamster.addEventListener('pointerenter', moveToRight);
    rightHamster.addEventListener('pointerenter', () => {
        if (step1completed) showMainHamster();
    });

    function triggerJump(el) {
        if (!el) return;
        el.classList.remove('jump-bottom');
        void el.offsetWidth;
        el.classList.add('jump-bottom');
        setTimeout(() => el.classList.remove('jump-bottom'), 700);
    }

    setTimeout(() => {
        if (!step1completed) {
            leftHamster.style.animation = 'bounce 0.6s ease 2';
            const style = document.createElement('style');
            style.textContent = `
                @keyframes bounce {
                    0%,100%{ transform: translateX(-40px); }
                    50%{ transform: translateX(-30px); }
                }
            `;
            document.head.appendChild(style);
            setTimeout(() => style.remove(), 2000);
        }
    }, 3000);
})();