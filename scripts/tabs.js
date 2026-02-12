(function () {
  // Tabs
  const tabsWrap = document.querySelector("[data-tabs]");
  if (tabsWrap) {
    const tabButtons = Array.from(tabsWrap.querySelectorAll("[data-tab]"));
    const panels = Array.from(document.querySelectorAll("[data-panel]"));

    function activateTab(tabName) {
      tabButtons.forEach((btn) => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach((p) => {
        const match = p.getAttribute("data-panel") === tabName;
        p.classList.toggle("hidden", !match);
      });
    }

    tabsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (!btn) return;
      activateTab(btn.dataset.tab);
    });

    const preselected = tabButtons.find(
      (b) => b.getAttribute("aria-selected") === "true",
    );
    activateTab(preselected?.dataset.tab || "playlists");
  }

 
  // Reuse your existing video modal
  const modal = document.getElementById("videoModal");
  const overlay = document.getElementById("modalOverlay");
  const closeBtn = document.getElementById("modalClose");
  const iframe = document.getElementById("modalIframe");

  if (!modal || !overlay || !closeBtn || !iframe) return;

  function openVideo(embedUrl) {
    // Use your same params style
    const src =
      embedUrl +
      (embedUrl.includes("?") ? "&" : "?") +
      "autoplay=1&mute=0&rel=0&modestbranding=1";

    iframe.src = src;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  }

  function closeVideo() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    iframe.src = ""; // stop video
    document.body.classList.remove("overflow-hidden");
  }

  // Open video from ANY button with data-video-trigger (site-wide)
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-video-trigger]");
    if (!trigger) return;

    const embedUrl = trigger.getAttribute("data-video");
    if (!embedUrl) return;

    openVideo(embedUrl);
  });

  // Close handlers
  overlay.addEventListener("click", closeVideo);
  closeBtn.addEventListener("click", closeVideo);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeVideo();
  });
})();
