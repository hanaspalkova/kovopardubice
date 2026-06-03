(function () {
    const STORAGE_KEY = 'cookie_consent';

    /* ---------- GA helpers ---------- */
    function grantAnalytics() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', { analytics_storage: 'granted' });
        }
    }
    function denyAnalytics() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', { analytics_storage: 'denied' });
        }
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
        hideBanner();
        loadGoogleMaps();
        grantAnalytics();
    }

    function acceptNecessary() {
        localStorage.setItem(STORAGE_KEY, 'necessary');
        hideBanner();
        denyAnalytics();
    }

    /* ---------- Modal ---------- */
    function openModal() {
        const modal = document.getElementById('cookie-modal');
        if (!modal) return;
        // předvyplnit toggle podle uloženého stavu
        const saved = localStorage.getItem(STORAGE_KEY);
        const toggle = document.getElementById('cookie-toggle-analytics');
        if (toggle) toggle.checked = (saved === 'all' || saved === 'custom-analytics');
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
        const toggle = document.getElementById('cookie-toggle-analytics');
        const analytics = toggle && toggle.checked;
        if (analytics) {
            localStorage.setItem(STORAGE_KEY, 'custom-analytics');
            loadGoogleMaps();
            grantAnalytics();
        } else {
            localStorage.setItem(STORAGE_KEY, 'necessary');
            denyAnalytics();
        }
        closeModal();
        hideBanner();
    }

    /* ---------- Init ---------- */
    function init() {
        const consent = localStorage.getItem(STORAGE_KEY);

        if (consent === 'all' || consent === 'custom-analytics') {
            loadGoogleMaps();
            grantAnalytics();
        }

        // banner
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            if (!consent) {
                requestAnimationFrame(() => banner.classList.add('visible'));
            }
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

        // modal
        document.getElementById('cookie-save-preferences')
            ?.addEventListener('click', savePreferences);
        document.getElementById('cookie-modal-close')
            ?.addEventListener('click', closeModal);
        document.getElementById('cookie-modal-overlay')
            ?.addEventListener('click', closeModal);

        // mapa
        const mapBtn = document.getElementById('map-consent-btn');
        if (mapBtn) mapBtn.addEventListener('click', acceptAll);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
