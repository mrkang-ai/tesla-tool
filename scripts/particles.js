/**
 * Global 3D Particle & Confetti Explosion Engine
 * Lightweight, 60FPS physics-based 3D confetti and victory particle generator.
 * Zero external dependencies.
 */

(function() {
    'use strict';

    class ParticleExplosion {
        constructor(options = {}) {
            this.canvas = null;
            this.ctx = null;
            this.particles = [];
            this.animId = null;
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);
            
            this.options = Object.assign({
                count: 80,
                originX: window.innerWidth / 2,
                originY: window.innerHeight * 0.4,
                spread: 360,
                colors: ['#0ea5e9', '#38bdf8', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#f43f5e', '#ffffff'],
                gravity: 0.35,
                drag: 0.985,
                duration: 2600 // ms
            }, options);

            this.startTime = 0;
            this.init();
        }

        init() {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '99999';
            document.body.appendChild(this.canvas);

            this.ctx = this.canvas.getContext('2d');
            this.resize();

            this.createParticles();
            this.startTime = performance.now();
            this.animate(this.startTime);
        }

        resize() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
            this.ctx.scale(this.dpr, this.dpr);
        }

        createParticles() {
            for (let i = 0; i < this.options.count; i++) {
                const angle = (Math.random() * Math.PI * 2);
                const speed = 7 + Math.random() * 14;
                const size = 6 + Math.random() * 8;
                const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
                const shape = Math.random() > 0.3 ? 'rect' : (Math.random() > 0.5 ? 'circle' : 'star');

                this.particles.push({
                    x: this.options.originX,
                    y: this.options.originY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 4, // initial upwards boost
                    size: size,
                    color: color,
                    shape: shape,
                    rotationX: Math.random() * 360,
                    rotationY: Math.random() * 360,
                    rotationZ: Math.random() * 360,
                    rotSpeedX: (Math.random() - 0.5) * 12,
                    rotSpeedY: (Math.random() - 0.5) * 12,
                    rotSpeedZ: (Math.random() - 0.5) * 8,
                    opacity: 1
                });
            }
        }

        drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
            let rot = Math.PI / 2 * 3;
            let x = cx;
            let y = cy;
            let step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fill();
        }

        animate(now) {
            const elapsed = now - this.startTime;
            const progress = Math.min(elapsed / this.options.duration, 1);

            this.ctx.clearRect(0, 0, this.width, this.height);

            for (let p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += this.options.gravity;
                p.vx *= this.options.drag;
                p.vy *= this.options.drag;

                p.rotationX += p.rotSpeedX;
                p.rotationY += p.rotSpeedY;
                p.rotationZ += p.rotSpeedZ;

                // Fade out towards the end
                if (progress > 0.6) {
                    p.opacity = 1 - (progress - 0.6) / 0.4;
                }

                this.ctx.save();
                this.ctx.translate(p.x, p.y);

                // 3D Perspective Rotation Simulation via scaling
                const cosX = Math.cos(p.rotationX * Math.PI / 180);
                const cosY = Math.cos(p.rotationY * Math.PI / 180);
                this.ctx.scale(cosY, cosX);
                this.ctx.rotate(p.rotationZ * Math.PI / 180);

                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = Math.max(0, p.opacity);

                if (p.shape === 'rect') {
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else if (p.shape === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (p.shape === 'star') {
                    this.drawStar(this.ctx, 0, 0, 5, p.size, p.size * 0.5);
                }

                this.ctx.restore();
            }

            if (progress < 1) {
                this.animId = requestAnimationFrame((t) => this.animate(t));
            } else {
                this.destroy();
            }
        }

        destroy() {
            if (this.animId) cancelAnimationFrame(this.animId);
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // Global trigger function
    window.triggerConfetti = function(customOptions = {}) {
        return new ParticleExplosion(customOptions);
    };

    // Dual cannon victory blast
    window.triggerCelebration = function() {
        // Left cannon
        new ParticleExplosion({
            count: 50,
            originX: window.innerWidth * 0.2,
            originY: window.innerHeight * 0.7,
            duration: 2800
        });
        // Right cannon
        setTimeout(() => {
            new ParticleExplosion({
                count: 50,
                originX: window.innerWidth * 0.8,
                originY: window.innerHeight * 0.7,
                duration: 2800
            });
        }, 120);
    };
})();
