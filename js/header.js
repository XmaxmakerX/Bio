/* ============================================================
   КОМПОНЕНТ ШАПКИ <site-header>
   ============================================================ */

const ICONS = {

    sun: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2"  x2="12" y2="4"  />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2"  y1="12" x2="4"  y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
        </svg>
    `,

    moon: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    `,

    home: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
        </svg>
    `,

    folder: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        </svg>
    `,

    mail: `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    `
};


class SiteHeader extends HTMLElement {
    connectedCallback() {
        const active = this.getAttribute('active') || '';
        const isSimple = this.hasAttribute('simple');

        const menuItem = (href, key, icon, ru, en) => {
            const activeAttr = active === key
                ? ' class="active" aria-current="page"'
                : '';
            return `
                <li>
                    <a href="${href}"${activeAttr}>
                        <span class="nav-icon">${ICONS[icon]}</span>
                        <span data-ru="${ru}" data-en="${en}">${ru}</span>
                    </a>
                </li>
            `;
        };

        const panelHtml = isSimple ? '' : `
            <div id="nav-panel" class="nav-panel">
                <ul class="nav-links">
                    ${menuItem('pages/index.html',    'home',     'home',   'Главная',  'Home')}
                    ${menuItem('pages/projects.html', 'projects', 'folder', 'Проекты',  'Projects')}
                    ${menuItem('pages/contacts.html', 'contacts', 'mail',   'Контакты', 'Contacts')}
                </ul>
            </div>
        `;

        /* Порядок кнопок: бургер · язык · тема */
        const burgerHtml = isSimple ? '' : `
            <button id="menu-toggle" class="menu-toggle" aria-label="Открыть меню">
                <span class="burger-line"></span>
                <span class="burger-line"></span>
            </button>
        `;

        this.innerHTML = `
            <header>
                <nav>
                    ${panelHtml}
                    <div class="nav-actions">
                        ${burgerHtml}
                        <button id="lang-toggle" class="lang-toggle" aria-label="Switch language">EN</button>
                        <button id="theme-toggle" class="theme-toggle" aria-label="Переключить тему">
                            <span class="icon icon-sun">${ICONS.sun}</span>
                            <span class="icon icon-moon">${ICONS.moon}</span>
                        </button>
                    </div>
                </nav>
                <div id="overlay" class="overlay"></div>
            </header>
        `;
    }
}

customElements.define('site-header', SiteHeader);
