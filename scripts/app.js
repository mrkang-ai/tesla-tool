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
                        text: document.querySelector('meta[name="description"]').content,
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
            serviceName = menuButton.getAttribute(lang === 'en' ? 'data-lang-en' : 'data-lang-ko');
        }
        serviceNameElement.textContent = serviceName;
    };
    
    // Expose the function to be called from language.js
    window.updateCurrentServiceName = updateCurrentServiceName;

    const path = window.location.pathname;
    const basePath = path.includes('/lotto/') || path.includes('/TextCount/') || path.includes('/eat/') || path.includes('/Rock-paper-scissors/') || path.includes('/ladder/') || path.includes('/carrot-dodger/') || path.includes('/Dodger/') || path.includes('/meme-generator/') || path.includes('/roulette/') || path.includes('/keycap/') || path.includes('/stairs/') ? '../' : '';

    loadHTML(`${basePath}header.html`, 'header-placeholder', () => {
        initializeDropdowns();
        setupShareButtons();
        // Initial updates on page load
        if (window.applyLanguage) {
            window.applyLanguage(localStorage.getItem('language') || 'ko', true);
        } else {
            updateCurrentServiceName();
        }
    });

    loadHTML(`${basePath}footer.html`, 'footer-placeholder');
});
