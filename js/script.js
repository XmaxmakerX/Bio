/* ============================================================
   СКРИПТ СТРАНИЦЫ
   Обработчики навешиваются после того, как <site-header>
   отрисует свою разметку (иначе кнопок в DOM ещё нет).
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

    /* Если элемента ещё нет — следим за DOM */
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

        /* Меняем текст у всех элементов с data-ru / data-en */
        document.querySelectorAll('[data-ru]').forEach(function (el) {
            var text = el.getAttribute('data-' + lang);
            if (text !== null) el.textContent = text;
        });

        /* Заголовок вкладки */
        var pageTitle = document.documentElement.getAttribute('data-title-' + lang);
        if (pageTitle) document.title = pageTitle;

        /* Кнопка показывает язык, на который переключимся */
        langBtn.textContent = lang === 'ru' ? 'EN' : 'RU';
    }

    /* Применяем сохранённый язык при загрузке */
    var current = localStorage.getItem('lang') || 'ru';
    applyLang(current);

    /* Клик — переключаем, запоминаем, анимация разворота */
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
   3) БУРГЕР + ПАНЕЛЬ (только на мобильных)
   inert ставится ТОЛЬКО когда панель реально скрыта
   (узкий экран). На десктопе панель всегда видна и кликабельна.
   ============================================================ */
waitForElement('menu-toggle', function (menuToggle) {
    var navPanel = document.getElementById('nav-panel');
    var overlay  = document.getElementById('overlay');

    if (!navPanel) return;

    /* Проверяем: мобильный ли сейчас режим */
    function isMobile() {
        return window.matchMedia('(max-width: 640px)').matches;
    }

    /* Обновляем состояние панели в зависимости от ширины экрана */
    function syncPanelState() {
        if (isMobile()) {
            /* На мобильном панель закрыта — ставим aria-hidden и inert */
            if (!navPanel.classList.contains('open')) {
                navPanel.setAttribute('aria-hidden', 'true');
                navPanel.setAttribute('inert', '');
            }
        } else {
            /* На десктопе панель всегда видна — снимаем ограничения */
            navPanel.removeAttribute('aria-hidden');
            navPanel.removeAttribute('inert');
        }
    }

    /* Синхронизация при загрузке и при изменении ширины */
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
    /* Ждём, пока бейджи появятся на странице */
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

    /* Если бейджи есть сразу — вешаем обработчики.
       Если нет — ждём, пока они появятся. */
    if (!initBadges()) {
        var observer = new MutationObserver(function (mutations, obs) {
            if (initBadges()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
