const SITE_LANG_KEY = "site.lang";
const SUPPORTED_LANGS = ["ja", "en"];
const dictCache = {};
let activeLang = "ja";

function flattenDict(source, prefix = "", out = {}) {
  Object.keys(source || {}).forEach((key) => {
    const value = source[key];
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenDict(value, next, out);
    } else {
      out[next] = String(value);
    }
  });
  return out;
}

async function loadDict(lang) {
  if (dictCache[lang]) {
    return dictCache[lang];
  }

  try {
    const response = await fetch(`assets/i18n/${lang}.json`, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Failed to load dict: ${lang}`);
    }
    const json = await response.json();
    dictCache[lang] = flattenDict(json);
    return dictCache[lang];
  } catch (error) {
    if (lang !== "ja") {
      console.warn(error);
      return loadDict("ja");
    }
    console.warn(error);
    return {};
  }
}

function resolveLang() {
  const saved = localStorage.getItem(SITE_LANG_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved)) {
    return saved;
  }

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("ja")) {
    return "ja";
  }
  if (nav.startsWith("en")) {
    return "en";
  }
  return "ja";
}

function setLangButtons(lang) {
  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });
}

function applyDict(langDict, jaDict) {
  const nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (!key) {
      return;
    }
    const translated = langDict[key] ?? jaDict[key];
    if (translated !== undefined) {
      node.textContent = translated;
    }
  });

  const attrNodes = document.querySelectorAll("[data-i18n-attr]");
  attrNodes.forEach((node) => {
    const config = node.getAttribute("data-i18n-attr");
    if (!config || !config.includes(":")) {
      return;
    }
    const [attrName, key] = config.split(":");
    const translated = langDict[key] ?? jaDict[key];
    if (translated !== undefined) {
      node.setAttribute(attrName, translated);
    }
  });
}

async function applyLanguage(lang) {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : "ja";
  const [langDict, jaDict] = await Promise.all([loadDict(safeLang), loadDict("ja")]);

  applyDict(langDict, jaDict);
  activeLang = safeLang;
  document.documentElement.lang = safeLang;
  localStorage.setItem(SITE_LANG_KEY, safeLang);
  setLangButtons(safeLang);
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (!target.classList.contains("lang-btn")) {
    return;
  }
  const lang = target.dataset.lang || "ja";
  if (lang !== activeLang) {
    applyLanguage(lang);
  }
});

document.addEventListener("layout:ready", () => {
  const initialLang = resolveLang();
  applyLanguage(initialLang);
});
