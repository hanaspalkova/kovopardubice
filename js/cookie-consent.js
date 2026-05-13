(function () {
    const STORAGE_KEY = 'cookie_consent';

    function loadGoogleMaps() {
        const iframe = document.getElementById('google-map');
        const placeholder = document.getElementById('map-placeholder');
        if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
    }

    function grantAnalytics() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', { analytics_storage: 'granted' });
        }
    }

    function acceptAll() {
        localStorage.setItem(STORAGE_KEY, 'all');
        hideBanner();
        loadGoogleMaps();
        grantAnalytics();
    }

    function acceptNecessary() {
        localStorage.setItem(STORAGE_KEY, 'necessary');
        hideBanner();
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 350);
        }
    }

    function init() {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (consent === 'all') {
            loadGoogleMaps();
            grantAnalytics();
            return;
        }

        const banner = document.getElementById('cookie-banner');
        if (!banner) return;

        if (!consent) {
            requestAnimationFrame(() => banner.classList.add('visible'));
        }

        document.getElementById('cookie-accept-all')
            ?.addEventListener('click', acceptAll);
        document.getElementById('cookie-accept-necessary')
            ?.addEventListener('click', acceptNecessary);

        const mapBtn = document.getElementById('map-consent-btn');
        if (mapBtn) mapBtn.addEventListener('click', acceptAll);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
