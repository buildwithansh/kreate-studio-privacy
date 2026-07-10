/* Kreate Studio — shared site behaviour: theme toggle, nav, TOC, progress, reveal */
(function () {
  "use strict";

  var THEME_KEY = "kreate-theme";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function setTheme(theme, persist) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    if (themeToggle) {
      var isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    if (persist) {
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
    }
  }
  setTheme(currentTheme(), false);
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(currentTheme() === "light" ? "dark" : "light", true);
    });
  }

  /* ---------- Mobile site nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  function closeNav() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function toggleNav() {
    if (!siteNav || !navToggle) return;
    var open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", toggleNav);
    siteNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 940) closeNav();
    });
  }

  /* ---------- Reading progress ---------- */
  var bar = document.getElementById("progressBar");
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || document.body.scrollTop) / max * 100 : 0;
    if (bar) bar.style.width = pct + "%";
    var toTop = document.getElementById("toTop");
    if (toTop) toTop.classList.toggle("show", (h.scrollTop || document.body.scrollTop) > 560);
    var header = document.getElementById("siteHeader");
    if (header) header.classList.toggle("is-scrolled", (h.scrollTop || document.body.scrollTop) > 4);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---------- Back to top ---------- */
  var toTopBtn = document.getElementById("toTop");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Table of contents: mobile toggle ---------- */
  var toc = document.getElementById("toc");
  var tocToggle = document.getElementById("tocToggle");
  function isMobileToc() { return window.matchMedia("(max-width:900px)").matches; }
  if (toc && tocToggle) {
    tocToggle.addEventListener("click", function () {
      var open = toc.classList.toggle("open");
      tocToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    toc.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (isMobileToc()) { toc.classList.remove("open"); tocToggle.setAttribute("aria-expanded", "false"); }
      });
    });
  }

  /* ---------- Scrollspy + reveal-on-scroll ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll("nav.toc a"));
  var linkMap = {};
  tocLinks.forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#") linkMap[href.slice(1)] = a;
  });
  var sections = Array.prototype.slice.call(document.querySelectorAll("main.doc-content section[id]"));

  if ("IntersectionObserver" in window) {
    if (sections.length && tocLinks.length) {
      var active = null;
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var link = linkMap[entry.target.id];
            if (link) {
              if (active) active.classList.remove("active");
              active = link;
              active.classList.add("active");
            }
          }
        });
      }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
      sections.forEach(function (s) { spy.observe(s); });
    }

    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    sections.forEach(function (s) { reveal.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add("in"); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
