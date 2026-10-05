/* ============================================================
   ВНИМАНИЕ:
   Установка темы при загрузке страницы теперь делается
   инлайн-скриптом в <head> каждого HTML-файла.
   Это нужно, чтобы тема применилась ДО отрисовки страницы
   и не было мигания светлой темы.
   Здесь остаётся только логика переключения и год в подвале.
   ============================================================ */

(function () {

    /* ------------------------------------------------------------
       1) ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
       ------------------------------------------------------------ */
    var toggle = document.getElementById('theme-toggle');

    if (toggle) {
        toggle.addEventListener('click', function () {
            // Текущая тема
            var current = document.documentElement.getAttribute('data-theme');
            // Куда переключаемся
            var next = current === 'dark' ? 'light' : 'dark';

            // Меняем атрибут на <html>
            document.documentElement.setAttribute('data-theme', next);

            // Запоминаем выбор
            localStorage.setItem('theme', next);
        });
    }

    /* ------------------------------------------------------------
       2) АВТО-ГОД В ПОДВАЛЕ
       ------------------------------------------------------------ */
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

})();