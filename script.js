(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");

  if (toggle && navList) {
    var closeMenu = function () {
      navList.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      var clickedInsideNav = navList.contains(e.target) || toggle.contains(e.target);
      if (!clickedInsideNav && navList.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  // Scroll-reveal animations (respects prefers-reduced-motion)
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();

(function () {
  "use strict";

  // Evidence lightbox — opens a larger view of an evidence thumbnail
  var lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lastFocused = null;

  function openLightbox(src, alt, caption) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  document.querySelectorAll(".evidence-thumb").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var img = btn.querySelector("img");
      var full = btn.getAttribute("data-full") || (img ? img.src : "");
      var alt = img ? img.alt : "";
      var caption = btn.getAttribute("data-caption") || alt;
      openLightbox(full, alt, caption);
    });
  });

  lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();
