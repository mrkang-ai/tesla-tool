/**
 * ToolBox Universal Core Framework (framework/core.js)
 * High-reliability Header/Footer Smart Mounter, Safe Dropdown Engine, Theme & Sound Sync,
 * Global Floating Quick Nav Dock (Home/Menu/Top), and Tool Screen Related Tools Switcher.
 */
(function() {
    'use strict';
    // 0. Suppress benign third-party production warnings (e.g. Tailwind CDN)
    if (typeof console !== 'undefined' && console.warn) {
        const _origWarn = console.warn;
        console.warn = function(...args) {
            if (args[0] && typeof args[0] === 'string' && (
                args[0].includes('cdn.tailwindcss.com should not be used in production') ||
                args[0].includes('should not be used in production')
            )) {
                return;
            }
            _origWarn.apply(console, args);
        };
    }

    // 0b. Global Procedural SoundFX Engine (Web Audio API - 0 external files)
    let audioCtx = null;
    let isSoundEnabled = localStorage.getItem('sound_enabled') === 'true';

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    const SoundFX = {
        isEnabled() { return isSoundEnabled; },
        toggle() {
            isSoundEnabled = !isSoundEnabled;
            localStorage.setItem('sound_enabled', isSoundEnabled ? 'true' : 'false');
            this.updateUI();
            if (isSoundEnabled) {
                getAudioContext();
                this.playPop();
            }
            return isSoundEnabled;
        },
        setEnabled(val) {
            isSoundEnabled = !!val;
            localStorage.setItem('sound_enabled', isSoundEnabled ? 'true' : 'false');
            this.updateUI();
        },
        updateUI() {
            document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined') || btn.querySelector('span');
                if (icon) icon.textContent = isSoundEnabled ? 'volume_up' : 'volume_off';
                btn.setAttribute('aria-label', isSoundEnabled ? '사운드 켜짐' : '사운드 꺼짐');
                if (isSoundEnabled) {
                    btn.classList.add('text-primary');
                    btn.classList.remove('text-text-muted', 'dark:text-slate-400');
                } else {
                    btn.classList.remove('text-primary');
                    btn.classList.add('text-text-muted', 'dark:text-slate-400');
                }
            });
        },
        playPop() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                const now = ctx.currentTime;
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } catch(e) {}
        },
        playClick() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                const now = ctx.currentTime;
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } catch(e) {}
        },
        playTick() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                const now = ctx.currentTime;
                osc.frequency.setValueAtTime(950, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.03);
            } catch(e) {}
        },
        playWin() {
            if (!isSoundEnabled) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                const now = ctx.currentTime;
                notes.forEach((freq, idx) => {
                    const startTime = now + idx * 0.09;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(0.25, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(startTime);
                    osc.stop(startTime + 0.36);
                });
            } catch(e) {}
        }
    };
    window.SoundFX = SoundFX;


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

    // 3. Robust HTML Loader with Anti-404 Guard & Built-in In-memory Fallback
    const INLINE_FALLBACKS = {
        'header.html': `
<header class="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 transition-colors w-full">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
        <div class="flex items-center gap-6 lg:gap-8">
            <a href="/" class="flex items-center gap-2.5 text-slate-900 dark:text-white cursor-pointer group select-none">
                <div class="w-8 h-8 flex items-center justify-center bg-primary rounded-xl text-white shadow-md shadow-sky-200 dark:shadow-none group-hover:scale-105 transition-transform">
                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <div class="flex flex-col">
                    <span class="text-base font-extrabold leading-none tracking-tight">ToolBox</span>
                    <span class="text-[9px] font-bold text-primary leading-none mt-0.5 tracking-wider">100+ UTILS</span>
                </div>
            </a>
            <nav class="hidden md:flex items-center gap-2 text-sm font-semibold">
                <a href="/" class="px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">홈</a>
                <a href="/#tools-100" class="px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">100대 도구모음</a>
            </nav>
        </div>
        <div class="flex items-center gap-2">
            <button type="button" class="sound-toggle-btn p-2 rounded-xl text-text-muted dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="효과음 켜기/끄기">
                <span class="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
            <button type="button" class="theme-toggle-btn p-2 rounded-xl text-text-muted dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="다크/라이트 모드 전환">
                <span class="theme-toggle-icon">🌙</span>
            </button>
        </div>
    </div>
</header>`,
        'footer.html': `
<footer class="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 py-8 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>© 2026 ToolBox. All rights reserved. 100+ Productivity Web Apps.</div>
        <div class="flex items-center gap-4">
            <a href="/privacy.html" class="hover:underline">개인정보처리방침</a>
            <a href="/terms.html" class="hover:underline">이용약관</a>
            <a href="/sitemap.html" class="hover:underline">사이트맵</a>
            <a href="/" class="hover:underline font-bold text-primary">홈으로</a>
        </div>
    </div>
</footer>`
    };

    function isInvalidPartialHtml(html) {
        if (!html || typeof html !== 'string' || !html.trim()) return true;
        const lower = html.toLowerCase();
        // Check for 404 page hallmarks
        if (lower.includes('페이지를 찾을 수 없습니다') || lower.includes('page not found') || lower.includes('요청하신 페이지를 찾을 수 없습니다')) {
            return true;
        }
        if (/<h1[^>]*>404<\/h1>/i.test(html)) {
            return true;
        }
        // Partials must NOT be complete HTML documents (like 404.html)
        if (html.trim().toLowerCase().startsWith('<!doctype') || html.includes('<html') || html.includes('<body')) {
            return true;
        }
        return false;
    }

    async function fetchAndMount(url, candidateIds, callback) {
        let targetEl = null;
        for (const id of candidateIds) {
            const el = document.getElementById(id);
            if (el) {
                targetEl = el;
                break;
            }
        }
        if (!targetEl || targetEl.getAttribute('data-mounted') === 'true') return;
        targetEl.setAttribute('data-mounted', 'true');

        const cleanUrl = url.replace(/^\//, '');
        const noExtUrl = cleanUrl.replace(/\.html$/, '');

        // Candidate endpoints to attempt in order of priority:
        // 1. Root with extension (/header.html, /footer.html)
        // 2. Relative fallback (../../../header.html)
        // 3. Extensionless path (/header, /footer) for Pretty URLs
        const endpoints = [];
        endpoints.push('/' + cleanUrl);
        endpoints.push(rootPrefix + cleanUrl);
        if (noExtUrl !== cleanUrl) {
            endpoints.push('/' + noExtUrl);
            endpoints.push(rootPrefix + noExtUrl);
        }

        let mountedHtml = null;

        for (const ep of endpoints) {
            try {
                const res = await fetch(ep + '?v=305', { cache: 'no-cache' });
                if (!res.ok) continue;
                const text = await res.text();
                if (!isInvalidPartialHtml(text)) {
                    mountedHtml = text;
                    break;
                }
            } catch (e) {
                // Endpoint fetch failed, proceed to next candidate
            }
        }

        if (mountedHtml) {
            targetEl.innerHTML = mountedHtml;
        } else {
            // Apply safe inline fallback (prevents ANY 404 injection or broken layout)
            const fallbackKey = cleanUrl.endsWith('.html') ? cleanUrl : cleanUrl + '.html';
            if (INLINE_FALLBACKS[fallbackKey]) {
                targetEl.innerHTML = INLINE_FALLBACKS[fallbackKey];
            }
        }

        if (callback) {
            try {
                callback(targetEl);
            } catch (cbErr) {
                console.warn('[ToolBox Framework] Callback error after mount:', cbErr);
            }
        }
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
                
                document.querySelectorAll('.dropdown-content.show, .fw-dropdown-menu.is-active').forEach(openMenu => {
                    openMenu.classList.remove('show', 'is-active');
                });

                if (!isOpen) {
                    menu.classList.add('show', 'is-active');
                }
            });

            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('show', 'is-active');
                });
            });

            const closeBtn = menu.querySelector('.dropdown-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.remove('show', 'is-active');
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown, .nav-dropdown, .fw-dropdown')) {
                document.querySelectorAll('.dropdown-content.show, .fw-dropdown-menu.is-active').forEach(openMenu => {
                    openMenu.classList.remove('show', 'is-active');
                });
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.dropdown-content.show, .fw-dropdown-menu.is-active').forEach(openMenu => {
                    openMenu.classList.remove('show', 'is-active');
                });
            }
        });
    }

    
    // 5b. Mega Menu Tabs Controller
    function setupMegaMenuTabs(headerEl) {
        const root = headerEl || document;
        const tabs = root.querySelectorAll('.mega-menu-tab');
        const panels = root.querySelectorAll('.mega-menu-panel');
        if (!tabs.length || !panels.length) return;

        const switchTab = (targetTab) => {
            tabs.forEach(t => {
                t.classList.remove('active', 'bg-sky-50', 'dark:bg-sky-950/40', 'text-primary', 'font-bold');
                t.classList.add('text-slate-600', 'dark:text-slate-400');
            });
            targetTab.classList.add('active', 'bg-sky-50', 'dark:bg-sky-950/40', 'text-primary', 'font-bold');
            targetTab.classList.remove('text-slate-600', 'dark:text-slate-400');

            const targetId = targetTab.dataset.target;
            panels.forEach(p => {
                if (p.id === targetId) {
                    p.classList.remove('hidden');
                } else {
                    p.classList.add('hidden');
                }
            });
        };

        tabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => switchTab(tab));
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab(tab);
            });
        });
    }
    window.setupMegaMenuTabs = setupMegaMenuTabs;

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

        const copyBtn = headerEl.querySelector('#copy-link-btn, .action-copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('현재 페이지 URL이 클립보드에 복사되었습니다.'))
                    .catch(() => prompt('아래 URL을 복사하세요:', window.location.href));
            });
        }

        headerEl.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => ThemeEngine.toggle());
        });

        headerEl.querySelectorAll('.sound-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.SoundFX) window.SoundFX.toggle();
            });
        });

        ThemeEngine.updateIcons();
    }

    // ===================================================================
    // 7. Global Floating Quick Nav Dock (Home / 10 Hubs Launcher / Scroll Top)
    // ===================================================================
    const CATEGORIES_DATA = [
        { id: 'cat01', slug: 'cat01-work', icon: '💼', name: 'K-직장인 생존 키트', count: 10 },
        { id: 'cat02', slug: 'cat02-public', icon: '🏛️', name: '공직 & 행정 생존기', count: 10 },
        { id: 'cat03', slug: 'cat03-campus', icon: '🎓', name: '캠퍼스 & Z/알파 세대', count: 10 },
        { id: 'cat04', slug: 'cat04-military', icon: '🪖', name: '밀리터리 & 국방 생존기', count: 10 },
        { id: 'cat05', slug: 'cat05-sns', icon: '📱', name: 'SNS & 인플루언서 랩', count: 10 },
        { id: 'cat06', slug: 'cat06-tech', icon: '🤖', name: 'AI & 미래 테크 샌드박스', count: 10 },
        { id: 'cat07', slug: 'cat07-mind', icon: '🔮', name: '심리 & 멘탈 & 운명', count: 10 },
        { id: 'cat08', slug: 'cat08-sf', icon: '🛸', name: '기상천외 SF & 우주', count: 10 },
        { id: 'cat09', slug: 'cat09-life', icon: '🛠️', name: '초경량 실전 일상 유틸', count: 10 },
        { id: 'cat10', slug: 'cat10-toy', icon: '🎮', name: '킬링타임 & 감각 토이', count: 10 }
    ];

    function setupGlobalFloatingDock() {
        if (document.getElementById('fw-floating-dock')) return;

        // 7a. Floating Dock HTML
        const dockEl = document.createElement('div');
        dockEl.id = 'fw-floating-dock';
        dockEl.className = 'fw-floating-dock';
        dockEl.innerHTML = `
            <a href="/" class="fw-dock-btn" title="메인 홈으로 이동">
                <span>🏠</span>
                <span class="dock-label">홈</span>
            </a>
            <div class="fw-dock-divider"></div>
            <button type="button" id="fw-dock-menu-btn" class="fw-dock-btn" title="10대 테마 및 퀵 메뉴">
                <span>🎯</span>
                <span class="dock-label">메뉴</span>
            </button>
            <div class="fw-dock-divider"></div>
            <button type="button" id="fw-dock-top-btn" class="fw-dock-btn" title="맨 위로 스크롤">
                <span>⬆️</span>
                <span class="dock-label">맨위로</span>
            </button>
        `;

        // 7b. Quick Launcher Popover HTML
        const popoverEl = document.createElement('div');
        popoverEl.id = 'fw-quick-launcher-popover';
        popoverEl.className = 'fw-quick-launcher-popover';

        const catItemsHtml = CATEGORIES_DATA.map(c => `
            <a href="/category/${c.slug}/" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors group">
                <span class="text-base p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">${c.icon}</span>
                <div class="overflow-hidden">
                    <div class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-primary truncate">${c.name}</div>
                    <div class="text-[10px] text-slate-400 font-mono">${c.count}개 도구</div>
                </div>
            </a>
        `).join('');

        popoverEl.innerHTML = `
            <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <span>🎯</span> <span>10대 테마 도구 허브 바로가기</span>
                </div>
                <button type="button" id="fw-popover-close" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm p-1 rounded-lg">✕</button>
            </div>
            <div class="grid grid-cols-2 gap-1.5 mb-3">
                ${catItemsHtml}
            </div>
            <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <a href="/#tools-100" class="text-primary font-bold hover:underline">🚀 전체 100대 도구 보기</a>
                <div class="flex items-center gap-2">
                    <a href="/#group-games" class="text-slate-500 hover:text-primary">🎲 게임</a>
                    <a href="/#group-classic" class="text-slate-500 hover:text-primary">⚙️ 클래식</a>
                </div>
            </div>
        `;

        document.body.appendChild(dockEl);
        document.body.appendChild(popoverEl);

        // Scroll listener for dock visibility
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY || document.documentElement.scrollTop;
                    if (scrollY > 250) {
                        dockEl.classList.add('is-visible');
                    } else {
                        dockEl.classList.remove('is-visible');
                        popoverEl.classList.remove('is-open');
                        const menuBtn = document.getElementById('fw-dock-menu-btn');
                        if (menuBtn) menuBtn.classList.remove('is-active');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Top button click
        const topBtn = document.getElementById('fw-dock-top-btn');
        if (topBtn) {
            topBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Menu button click
        const menuBtn = document.getElementById('fw-dock-menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = popoverEl.classList.contains('is-open');
                if (isOpen) {
                    popoverEl.classList.remove('is-open');
                    menuBtn.classList.remove('is-active');
                } else {
                    popoverEl.classList.add('is-open');
                    menuBtn.classList.add('is-active');
                }
            });
        }

        // Popover close button
        const popoverClose = document.getElementById('fw-popover-close');
        if (popoverClose) {
            popoverClose.addEventListener('click', () => {
                popoverEl.classList.remove('is-open');
                if (menuBtn) menuBtn.classList.remove('is-active');
            });
        }

        // Global dismiss for popover
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#fw-quick-launcher-popover') && !e.target.closest('#fw-dock-menu-btn')) {
                popoverEl.classList.remove('is-open');
                if (menuBtn) menuBtn.classList.remove('is-active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                popoverEl.classList.remove('is-open');
                if (menuBtn) menuBtn.classList.remove('is-active');
            }
        });
    }

    // ===================================================================
    // 8. Tool Screen Related Tools Switcher (Top Strip & Side Drawer)
    // ===================================================================
    async function setupToolScreenSwitcher() {
        const path = window.location.pathname;
        if (!path.includes('/tools/')) return;

        // Parse category slug and tool slug from path
        // Pattern: /tools/{category_slug}/{tool_slug}/
        const match = path.match(/\/tools\/([^\/]+)\/([^\/]+)/);
        if (!match) return;

        const currentCatSlug = match[1];
        const currentToolSlug = match[2];

        // Find Category Meta
        const catMeta = CATEGORIES_DATA.find(c => c.slug === currentCatSlug) || {
            id: currentCatSlug,
            slug: currentCatSlug,
            icon: '🛠️',
            name: currentCatSlug,
            count: 10
        };

        // Fetch tools dictionary
        let toolsData = {};
        try {
            const lang = localStorage.getItem('language') || 'ko';
            const res = await fetch(`/locales/${lang}/tools.json?v=305`);
            if (res.ok) {
                toolsData = await res.json();
            }
        } catch (e) {
            console.warn('[ToolBox Framework] Unable to load tools.json:', e);
        }

        // Filter tools belonging to this category
        const catTools = [];
        for (const [slug, info] of Object.entries(toolsData)) {
            if (info.category === catMeta.id || (info.url && info.url.includes(currentCatSlug))) {
                catTools.push({
                    slug,
                    name: info.name,
                    desc: info.desc,
                    badge: info.badge || '',
                    url: info.url || `/tools/${currentCatSlug}/${slug}/`
                });
            }
        }

        if (catTools.length === 0) return;

        // Calculate prev / next tools
        const currentIdx = catTools.findIndex(t => t.slug === currentToolSlug);
        const prevTool = catTools[(currentIdx - 1 + catTools.length) % catTools.length];
        const nextTool = catTools[(currentIdx + 1) % catTools.length];

        // 8a. Top Related Tools Strip
        const stripEl = document.createElement('div');
        stripEl.id = 'fw-related-strip';
        stripEl.className = 'fw-related-strip';

        const chipsHtml = catTools.map((t, idx) => {
            const isCurr = t.slug === currentToolSlug;
            return `
                <a href="${t.url}" class="fw-tool-chip ${isCurr ? 'is-current' : ''}" title="${t.name}: ${t.desc}">
                    <span>#${(idx + 1).toString().padStart(2, '0')}</span>
                    <span>${t.name}</span>
                </a>
            `;
        }).join('');

        stripEl.innerHTML = `
            <div class="flex items-center gap-2 shrink-0">
                <a href="/category/${catMeta.slug}/" class="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white hover:text-primary transition-colors">
                    <span class="text-base">${catMeta.icon}</span>
                    <span class="hidden md:inline font-extrabold">${catMeta.name}</span>
                </a>
                <span class="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950 text-primary font-bold shrink-0">${catTools.length}종</span>
            </div>

            <div class="fw-chips-scroll flex-1 mx-1 sm:mx-3">
                ${chipsHtml}
            </div>

            <div class="flex items-center gap-1 shrink-0">
                <a href="${prevTool.url}" class="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-0.5" title="이전 도구: ${prevTool.name}">
                    <span>◀</span><span class="hidden lg:inline text-[11px]">이전</span>
                </a>
                <a href="${nextTool.url}" class="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-0.5" title="다음 도구: ${nextTool.name}">
                    <span class="hidden lg:inline text-[11px]">다음</span><span>▶</span>
                </a>
                <button type="button" id="fw-open-drawer-btn" class="ml-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-primary hover:text-white text-primary dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800 transition-colors flex items-center gap-1">
                    <span>⚡ 도구 목록</span>
                </button>
            </div>
        `;

        // Mount strip right after header
        const headerPlaceholder = document.getElementById('header-placeholder') || document.querySelector('header');
        if (headerPlaceholder && headerPlaceholder.parentNode) {
            headerPlaceholder.parentNode.insertBefore(stripEl, headerPlaceholder.nextSibling);
        }

        // Scroll current chip into view
        setTimeout(() => {
            const currentChip = stripEl.querySelector('.fw-tool-chip.is-current');
            if (currentChip) {
                currentChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }, 150);

        // 8b. Floating Trigger Button & Side Drawer
        const triggerBtn = document.createElement('button');
        triggerBtn.id = 'fw-floating-trigger';
        triggerBtn.className = 'fw-floating-trigger';
        triggerBtn.innerHTML = `
            <span>⚡</span>
            <span>관련 도구 (${catTools.length})</span>
        `;

        const backdropEl = document.createElement('div');
        backdropEl.id = 'fw-drawer-backdrop';
        backdropEl.className = 'fw-drawer-backdrop';

        const drawerEl = document.createElement('div');
        drawerEl.id = 'fw-side-drawer';
        drawerEl.className = 'fw-side-drawer';

        const drawerItemsHtml = catTools.map((t, idx) => {
            const isCurr = t.slug === currentToolSlug;
            return `
                <a href="${t.url}" class="p-3 rounded-xl flex items-start gap-3 transition-colors ${isCurr ? 'bg-sky-50 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}">
                    <span class="text-xs font-mono font-bold px-2 py-1 rounded-md ${isCurr ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'} shrink-0">#${(idx + 1).toString().padStart(2, '0')}</span>
                    <div class="overflow-hidden flex-1">
                        <div class="flex items-center gap-1.5 mb-0.5">
                            <span class="text-xs font-bold text-slate-900 dark:text-white truncate">${t.name}</span>
                            ${t.badge ? `<span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 shrink-0">${t.badge}</span>` : ''}
                        </div>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${t.desc}</p>
                    </div>
                </a>
            `;
        }).join('');

        const catShortcutsHtml = CATEGORIES_DATA.map(c => `
            <a href="/category/${c.slug}/" class="p-1.5 rounded-lg text-center bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-xs transition-colors" title="${c.name}">
                <span>${c.icon}</span>
            </a>
        `).join('');

        drawerEl.innerHTML = `
            <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-xl p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">${catMeta.icon}</span>
                    <div>
                        <div class="text-xs font-mono text-primary font-bold">${catMeta.id.toUpperCase()} • ${catTools.length}개 도구</div>
                        <h3 class="text-sm font-black text-slate-900 dark:text-white">${catMeta.name}</h3>
                    </div>
                </div>
                <button type="button" id="fw-drawer-close-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <div class="flex-1 overflow-y-auto p-3 space-y-1.5">
                ${drawerItemsHtml}
            </div>

            <div class="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div class="text-[11px] font-bold text-slate-400 mb-2">다른 테마로 바로가기:</div>
                <div class="grid grid-cols-5 gap-1.5">
                    ${catShortcutsHtml}
                </div>
                <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    <a href="/category/${catMeta.slug}/" class="text-primary font-bold hover:underline">테마 허브 보기 →</a>
                    <a href="/" class="text-slate-500 hover:underline">메인 홈으로</a>
                </div>
            </div>
        `;

        document.body.appendChild(triggerBtn);
        document.body.appendChild(backdropEl);
        document.body.appendChild(drawerEl);

        const openDrawer = () => {
            drawerEl.classList.add('is-open');
            backdropEl.classList.add('is-open');
        };

        const closeDrawer = () => {
            drawerEl.classList.remove('is-open');
            backdropEl.classList.remove('is-open');
        };

        triggerBtn.addEventListener('click', openDrawer);
        const stripDrawerBtn = document.getElementById('fw-open-drawer-btn');
        if (stripDrawerBtn) stripDrawerBtn.addEventListener('click', openDrawer);

        const closeBtn = document.getElementById('fw-drawer-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        backdropEl.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });
    }

    // ===================================================================
    // 9. Auto Initializer on DOM Ready
    // ===================================================================
    function initFramework() {
        ThemeEngine.init();

        // Mount Header
        fetchAndMount('header.html', ['header-placeholder', 'header', 'site-header'], (headerEl) => {
            setupNavDropdowns(headerEl);
            setupMobileMenu(headerEl);
            setupHeaderActions(headerEl);

            setupMegaMenuTabs(headerEl);
            if (window.applyLanguage) {
                window.applyLanguage(localStorage.getItem('language') || 'ko', true);
            }
        });

        // Mount Footer
        fetchAndMount('footer.html', ['footer-placeholder', 'footer', 'site-footer']);

        // Mount Global Floating Quick Nav Dock
        setupGlobalFloatingDock();

        // Mount Tool Screen Related Switcher
        setupToolScreenSwitcher();
    }

    if (document.readyState !== 'loading') {
        initFramework();
    } else {
        document.addEventListener('DOMContentLoaded', initFramework);
    }
})();
