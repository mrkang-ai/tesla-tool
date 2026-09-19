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
                const res = await fetch(`/locales/${lang}/tools.json?v=420`);
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
                </div>
            `;

            const stripDrawerBtn = document.getElementById('fw-open-drawer-btn');
            if (stripDrawerBtn) stripDrawerBtn.onclick = openDrawer;

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

// Register PWA Service Worker for instant loading & offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
