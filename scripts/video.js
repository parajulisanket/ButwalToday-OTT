(() => {
  const videoModal = document.getElementById("videoModal");
  const modalClose = document.getElementById("modalClose");
  const modalIframe = document.getElementById("modalIframe");

  if (!videoModal || !modalIframe) return;

  function openModal(url) {
    videoModal.classList.remove("hidden");
    // This is the ONLY "lock" you need. Simple and clean.
    document.body.style.overflow = "hidden";

    // Set YouTube URL with autoplay
    modalIframe.src = url.includes("?")
      ? `${url}&autoplay=1`
      : `${url}?autoplay=1`;
  }

  function closeModal() {
    videoModal.classList.add("hidden");
    // Restore scrolling
    document.body.style.overflow = "auto";
    // Stop the video
    modalIframe.src = "";
  }

  // Listen for click on anything with data-video attribute
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-video]");
    if (trigger) {
      e.preventDefault();
      openModal(trigger.getAttribute("data-video"));
    }
  });

  // Close triggers
  if (modalClose) modalClose.addEventListener("click", closeModal);

  // Close on background click
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) closeModal();
  });

  // Close on Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
