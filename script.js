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

// ---- HERO COMPUTER (transparent video + Safari image fallback) ----
(function () {
  const media = document.querySelector(".hero-media");
  if (!media) return;
  const video = media.querySelector(".hero-video");
  const fallback = media.querySelector(".hero-media-fallback");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Safari can't decode VP9-with-alpha and paints a black box, so never let it
  // try. Show the image instead (animated transparent WebP, unless reduced motion).
  const canWebm = !!(video && video.canPlayType &&
    video.canPlayType('video/webm; codecs="vp9"'));

  if (!canWebm) {
    if (fallback && !reduce.matches && fallback.dataset.anim) {
      fallback.src = fallback.dataset.anim;
    }
    media.classList.add("is-static");
    return;
  }

  if (reduce.matches) return;
  const kick = () => { const p = video.play(); if (p && p.catch) p.catch(function () {}); };
  kick();
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) kick();
  });
})();
