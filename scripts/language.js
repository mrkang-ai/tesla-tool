/**
 * ToolBox Universal Multi-Language (i18n) Engine
 * Supports ?lang=en URL parameters, localStorage persistence, modular /locales/{lang}/ JSON dictionaries,
 * and data-lang-ko/en & data-i18n attributes.
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

    // 2. Fetch modular translations for a specific language
    async function loadLocaleBundle(lang) {
        if (Object.keys(translations[lang] || {}).length > 0) {
            return translations[lang];
        }

        translations[lang] = translations[lang] || {};
        const modules = ['common', 'categories', 'tools'];

        await Promise.all(modules.map(async (mod) => {
            try {
                const res = await fetch(`/locales/${lang}/${mod}.json?v=202`);
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
        if (!lang) lang = currentLang;
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        // Ensure locale bundle is loaded
        await loadLocaleBundle(lang);
        const bundle = translations[lang] || {};

        // 3a. Update [data-lang-ko] and [data-lang-en]
        document.querySelectorAll('[data-lang-ko], [data-lang-en]').forEach(element => {
            const text = element.getAttribute(`data-lang-${lang}`);
            if (text) {
                if (element.placeholder !== undefined) {
                    element.placeholder = text;
                } else if (element.tagName === 'META') {
                    element.setAttribute('content', text);
                } else if (element.id !== 'current-service-name' && element.id !== 'current-language-text') {
                    if (/<[a-z][\s\S]*>/i.test(text)) {
                        element.innerHTML = text;
                    } else {
                        element.textContent = text;
                    }
                }
            }
        });

        // 3b. Update [data-i18n] keys
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const val = getNestedTranslation(bundle, key);
            if (val && typeof val === 'string') {
                if (element.placeholder !== undefined) {
                    element.placeholder = val;
                } else {
                    element.textContent = val;
                }
            }
        });

        // 3c. Update language selector button display
        const currentLangTextElement = document.getElementById('current-language-text');
        if (currentLangTextElement) {
            currentLangTextElement.textContent = lang === 'ko' ? '한국어' : 'English';
        }

        // 3d. Synchronize service name in header if applicable
        if (window.updateCurrentServiceName) {
            window.updateCurrentServiceName();
        }

        // 3e. Dispatch custom event for arcade console or custom reactive widgets
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
    }

    // Expose to window immediately
    window.applyLanguage = applyLanguage;
    window.getLanguage = () => currentLang;

    // Initial load on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        applyLanguage(currentLang, true);

        // Delegated event listener for language switchers
        document.addEventListener('click', (event) => {
            const target = event.target.closest('#lang-ko, #lang-en');
            if (!target) return;
            event.preventDefault();
            const chosenLang = target.id === 'lang-en' ? 'en' : 'ko';
            applyLanguage(chosenLang);
        });
    });

})();
