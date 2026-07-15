// ---- THEME TOGGLE ----
(function () {
  const html = document.documentElement;

  function getStoredTheme() {
    try { return localStorage.getItem("nikhco-theme"); } catch (e) { return null; }
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    html.dataset.theme = theme;
  }

  // Apply before first paint to avoid flash
  applyTheme(getStoredTheme() || getSystemTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const next = (html.dataset.theme || getSystemTheme()) === "dark" ? "light" : "dark";
      try { localStorage.setItem("nikhco-theme", next); } catch (e) {}
      applyTheme(next);
    });
  });

  // Follow system changes only when no manual override
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
  });
})();

// ---- STICKY HEADER STATE ----
(function () {
  const header = document.querySelector(".top");
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 4) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ---- HERO VIDEO AUTOPLAY (nudge browsers that don't honor autoplay) ----
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;
  const video = document.querySelector(".hero-video");
  if (!video) return;
  const kick = () => { const p = video.play(); if (p && p.catch) p.catch(function () {}); };
  kick();
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) kick();
  });
})();
