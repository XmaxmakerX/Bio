/* ============================================================
   КОМПОНЕНТ ПОДВАЛА <site-footer>
   Автоматически подставляет текущий год.
   Полоса сверху (border-top) — на всю ширину окна,
   внутренний контент — в .footer-inner.
   ============================================================ */

class SiteFooter extends HTMLElement {
    connectedCallback() {
        const year = new Date().getFullYear();

        this.innerHTML = `
            <footer>
                <div class="footer-inner">
                    <p class="footer-copy">
                        &copy; ${year}
                        <span data-ru="Все права защищены"
                              data-en="All rights reserved">Все права защищены</span>
                    </p>
                </div>
            </footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);