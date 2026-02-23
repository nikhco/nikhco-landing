const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => observer.observe(item));

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
  const initialDelayMs = 2400;
  const minRepeatMs = 20000;
  const maxRepeatMs = 30000;

  const randomRepeatDelay = () =>
    Math.floor(Math.random() * (maxRepeatMs - minRepeatMs + 1)) + minRepeatMs;

  const triggerFlip = (word, cells) => {
    if (word.classList.contains("is-flipping")) {
      return;
    }

    word.classList.add("is-flipping");
    const totalDuration = flipDurationMs + (cells.length - 1) * flipStepMs;
    setTimeout(() => {
      word.classList.remove("is-flipping");
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
