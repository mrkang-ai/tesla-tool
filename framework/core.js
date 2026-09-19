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

    // 0c. Global Language Helper
    function getActiveLang() {
        return (window.getLanguage && window.getLanguage()) ||
               (new URLSearchParams(window.location.search).get('lang')) ||
               localStorage.getItem('language') || 'ko';
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
            const lang = getActiveLang();
            const soundOn = lang === 'en' ? 'Sound Enabled' : '사운드 켜짐';
            const soundOff = lang === 'en' ? 'Sound Muted' : '사운드 꺼짐';
            document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
                const icon = btn.querySelector('.material-symbols-outlined') || btn.querySelector('span');
                if (icon) icon.textContent = isSoundEnabled ? 'volume_up' : 'volume_off';
                btn.setAttribute('aria-label', isSoundEnabled ? soundOn : soundOff);
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
        },
        play(type) {
            if (type === 'click') return this.playClick();
            if (type === 'pop') return this.playPop();
            if (type === 'tick') return this.playTick();
            if (type === 'win') return this.playWin();
            this.playClick();
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
                    <span class="text-sm font-bold text-primary leading-none mt-0.5 tracking-wider">100+ UTILS</span>
                </div>
            </a>
            <nav class="hidden md:flex items-center gap-2 text-sm font-semibold">
                <a href="/" class="px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-primary transition-colors" data-lang-ko="홈" data-lang-en="Home">홈</a>
                <a href="/#tools-100" class="px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-primary transition-colors" data-lang-ko="100대 도구모음" data-lang-en="100 Tools">100대 도구모음</a>
            </nav>
        </div>
        <div class="flex items-center gap-2">
            <button type="button" class="sound-toggle-btn p-2 rounded-xl text-text-muted dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Sound FX">
                <span class="material-symbols-outlined text-[20px]">volume_up</span>
            </button>
            <button type="button" class="theme-toggle-btn p-2 rounded-xl text-text-muted dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Theme">
                <span class="theme-toggle-icon">🌙</span>
            </button>
        </div>
    </div>
</header>`,
        'footer.html': `
<footer class="border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 py-8 text-center text-sm text-slate-500 dark:text-slate-400 mt-auto">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>© 2026 ToolBox. All rights reserved. 100+ Productivity Web Apps.</div>
        <div class="flex items-center gap-4">
            <a href="/privacy.html" class="hover:underline" data-lang-ko="개인정보처리방침" data-lang-en="Privacy Policy">개인정보처리방침</a>
            <a href="/terms.html" class="hover:underline" data-lang-ko="이용약관" data-lang-en="Terms of Service">이용약관</a>
            <a href="/sitemap.html" class="hover:underline" data-lang-ko="사이트맵" data-lang-en="Sitemap">사이트맵</a>
            <a href="/" class="hover:underline font-bold text-primary" data-lang-ko="홈으로" data-lang-en="Home">홈으로</a>
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
                const res = await fetch(ep + '?v=420', { cache: 'no-cache' });
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
                const lang = getActiveLang();
                const copySuccess = lang === 'en' ? 'Page URL copied to clipboard!' : '현재 페이지 URL이 클립보드에 복사되었습니다.';
                const copyPrompt = lang === 'en' ? 'Copy the URL below:' : '아래 URL을 복사하세요:';
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert(copySuccess))
                    .catch(() => prompt(copyPrompt, window.location.href));
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
        { id: 'cat01', slug: 'cat01-work', icon: '💼', name_ko: 'K-직장인 생존 키트', name_en: 'K-Workplace Survival Kit', count: 10 },
        { id: 'cat02', slug: 'cat02-public', icon: '🏛️', name_ko: '공직 & 행정 생존기', name_en: 'Public & Civil Service', count: 10 },
        { id: 'cat03', slug: 'cat03-campus', icon: '🎓', name_ko: '캠퍼스 & Z/알파 세대', name_en: 'Campus & Gen Z Life Hacks', count: 10 },
        { id: 'cat04', slug: 'cat04-military', icon: '🪖', name_ko: '밀리터리 & 국방 생존기', name_en: 'Military & Defense', count: 10 },
        { id: 'cat05', slug: 'cat05-sns', icon: '📱', name_ko: 'SNS & 인플루언서 랩', name_en: 'Social Media & Creator Lab', count: 10 },
        { id: 'cat06', slug: 'cat06-tech', icon: '🤖', name_ko: 'AI & 미래 테크 샌드박스', name_en: 'AI & Future Tech Sandbox', count: 10 },
        { id: 'cat07', slug: 'cat07-mind', icon: '🔮', name_ko: '심리 & 멘탈 & 운명', name_en: 'Psychology & Mental Care', count: 10 },
        { id: 'cat08', slug: 'cat08-sf', icon: '🛸', name_ko: '기상천외 SF & 우주', name_en: 'Outrageous SF & Space', count: 10 },
        { id: 'cat09', slug: 'cat09-life', icon: '🛠️', name_ko: '초경량 실전 일상 유틸', name_en: 'Essential Daily Utilities', count: 10 },
        { id: 'cat10', slug: 'cat10-toy', icon: '🎮', name_ko: '킬링타임 & 감각 토이', name_en: 'Dopamine & Arcade Toys', count: 10 }
    ];

    function getCategoryName(c, lang) {
        if (!c) return '';
        if (lang === 'en') return c.name_en || c.name || '';
        return c.name_ko || c.name || '';
    }

    function setupGlobalFloatingDock() {
        if (document.getElementById('fw-floating-dock')) return;

        // 7a. Floating Dock HTML
        const dockEl = document.createElement('div');
        dockEl.id = 'fw-floating-dock';
        dockEl.className = 'fw-floating-dock';

        // 7b. Quick Launcher Popover HTML
        const popoverEl = document.createElement('div');
        popoverEl.id = 'fw-quick-launcher-popover';
        popoverEl.className = 'fw-quick-launcher-popover';

        function attachDockEvents() {
            const topBtn = document.getElementById('fw-dock-top-btn');
            if (topBtn) {
                topBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            const menuBtn = document.getElementById('fw-dock-menu-btn');
            if (menuBtn) {
                menuBtn.onclick = (e) => {
                    e.stopPropagation();
                    const isOpen = popoverEl.classList.contains('is-open');
                    if (isOpen) {
                        popoverEl.classList.remove('is-open');
                        menuBtn.classList.remove('is-active');
                    } else {
                        popoverEl.classList.add('is-open');
                        menuBtn.classList.add('is-active');
                    }
                };
            }

            const popoverClose = document.getElementById('fw-popover-close');
            if (popoverClose) {
                popoverClose.onclick = () => {
                    popoverEl.classList.remove('is-open');
                    if (menuBtn) menuBtn.classList.remove('is-active');
                };
            }
        }

        function renderDockContent(lang) {
            lang = lang || getActiveLang();
            const homeLabel = lang === 'en' ? 'Home' : '홈';
            const menuLabel = lang === 'en' ? 'Menu' : '메뉴';
            const topLabel = lang === 'en' ? 'Top' : '맨위로';
            const homeTitle = lang === 'en' ? 'Go to Main Home' : '메인 홈으로 이동';
            const menuTitle = lang === 'en' ? '10 Themed Hubs & Quick Menu' : '10대 테마 및 퀵 메뉴';
            const topTitle = lang === 'en' ? 'Scroll to Top' : '맨 위로 스크롤';
            const popoverTitle = lang === 'en' ? '10 Themed Tool Hubs' : '10대 테마 도구 허브 바로가기';
            const countLabel = lang === 'en' ? '10 Tools' : '10개 도구';
            const all100Label = lang === 'en' ? '🚀 View All 100 Tools' : '🚀 전체 100대 도구 보기';
            const gamesLabel = lang === 'en' ? '🎲 Games' : '🎲 게임';
            const classicLabel = lang === 'en' ? '⚙️ Classic' : '⚙️ 클래식';

            dockEl.innerHTML = `
                <a href="/" class="fw-dock-btn" title="${homeTitle}">
                    <span>🏠</span>
                    <span class="dock-label">${homeLabel}</span>
                </a>
                <div class="fw-dock-divider"></div>
                <button type="button" id="fw-dock-menu-btn" class="fw-dock-btn" title="${menuTitle}">
                    <span>🎯</span>
                    <span class="dock-label">${menuLabel}</span>
                </button>
                <div class="fw-dock-divider"></div>
                <button type="button" id="fw-dock-top-btn" class="fw-dock-btn" title="${topTitle}">
                    <span>⬆️</span>
                    <span class="dock-label">${topLabel}</span>
                </button>
            `;

            const catItemsHtml = CATEGORIES_DATA.map(c => `
                <a href="/category/${c.slug}/" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors group">
                    <span class="text-base p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">${c.icon}</span>
                    <div class="overflow-hidden">
                        <div class="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary truncate">${getCategoryName(c, lang)}</div>
                        <div class="text-sm text-slate-400 font-mono">${countLabel}</div>
                    </div>
                </a>
            `).join('');

            popoverEl.innerHTML = `
                <div class="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                    <div class="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                        <span>🎯</span> <span>${popoverTitle}</span>
                    </div>
                    <button type="button" id="fw-popover-close" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm p-1 rounded-lg">✕</button>
                </div>
                <div class="grid grid-cols-2 gap-1.5 mb-3">
                    ${catItemsHtml}
                </div>
                <div class="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                    <a href="/#tools-100" class="text-primary font-bold hover:underline">${all100Label}</a>
                    <div class="flex items-center gap-2">
                        <a href="/#group-games" class="text-slate-500 hover:text-primary">${gamesLabel}</a>
                        <a href="/#group-classic" class="text-slate-500 hover:text-primary">${classicLabel}</a>
                    </div>
                </div>
            `;

            attachDockEvents();
        }

        renderDockContent(getActiveLang());

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

        // Global dismiss for popover
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#fw-quick-launcher-popover') && !e.target.closest('#fw-dock-menu-btn')) {
                popoverEl.classList.remove('is-open');
                const menuBtn = document.getElementById('fw-dock-menu-btn');
                if (menuBtn) menuBtn.classList.remove('is-active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                popoverEl.classList.remove('is-open');
                const menuBtn = document.getElementById('fw-dock-menu-btn');
                if (menuBtn) menuBtn.classList.remove('is-active');
            }
        });

        // Listen for language changes
        window.addEventListener('languagechange', (e) => {
            renderDockContent(e.detail && e.detail.lang ? e.detail.lang : getActiveLang());
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
        let catMeta = CATEGORIES_DATA.find(c => c.slug === currentCatSlug);
        if (!catMeta) {
            if (currentCatSlug === 'games') {
                catMeta = { id: 'games', slug: 'games', icon: '🎮', name_ko: '미니 게임', name_en: 'Mini Games', count: 7 };
            } else if (currentCatSlug === 'classic') {
                catMeta = { id: 'classic', slug: 'classic', icon: '⚙️', name_ko: '클래식 유틸', name_en: 'Classic Tools', count: 8 };
            } else {
                catMeta = { id: currentCatSlug, slug: currentCatSlug, icon: '🛠️', name_ko: currentCatSlug, name_en: currentCatSlug, count: 10 };
            }
        }

        // Create container elements once
        let stripEl = document.getElementById('fw-related-strip');
        if (!stripEl) {
            stripEl = document.createElement('div');
            stripEl.id = 'fw-related-strip';
            stripEl.className = 'fw-related-strip';
            const headerPlaceholder = document.getElementById('header-placeholder') || document.querySelector('header');
            if (headerPlaceholder && headerPlaceholder.parentNode) {
                headerPlaceholder.parentNode.insertBefore(stripEl, headerPlaceholder.nextSibling);
            }
        }

        let triggerBtn = document.getElementById('fw-floating-trigger');
        if (!triggerBtn) {
            triggerBtn = document.createElement('button');
            triggerBtn.id = 'fw-floating-trigger';
            triggerBtn.className = 'fw-floating-trigger';
            document.body.appendChild(triggerBtn);
        }

        let backdropEl = document.getElementById('fw-drawer-backdrop');
        if (!backdropEl) {
            backdropEl = document.createElement('div');
            backdropEl.id = 'fw-drawer-backdrop';
            backdropEl.className = 'fw-drawer-backdrop';
            document.body.appendChild(backdropEl);
        }

        let drawerEl = document.getElementById('fw-side-drawer');
        if (!drawerEl) {
            drawerEl = document.createElement('div');
            drawerEl.id = 'fw-side-drawer';
            drawerEl.className = 'fw-side-drawer';
            document.body.appendChild(drawerEl);
        }

        const openDrawer = () => {
            drawerEl.classList.add('is-open');
            backdropEl.classList.add('is-open');
        };

        const closeDrawer = () => {
            drawerEl.classList.remove('is-open');
            backdropEl.classList.remove('is-open');
        };

        triggerBtn.onclick = openDrawer;
        backdropEl.onclick = closeDrawer;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });

        async function renderSwitcher(lang) {
            lang = lang || getActiveLang();

            // Fetch tools dictionary
            let toolsData = {};
            try {
                const res = await fetch(`/locales/${lang}/tools.json?v=440`);
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

            const localizedCatName = getCategoryName(catMeta, lang);
            const countLabel = lang === 'en' ? `${catTools.length} Tools` : `${catTools.length}종`;
            const prevLabel = lang === 'en' ? 'Prev' : '이전';
            const nextLabel = lang === 'en' ? 'Next' : '다음';
            const listBtnLabel = lang === 'en' ? '⚡ Tool List' : '⚡ 도구 목록';
            const relatedTriggerLabel = lang === 'en' ? `⚡ Related (${catTools.length})` : `⚡ 관련 도구 (${catTools.length})`;
            const otherThemesLabel = lang === 'en' ? 'Jump to Other Themes:' : '다른 테마로 바로가기:';
            const hubLinkLabel = lang === 'en' ? 'View Theme Hub →' : '테마 허브 보기 →';
            const homeLinkLabel = lang === 'en' ? 'Back to Home' : '메인 홈으로';

            triggerBtn.innerHTML = `
                <span>⚡</span>
                <span>${relatedTriggerLabel}</span>
            `;

            // 8a. Top Related Tools Strip
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
                    <a href="/category/${catMeta.slug}/" class="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-white hover:text-primary transition-colors">
                        <span class="text-base">${catMeta.icon}</span>
                        <span class="hidden md:inline font-extrabold">${localizedCatName}</span>
                    </a>
                    <span class="text-sm font-mono px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-950 text-primary font-bold shrink-0">${countLabel}</span>
                </div>

                <div class="fw-chips-scroll flex-1 mx-1 sm:mx-3">
                    ${chipsHtml}
                </div>

                <div class="flex items-center gap-1 shrink-0">
                    <a href="${prevTool.url}" class="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors flex items-center gap-0.5" title="${prevLabel}: ${prevTool.name}">
                        <span>◀</span><span class="hidden lg:inline text-sm">${prevLabel}</span>
                    </a>
                    <a href="${nextTool.url}" class="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors flex items-center gap-0.5" title="${nextLabel}: ${nextTool.name}">
                        <span class="hidden lg:inline text-sm">${nextLabel}</span><span>▶</span>
                    </a>
                    <button type="button" id="fw-open-drawer-btn" class="ml-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-primary hover:text-white text-primary dark:text-sky-300 text-sm font-bold border border-sky-200 dark:border-sky-800 transition-colors flex items-center gap-1">
                        <span>${listBtnLabel}</span>
                    </button>
                    <button type="button" id="fw-fullscreen-btn" class="ml-0.5 sm:ml-1 p-1 sm:px-2 sm:py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer" title="모바일 / PC 전체화면 (화면 켜짐 유지)">
                        <span id="fw-fs-icon" class="material-symbols-outlined text-sm sm:text-base">fullscreen</span>
                        <span class="hidden sm:inline text-xs font-bold">전체화면</span>
                    </button>
                </div>
            `;

            const stripDrawerBtn = document.getElementById('fw-open-drawer-btn');
            if (stripDrawerBtn) stripDrawerBtn.onclick = openDrawer;

            // Universal Fullscreen & Wake Lock Controller
            const stripFsBtn = document.getElementById('fw-fullscreen-btn');
            let exitPill = document.getElementById('fw-fullscreen-exit-pill');
            if (!exitPill) {
                exitPill = document.createElement('button');
                exitPill.id = 'fw-fullscreen-exit-pill';
                exitPill.type = 'button';
                exitPill.className = 'fw-fullscreen-exit-pill';
                exitPill.innerHTML = `
                    <span class="material-symbols-outlined text-sm">fullscreen_exit</span>
                    <span>전체화면 종료</span>
                `;
                const exitAction = (e) => {
                    if (e && e.type === 'touchend') e.preventDefault();
                    if (document.fullscreenElement || document.webkitFullscreenElement) {
                        if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
                        else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(()=>{});
                    }
                    document.body.classList.remove('fw-fullscreen-mode');
                    exitPill.classList.remove('is-active');
                    const fsIcon = document.getElementById('fw-fs-icon');
                    if (fsIcon) fsIcon.textContent = 'fullscreen';
                    if (window._toolWakeLock) {
                        window._toolWakeLock.release().catch(()=>{});
                        window._toolWakeLock = null;
                    }
                };
                exitPill.onclick = exitAction;
                exitPill.ontouchend = exitAction;
                document.body.appendChild(exitPill);
            }

            const toggleToolFullscreen = async (e) => {
                if (e && e.type === 'touchend') e.preventDefault();
                try {
                    const isFsNative = !!(document.fullscreenElement || document.webkitFullscreenElement);
                    const isFsCSS = document.body.classList.contains('fw-fullscreen-mode');

                    if (!isFsNative && !isFsCSS) {
                        // Enter Fullscreen
                        try {
                            if (document.documentElement.requestFullscreen) {
                                await document.documentElement.requestFullscreen();
                            } else if (document.documentElement.webkitRequestFullscreen) {
                                await document.documentElement.webkitRequestFullscreen();
                            }
                        } catch(err) {
                            console.warn('[ToolBox] Native requestFullscreen note:', err);
                        }

                        // Always apply CSS Fullscreen (vital for iPhone iOS Safari where requestFullscreen is unsupported)
                        document.body.classList.add('fw-fullscreen-mode');
                        if (exitPill) exitPill.classList.add('is-active');
                        const fsIcon = document.getElementById('fw-fs-icon');
                        if (fsIcon) fsIcon.textContent = 'fullscreen_exit';

                        if ('wakeLock' in navigator) {
                            try { window._toolWakeLock = await navigator.wakeLock.request('screen'); } catch(e){}
                        }
                    } else {
                        // Exit Fullscreen
                        if (document.fullscreenElement || document.webkitFullscreenElement) {
                            if (document.exitFullscreen) await document.exitFullscreen().catch(()=>{});
                            else if (document.webkitExitFullscreen) await document.webkitExitFullscreen().catch(()=>{});
                        }
                        document.body.classList.remove('fw-fullscreen-mode');
                        if (exitPill) exitPill.classList.remove('is-active');
                        const fsIcon = document.getElementById('fw-fs-icon');
                        if (fsIcon) fsIcon.textContent = 'fullscreen';

                        if (window._toolWakeLock) {
                            window._toolWakeLock.release().catch(()=>{});
                            window._toolWakeLock = null;
                        }
                    }
                } catch (e) {
                    console.warn('[ToolBox] Fullscreen toggle error:', e);
                }
            };

            if (stripFsBtn) {
                stripFsBtn.onclick = toggleToolFullscreen;
                stripFsBtn.ontouchend = toggleToolFullscreen;
            }

            const handleFsStateChange = () => {
                const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
                const fsIcon = document.getElementById('fw-fs-icon');
                if (fsIcon) fsIcon.textContent = isFs ? 'fullscreen_exit' : 'fullscreen';
                if (exitPill) {
                    if (isFs) exitPill.classList.add('is-active');
                    else exitPill.classList.remove('is-active');
                }
                if (!isFs && window._toolWakeLock) {
                    window._toolWakeLock.release().catch(()=>{});
                    window._toolWakeLock = null;
                }
            };

            document.removeEventListener('fullscreenchange', handleFsStateChange);
            document.removeEventListener('webkitfullscreenchange', handleFsStateChange);
            document.addEventListener('fullscreenchange', handleFsStateChange);
            document.addEventListener('webkitfullscreenchange', handleFsStateChange);

            // 8b. Side Drawer Content
            const drawerItemsHtml = catTools.map((t, idx) => {
                const isCurr = t.slug === currentToolSlug;
                return `
                    <a href="${t.url}" class="p-3 rounded-xl flex items-start gap-3 transition-colors ${isCurr ? 'bg-sky-50 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-700' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}">
                        <span class="text-sm font-mono font-bold px-2 py-1 rounded-md ${isCurr ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'} shrink-0">#${(idx + 1).toString().padStart(2, '0')}</span>
                        <div class="overflow-hidden flex-1">
                            <div class="flex items-center gap-1.5 mb-0.5">
                                <span class="text-sm font-bold text-slate-900 dark:text-white truncate">${t.name}</span>
                                ${t.badge ? `<span class="text-sm font-bold px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 shrink-0">${t.badge}</span>` : ''}
                            </div>
                            <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">${t.desc}</p>
                        </div>
                    </a>
                `;
            }).join('');

            const catShortcutsHtml = CATEGORIES_DATA.map(c => `
                <a href="/category/${c.slug}/" class="p-1.5 rounded-lg text-center bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-sm transition-colors" title="${getCategoryName(c, lang)}">
                    <span>${c.icon}</span>
                </a>
            `).join('');

            drawerEl.innerHTML = `
                <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xl p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">${catMeta.icon}</span>
                        <div>
                            <div class="text-sm font-mono text-primary font-bold">${catMeta.id.toUpperCase()} • ${countLabel}</div>
                            <h3 class="text-sm font-black text-slate-900 dark:text-white">${localizedCatName}</h3>
                        </div>
                    </div>
                    <button type="button" id="fw-drawer-close-btn" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 text-sm">✕</button>
                </div>

                <div class="flex-1 overflow-y-auto p-3 space-y-1.5">
                    ${drawerItemsHtml}
                </div>

                <div class="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div class="text-sm font-bold text-slate-400 mb-2">${otherThemesLabel}</div>
                    <div class="grid grid-cols-5 gap-1.5">
                        ${catShortcutsHtml}
                    </div>
                    <div class="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-sm">
                        <a href="/category/${catMeta.slug}/" class="text-primary font-bold hover:underline">${hubLinkLabel}</a>
                        <a href="/" class="text-slate-500 hover:underline">${homeLinkLabel}</a>
                    </div>
                </div>
            `;

            const closeBtn = document.getElementById('fw-drawer-close-btn');
            if (closeBtn) closeBtn.onclick = closeDrawer;

            // Scroll current chip into view
            setTimeout(() => {
                const currentChip = stripEl.querySelector('.fw-tool-chip.is-current');
                if (currentChip) {
                    currentChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }, 100);
        }

        // Initial render
        await renderSwitcher(getActiveLang());

        // Real-time language switch listener
        window.addEventListener('languagechange', (e) => {
            renderSwitcher(e.detail && e.detail.lang ? e.detail.lang : getActiveLang());
        });
    }

    // ===================================================================
    // Toast Notification System
    // ===================================================================
    function showToast(message, icon = '✨', duration = 2500) {
        let toastContainer = document.getElementById('fw-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'fw-toast-container';
            toastContainer.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none transition-all px-4 w-full max-w-md';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md border border-slate-700/50 dark:border-slate-200 text-sm font-bold transition-all duration-300 transform translate-y-3 opacity-0';
        toast.innerHTML = `<span class="text-base">${icon}</span><span>${message}</span>`;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-3', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-2', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    window.ToolBoxToast = { show: showToast };

    // ===================================================================
    // ToolBoxHub: Central Data Provider & Korean Chosung Engine
    // ===================================================================
    const CHOSUNG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    function extractChosung(str) {
        if (!str) return '';
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i) - 44032;
            if (code >= 0 && code <= 11171) {
                result += CHOSUNG_LIST[Math.floor(code / 588)];
            } else {
                result += str.charAt(i).toLowerCase();
            }
        }
        return result;
    }

    let _toolsPromise = null;
    function loadTools100Data() {
        if (window.TOOLS_100_DATA && window.TOOLS_100_DATA.length > 0) {
            return Promise.resolve(window.TOOLS_100_DATA);
        }
        if (_toolsPromise) return _toolsPromise;
        _toolsPromise = new Promise((resolve) => {
            const existingScript = document.querySelector('script[src*="tools100-data.js"]');
            if (existingScript) {
                existingScript.addEventListener('load', () => resolve(window.TOOLS_100_DATA || []));
                return;
            }
            const script = document.createElement('script');
            script.src = '/scripts/tools100-data.js?v=450';
            script.async = true;
            script.onload = () => resolve(window.TOOLS_100_DATA || []);
            script.onerror = () => resolve([]);
            document.head.appendChild(script);
        });
        return _toolsPromise;
    }

    async function getAllTools() {
        const cats = await loadTools100Data();
        const list = [];
        cats.forEach(cat => {
            if (cat.tools) {
                cat.tools.forEach(t => {
                    list.push({
                        ...t,
                        catId: cat.id,
                        catName: cat.name,
                        catIcon: cat.icon,
                        chosung: extractChosung(t.name)
                    });
                });
            }
        });
        return list;
    }

    function getCurrentToolSlug() {
        const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/^\/+|\/+$/g, '');
        const parts = path.split('/');
        return parts[parts.length - 1] || '';
    }

    window.ToolBoxHub = {
        loadTools100Data,
        getAllTools,
        extractChosung,
        getCurrentToolSlug,
        async getRandomTool() {
            const tools = await getAllTools();
            if (!tools || tools.length === 0) return null;
            const currentSlug = getCurrentToolSlug();
            const candidates = tools.filter(t => t.slug !== currentSlug);
            return candidates[Math.floor(Math.random() * candidates.length)] || tools[0];
        }
    };

    // ===================================================================
    // [과제 1] ToolBoxShare: High-Resolution Canvas Card Export & Web Share
    // ===================================================================
    const ToolBoxShare = {
        generateCardCanvas(options) {
            const isStory = options.ratio === '9:16';
            const width = 1080;
            const height = isStory ? 1920 : 1080;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // 1. Rich Dark Studio Gradient Background
            const bgGrad = ctx.createLinearGradient(0, 0, width, height);
            bgGrad.addColorStop(0, '#0a0f1d');
            bgGrad.addColorStop(0.5, '#111827');
            bgGrad.addColorStop(1, '#030712');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // 2. Subtle Glow Orbs
            const orb1 = ctx.createRadialGradient(width * 0.85, height * 0.18, 50, width * 0.85, height * 0.18, 500);
            orb1.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
            orb1.addColorStop(1, 'rgba(14, 165, 233, 0)');
            ctx.fillStyle = orb1;
            ctx.beginPath();
            ctx.arc(width * 0.85, height * 0.18, 500, 0, Math.PI * 2);
            ctx.fill();

            const orb2 = ctx.createRadialGradient(width * 0.15, height * 0.82, 50, width * 0.15, height * 0.82, 450);
            orb2.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
            orb2.addColorStop(1, 'rgba(99, 102, 241, 0)');
            ctx.fillStyle = orb2;
            ctx.beginPath();
            ctx.arc(width * 0.15, height * 0.82, 450, 0, Math.PI * 2);
            ctx.fill();

            // Helper: Rounded Rect
            const drawRoundRect = (x, y, w, h, r, fill, stroke) => {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
                if (fill) { ctx.fillStyle = fill; ctx.fill(); }
                if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
            };

            // Outer Frame Card Border
            drawRoundRect(40, 40, width - 80, height - 80, 40, 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.08)');

            // Brand Header
            ctx.save();
            ctx.fillStyle = '#0ea5e9';
            drawRoundRect(80, 80, 52, 52, 16, '#0ea5e9');
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 30px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🛠️', 106, 106);

            ctx.textAlign = 'left';
            ctx.font = 'bold 36px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('ToolBox', 148, 102);
            ctx.font = 'bold 22px sans-serif';
            ctx.fillStyle = '#0ea5e9';
            ctx.fillText('100+ 온라인 스마트 도구', 148, 130);

            // Badge Pill
            if (options.badge) {
                ctx.font = 'bold 24px sans-serif';
                const badgeText = options.badge;
                const badgeWidth = ctx.measureText(badgeText).width + 36;
                drawRoundRect(width - 80 - badgeWidth, 86, badgeWidth, 46, 23, 'rgba(14, 165, 233, 0.15)', 'rgba(14, 165, 233, 0.4)');
                ctx.fillStyle = '#38bdf8';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(badgeText, width - 80 - badgeWidth / 2, 109);
            }
            ctx.restore();

            // Main Content Area Start Y
            let currentY = isStory ? 260 : 190;

            // Title
            ctx.save();
            ctx.textAlign = 'left';
            ctx.font = '800 52px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(options.title || 'ToolBox 결과 카드', 80, currentY);
            currentY += 45;

            // Subtitle
            if (options.subtitle) {
                ctx.font = '500 28px sans-serif';
                ctx.fillStyle = '#94a3b8';
                ctx.fillText(options.subtitle, 80, currentY);
                currentY += 55;
            } else {
                currentY += 30;
            }
            ctx.restore();

            // Glass Container Card
            const cardHeight = isStory ? height - currentY - 240 : height - currentY - 170;
            drawRoundRect(80, currentY, width - 160, cardHeight, 32, 'rgba(255, 255, 255, 0.04)', 'rgba(255, 255, 255, 0.12)');

            let innerY = currentY + 50;

            // Metrics Box (Key highlight stats)
            if (options.metrics && options.metrics.length > 0) {
                const metricCount = options.metrics.length;
                const colWidth = (width - 160 - 40 - (metricCount - 1) * 20) / metricCount;
                options.metrics.forEach((m, idx) => {
                    const boxX = 100 + idx * (colWidth + 20);
                    drawRoundRect(boxX, innerY, colWidth, 140, 20, 'rgba(15, 23, 42, 0.6)', 'rgba(255, 255, 255, 0.08)');
                    
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.font = 'bold 24px sans-serif';
                    ctx.fillStyle = '#94a3b8';
                    ctx.fillText(m.label, boxX + colWidth / 2, innerY + 45);

                    ctx.font = '800 38px sans-serif';
                    ctx.fillStyle = m.highlight ? '#38bdf8' : '#ffffff';
                    ctx.fillText(m.value, boxX + colWidth / 2, innerY + 102);
                    ctx.restore();
                });
                innerY += 180;
            }

            // Quote or Main Text Box
            if (options.quote) {
                const textWidth = width - 240;
                ctx.save();
                ctx.font = '600 32px sans-serif';
                ctx.fillStyle = '#f1f5f9';

                // Word wrap
                const words = options.quote.split('\n');
                let lines = [];
                words.forEach(paragraph => {
                    let curLine = '';
                    for (let c of paragraph) {
                        if (ctx.measureText(curLine + c).width > textWidth) {
                            lines.push(curLine);
                            curLine = c;
                        } else {
                            curLine += c;
                        }
                    }
                    if (curLine) lines.push(curLine);
                });

                // Render quotation highlight box
                const quoteBoxHeight = Math.min(lines.length * 48 + 60, cardHeight - (innerY - currentY) - 50);
                drawRoundRect(100, innerY, width - 200, quoteBoxHeight, 20, 'rgba(14, 165, 233, 0.08)', 'rgba(14, 165, 233, 0.25)');

                ctx.font = '600 30px sans-serif';
                ctx.fillStyle = '#e2e8f0';
                lines.slice(0, 10).forEach((line, lIdx) => {
                    ctx.fillText(line, 130, innerY + 50 + lIdx * 46);
                });
                ctx.restore();
            }

            // Bottom Footer Watermark & Timestamp
            ctx.save();
            const footerY = height - 80;
            ctx.font = '600 24px sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'left';
            ctx.fillText('🔗 mrkang-ai.github.io/tesla-tool', 80, footerY);

            ctx.textAlign = 'right';
            const now = new Date();
            const timeStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
            ctx.fillText(`인증 일자: ${timeStr}`, width - 80, footerY);
            ctx.restore();

            return canvas;
        },

        openModal(options = {}) {
            if (SoundFX.isEnabled()) SoundFX.playPop();

            let modal = document.getElementById('toolbox-share-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'toolbox-share-modal';
                modal.className = 'fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 opacity-0 pointer-events-none';
                modal.innerHTML = `
                    <div class="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] transform scale-95 transition-all duration-300">
                        <!-- Header -->
                        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                            <div class="flex items-center gap-2 font-bold text-white text-base">
                                <span class="text-xl">📸</span>
                                <span>결과 이미지 카드 생성 & 공유</span>
                            </div>
                            <button type="button" id="share-modal-close" class="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <!-- Ratio Switcher & Preview Container -->
                        <div class="p-6 flex flex-col items-center gap-4 overflow-y-auto">
                            <!-- Ratio Toggle -->
                            <div class="flex items-center p-1 bg-slate-800 rounded-xl border border-slate-700/60 text-xs font-bold text-slate-300">
                                <button type="button" id="share-ratio-1-1" class="px-4 py-1.5 rounded-lg bg-primary text-white shadow-sm transition-all">
                                    1:1 정방형 (피드/카톡)
                                </button>
                                <button type="button" id="share-ratio-9-16" class="px-4 py-1.5 rounded-lg hover:text-white transition-all">
                                    9:16 세로형 (인스타 스토리)
                                </button>
                            </div>

                            <!-- Live Canvas Preview Frame -->
                            <div class="w-full flex justify-center bg-slate-950/60 p-3 rounded-2xl border border-slate-800 shadow-inner">
                                <canvas id="share-preview-canvas" class="max-h-[46vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"></canvas>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="px-6 py-4 bg-slate-950/70 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
                            <button type="button" id="share-btn-download" class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-900/30 transition-all cursor-pointer">
                                <span>📥</span> <span>이미지 저장 (PNG)</span>
                            </button>
                            <button type="button" id="share-btn-native" class="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 transition-all cursor-pointer">
                                <span>📱</span> <span>SNS 공유하기</span>
                            </button>
                            <button type="button" id="share-btn-copy" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer" title="결과 텍스트 및 링크 복사">
                                📋
                            </button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                // Modal close handler
                const closeModal = () => {
                    modal.classList.add('opacity-0', 'pointer-events-none');
                    modal.querySelector('.bg-slate-900').classList.add('scale-95');
                };
                modal.querySelector('#share-modal-close').onclick = closeModal;
                modal.onclick = (e) => { if (e.target === modal) closeModal(); };
            }

            let currentRatio = '1:1';
            const previewCanvas = modal.querySelector('#share-preview-canvas');
            const btn11 = modal.querySelector('#share-ratio-1-1');
            const btn916 = modal.querySelector('#share-ratio-9-16');
            const btnDownload = modal.querySelector('#share-btn-download');
            const btnNative = modal.querySelector('#share-btn-native');
            const btnCopy = modal.querySelector('#share-btn-copy');

            const render = () => {
                const fullCanvas = ToolBoxShare.generateCardCanvas({ ...options, ratio: currentRatio });
                previewCanvas.width = fullCanvas.width;
                previewCanvas.height = fullCanvas.height;
                const pCtx = previewCanvas.getContext('2d');
                pCtx.drawImage(fullCanvas, 0, 0);
            };

            btn11.onclick = () => {
                currentRatio = '1:1';
                btn11.className = 'px-4 py-1.5 rounded-lg bg-primary text-white shadow-sm transition-all';
                btn916.className = 'px-4 py-1.5 rounded-lg hover:text-white transition-all';
                render();
            };

            btn916.onclick = () => {
                currentRatio = '9:16';
                btn916.className = 'px-4 py-1.5 rounded-lg bg-primary text-white shadow-sm transition-all';
                btn11.className = 'px-4 py-1.5 rounded-lg hover:text-white transition-all';
                render();
            };

            // Download Handler
            btnDownload.onclick = () => {
                const fullCanvas = ToolBoxShare.generateCardCanvas({ ...options, ratio: currentRatio });
                fullCanvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const cleanSlug = getCurrentToolSlug() || 'toolbox';
                    a.download = `ToolBox_${cleanSlug}_${Date.now()}.png`;
                    a.href = url;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast('이미지가 갤러리/다운로드에 저장되었습니다!', '📥');
                });
            };

            // Native Web Share API Handler
            btnNative.onclick = async () => {
                const fullCanvas = ToolBoxShare.generateCardCanvas({ ...options, ratio: currentRatio });
                fullCanvas.toBlob(async (blob) => {
                    if (!blob) return;
                    const file = new File([blob], `toolbox_result.png`, { type: 'image/png' });
                    const shareData = {
                        title: options.title || 'ToolBox 결과',
                        text: `${options.title}\n${options.subtitle || ''}\n${options.quote || ''}\n👉 지금 확인하기: ${window.location.href}`,
                        url: window.location.href
                    };
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({ ...shareData, files: [file] });
                            showToast('공유되었습니다!', '🚀');
                        } catch (err) {
                            if (err.name !== 'AbortError') showToast('공유가 취소되었습니다.');
                        }
                    } else if (navigator.share) {
                        try {
                            await navigator.share(shareData);
                            showToast('공유되었습니다!', '🚀');
                        } catch (err) {
                            if (err.name !== 'AbortError') showToast('공유가 취소되었습니다.');
                        }
                    } else {
                        // Fallback: copy link
                        await navigator.clipboard.writeText(shareData.text);
                        showToast('클립보드에 결과 멘트와 링크가 복사되었습니다!', '📋');
                    }
                });
            };

            // Copy Text & Link Handler
            btnCopy.onclick = async () => {
                const text = `[ToolBox] ${options.title || ''}\n${options.subtitle || ''}\n\n${options.quote || ''}\n\n👉 바로가기: ${window.location.href}`;
                await navigator.clipboard.writeText(text);
                showToast('결과 멘트와 바로가기 링크가 복사되었습니다!', '📋');
            };

            // Open Animation
            render();
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('.bg-slate-900').classList.remove('scale-95');
        }
    };
    window.ToolBoxShare = ToolBoxShare;

    // ===================================================================
    // [과제 2] ToolBoxSearch: Command Palette (Ctrl + K) & Chosung Search
    // ===================================================================
    const ToolBoxSearch = {
        paletteEl: null,
        toolsCache: null,
        activeIndex: 0,

        async init() {
            // Global Shortcut Ctrl + K or Cmd + K
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
                    e.preventDefault();
                    ToolBoxSearch.togglePalette();
                } else if (e.key === 'Escape' && ToolBoxSearch.isOpen()) {
                    ToolBoxSearch.closePalette();
                }
            });

            // Header and Mobile Button clicks
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('#header-search-btn, #mobile-search-btn');
                if (btn) {
                    e.preventDefault();
                    ToolBoxSearch.openPalette();
                }
            });
        },

        isOpen() {
            return this.paletteEl && !this.paletteEl.classList.contains('pointer-events-none');
        },

        togglePalette() {
            if (this.isOpen()) this.closePalette();
            else this.openPalette();
        },

        async openPalette(initialQuery = '') {
            if (SoundFX.isEnabled()) SoundFX.playPop();

            if (!this.paletteEl) {
                this.buildPaletteModal();
            }

            if (!this.toolsCache) {
                this.toolsCache = await getAllTools();
            }

            const input = this.paletteEl.querySelector('#cmd-palette-input');
            input.value = initialQuery;
            this.paletteEl.classList.remove('opacity-0', 'pointer-events-none');
            this.paletteEl.querySelector('.cmd-modal-card').classList.remove('scale-95', 'translate-y-4');
            setTimeout(() => input.focus(), 50);

            this.renderResults(initialQuery);
        },

        closePalette() {
            if (!this.paletteEl) return;
            this.paletteEl.classList.add('opacity-0', 'pointer-events-none');
            this.paletteEl.querySelector('.cmd-modal-card').classList.add('scale-95', 'translate-y-4');
        },

        buildPaletteModal() {
            const el = document.createElement('div');
            el.id = 'toolbox-cmd-palette';
            el.className = 'fixed inset-0 z-[10001] bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 transition-all duration-200 opacity-0 pointer-events-none';
            el.innerHTML = `
                <div class="cmd-modal-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transform scale-95 translate-y-4 transition-all duration-200">
                    <!-- Search Input Bar -->
                    <div class="flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                        <span class="text-xl text-slate-400">🔍</span>
                        <input type="text" id="cmd-palette-input" class="w-full bg-transparent border-none outline-none text-base sm:text-lg font-bold text-slate-900 dark:text-white placeholder-slate-400" placeholder="도구 이름, 설명 또는 초성 검색 (예: ㅋㅅㅇ, ㅇㅂ, ㄷㄱ)..." autocomplete="off" spellcheck="false" />
                        <kbd class="hidden sm:inline-flex px-2 py-0.5 text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">ESC</kbd>
                    </div>

                    <!-- Quick Action Chips (Random, Favorites) -->
                    <div class="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
                        <button type="button" id="cmd-random-btn" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950 text-primary hover:bg-sky-200 dark:hover:bg-sky-900 transition-colors whitespace-nowrap cursor-pointer">
                            <span>🎲</span> <span>아무 도구나 랜덤 실행</span>
                        </button>
                        <button type="button" id="cmd-fav-filter-btn" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors whitespace-nowrap cursor-pointer">
                            <span>⭐</span> <span>내 즐겨찾기 도구만 보기</span>
                        </button>
                    </div>

                    <!-- Results Scroll Container -->
                    <div id="cmd-palette-results" class="flex-1 overflow-y-auto p-3 space-y-1 max-h-[50vh]">
                        <!-- Dynamic Results injected here -->
                    </div>

                    <!-- Bottom Nav Hint -->
                    <div class="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        <div class="flex items-center gap-3">
                            <span>↑↓ 이동</span>
                            <span>Enter 선택</span>
                            <span>ESC 닫기</span>
                        </div>
                        <span class="font-mono">100+ Total Smart Tools</span>
                    </div>
                </div>
            `;
            document.body.appendChild(el);
            this.paletteEl = el;

            // Close on backdrop
            el.onclick = (e) => { if (e.target === el) this.closePalette(); };

            // Input Listener with Hangul Chosung
            const input = el.querySelector('#cmd-palette-input');
            input.oninput = (e) => {
                this.renderResults(e.target.value.trim());
            };

            // Keyboard Navigation (ArrowUp, ArrowDown, Enter)
            input.onkeydown = (e) => {
                const resultsContainer = el.querySelector('#cmd-palette-results');
                const items = resultsContainer.querySelectorAll('.cmd-item');
                if (items.length === 0) return;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.activeIndex = (this.activeIndex + 1) % items.length;
                    this.updateActiveItem(items);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.activeIndex = (this.activeIndex - 1 + items.length) % items.length;
                    this.updateActiveItem(items);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const active = items[this.activeIndex];
                    if (active) {
                        const url = active.getAttribute('data-url');
                        if (url) window.location.href = url;
                    }
                }
            };

            // Random Quick Button
            el.querySelector('#cmd-random-btn').onclick = async () => {
                const rand = await window.ToolBoxHub.getRandomTool();
                if (rand && rand.url) window.location.href = rand.url;
            };

            // Favorites Filter Button
            el.querySelector('#cmd-fav-filter-btn').onclick = () => {
                this.renderFavoritesOnly();
            };
        },

        updateActiveItem(items) {
            items.forEach((item, idx) => {
                if (idx === this.activeIndex) {
                    item.classList.add('bg-sky-50', 'dark:bg-slate-800', 'border-primary', 'dark:border-sky-500');
                    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                } else {
                    item.classList.remove('bg-sky-50', 'dark:bg-slate-800', 'border-primary', 'dark:border-sky-500');
                }
            });
        },

        renderResults(query) {
            const container = this.paletteEl.querySelector('#cmd-palette-results');
            if (!this.toolsCache) return;

            let filtered = [];
            const favs = ToolBoxFavorites.getFavorites();

            if (!query) {
                // Empty query: Show Recent tools & Top Picks
                const recents = ToolBoxFavorites.getRecentTools();
                let html = '';

                if (recents && recents.length > 0) {
                    html += `<div class="text-xs font-bold text-slate-400 px-3 py-1">최근 방문한 도구</div>`;
                    recents.forEach((r, idx) => {
                        html += this.renderItemHtml(r, idx);
                    });
                }

                html += `<div class="text-xs font-bold text-slate-400 px-3 py-1 mt-2">인기 추천 도구 TOP 5</div>`;
                const topPicks = this.toolsCache.slice(0, 5);
                topPicks.forEach((t, idx) => {
                    html += this.renderItemHtml(t, idx + 10);
                });

                container.innerHTML = html;
                this.activeIndex = 0;
                this.bindItemEvents(container);
                return;
            }

            const qLower = query.toLowerCase();
            const qChosung = extractChosung(query);
            const isChosungQuery = /^[ㄱ-ㅎ]+$/.test(query);

            filtered = this.toolsCache.filter(t => {
                if (isChosungQuery) {
                    return t.chosung.includes(query);
                }
                const nameMatch = t.name.toLowerCase().includes(qLower);
                const descMatch = (t.desc || '').toLowerCase().includes(qLower);
                const catMatch = (t.catName || '').toLowerCase().includes(qLower);
                return nameMatch || descMatch || catMatch || t.chosung.includes(qChosung);
            });

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                        <span class="text-3xl">🔍</span>
                        <p class="font-bold text-sm text-slate-600 dark:text-slate-300">검색 결과가 없습니다.</p>
                        <p class="text-xs text-slate-400">다른 검색어나 초성을 입력해 보세요 (예: ㅋㅅㅇ, ㅇㅂ, ㄷㄱ)</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = filtered.slice(0, 20).map((t, idx) => this.renderItemHtml(t, idx)).join('');
            this.activeIndex = 0;
            this.bindItemEvents(container);
            const items = container.querySelectorAll('.cmd-item');
            this.updateActiveItem(items);
        },

        renderFavoritesOnly() {
            const container = this.paletteEl.querySelector('#cmd-palette-results');
            const favSlugs = new Set(ToolBoxFavorites.getFavorites());
            const favTools = (this.toolsCache || []).filter(t => favSlugs.has(t.slug));

            if (favTools.length === 0) {
                container.innerHTML = `
                    <div class="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                        <span class="text-3xl">⭐</span>
                        <p class="font-bold text-sm text-slate-600 dark:text-slate-300">즐겨찾기한 도구가 아직 없습니다.</p>
                        <p class="text-xs text-slate-400">도구 상세 화면에서 상단의 별(⭐) 버튼을 눌러 즐겨찾기에 추가해 보세요!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `<div class="text-xs font-bold text-amber-500 px-3 py-1">내 즐겨찾기 도구 (${favTools.length})</div>` +
                favTools.map((t, idx) => this.renderItemHtml(t, idx)).join('');
            this.activeIndex = 0;
            this.bindItemEvents(container);
            const items = container.querySelectorAll('.cmd-item');
            this.updateActiveItem(items);
        },

        renderItemHtml(t, idx) {
            const isFav = ToolBoxFavorites.isFavorite(t.slug);
            return `
                <div class="cmd-item flex items-center justify-between p-3 rounded-2xl border border-transparent hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer transition-all duration-150 group select-none" data-url="${t.url}" data-slug="${t.slug}">
                    <div class="flex items-center gap-3 overflow-hidden">
                        <span class="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform shrink-0">${t.icon || '🛠️'}</span>
                        <div class="overflow-hidden">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">${t.name}</span>
                                ${t.badge ? `<span class="text-xs px-2 py-0.2 rounded-md bg-sky-100 dark:bg-sky-950 text-primary font-bold shrink-0">${t.badge}</span>` : ''}
                            </div>
                            <div class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">${t.desc || ''}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <span class="text-xs text-slate-400 font-medium hidden sm:inline">${t.catName || ''}</span>
                        ${isFav ? '<span class="text-amber-500 text-sm">⭐</span>' : ''}
                    </div>
                </div>
            `;
        },

        bindItemEvents(container) {
            container.querySelectorAll('.cmd-item').forEach((item, idx) => {
                item.onclick = () => {
                    const url = item.getAttribute('data-url');
                    if (url) window.location.href = url;
                };
                item.onmouseenter = () => {
                    this.activeIndex = idx;
                    const items = container.querySelectorAll('.cmd-item');
                    this.updateActiveItem(items);
                };
            });
        }
    };
    window.ToolBoxSearch = ToolBoxSearch;

    // ===================================================================
    // [과제 3] ToolBoxFavorites: Universal Favorites & Recent Tools
    // ===================================================================
    const FAV_KEY = 'toolbox_favorites_v1';
    const RECENT_KEY = 'toolbox_recent_v1';

    const ToolBoxFavorites = {
        getFavorites() {
            try {
                return JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
            } catch (e) { return []; }
        },

        isFavorite(slug) {
            if (!slug) return false;
            return this.getFavorites().includes(slug);
        },

        toggleFavorite(slug, name = '') {
            const favs = this.getFavorites();
            const idx = favs.indexOf(slug);
            let isNowFav = false;
            if (idx !== -1) {
                favs.splice(idx, 1);
                isNowFav = false;
                showToast(`'${name || slug}' 즐겨찾기에서 해제되었습니다.`, '☆');
            } else {
                favs.push(slug);
                isNowFav = true;
                showToast(`'${name || slug}' 즐겨찾기에 추가되었습니다!`, '⭐');
            }
            try {
                localStorage.setItem(FAV_KEY, JSON.stringify(favs));
            } catch (e) {}

            if (SoundFX.isEnabled()) SoundFX.playPop();
            this.updateHeaderStar();
            window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { slug, isNowFav } }));
            return isNowFav;
        },

        getRecentTools() {
            try {
                return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
            } catch (e) { return []; }
        },

        addRecent(tool) {
            if (!tool || !tool.slug) return;
            const recents = this.getRecentTools().filter(t => t.slug !== tool.slug);
            recents.unshift({
                slug: tool.slug,
                name: tool.name,
                icon: tool.icon || '🛠️',
                url: tool.url,
                catName: tool.catName || '',
                time: Date.now()
            });
            try {
                localStorage.setItem(RECENT_KEY, JSON.stringify(recents.slice(0, 6)));
            } catch (e) {}
        },

        updateHeaderStar() {
            const headerFavBtn = document.getElementById('header-fav-btn');
            if (!headerFavBtn) return;
            const slug = getCurrentToolSlug();
            if (!slug) {
                headerFavBtn.classList.add('hidden');
                return;
            }
            headerFavBtn.classList.remove('hidden');
            headerFavBtn.classList.add('flex');

            const isFav = this.isFavorite(slug);
            const icon = headerFavBtn.querySelector('span');
            if (icon) {
                icon.textContent = isFav ? 'star' : 'star_border';
                if (isFav) {
                    headerFavBtn.classList.add('text-amber-500');
                    headerFavBtn.classList.remove('text-slate-400');
                    headerFavBtn.setAttribute('title', '즐겨찾기 해제');
                } else {
                    headerFavBtn.classList.remove('text-amber-500');
                    headerFavBtn.classList.add('text-slate-400');
                    headerFavBtn.setAttribute('title', '즐겨찾기 추가');
                }
            }
        },

        async setupPageIntegration() {
            const slug = getCurrentToolSlug();
            if (!slug) return;

            // Update Header Star Button
            this.updateHeaderStar();
            const headerFavBtn = document.getElementById('header-fav-btn');
            if (headerFavBtn) {
                headerFavBtn.onclick = () => {
                    const title = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : slug;
                    ToolBoxFavorites.toggleFavorite(slug, title);
                };
            }

            // Track into Recent Tools
            const allTools = await getAllTools();
            const currentTool = allTools.find(t => t.slug === slug);
            if (currentTool) {
                this.addRecent(currentTool);
            }
        }
    };
    window.ToolBoxFavorites = ToolBoxFavorites;

    // ===================================================================
    // [과제 4] ToolBoxStreak: Daily Attendance & Fortune Cookie
    // ===================================================================
    const STREAK_KEY = 'toolbox_streak_v1';
    const FORTUNES = [
        "오늘 하루, 퇴근 10분 전 기습 회의를 완벽 차단하는 행운이 따릅니다! 🏃",
        "숨만 쉬어도 월급 계좌에 착착 쌓이는 보너스 같은 하루가 펼쳐집니다. 💸",
        "껄끄러운 부탁을 거절해도 아무도 섭섭해하지 않는 마법의 쿠션어가 함께합니다. 🛡️",
        "오늘 당신의 집중력은 100%! 퇴근 시간 칼퇴 셔터가 번개처럼 내려옵니다. ⚡",
        "가장 까다로운 보고서나 과제가 단번에 'OK 승인'을 받는 기적이 찾아옵니다! 📑",
        "기대하지 않았던 깜짝 커피 쿠폰이나 뜻밖의 간식 복이 쏟아지는 하루입니다. ☕",
        "어떤 난관이 와도 여유롭게 미소 지으며 '넵, 확인했습니다'로 넘길 수 있습니다. 👑",
        "당신의 노력이 마침내 큰 인정과 보상으로 되돌아오는 터닝 포인트의 날입니다! 🌟"
    ];

    const ToolBoxStreak = {
        getStreakData() {
            try {
                return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
            } catch (e) { return {}; }
        },

        getTodayStr() {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
        },

        getYesterdayStr() {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        },

        updateBadge() {
            const badge = document.getElementById('header-streak-badge');
            if (!badge) return;
            const data = this.getStreakData();
            const today = this.getTodayStr();
            const isChecked = data.lastCheckDate === today;

            if (data.streak && data.streak > 0) {
                badge.textContent = `${data.streak}일`;
                badge.classList.remove('hidden');
                if (isChecked) {
                    badge.classList.add('bg-emerald-500');
                    badge.classList.remove('bg-rose-500');
                } else {
                    badge.classList.add('bg-rose-500');
                    badge.classList.remove('bg-emerald-500');
                }
            } else {
                badge.textContent = '1일';
                badge.classList.remove('hidden');
            }
        },

        init() {
            this.updateBadge();
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('#header-streak-btn, #mobile-streak-btn');
                if (btn) {
                    e.preventDefault();
                    this.openModal();
                }
            });
        },

        async openModal() {
            if (SoundFX.isEnabled()) SoundFX.playPop();

            const data = this.getStreakData();
            const today = this.getTodayStr();
            const yesterday = this.getYesterdayStr();
            const isAlreadyChecked = data.lastCheckDate === today;

            let currentStreak = data.streak || 0;
            let totalCount = data.total || 0;

            if (!isAlreadyChecked) {
                if (data.lastCheckDate === yesterday) {
                    currentStreak += 1;
                } else {
                    currentStreak = 1;
                }
                totalCount += 1;
                data.lastCheckDate = today;
                data.streak = currentStreak;
                data.total = totalCount;
                data.fortuneIndex = Math.floor(Math.random() * FORTUNES.length);
                try {
                    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
                } catch (e) {}
                this.updateBadge();
            }

            const fortuneText = FORTUNES[data.fortuneIndex || 0];
            const luckyTool = await window.ToolBoxHub.getRandomTool();

            let modal = document.getElementById('toolbox-streak-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'toolbox-streak-modal';
                modal.className = 'fixed inset-0 z-[10002] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 opacity-0 pointer-events-none';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div class="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col p-6 sm:p-8 text-center relative text-white">
                    <canvas id="streak-confetti-canvas" class="absolute inset-0 pointer-events-none w-full h-full z-10"></canvas>
                    
                    <button type="button" id="streak-modal-close" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors z-20">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <!-- Fortune Cookie Icon Animation -->
                    <div class="relative flex justify-center mb-4 z-20">
                        <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/30 animate-bounce">
                            🥠
                        </div>
                    </div>

                    <div class="inline-flex items-center justify-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/30 mx-auto z-20">
                        <span>🔥</span> <span>연속 ${currentStreak}일째 출석 완료! (누적 ${totalCount}회)</span>
                    </div>

                    <h3 class="text-2xl font-black text-white mb-2 z-20">
                        ${isAlreadyChecked ? '오늘의 포춘 쿠키 (출석 완료)' : '오늘의 출석 체크 완료!'}
                    </h3>

                    <!-- Fortune Box -->
                    <div class="my-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-sm font-semibold leading-relaxed relative z-20">
                        <div class="text-xs text-amber-400 font-bold mb-1">📜 오늘의 직장인/학생 생존 포춘</div>
                        "${fortuneText}"
                    </div>

                    <!-- Recommended Lucky Tool -->
                    ${luckyTool ? `
                        <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left mb-5 z-20 flex items-center justify-between">
                            <div class="flex items-center gap-3 overflow-hidden">
                                <span class="text-2xl p-2 rounded-xl bg-slate-700/80 shrink-0">${luckyTool.icon || '🛠️'}</span>
                                <div class="overflow-hidden">
                                    <div class="text-xs text-sky-400 font-bold">✨ 오늘의 행운 추천 도구</div>
                                    <div class="font-bold text-sm text-white truncate">${luckyTool.name}</div>
                                </div>
                            </div>
                            <a href="${luckyTool.url}" class="px-3 py-1.5 rounded-lg bg-primary hover:bg-sky-500 text-white font-bold text-xs shrink-0 transition-colors">
                                바로 실행 →
                            </a>
                        </div>
                    ` : ''}

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-2.5 z-20">
                        <button type="button" id="streak-share-card-btn" class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
                            📸 출석 인증 카드 공유
                        </button>
                        <button type="button" id="streak-confirm-btn" class="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors cursor-pointer">
                            확인
                        </button>
                    </div>
                </div>
            `;

            const closeModal = () => {
                modal.classList.add('opacity-0', 'pointer-events-none');
            };
            modal.querySelector('#streak-modal-close').onclick = closeModal;
            modal.querySelector('#streak-confirm-btn').onclick = closeModal;
            modal.onclick = (e) => { if (e.target === modal) closeModal(); };

            // Share Card integration
            modal.querySelector('#streak-share-card-btn').onclick = () => {
                closeModal();
                ToolBoxShare.openModal({
                    title: `연속 ${currentStreak}일 출석 달성!`,
                    subtitle: `ToolBox 데일리 포춘 & 습관 루틴`,
                    badge: `🔥 출석 스트릭 ${currentStreak}일차`,
                    metrics: [
                        { label: '연속 출석', value: `${currentStreak}일`, highlight: true },
                        { label: '누적 출석', value: `${totalCount}회`, highlight: false }
                    ],
                    quote: fortuneText + (luckyTool ? `\n\n🎯 오늘의 행운 추천 도구: ${luckyTool.name}` : '')
                });
            };

            // Confetti Trigger
            modal.classList.remove('opacity-0', 'pointer-events-none');
            this.runConfetti(modal.querySelector('#streak-confetti-canvas'));
        },

        runConfetti(canvas) {
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const w = canvas.width = canvas.offsetWidth;
            const h = canvas.height = canvas.offsetHeight;
            const pieces = [];
            const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6', '#eab308'];

            for (let i = 0; i < 40; i++) {
                pieces.push({
                    x: w / 2,
                    y: h / 3,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.7) * 12,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rot: Math.random() * 360,
                    vRot: (Math.random() - 0.5) * 10
                });
            }

            let frame = 0;
            const animate = () => {
                if (frame > 60) return;
                ctx.clearRect(0, 0, w, h);
                pieces.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.35; // gravity
                    p.rot += p.vRot;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                });
                frame++;
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    };
    window.ToolBoxStreak = ToolBoxStreak;

    // ===================================================================
    // [과제 5] ToolBoxPWA: Smart A2HS Banner & Mobile Guide
    // ===================================================================
    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        ToolBoxPWA.showBanner();
    });

    const ToolBoxPWA = {
        init() {
            // Check after a brief delay
            setTimeout(() => {
                this.checkIOSPrompt();
            }, 3000);
        },

        isDismissed() {
            const until = localStorage.getItem('toolbox_pwa_dismissed_until');
            return until && Number(until) > Date.now();
        },

        dismissBanner(days = 3) {
            try {
                localStorage.setItem('toolbox_pwa_dismissed_until', String(Date.now() + days * 86400000));
            } catch (e) {}
            const b = document.getElementById('toolbox-pwa-banner');
            if (b) b.remove();
        },

        showBanner() {
            if (this.isDismissed()) return;
            if (window.matchMedia('(display-mode: standalone)').matches) return;
            if (document.getElementById('toolbox-pwa-banner')) return;

            const banner = document.createElement('div');
            banner.id = 'toolbox-pwa-banner';
            banner.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9990] bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 border border-slate-700/80 dark:border-slate-200 p-4 rounded-3xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-fade-in-up';
            banner.innerHTML = `
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white text-xl shrink-0 shadow-md">
                        🛠️
                    </div>
                    <div class="overflow-hidden">
                        <div class="font-extrabold text-sm truncate">ToolBox 앱 홈 화면 추가</div>
                        <div class="text-xs text-slate-300 dark:text-slate-600 truncate">설치 용량 0MB • 1초 만에 실행</div>
                    </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" id="pwa-install-action-btn" class="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer">
                        앱 설치
                    </button>
                    <button type="button" id="pwa-install-close-btn" class="p-1.5 text-slate-400 hover:text-white dark:hover:text-slate-900 rounded-lg transition-colors cursor-pointer">
                        ✕
                    </button>
                </div>
            `;
            document.body.appendChild(banner);

            banner.querySelector('#pwa-install-action-btn').onclick = async () => {
                if (deferredInstallPrompt) {
                    deferredInstallPrompt.prompt();
                    const choice = await deferredInstallPrompt.userChoice;
                    if (choice.outcome === 'accepted') {
                        showToast('ToolBox 앱이 홈 화면에 추가되었습니다!', '🎉');
                    }
                    deferredInstallPrompt = null;
                } else {
                    this.showManualGuide();
                }
                banner.remove();
            };

            banner.querySelector('#pwa-install-close-btn').onclick = () => {
                this.dismissBanner(3);
            };
        },

        checkIOSPrompt() {
            if (this.isDismissed()) return;
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

            if (isIOS && !isStandalone) {
                this.showBanner();
            }
        },

        showManualGuide() {
            showToast('브라우저 메뉴에서 [홈 화면에 추가]를 눌러주세요!', '📱', 4000);
        }
    };
    window.ToolBoxPWA = ToolBoxPWA;

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
                window.applyLanguage(getActiveLang(), true);
            }

            // Init Header integrations
            ToolBoxFavorites.setupPageIntegration();
            ToolBoxStreak.updateBadge();
        });

        // Mount Footer
        fetchAndMount('footer.html', ['footer-placeholder', 'footer', 'site-footer']);

        // Mount Global Floating Quick Nav Dock
        setupGlobalFloatingDock();

        // Mount Tool Screen Related Switcher
        setupToolScreenSwitcher();

        // Init Universal Modules
        ToolBoxSearch.init();
        ToolBoxStreak.init();
        ToolBoxPWA.init();
        ToolBoxFavorites.setupPageIntegration();
    }

    if (document.readyState !== 'loading') {
        initFramework();
    } else {
        document.addEventListener('DOMContentLoaded', initFramework);
    }
})();

// Register PWA Service Worker for instant loading & offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
