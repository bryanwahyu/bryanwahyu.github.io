(function () {
    var nav = document.getElementById("mainNav");
    var toggle = nav.querySelector(".nav-toggle");
    var links = document.getElementById("navLinks");

    function shrinkNav() {
        nav.classList.toggle("is-shrunk", window.scrollY > 0);
    }
    shrinkNav();
    document.addEventListener("scroll", shrinkNav, { passive: true });

    function setMenu(open) {
        links.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
    }
    toggle.addEventListener("click", function () {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (e) {
        if (e.target.closest("a")) setMenu(false);
    });

    // Highlight the nav link of the section in view
    var navLinks = links.querySelectorAll("a");
    var sections = Array.prototype.map.call(navLinks, function (a) {
        return document.querySelector(a.getAttribute("href"));
    });
    if ("IntersectionObserver" in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) {
                    a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        sections.forEach(function (s) { if (s) spy.observe(s); });
    }

    // Portfolio filter
    var tiles = document.querySelectorAll("#portfolioGrid .tile");
    var filters = document.querySelectorAll(".filter");
    var status = document.getElementById("filterStatus");
    var empty = document.getElementById("gridEmpty");

    function applyFilter(cat) {
        var shown = 0;
        tiles.forEach(function (tile) {
            var match = cat === "all" || tile.dataset.cat === cat;
            tile.hidden = !match;
            if (match) shown++;
        });
        filters.forEach(function (btn) {
            btn.setAttribute("aria-pressed", String(btn.dataset.filter === cat));
        });
        status.textContent = shown + (shown === 1 ? " project" : " projects");
        empty.hidden = shown > 0;
    }
    document.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (btn) applyFilter(btn.dataset.filter);
    });
    applyFilter("all");

    // Project modal
    var modal = document.getElementById("projectModal");
    var title = document.getElementById("modalTitle");
    var body = document.getElementById("modalBody");
    var opener = null;

    document.getElementById("portfolioGrid").addEventListener("click", function (e) {
        var btn = e.target.closest(".tile-btn");
        if (!btn) return;
        opener = btn;
        title.textContent = btn.querySelector(".tile-name").textContent;
        body.replaceChildren(btn.parentElement.querySelector("template").content.cloneNode(true));
        modal.showModal();
    });
    modal.querySelectorAll(".modal-close, .modal-close-btn").forEach(function (btn) {
        btn.addEventListener("click", function () { modal.close(); });
    });
    // Close on backdrop click; clicks on the dialog's own padding also target the dialog, so check bounds
    modal.addEventListener("click", function (e) {
        if (e.target !== modal) return;
        var r = modal.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
    });
    modal.addEventListener("close", function () {
        if (opener) opener.focus();
    });

    document.getElementById("year").textContent = new Date().getFullYear();
})();
