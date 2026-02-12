// reels.js
(() => {
  // --------- CAROUSEL SCROLL ----------
  document.querySelectorAll(".carousel-track").forEach((track) => {
    const wrapper = track.closest(".relative");
    const btnPrev = wrapper?.querySelector(".carousel-prev");
    const btnNext = wrapper?.querySelector(".carousel-next");

    const scrollByAmount = () => Math.round(track.clientWidth * 0.9);

    btnPrev?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      track.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
    });

    btnNext?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      track.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
    });
  });

  // --------- REELS MODAL ----------
  const modal = document.getElementById("reelsModal");
  const frame = document.getElementById("reelsFrame");
  const btnPrev = document.getElementById("reelsPrev");
  const btnNext = document.getElementById("reelsNext");

  if (!modal || !frame) return;

  // ONLY reels triggers (must have data-video-id)
  // Also EXCLUDE the watchNowBtn so clicking it never opens reels.
  const triggers = Array.from(
    document.querySelectorAll("[data-video-trigger][data-video-id]"),
  ).filter((el) => el.id !== "watchNowBtn");

  let currentIndex = -1;

  const youtubeSrc = (videoId) =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const isOpen = () => !modal.classList.contains("hidden");

  function openReelsAt(index) {
    // Close normal video modal if open
    document.dispatchEvent(new CustomEvent("bt:close-video"));

    if (index < 0 || index >= triggers.length) return;
    currentIndex = index;

    const videoId = triggers[index].getAttribute("data-video-id");
    frame.src = youtubeSrc(videoId);

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  }

  function closeReels() {
    if (!isOpen()) return;

    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    frame.src = "";
    currentIndex = -1;
  }

  // Allow video.js to close reels
  document.addEventListener("bt:close-reels", closeReels);

  function nextVideo() {
    if (currentIndex === -1) return;
    openReelsAt((currentIndex + 1) % triggers.length);
  }

  function prevVideo() {
    if (currentIndex === -1) return;
    openReelsAt((currentIndex - 1 + triggers.length) % triggers.length);
  }

  // Open reels on click (stop bubbling so no other click handlers conflict)
  triggers.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openReelsAt(index);
    });
  });

  // Close by backdrop / X
  modal.querySelectorAll("[data-reels-close]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeReels();
    });
  });

  // Prev/Next
  btnNext?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    nextVideo();
  });

  btnPrev?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    prevVideo();
  });

  // Keyboard (only when open)
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;

    if (e.key === "Escape") closeReels();
    if (e.key === "ArrowRight") nextVideo();
    if (e.key === "ArrowLeft") prevVideo();
  });
})();
