document.addEventListener("DOMContentLoaded", function() {
    const loadHTML = (url, elementId, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                }
                if (callback) {
                    callback();
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    const initializeDropdowns = () => {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content');

            if (button && content) {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const isAlreadyOpen = content.classList.contains('show');
                    // Close all dropdowns first
                    document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                        openDropdown.classList.remove('show');
                    });
                    // If it wasn't already open, show it
                    if (!isAlreadyOpen) {
                        content.classList.add('show');
                    }
                });
            }
        });

        window.onclick = (event) => {
            if (!event.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                    openDropdown.classList.remove('show');
                });
            }
        };
    };

    const setupShareButtons = () => {
        const copyLinkBtn = document.getElementById('copy-link-btn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('Page URL copied to clipboard!'))
                    .catch(err => console.error('Failed to copy: ', err));
            });
        }

        const snsShareBtn = document.getElementById('sns-share-btn');
        if (snsShareBtn) {
            snsShareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        text: document.querySelector('meta[name="description"]')?.content || document.title,
                        url: window.location.href,
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing', error));
                } else {
                    alert('Web Share API is not supported in this browser.');
                }
            });
        }
    };

    const setupMobileMenu = () => {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuIcon = document.getElementById('mobile-menu-icon');

        if (!mobileMenuBtn || !mobileMenu) return;

        const toggleMenu = (forceShow) => {
            const isCurrentlyHidden = mobileMenu.classList.contains('hidden');
            const shouldOpen = typeof forceShow === 'boolean' ? forceShow : isCurrentlyHidden;

            if (shouldOpen) {
                mobileMenu.classList.remove('hidden');
                if (mobileMenuIcon) mobileMenuIcon.textContent = 'close';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        };

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('#mobile-menu') && !event.target.closest('#mobile-menu-btn')) {
                toggleMenu(false);
            }
        });

        // Close mobile menu when clicking any link inside it
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toggleMenu(false);
            }
        });
    };

    const updateCurrentServiceName = () => {
        const serviceNameElement = document.getElementById('current-service-name');
        if (!serviceNameElement) return;

        const path = window.location.pathname;
        const navDropdown = document.querySelector('.nav-dropdown');
        if (!navDropdown) return;

        const navLinks = navDropdown.querySelectorAll('.dropdown-content a');
        let currentServiceLink = null;

        navLinks.forEach(link => {
            if (path.includes(link.getAttribute('href'))) {
                currentServiceLink = link;
            }
        });

        const lang = document.documentElement.lang || 'ko';
        let serviceName;

        if (currentServiceLink) {
            serviceName = currentServiceLink.getAttribute(lang === 'en' ? 'data-lang-en' : 'data-lang-ko');
        } else {
            // Default to 'Menu' if on the main page
            const menuButton = navDropdown.querySelector('.dropbtn span');
            serviceName = menuButton ? menuButton.getAttribute(lang === 'en' ? 'data-lang-en' : 'data-lang-ko') : '';
        }
        serviceNameElement.textContent = serviceName;
    };
    
    // Expose the function to be called from language.js
    window.updateCurrentServiceName = updateCurrentServiceName;

    const path = window.location.pathname;
    const basePath = path.includes('/lotto/') || path.includes('/TextCount/') || path.includes('/eat/') || path.includes('/Rock-paper-scissors/') || path.includes('/ladder/') || path.includes('/carrot-dodger/') || path.includes('/Dodger/') || path.includes('/meme-generator/') || path.includes('/roulette/') || path.includes('/keycap/') || path.includes('/stairs/') ? '../' : '';

    const setupSoundToggle = () => {
        const soundBtns = document.querySelectorAll('.sound-toggle-btn');
        soundBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.SoundFX) {
                    window.SoundFX.toggle();
                }
            });
        });
        if (window.SoundFX) {
            window.SoundFX.updateUI();
        }
    };

    loadHTML(`${basePath}header.html`, 'header-placeholder', () => {
        initializeDropdowns();
        setupShareButtons();
        setupMobileMenu();
        setupSoundToggle();
        // Initial updates on page load
        if (window.applyLanguage) {
            window.applyLanguage(localStorage.getItem('language') || 'ko', true);
        } else {
            updateCurrentServiceName();
        }
    });

    loadHTML(`${basePath}footer.html`, 'footer-placeholder');

    // Dynamic Script Loader for Particles and SoundFX if not already loaded
    const loadScriptIfNotPresent = (src) => {
        if (!document.querySelector(`script[src*="${src}"]`)) {
            const script = document.createElement('script');
            script.src = `${basePath}${src}`;
            script.defer = true;
            document.head.appendChild(script);
        }
    };

    loadScriptIfNotPresent('scripts/particles.js');
    loadScriptIfNotPresent('scripts/sound.js');


    // 3D Parallax Tilt & Dynamic Glare Engine
    const setup3DTiltCards = () => {
        const cards = document.querySelectorAll('.tilt-card, [data-tilt]');
        if (!cards.length) return;

        // Skip on touch-only small screens
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        if (isTouchDevice && window.innerWidth < 768) return;

        cards.forEach(card => {
            let glare = card.querySelector('.tilt-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'tilt-glare';
                card.appendChild(glare);
            }

            let animationFrameId = null;

            const handleMouseMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const maxTilt = 8; // degrees
                const rotateX = ((centerY - y) / centerY) * maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;

                if (animationFrameId) cancelAnimationFrame(animationFrameId);

                animationFrameId = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                    
                    const glareX = (x / rect.width) * 100;
                    const glareY = (y / rect.height) * 100;
                    glare.style.opacity = '1';
                    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`;
                });
            };

            const handleMouseLeave = () => {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                glare.style.opacity = '0';
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    // Initialize 3D cards
    setup3DTiltCards();
    window.setup3DTiltCards = setup3DTiltCards;
});

