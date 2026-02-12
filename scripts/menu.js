const sidebar = document.getElementById("sidebar");
const mainWrap = document.getElementById("mainWrap");

const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
const sidebarToggleIcon = document.getElementById("sidebarToggleIcon");

const logoCollapsed = document.getElementById("logoCollapsed");
const logoExpanded = document.getElementById("logoExpanded");

const mobileHamburger = document.getElementById("mobileHamburger");
const mobileCloseBtn = document.getElementById("mobileCloseBtn");
const mobileBackdrop = document.getElementById("mobileBackdrop");

// widths
const COLLAPSED_W = 86;
const EXPANDED_W = 260;

let isExpanded = false;

function setMainOffset(widthPx) {
  if (!mainWrap) return;

  // Desktop only: push content right (no overlap)
  if (window.innerWidth >= 768) {
    mainWrap.style.marginLeft = `${widthPx}px`;
  } else {
    // Mobile: content full width (sidebar overlays)
    mainWrap.style.marginLeft = `0px`;
  }
}

function applyDesktopState(expanded) {
  isExpanded = expanded;

  const w = expanded ? EXPANDED_W : COLLAPSED_W;

  // sidebar width
  sidebar.style.width = `${w}px`;
  sidebar.dataset.state = expanded ? "expanded" : "collapsed";

  // IMPORTANT: move main content (desktop only)
  setMainOffset(w);

  // swap logos
  if (logoExpanded) logoExpanded.classList.toggle("hidden", !expanded);
  if (logoCollapsed) logoCollapsed.classList.toggle("hidden", expanded);

  // REMOVE BLINKING:
  // Do NOT toggle "hidden" for labels anymore. Let CSS handle with opacity/transform.
  // document.querySelectorAll(".sidebar-expanded-only").forEach((el) => {
  //   el.classList.toggle("hidden", !expanded);
  // });

  // icon change
  if (sidebarToggleIcon) {
    sidebarToggleIcon.classList.toggle("ph-caret-right", !expanded);
    sidebarToggleIcon.classList.toggle("ph-caret-left", expanded);
  }
}

// Init (desktop collapsed)
applyDesktopState(false);

// Desktop chevron toggle
if (sidebarToggleBtn) {
  sidebarToggleBtn.addEventListener("click", () => {
    applyDesktopState(!isExpanded);
  });
}

/* ---------------- Mobile offcanvas (ONE MENU TYPE) ---------------- */
function openMobileSidebar() {
  // Always expanded on mobile
  applyDesktopState(true);

  sidebar.classList.remove("-translate-x-full");
  sidebar.classList.add("translate-x-0");

  if (mobileBackdrop) {
    mobileBackdrop.classList.remove("opacity-0", "pointer-events-none");
  }
  document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
  sidebar.classList.add("-translate-x-full");
  sidebar.classList.remove("translate-x-0");

  if (mobileBackdrop) {
    mobileBackdrop.classList.add("opacity-0", "pointer-events-none");
  }
  document.body.style.overflow = "";
}

if (mobileHamburger)
  mobileHamburger.addEventListener("click", openMobileSidebar);
if (mobileCloseBtn)
  mobileCloseBtn.addEventListener("click", closeMobileSidebar);

// If you want ONLY user close button, comment this line:
// if (mobileBackdrop) mobileBackdrop.addEventListener("click", closeMobileSidebar);
if (mobileBackdrop)
  mobileBackdrop.addEventListener("click", closeMobileSidebar);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileSidebar();
});

/* ---------------- AUTO ACTIVE LINK BY URL ---------------- */
function setActiveLinkByURL() {
  const links = document.querySelectorAll("[data-nav-link]");
  if (!links.length) return;

  // current file name (no query/hash)
  const currentFile = (
    window.location.pathname.split("/").pop() || "index.html"
  )
    .split("?")[0]
    .split("#")[0];

  links.forEach((link) => {
    link.classList.remove("is-active");

    const rawHref = (link.getAttribute("href") || "").trim();
    if (!rawHref || rawHref === "#") return;

    // Convert href into a URL so /random.html and random.html both work
    const linkUrl = new URL(rawHref, window.location.href);

    // Extract filename from the href
    const hrefFile = (linkUrl.pathname.split("/").pop() || "")
      .split("?")[0]
      .split("#")[0];

    // Match index page too (/, /index.html, index.html)
    const isIndexMatch =
      currentFile === "index.html" &&
      (hrefFile === "" || hrefFile === "index.html");

    if (isIndexMatch || hrefFile === currentFile) {
      link.classList.add("is-active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveLinkByURL();
  // Ensure correct offset on first load
  setMainOffset(isExpanded ? EXPANDED_W : COLLAPSED_W);
});

/* ---------------- Resize handling ---------------- */
window.addEventListener("resize", () => {
  // Always keep main offset correct after resize
  setMainOffset(isExpanded ? EXPANDED_W : COLLAPSED_W);

  if (window.innerWidth >= 768) {
    // Desktop: remove mobile overlay state, but DO NOT collapse the sidebar
    if (mobileBackdrop)
      mobileBackdrop.classList.add("opacity-0", "pointer-events-none");
    sidebar.classList.remove("translate-x-0");
    document.body.style.overflow = "";
  }
});
