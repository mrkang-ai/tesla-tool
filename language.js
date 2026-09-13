/**
 * ToolBox Universal Multi-Language (i18n) Engine
 * Supports ?lang=en URL parameters, localStorage persistence, modular /locales/{lang}/ JSON dictionaries,
 * and data-lang-ko/en, data-lang-ko-ph/en-ph & data-i18n attributes.
 */
(function() {
    'use strict';

    const translations = {
        ko: {},
        en: {}
    };

    // 1. Detect language from URL search param or localStorage (default: 'ko')
    const urlParams = new URLSearchParams(window.location.search);
    const queryLang = urlParams.get('lang');
    let currentLang = (queryLang === 'en' || queryLang === 'ko') 
        ? queryLang 
        : (localStorage.getItem('language') || 'ko');

    if (queryLang) {
        localStorage.setItem('language', queryLang);
    }

    // Expose functions to window immediately so they are NEVER undefined
    window.applyLanguage = applyLanguage;
    window.getLanguage = () => currentLang;
    window.getTranslationBundle = (lang) => translations[lang || currentLang] || {};

    // 2. Fetch modular translations for a specific language
    async function loadLocaleBundle(lang) {
        if (translations[lang] && Object.keys(translations[lang]).length >= 3) {
            return translations[lang];
        }

        translations[lang] = translations[lang] || {};
        const modules = ['common', 'categories', 'tools'];

        await Promise.all(modules.map(async (mod) => {
            try {
                const res = await fetch(`/locales/${lang}/${mod}.json?v=320`, { cache: 'no-cache' });
                if (res.ok) {
                    const data = await res.json();
                    translations[lang][mod] = data;
                }
            } catch (err) {
                // Silently fallback if module not loaded
            }
        }));

        return translations[lang];
    }

    // Helper: Resolve dotted key e.g. "actions.launch" in translations object
    function getNestedTranslation(obj, key) {
        if (!obj || !key) return null;
        const parts = key.split('.');
        let curr = obj;
        for (const p of parts) {
            if (curr && curr[p] !== undefined) {
                curr = curr[p];
            } else {
                return null;
            }
        }
        return curr;
    }

    // 3. Apply Language to DOM
    async function applyLanguage(lang, isInitialLoad = false) {
        if (!lang || (lang !== 'ko' && lang !== 'en')) lang = 'ko';
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        // Ensure locale bundle is loaded
        await loadLocaleBundle(lang);
        const bundle = translations[lang] || {};

        // 3a. Update page title
        const titleEl = document.querySelector('title[data-lang-ko], title[data-lang-en]');
        if (titleEl) {
            const titleText = titleEl.getAttribute(`data-lang-${lang}`);
            if (titleText) document.title = titleText;
        }

        // 3b. Update [data-lang-ko] and [data-lang-en]
        document.querySelectorAll('[data-lang-ko], [data-lang-en]').forEach(element => {
            const text = element.getAttribute(`data-lang-${lang}`);
            if (text) {
                if (element.tagName === 'META') {
                    element.setAttribute('content', text);
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (element.id !== 'current-service-name' && element.id !== 'current-language-text') {
                    if (/<[a-z][\s\S]*>/i.test(text)) {
                        element.innerHTML = text;
                    } else {
                        element.textContent = text;
                    }
                }
            }
        });

        // 3c. Update placeholders with [data-lang-ko-ph], [data-lang-en-ph]
        document.querySelectorAll('[data-lang-ko-ph], [data-lang-en-ph]').forEach(element => {
            const ph = element.getAttribute(`data-lang-${lang}-ph`);
            if (ph) {
                element.placeholder = ph;
            }
        });

        // 3d. Update [data-i18n] keys
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const val = getNestedTranslation(bundle, key);
            if (val && typeof val === 'string') {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = val;
                } else {
                    element.textContent = val;
                }
            }
        });

        // 3e. Update language selector buttons display and active state
        const currentLangTextElement = document.getElementById('current-language-text');
        if (currentLangTextElement) {
            currentLangTextElement.textContent = lang === 'ko' ? '한국어' : 'English';
        }

        const checkKo = document.getElementById('lang-check-ko');
        const checkEn = document.getElementById('lang-check-en');
        if (checkKo) checkKo.classList.toggle('hidden', lang !== 'ko');
        if (checkEn) checkEn.classList.toggle('hidden', lang !== 'en');

        // Update mobile segment buttons
        const mobileBtnKo = document.getElementById('mobile-lang-ko');
        const mobileBtnEn = document.getElementById('mobile-lang-en');
        if (mobileBtnKo && mobileBtnEn) {
            if (lang === 'ko') {
                mobileBtnKo.className = 'mobile-lang-btn px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-white shadow-sm';
                mobileBtnEn.className = 'mobile-lang-btn px-3 py-1 rounded-md text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-primary';
            } else {
                mobileBtnEn.className = 'mobile-lang-btn px-3 py-1 rounded-md text-xs font-bold transition-all bg-primary text-white shadow-sm';
                mobileBtnKo.className = 'mobile-lang-btn px-3 py-1 rounded-md text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-primary';
            }
        }

        // 3f. Synchronize URL search params (?lang=) without reloading
        if (!isInitialLoad) {
            try {
                const currentUrl = new URL(window.location.href);
                if (lang === 'ko') {
                    currentUrl.searchParams.delete('lang');
                } else {
                    currentUrl.searchParams.set('lang', lang);
                }
                window.history.replaceState({}, '', currentUrl.toString());
            } catch (e) {}
        }

        // 3g. Sound FX on switch
        if (!isInitialLoad && window.SoundFX) {
            if (typeof window.SoundFX.playClick === 'function') {
                window.SoundFX.playClick();
            } else if (typeof window.SoundFX.play === 'function') {
                window.SoundFX.play('click');
            }
        }

        // 3h. Dispatch custom event for arcade console, framework dock & side drawer
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang, bundle } }));
    }

    // Initial load on DOM ready
    if (document.readyState !== 'loading') {
        applyLanguage(currentLang, true);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            applyLanguage(currentLang, true);
        });
    }

    // Delegated event listener for all language switchers
    document.addEventListener('click', (event) => {
        const target = event.target.closest('#lang-ko, #lang-en, #mobile-lang-ko, #mobile-lang-en, [data-lang-choice]');
        if (!target) return;
        event.preventDefault();
        const choice = target.getAttribute('data-lang-choice') || (target.id.includes('en') ? 'en' : 'ko');
        applyLanguage(choice);
    });

})();

