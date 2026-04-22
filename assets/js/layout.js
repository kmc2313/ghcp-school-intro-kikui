const navItems = [
  { href: "index.html", key: "nav.home" },
  { href: "about.html", key: "nav.about" },
  { href: "access.html", key: "nav.access" },
  { href: "admissions.html", key: "nav.admissions" },
  { href: "gallery.html", key: "nav.gallery" },
  { href: "voices.html", key: "nav.voices" },
  { href: "faq.html", key: "nav.faq" }
];

function currentPageName() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page || "index.html";
}

function renderHeader(current) {
  const links = navItems
    .map((item) => {
      const active = item.href === current;
      const className = active ? "is-active" : "";
      const currentAttr = active ? ' aria-current="page"' : "";
      return `<a class="${className}" href="${item.href}" data-i18n="${item.key}"${currentAttr}></a>`;
    })
    .join("");

  return `
    <header class="site-header" id="header-shell">
      <div class="container site-header-inner">
        <a class="logo" href="index.html" aria-label="Home">
          <span class="logo-mark" aria-hidden="true"></span>
          <span data-i18n="site.name"></span>
        </a>
        <button id="nav-toggle" class="nav-toggle" aria-expanded="false" aria-controls="site-nav">MENU</button>
        <nav id="site-nav" class="site-nav" aria-label="Main Navigation">
          ${links}
        </nav>
        <div class="lang-switch" aria-label="Language switcher">
          <button type="button" class="lang-btn" data-lang="ja" aria-pressed="false">JA</button>
          <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>
        </div>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container site-footer-inner">
        <p data-i18n="footer.disclaimer"></p>
        <p>
          <a href="https://kamiyama.ac.jp/" target="_blank" rel="noopener noreferrer" data-i18n="footer.officialLink"></a>
          / <a href="mailto:info@kamiyama.ac.jp" data-i18n="footer.mailto"></a>
        </p>
      </div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = currentPageName();
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");

  if (headerMount) {
    headerMount.innerHTML = renderHeader(page);
  }

  if (footerMount) {
    footerMount.innerHTML = renderFooter();
  }

  document.dispatchEvent(new CustomEvent("layout:ready"));
});
