// MULTIMEDIA SECTION
(function initMultimediaSection() {
  const playlist = document.getElementById("mmPlaylist");
  const iframe = document.getElementById("mmMainIframe");
  const titleEl = document.getElementById("mmMainTitle");

  if (!playlist || !iframe || !titleEl) return;

  function setActive(btn) {
    playlist.querySelectorAll(".mm-item").forEach((b) => {
      b.classList.remove("bg-white/5");
      b.setAttribute("aria-current", "false");
    });
    btn.classList.add("bg-white/5");
    btn.setAttribute("aria-current", "true");
  }

  function buildSrc(videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  playlist.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-mm-video]");
    if (!btn) return;

    const videoId = btn.getAttribute("data-mm-video");
    const t = btn.getAttribute("data-mm-title") || "";

    iframe.src = buildSrc(videoId);
    titleEl.textContent = t;

    setActive(btn);
  });
})();

// --- DARK MODE (Sidebar Toggle) --
(() => {
  const STORAGE_KEY = "bt_theme";
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");

  function applyTheme(mode) {
    const isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);

    if (icon) {
      icon.classList.toggle("ph-moon", !isDark);
      icon.classList.toggle("ph-sun", isDark);
    }

    if (text) {
      text.textContent = isDark ? "Light" : "Dark";
    }
  }

  function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // init
  applyTheme(getTheme());

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isDark = document.documentElement.classList.contains("dark");
      const next = isDark ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }
})();
