/* ============================================================
   СКРИПТ СТРАНИЦЫ
   Обработчики навешиваются после того, как <site-header>
   отрисует свою разметку.
   ============================================================ */


/* ============================================================
   ВСПОМОГАТЕЛЬНОЕ: дождаться появления элемента в DOM
   ============================================================ */
function waitForElement(id, callback) {
    var el = document.getElementById(id);
    if (el) {
        callback(el);
        return;
    }

    var observer = new MutationObserver(function (mutations, obs) {
        var found = document.getElementById(id);
        if (found) {
            obs.disconnect();
            callback(found);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}


/* ============================================================
   1) ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
   ============================================================ */
waitForElement('theme-toggle', function (themeToggle) {
    themeToggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
});


/* ============================================================
   2) ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА (RU / EN)
   ============================================================ */
waitForElement('lang-toggle', function (langBtn) {

    function applyLang(lang) {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);

        document.querySelectorAll('[data-ru]').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text !== null) el.textContent = text;
        });

        var pageTitle = document.documentElement.getAttribute('data-title-' + lang);
        if (pageTitle) document.title = pageTitle;

        langBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
    }

    var current = localStorage.getItem('lang') || 'ru';
    applyLang(current);

    langBtn.addEventListener('click', function () {
        var next = (localStorage.getItem('lang') || 'ru') === 'ru' ? 'en' : 'ru';
        localStorage.setItem('lang', next);
        applyLang(next);

        langBtn.classList.remove('flipping');
        void langBtn.offsetWidth;
        langBtn.classList.add('flipping');

        setTimeout(function () {
            langBtn.classList.remove('flipping');
        }, 500);
    });
});


/* ============================================================
   3) БУРГЕР + ПАНЕЛЬ
   ============================================================ */
waitForElement('menu-toggle', function (menuToggle) {
    var navPanel = document.getElementById('nav-panel');
    var overlay  = document.getElementById('overlay');

    if (!navPanel) return;

    function isMobile() {
        return window.matchMedia('(max-width: 640px)').matches;
    }

    function syncPanelState() {
        if (isMobile()) {
            if (!navPanel.classList.contains('open')) {
                navPanel.setAttribute('aria-hidden', 'true');
                navPanel.setAttribute('inert', '');
            }
        } else {
            navPanel.removeAttribute('aria-hidden');
            navPanel.removeAttribute('inert');
        }
    }

    syncPanelState();
    window.addEventListener('resize', syncPanelState);

    function toggleMenu() {
        var isOpen = navPanel.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        if (overlay) overlay.classList.toggle('open', isOpen);

        document.body.style.overflow = isOpen ? 'hidden' : '';

        navPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        if (isOpen) {
            navPanel.removeAttribute('inert');
        } else {
            navPanel.setAttribute('inert', '');
        }

        menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    }

    function closeMenu() {
        navPanel.classList.remove('open');
        menuToggle.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';

        syncPanelState();
        menuToggle.setAttribute('aria-label', 'Открыть меню');
    }

    menuToggle.addEventListener('click', toggleMenu);

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    navPanel.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
});


/* ============================================================
   4) АВТО-ГОД В ПОДВАЛЕ
   ============================================================ */
waitForElement('year', function (yearEl) {
    yearEl.textContent = new Date().getFullYear();
});


/* ============================================================
   5) БЕЙДЖИ С ТУЛТИПАМИ (клик на мобильном)
   ============================================================ */
(function () {
    function initBadges() {
        var badges = document.querySelectorAll('.badge:not(.badge-placeholder)');
        if (!badges.length) return false;

        badges.forEach(function (badge) {
            badge.addEventListener('click', function (e) {
                e.stopPropagation();

                badges.forEach(function (b) {
                    if (b !== badge) b.classList.remove('active');
                });

                badge.classList.toggle('active');
            });
        });

        document.addEventListener('click', function () {
            badges.forEach(function (b) {
                b.classList.remove('active');
            });
        });

        return true;
    }

    if (!initBadges()) {
        var observer = new MutationObserver(function (mutations, obs) {
            if (initBadges()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();


/* ============================================================
   6) ПРЕВЬЮ АВАТАРКИ НА ТАЧ-УСТРОЙСТВАХ
   Тап по аватарке — открывает превью.
   Тап в любом другом месте — закрывает.
   На десктопе работает :hover (CSS), здесь только мобильные.
   ============================================================ */
(function () {
    function initAvatarPreview() {
        var wrap = document.querySelector('.avatar-wrap');
        if (!wrap) return false;

        wrap.addEventListener('click', function (e) {
            /* Только для тач-устройств (где нет hover) */
            if (!window.matchMedia('(hover: none)').matches) return;

            e.stopPropagation();
            wrap.classList.toggle('open');
        });

        /* Тап в любом другом месте — закрыть */
        document.addEventListener('click', function () {
            wrap.classList.remove('open');
        });

        return true;
    }

    if (!initAvatarPreview()) {
        var observer = new MutationObserver(function (mutations, obs) {
            if (initAvatarPreview()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
