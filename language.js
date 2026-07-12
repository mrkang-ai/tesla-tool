document.addEventListener('DOMContentLoaded', () => {
    const translations = {};
    let currentLang = localStorage.getItem('language') || 'ko';

    async function fetchTranslations() {
        try {
            const response = await fetch('/locales/translations.json');
            const data = await response.json();
            Object.assign(translations, data);
            // Don't apply language here, main.js will do it after header load
        } catch (error) {
            console.error('Error fetching translations:', error);
        }
    }

    function applyLanguage(lang, isInitialLoad = false) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        // Update all text content based on language
        document.querySelectorAll('[data-lang-ko], [data-lang-en]').forEach(element => {
            const text = element.getAttribute(`data-lang-${lang}`);
            if (text) {
                if (element.placeholder !== undefined) {
                    element.placeholder = text;
                } else if (element.tagName === 'META') {
                    element.setAttribute('content', text);
                } else if (element.id !== 'current-service-name' && element.id !== 'current-language-text') {
                    // Avoid directly setting text for elements controlled by other functions
                    element.textContent = text;
                }
            }
        });

        // Update the current language display text
        const currentLangTextElement = document.getElementById('current-language-text');
        if (currentLangTextElement) {
            currentLangTextElement.textContent = lang === 'ko' ? '한국어' : 'English';
        }

        // Update the service name in the header
        if (window.updateCurrentServiceName) {
            window.updateCurrentServiceName();
        }
        
        // On initial load, this is handled by the main.js callback
        if (!isInitialLoad) {
             // Logic for subsequent language changes might be needed here
        }
    }

    window.applyLanguage = applyLanguage;

    fetchTranslations();

    // Delegated event listener for language switchers
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.matches('#lang-ko')) {
            event.preventDefault();
            applyLanguage('ko');
        } else if (target.matches('#lang-en')) {
            event.preventDefault();
            applyLanguage('en');
        }
    });
});
