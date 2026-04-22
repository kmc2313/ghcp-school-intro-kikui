function setupMobileNav() {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  if (!nav || !toggle) {
    return;
  }

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement && window.innerWidth < 720) {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 720) {
      closeNav();
    }
  });
}

function setupHeaderShadow() {
  const shell = document.getElementById("header-shell");
  if (!shell) {
    return;
  }

  const refresh = () => {
    shell.classList.toggle("is-scrolled", window.scrollY > 4);
  };

  refresh();
  window.addEventListener("scroll", refresh, { passive: true });
}

document.addEventListener("layout:ready", () => {
  setupMobileNav();
  setupHeaderShadow();
});
