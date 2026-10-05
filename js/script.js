/* ============================================================
   1) ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
   ============================================================ */
(function () {
    var themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
})();


/* ============================================================
   2) БУРГЕР + ПАНЕЛЬ
   ============================================================ */
(function () {
    var menuToggle = document.getElementById('menu-toggle');
    var navPanel   = document.getElementById('nav-panel');
    var overlay    = document.getElementById('overlay');

    if (!menuToggle || !navPanel) return;

    function toggleMenu() {
        var isOpen = navPanel.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        if (overlay) overlay.classList.toggle('open', isOpen);

        document.body.style.overflow = isOpen ? 'hidden' : '';
        menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    }

    function closeMenu() {
        navPanel.classList.remove('open');
        menuToggle.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-label', 'Открыть меню');
    }

    menuToggle.addEventListener('click', toggleMenu);

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    navPanel.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });
})();


/* ============================================================
   3) АВТО-ГОД В ПОДВАЛЕ
   ============================================================ */
(function () {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
