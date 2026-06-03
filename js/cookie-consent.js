(function () {
    const STORAGE_KEY = 'cookie_consent';
    const STORAGE_FUNCTIONAL = 'cookie_functional';
    const STORAGE_ANALYTICS  = 'cookie_analytics';

    /* ---------- GA ---------- */
    function grantAnalytics() {
        if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'granted' });
    }
    function denyAnalytics() {
        if (typeof gtag === 'function') gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    /* ---------- Google Maps ---------- */
    function loadGoogleMaps() {
        const iframe = document.getElementById('google-map');
        const placeholder = document.getElementById('map-placeholder');
        if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
    }

    /* ---------- Banner ---------- */
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 350);
        }
    }

    function acceptAll() {
        localStorage.setItem(STORAGE_KEY, 'all');
        localStorage.setItem(STORAGE_FUNCTIONAL, '1');
        localStorage.setItem(STORAGE_ANALYTICS, '1');
        hideBanner();
        loadGoogleMaps();
        grantAnalytics();
    }

    function acceptNecessary() {
        localStorage.setItem(STORAGE_KEY, 'necessary');
        localStorage.setItem(STORAGE_FUNCTIONAL, '0');
        localStorage.setItem(STORAGE_ANALYTICS, '0');
        hideBanner();
        denyAnalytics();
    }

    /* ---------- Modal ---------- */
    function openModal() {
        const modal = document.getElementById('cookie-modal');
        if (!modal) return;
        const toggleF = document.getElementById('cookie-toggle-functional');
        const toggleA = document.getElementById('cookie-toggle-analytics');
        if (toggleF) toggleF.checked = localStorage.getItem(STORAGE_FUNCTIONAL) === '1';
        if (toggleA) toggleA.checked = localStorage.getItem(STORAGE_ANALYTICS) === '1';
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('cookie-modal');
        if (!modal) return;
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }

    function savePreferences() {
        const functional = document.getElementById('cookie-toggle-functional')?.checked;
        const analytics  = document.getElementById('cookie-toggle-analytics')?.checked;

        localStorage.setItem(STORAGE_KEY, 'custom');
        localStorage.setItem(STORAGE_FUNCTIONAL, functional ? '1' : '0');
        localStorage.setItem(STORAGE_ANALYTICS,  analytics  ? '1' : '0');

        if (functional) loadGoogleMaps();
        if (analytics)  grantAnalytics(); else denyAnalytics();

        closeModal();
        hideBanner();
    }

    /* ---------- Init ---------- */
    function init() {
        const functional = localStorage.getItem(STORAGE_FUNCTIONAL) === '1';
        const analytics  = localStorage.getItem(STORAGE_ANALYTICS)  === '1';
        const consent    = localStorage.getItem(STORAGE_KEY);

        if (functional) loadGoogleMaps();
        if (analytics)  grantAnalytics();

        /* banner */
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            if (!consent) requestAnimationFrame(() => banner.classList.add('visible'));

            document.getElementById('cookie-accept-all')
                ?.addEventListener('click', acceptAll);
            document.getElementById('cookie-accept-necessary')
                ?.addEventListener('click', acceptNecessary);
            document.getElementById('cookie-open-preferences')
                ?.addEventListener('click', function (e) {
                    e.preventDefault();
                    openModal();
                });
        }

        /* modal */
        document.getElementById('cookie-save-preferences')
            ?.addEventListener('click', savePreferences);
        document.getElementById('cookie-modal-close')
            ?.addEventListener('click', closeModal);
        document.getElementById('cookie-modal-overlay')
            ?.addEventListener('click', closeModal);

        /* mapa — tlačítko přímo v sekci mapy */
        document.getElementById('map-consent-btn')
            ?.addEventListener('click', acceptAll);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
