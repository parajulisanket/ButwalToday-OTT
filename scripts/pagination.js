(() => {
  // --------- CSS  ---------
  const css = `
    .bt-pager {
      display: flex;
      gap: 14px;
      align-items: center;
      justify-content: center;
      user-select: none;
      margin-top: 50px;
    }

    .bt-pager__btn {
      height: 50px;
      min-width: 50px;
      padding: 0 18px;
      border-radius: 6px;
      border: 1px solid rgba(0,0,0,.18);
      background: #F8F3F3;
      color: rgba(0,0,0,.65);
      font-weight: 500;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: filter .15s ease, transform .1s ease;
    }

    .bt-pager__btn:hover { filter: brightness(.98); }
    .bt-pager__btn:active { transform: translateY(1px); }

    .bt-pager__btn[disabled] {
      opacity: .45;
      cursor: not-allowed;
    }

    .bt-pager__btn.is-active {
      background: #1C7CE5;
      border-color: #1C7CE5;
      color: #fff;
    }

    .bt-pager__btn.is-icon {
      font-size: 18px;
      font-weight: 900;
    }

    /* items show/hide */
    [data-page-item] { display: none; }
    [data-page-item].is-visible { display: block; }
  `;

  const style = document.createElement("style");
  style.setAttribute("data-bt-pagination", "1");
  style.textContent = css;
  document.head.appendChild(style);

  // --------- Helpers ---------
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function paginateContainer(container) {
    const perPage = parseInt(container.dataset.perPage || "8", 10);
    const controlsId = container.dataset.controlsId;
    const mount =
      (controlsId && document.getElementById(controlsId)) ||
      (() => {
        const d = document.createElement("div");
        d.className = "mt-8";
        container.insertAdjacentElement("afterend", d);
        return d;
      })();

    const items = Array.from(container.querySelectorAll("[data-page-item]"));
    if (!items.length) return;

    let currentPage = 1;
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));

    function renderItems(page) {
      const p = clamp(page, 1, totalPages);
      currentPage = p;

      const start = (p - 1) * perPage;
      const end = start + perPage;

      items.forEach((el, idx) => {
        if (idx >= start && idx < end) el.classList.add("is-visible");
        else el.classList.remove("is-visible");
      });
    }

    function makeBtn(label, opts = {}) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bt-pager__btn";
      b.textContent = label;
      b.innerHTML = label;

      if (opts.icon) b.classList.add("is-icon");
      if (opts.active) b.classList.add("is-active");
      if (opts.disabled) b.disabled = true;

      if (typeof opts.onClick === "function") {
        b.addEventListener("click", opts.onClick);
      }
      return b;
    }

    function goTo(page) {
      renderItems(page);
      renderPager();

      // Smooth scroll back to list (optional)
      const top = container.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: Math.max(0, top - 120), behavior: "smooth" });
    }

    function renderPager() {
      mount.innerHTML = "";
      const pager = document.createElement("div");
      pager.className = "bt-pager";

      if (currentPage > 1) {
        const prev = makeBtn('<i class="fa-solid fa-chevron-left"></i>', {
          icon: true,
          onClick: () => goTo(currentPage - 1),
        });
        pager.appendChild(prev);
      }

      for (let p = 1; p <= totalPages; p++) {
        const btn = makeBtn(String(p), {
          active: p === currentPage,
          onClick: () => goTo(p),
        });
        pager.appendChild(btn);
      }

      const next = makeBtn('<i class="fa-solid fa-chevron-right"></i>', {
        icon: true,
        disabled: currentPage === totalPages,
        onClick: () => goTo(currentPage + 1),
      });
      pager.appendChild(next);

      mount.appendChild(pager);
    }

    // Init
    renderItems(1);
    renderPager();
  }

  function init() {
    document.querySelectorAll("[data-paginate]").forEach(paginateContainer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
