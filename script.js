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

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function setupLogoFlipAnimation() {
  if (prefersReducedMotion) {
    return;
  }

  const logoWords = document.querySelectorAll(".logo-word");
  if (!logoWords.length) {
    return;
  }

  const flipDurationMs = 1100;
  const flipStepMs = 220;
  const initialDelayMs = 1800;
  const minRepeatMs = 7000;
  const maxRepeatMs = 11000;

  // Hand-picked palette — orange anchor, then deep indigo, hot magenta,
  // coral, and deep violet, with a return to the cell default (black/cream)
  // before looping. Order chosen so adjacent chips have clearly distinct
  // hues when flipping.
  const palette = [
    { bg: "#EF5F00", fg: "#FFF7ED", glow: "239,95,0" },     // orange
    { bg: "#2E3C7D", fg: "#F0F4FF", glow: "46,60,125" },    // indigo
    { bg: "#EB2188", fg: "#FFF0F5", glow: "235,33,136" },   // magenta
    { bg: "#F96066", fg: "#FFF7ED", glow: "249,96,102" },   // coral
    { bg: "#3B195A", fg: "#F5F2FF", glow: "59,25,90" },     // deep violet
    {                                                        // back to cell default
      bg: "var(--logo-cell-bg)",
      fg: "var(--logo-cell-fg)",
      glow: "var(--logo-cell-glow)",
    },
  ];
  let paletteIdx = 0;

  const randomRepeatDelay = () =>
    Math.floor(Math.random() * (maxRepeatMs - minRepeatMs + 1)) + minRepeatMs;

  const triggerFlip = (word, cells) => {
    if (word.classList.contains("is-flipping")) {
      return;
    }

    const wasFlipped = word.classList.contains("is-flipped");
    // Paint the incoming (currently hidden) face with the next palette color.
    // This way every flip reveals a fresh color instead of returning to black.
    const incomingSide = wasFlipped ? "front" : "back";
    const color = palette[paletteIdx];
    word.style.setProperty(`--logo-${incomingSide}-bg`, color.bg);
    word.style.setProperty(`--logo-${incomingSide}-fg`, color.fg);
    word.style.setProperty(`--logo-${incomingSide}-glow`, color.glow);
    paletteIdx = (paletteIdx + 1) % palette.length;

    word.classList.add("is-flipping");
    word.classList.add(wasFlipped ? "to-front" : "to-back");

    const totalDuration = flipDurationMs + (cells.length - 1) * flipStepMs;
    setTimeout(() => {
      word.classList.toggle("is-flipped");
      word.classList.remove("is-flipping", "to-front", "to-back");
    }, totalDuration);
  };

  const scheduleLoop = (word, cells) => {
    const delay = randomRepeatDelay();
    setTimeout(() => {
      if (!document.hidden) {
        triggerFlip(word, cells);
      }
      scheduleLoop(word, cells);
    }, delay);
  };

  logoWords.forEach((word) => {
    const cells = word.querySelectorAll(".logo-cell");
    cells.forEach((cell, index) => {
      const letter = cell.textContent.trim();
      cell.textContent = "";
      cell.style.setProperty("--flip-delay", `${index * flipStepMs}ms`);

      const flipper = document.createElement("span");
      flipper.className = "logo-flipper";

      const front = document.createElement("span");
      front.className = "logo-face logo-front";
      front.textContent = letter;

      const back = document.createElement("span");
      back.className = "logo-face logo-back";
      back.textContent = letter;

      flipper.appendChild(front);
      flipper.appendChild(back);
      cell.appendChild(flipper);
    });

    setTimeout(() => {
      triggerFlip(word, cells);
      scheduleLoop(word, cells);
    }, initialDelayMs);
  });
}

setupLogoFlipAnimation();
