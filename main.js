/* HALFSPACE — shared behavior */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is chosen
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- film room: sync notes with frame annotations ---------- */
  var notes = document.querySelectorAll(".film-note");
  var frame = document.querySelector(".film-frame");
  if (notes.length && frame) {
    var clock = frame.querySelector(".frame-clock");
    var setActive = function (idx) {
      notes.forEach(function (n) {
        n.setAttribute("aria-pressed", n.dataset.anno === idx ? "true" : "false");
      });
      frame.querySelectorAll(".anno").forEach(function (a) {
        a.classList.toggle("active", a.dataset.anno === idx);
      });
      var current = document.querySelector('.film-note[data-anno="' + idx + '"] .stamp');
      if (clock && current) clock.textContent = current.textContent;
    };
    notes.forEach(function (n) {
      n.addEventListener("click", function () { setActive(n.dataset.anno); });
    });
    setActive("1");
  }

  /* ---------- forms ---------- */
  var PLACEHOLDER = "YOUR_FORM_ID";
  document.querySelectorAll("form[data-halfspace-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      // honeypot: silently drop bot submissions
      var hp = form.querySelector('input[name="_gotcha"]');
      if (hp && hp.value) { e.preventDefault(); return; }

      // form not connected to Formspree yet — fail gracefully
      if (form.action.indexOf(PLACEHOLDER) !== -1) {
        e.preventDefault();
        if (status) {
          status.textContent =
            "This form isn’t connected yet. Please email us directly — the address is in the footer below.";
          status.className = "form-status err show";
        }
        return;
      }

      e.preventDefault();
      var data = new FormData(form);
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) {
              status.textContent =
                "Got it — your message is in. You’ll hear back within 48 hours.";
              status.className = "form-status ok show";
            }
          } else {
            throw new Error("Request failed");
          }
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "Something went wrong sending the form. Please try again, or email us directly — the address is in the footer.";
            status.className = "form-status err show";
          }
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send"; }
        });
    });
  });
})();
