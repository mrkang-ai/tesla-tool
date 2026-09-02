/**
 * Hero 3D Interactive Canvas Engine
 * Lightweight, 60FPS interactive 3D particle and geometric visualizer
 * Reacts to mouse cursor, touch gestures, and theme (dark/light) mode.
 */

(function() {
    'use strict';

    class Hero3DScene {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.width = 0;
            this.height = 0;
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);

            // Mouse / Touch interaction state
            this.mouse = {
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                isHovered: false
            };

            // 3D camera & rotation
            this.rotX = 0;
            this.rotY = 0;
            this.targetRotX = 0;
            this.targetRotY = 0;

            // Geometry Objects
            this.shapes = [];
            this.particles = [];
            this.particleCount = 45;

            // Performance observer
            this.isVisible = true;
            this.animId = null;

            this.init();
        }

        init() {
            this.resize();
            this.createObjects();
            this.setupEvents();
            this.setupVisibilityObserver();
            this.animate();
        }

        resize() {
            if (!this.canvas.parentElement) return;
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.width = rect.width || 380;
            this.height = rect.height || 380;

            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;

            this.ctx.scale(this.dpr, this.dpr);
        }

        isDarkMode() {
            return document.documentElement.classList.contains('dark');
        }

        createObjects() {
            this.shapes = [];
            this.particles = [];

            // 1. Central 3D Isometric Cube (The Core Toolkit Box)
            const cubeSize = Math.min(this.width, this.height) * 0.28;
            this.shapes.push(this.create3DCube(0, 0, 0, cubeSize));

            // 2. Surrounding floating 3D Polyhedra (Octahedron & Gems)
            const orbitRadius = cubeSize * 1.5;
            this.shapes.push(this.create3DOctahedron(-orbitRadius * 0.7, -orbitRadius * 0.5, 30, cubeSize * 0.38, 0.015));
            this.shapes.push(this.create3DIcosahedron(orbitRadius * 0.75, orbitRadius * 0.45, -20, cubeSize * 0.35, -0.018));
            this.shapes.push(this.create3DPyramid(orbitRadius * 0.6, -orbitRadius * 0.65, 40, cubeSize * 0.32, 0.02));

            // 3. Floating 3D Star / Diamond Particles
            for (let i = 0; i < this.particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 50 + Math.random() * (Math.min(this.width, this.height) * 0.48);
                this.particles.push({
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    z: (Math.random() - 0.5) * 200,
                    size: 1.5 + Math.random() * 3,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    speedZ: (Math.random() - 0.5) * 0.3,
                    opacity: 0.2 + Math.random() * 0.6
                });
            }
        }

        create3DCube(cx, cy, cz, s) {
            const h = s / 2;
            const vertices = [
                { x: -h, y: -h, z: -h }, { x: h, y: -h, z: -h },
                { x: h, y: h, z: -h }, { x: -h, y: h, z: -h },
                { x: -h, y: -h, z: h }, { x: h, y: -h, z: h },
                { x: h, y: h, z: h }, { x: -h, y: h, z: h }
            ];
            const edges = [
                [0, 1], [1, 2], [2, 3], [3, 0],
                [4, 5], [5, 6], [6, 7], [7, 4],
                [0, 4], [1, 5], [2, 6], [3, 7]
            ];
            const faces = [
                [0, 1, 2, 3], [4, 5, 6, 7],
                [0, 1, 5, 4], [2, 3, 7, 6],
                [1, 2, 6, 5], [0, 3, 7, 4]
            ];
            return {
                type: 'cube',
                cx, cy, cz,
                vertices, edges, faces,
                rx: 0.4, ry: 0.6, rz: 0.2,
                speedX: 0.005, speedY: 0.008, speedZ: 0.003
            };
        }

        create3DOctahedron(cx, cy, cz, s, speed) {
            const vertices = [
                { x: 0, y: -s, z: 0 },
                { x: -s, y: 0, z: 0 },
                { x: 0, y: 0, z: s },
                { x: s, y: 0, z: 0 },
                { x: 0, y: 0, z: -s },
                { x: 0, y: s, z: 0 }
            ];
            const edges = [
                [0, 1], [0, 2], [0, 3], [0, 4],
                [5, 1], [5, 2], [5, 3], [5, 4],
                [1, 2], [2, 3], [3, 4], [4, 1]
            ];
            return {
                type: 'octa',
                cx, cy, cz,
                vertices, edges, faces: [],
                rx: Math.random() * Math.PI, ry: Math.random() * Math.PI, rz: 0,
                speedX: speed, speedY: speed * 1.2, speedZ: speed * 0.8
            };
        }

        create3DPyramid(cx, cy, cz, s, speed) {
            const h = s * 0.8;
            const vertices = [
                { x: 0, y: -h, z: 0 },
                { x: -s, y: h, z: -s },
                { x: s, y: h, z: -s },
                { x: s, y: h, z: s },
                { x: -s, y: h, z: s }
            ];
            const edges = [
                [0, 1], [0, 2], [0, 3], [0, 4],
                [1, 2], [2, 3], [3, 4], [4, 1]
            ];
            return {
                type: 'pyramid',
                cx, cy, cz,
                vertices, edges, faces: [],
                rx: 0.2, ry: 0.5, rz: 0.1,
                speedX: speed * 0.8, speedY: speed, speedZ: speed * 0.5
            };
        }

        create3DIcosahedron(cx, cy, cz, s, speed) {
            const phi = (1 + Math.sqrt(5)) / 2;
            const a = s / 2;
            const b = a * phi;
            const vertices = [
                { x: -a, y: b, z: 0 }, { x: a, y: b, z: 0 }, { x: -a, y: -b, z: 0 }, { x: a, y: -b, z: 0 },
                { x: 0, y: -a, z: b }, { x: 0, y: a, z: b }, { x: 0, y: -a, z: -b }, { x: 0, y: a, z: -b },
                { x: b, y: 0, z: -a }, { x: b, y: 0, z: a }, { x: -b, y: 0, z: -a }, { x: -b, y: 0, z: a }
            ];
            const edges = [
                [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
                [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
                [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
                [4, 9], [9, 8], [8, 6], [6, 2], [2, 4],
                [1, 9], [5, 4], [11, 2], [10, 6], [7, 8]
            ];
            return {
                type: 'icosa',
                cx, cy, cz,
                vertices, edges, faces: [],
                rx: 0.5, ry: 0.2, rz: 0.4,
                speedX: speed, speedY: speed * 0.9, speedZ: speed * 1.1
            };
        }

        setupEvents() {
            window.addEventListener('resize', () => {
                this.resize();
                this.createObjects();
            });

            const targetContainer = this.canvas.parentElement;
            if (!targetContainer) return;

            const handlePointerMove = (clientX, clientY) => {
                const rect = targetContainer.getBoundingClientRect();
                const x = clientX - rect.left - rect.width / 2;
                const y = clientY - rect.top - rect.height / 2;
                this.mouse.targetX = (x / (rect.width / 2));
                this.mouse.targetY = (y / (rect.height / 2));
                this.mouse.isHovered = true;
            };

            window.addEventListener('mousemove', (e) => {
                const rect = targetContainer.getBoundingClientRect();
                if (e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50 &&
                    e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 50) {
                    handlePointerMove(e.clientX, e.clientY);
                } else {
                    this.mouse.targetX = 0;
                    this.mouse.targetY = 0;
                    this.mouse.isHovered = false;
                }
            });

            targetContainer.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
                }
            }, { passive: true });

            targetContainer.addEventListener('touchend', () => {
                this.mouse.targetX = 0;
                this.mouse.targetY = 0;
                this.mouse.isHovered = false;
            });
        }

        setupVisibilityObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                    if (this.isVisible && !this.animId) {
                        this.animate();
                    }
                });
            }, { threshold: 0.05 });

            observer.observe(this.canvas);
        }

        // 3D Math projection: rotate point (x, y, z) by angles rx, ry, rz
        project3D(x, y, z, rx, ry, rz, cx, cy, cz) {
            // Local Rotation
            let x1 = x, y1 = y * Math.cos(rx) - z * Math.sin(rx), z1 = y * Math.sin(rx) + z * Math.cos(rx);
            let x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry), y2 = y1, z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
            let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz), y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz), z3 = z2;

            // Offset to object center
            let wx = x3 + cx;
            let wy = y3 + cy;
            let wz = z3 + cz;

            // Global Scene Rotation (Mouse Tilt)
            let gx = wx * Math.cos(this.rotY) + wz * Math.sin(this.rotY);
            let gy = wy * Math.cos(this.rotX) - (-wx * Math.sin(this.rotY) + wz * Math.cos(this.rotY)) * Math.sin(this.rotX);
            let gz = wy * Math.sin(this.rotX) + (-wx * Math.sin(this.rotY) + wz * Math.cos(this.rotY)) * Math.cos(this.rotX);

            // Perspective Projection
            const fov = 450;
            const scale = fov / (fov + gz + 180);
            return {
                x: this.width / 2 + gx * scale,
                y: this.height / 2 + gy * scale,
                z: gz,
                scale
            };
        }

        render() {
            this.ctx.clearRect(0, 0, this.width, this.height);

            const isDark = this.isDarkMode();
            const primaryColor = isDark ? '#38bdf8' : '#0ea5e9'; // Sky blue
            const accentColor = isDark ? '#c084fc' : '#6366f1';  // Purple/Indigo
            const glowColor = isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(14, 165, 233, 0.15)';

            // Background Radial Glow
            const glowGrad = this.ctx.createRadialGradient(
                this.width / 2, this.height / 2, 10,
                this.width / 2, this.height / 2, Math.min(this.width, this.height) * 0.48
            );
            glowGrad.addColorStop(0, glowColor);
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = glowGrad;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // 1. Render & Update Floating Particles
            this.ctx.fillStyle = isDark ? 'rgba(186, 230, 253, 0.7)' : 'rgba(14, 165, 233, 0.6)';
            for (let p of this.particles) {
                p.x += p.speedX;
                p.y += p.speedY;
                p.z += p.speedZ;

                const maxBound = Math.min(this.width, this.height) * 0.45;
                if (Math.abs(p.x) > maxBound) p.speedX *= -1;
                if (Math.abs(p.y) > maxBound) p.speedY *= -1;
                if (Math.abs(p.z) > 150) p.speedZ *= -1;

                const proj = this.project3D(p.x, p.y, p.z, 0, 0, 0, 0, 0, 0);
                if (proj.scale > 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(proj.x, proj.y, Math.max(1, p.size * proj.scale), 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            // Draw connecting constellation lines for nearby particles
            this.ctx.lineWidth = 0.6;
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p1 = this.particles[i];
                    const p2 = this.particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dz = p1.z - p2.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < 75) {
                        const proj1 = this.project3D(p1.x, p1.y, p1.z, 0, 0, 0, 0, 0, 0);
                        const proj2 = this.project3D(p2.x, p2.y, p2.z, 0, 0, 0, 0, 0, 0);
                        const lineOpacity = (1 - dist / 75) * (isDark ? 0.3 : 0.2);
                        this.ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${lineOpacity})` : `rgba(14, 165, 233, ${lineOpacity})`;
                        this.ctx.beginPath();
                        this.ctx.moveTo(proj1.x, proj1.y);
                        this.ctx.lineTo(proj2.x, proj2.y);
                        this.ctx.stroke();
                    }
                }
            }

            // 2. Render 3D Shapes
            for (let shape of this.shapes) {
                shape.rx += shape.speedX;
                shape.ry += shape.speedY;
                shape.rz += shape.speedZ;

                const projectedVertices = shape.vertices.map(v => 
                    this.project3D(v.x, v.y, v.z, shape.rx, shape.ry, shape.rz, shape.cx, shape.cy, shape.cz)
                );

                // If it's a cube, draw shaded faces
                if (shape.type === 'cube' && shape.faces.length > 0) {
                    for (let face of shape.faces) {
                        const p0 = projectedVertices[face[0]];
                        const p1 = projectedVertices[face[1]];
                        const p2 = projectedVertices[face[2]];
                        const p3 = projectedVertices[face[3]];

                        // Calculate face normal z to determine illumination
                        const normalZ = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
                        if (normalZ > 0) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(p0.x, p0.y);
                            this.ctx.lineTo(p1.x, p1.y);
                            this.ctx.lineTo(p2.x, p2.y);
                            this.ctx.lineTo(p3.x, p3.y);
                            this.ctx.closePath();

                            const fillAlpha = isDark ? 0.12 : 0.08;
                            this.ctx.fillStyle = isDark ? `rgba(56, 189, 248, ${fillAlpha})` : `rgba(14, 165, 233, ${fillAlpha})`;
                            this.ctx.fill();

                            this.ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(14, 165, 233, 0.35)';
                            this.ctx.lineWidth = 1.2;
                            this.ctx.stroke();
                        }
                    }
                }

                // Draw wireframe edges
                this.ctx.strokeStyle = shape.type === 'cube' 
                    ? (isDark ? 'rgba(186, 230, 253, 0.85)' : 'rgba(14, 165, 233, 0.85)')
                    : (shape.type === 'octa' ? accentColor : primaryColor);
                this.ctx.lineWidth = shape.type === 'cube' ? 2 : 1.4;

                for (let edge of shape.edges) {
                    const p1 = projectedVertices[edge[0]];
                    const p2 = projectedVertices[edge[1]];
                    if (p1.scale > 0 && p2.scale > 0) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }

                // Draw glowing vertex nodes
                this.ctx.fillStyle = isDark ? '#ffffff' : primaryColor;
                for (let p of projectedVertices) {
                    if (p.scale > 0) {
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, (shape.type === 'cube' ? 3.5 : 2.5) * p.scale, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }

        animate() {
            if (!this.isVisible) {
                this.animId = null;
                return;
            }

            // Smooth mouse physics interpolation (Spring ease)
            this.targetRotX = this.mouse.targetY * 0.35;
            this.targetRotY = this.mouse.targetX * 0.45;

            this.rotX += (this.targetRotX - this.rotX) * 0.06;
            this.rotY += (this.targetRotY - this.rotY) * 0.06;

            this.render();
            this.animId = requestAnimationFrame(() => this.animate());
        }
    }

    // Auto initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new Hero3DScene('hero-3d-canvas'));
    } else {
        new Hero3DScene('hero-3d-canvas');
    }
})();
