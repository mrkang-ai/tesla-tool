/**
 * ToolBox Universal Core Framework (framework/core.js)
 * High-reliability Header/Footer Smart Mounter, Safe Dropdown Engine, Theme & Sound Sync
 */
(function() {
    'use strict';

    // 1. Determine site root path safely
    function getRootPrefix() {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length - 1;
        if (depth <= 0) return './';
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }
        return prefix;
    }

    const rootPrefix = getRootPrefix();

    // 2. Theme Engine
    const ThemeEngine = {
        init() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            this.updateIcons();
        },
        toggle() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.updateIcons();
            if (window.SoundFX) window.SoundFX.play('click');
        },
        updateIcons() {
            const isDark = document.documentElement.classList.contains('dark');
            document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
                icon.innerHTML = isDark ? '☀️' : '🌙';
            });
        }
    };

    window.ToolboxTheme = ThemeEngine;

    // 3. Robust HTML Loader
    function fetchAndMount(url, candidateIds, callback) {
        let targetEl = null;
        for (const id of candidateIds) {
            const el = document.getElementById(id);
            if (el) {
                targetEl = el;
                break;
            }
        }
        if (!targetEl) return;

        // Try absolute root first, then relative prefix fallback
        const primaryUrl = url.startsWith('/') ? url : '/' + url;
        const fallbackUrl = rootPrefix + url.replace(/^\//, '');

        fetch(primaryUrl + '?v=201', { cache: 'no-cache' })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .catch(() => fetch(fallbackUrl + '?v=201', { cache: 'no-cache' }).then(res => res.text()))
            .then(html => {
                targetEl.innerHTML = html;
                if (callback) callback(targetEl);
            })
            .catch(err => {
                console.warn('[ToolBox Framework] Failed to mount:', url, err);
            });
    }

    // 4. Dropdown & Navigation Safe Controller
    function setupNavDropdowns(headerEl) {
        if (!headerEl) return;

        const dropdowns = headerEl.querySelectorAll('.dropdown, .nav-dropdown, .fw-dropdown');
        dropdowns.forEach(dropdown => {
            const btn = dropdown.querySelector('.dropbtn, [data-toggle="dropdown"]');
            const menu = dropdown.querySelector('.dropdown-content, .fw-dropdown-menu');

            if (!btn || !menu) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.contains('show') || menu.classList.contains('is-active');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-content.show, .fw-dropdown-menu.is-active').forEach(openMenu => {
                    openMenu.classList.remove('show', 'is-active');
                });

                if (!isOpen) {
                    menu.classList.add('show', 'is-active');
                }
            });

            // Close when clicking inside links
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('show', 'is-active');
                });
            });

            // Explicit close button if present
            const closeBtn = menu.querySelector('.dropdown-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.remove('show', 'is-active');
                });
            }
        });

        // Global dismiss on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown, .nav-dropdown, .fw-dropdown')) {
                document.querySelectorAll('.dropdown-content.show, .fw-dropdown-menu.is-active').forEach(openMenu => {
                    openMenu.classList.remove('show', 'is-active');
                });
            }
        });

        // Global dismiss on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.dropdown-content.show, .fw-dropdown-menu.is-active').forEach(openMenu => {
                    openMenu.classList.remove('show', 'is-active');
                });
            }
        });
    }

    // 5. Mobile Menu Controller
    function setupMobileMenu(headerEl) {
        if (!headerEl) return;
        const toggleBtn = headerEl.querySelector('#mobile-menu-button, .mobile-menu-toggle');
        const mobileMenu = headerEl.querySelector('#mobile-menu, .mobile-menu-drawer');
        if (toggleBtn && mobileMenu) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#mobile-menu, #mobile-menu-button, .mobile-menu-drawer, .mobile-menu-toggle')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        }
    }

    // 6. Header Action Buttons (Share, Copy, Sound, Theme)
    function setupHeaderActions(headerEl) {
        if (!headerEl) return;

        // Copy link
        const copyBtn = headerEl.querySelector('#copy-link-btn, .action-copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('현재 페이지 URL이 클립보드에 복사되었습니다.'))
                    .catch(() => prompt('아래 URL을 복사하세요:', window.location.href));
            });
        }

        // Theme toggle buttons
        headerEl.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => ThemeEngine.toggle());
        });

        // Sound toggle buttons
        headerEl.querySelectorAll('.sound-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.SoundFX) window.SoundFX.toggle();
            });
        });

        ThemeEngine.updateIcons();
    }

    // 7. Auto Initializer on DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        ThemeEngine.init();

        // Mount Header to #header-placeholder OR #header OR #site-header
        fetchAndMount('header.html', ['header-placeholder', 'header', 'site-header'], (headerEl) => {
            setupNavDropdowns(headerEl);
            setupMobileMenu(headerEl);
            setupHeaderActions(headerEl);

            // Backward compatibility with app.js functions if present
            if (window.setupMegaMenuTabs) window.setupMegaMenuTabs();
            if (window.applyLanguage) {
                window.applyLanguage(localStorage.getItem('language') || 'ko', true);
            }
        });

        // Mount Footer to #footer-placeholder OR #footer OR #site-footer
        fetchAndMount('footer.html', ['footer-placeholder', 'footer', 'site-footer']);
    });
})();
