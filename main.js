/* CEREBRAL SOCCER — shared behavior */
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
    var wrap = document.querySelector(".film-notes");
    var dotsBox = document.querySelector(".film-dots");
    var prevBtn = document.querySelector(".car-btn.prev");
    var nextBtn = document.querySelector(".car-btn.next");
    var currentIdx = "1";
    var dots = [];

    var setActive = function (idx) {
      currentIdx = idx;
      notes.forEach(function (n) {
        n.setAttribute("aria-pressed", n.dataset.anno === idx ? "true" : "false");
        n.classList.toggle("current", n.dataset.anno === idx);
      });
      frame.querySelectorAll(".anno").forEach(function (a) {
        a.classList.toggle("active", a.dataset.anno === idx);
      });
      var current = document.querySelector('.film-note[data-anno="' + idx + '"] .stamp');
      if (clock && current) clock.textContent = current.textContent;
      dots.forEach(function (d, i) {
        d.classList.toggle("active", String(i + 1) === idx);
      });
      if (typeof restartAutoplay === "function") restartAutoplay();
    };

    var scrollToNote = function (i) {
      var card = notes[i];
      if (!card || !wrap) return;
      var wr = wrap.getBoundingClientRect();
      var cr = card.getBoundingClientRect();
      var target = wrap.scrollLeft + (cr.left - wr.left) - (wr.width - cr.width) / 2;
      wrap.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
      setActive(String(i + 1));
    };

    // carousel dots (visible on mobile only, via CSS)
    if (dotsBox) {
      notes.forEach(function (n, i) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "film-dot";
        d.setAttribute("aria-label", "Show note " + (i + 1) + " of " + notes.length);
        d.addEventListener("click", function () { scrollToNote(i); });
        dotsBox.appendChild(d);
        dots.push(d);
      });
    }
    if (prevBtn) prevBtn.addEventListener("click", function () {
      scrollToNote(Math.max(0, parseInt(currentIdx, 10) - 2));
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      scrollToNote(Math.min(notes.length - 1, parseInt(currentIdx, 10)));
    });

    // swipe sync: highlight whichever card is centered
    if (wrap) {
      var ticking = false;
      wrap.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          if (wrap.scrollWidth <= wrap.clientWidth + 4) return; // not a carousel (desktop)
          var wr = wrap.getBoundingClientRect();
          var center = wr.left + wr.width / 2;
          var best = 0, bd = Infinity;
          notes.forEach(function (n, i) {
            var r = n.getBoundingClientRect();
            var d = Math.abs(r.left + r.width / 2 - center);
            if (d < bd) { bd = d; best = i; }
          });
          var idx = String(best + 1);
          if (idx !== currentIdx) setActive(idx);
        });
      }, { passive: true });
    }

    notes.forEach(function (n) {
      n.addEventListener("click", function () { setActive(n.dataset.anno); });
    });

    /* autoplay: advance every 10s, loop, pause when off-screen or tab hidden.
       Any manual change (click, arrow, dot, swipe) resets the timer via setActive. */
    var AUTOPLAY_MS = 10000;
    var autoTimer = null;
    var sectionVisible = true;
    var sampleSection = document.getElementById("sample") || frame;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        sectionVisible = entries[0].isIntersecting;
      }, { threshold: 0.15 }).observe(sampleSection);
    }
    var restartAutoplay = function () {
      if (reduced) return;
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        if (!sectionVisible || document.hidden) return;
        var next = parseInt(currentIdx, 10) % notes.length; // 1-based idx -> next 0-based, wraps 4 -> 0
        scrollToNote(next);
      }, AUTOPLAY_MS);
    };

    setActive("1");
  }

  /* ---------- forms ---------- */
  var PLACEHOLDER = "YOUR_FORM_ID";
  document.querySelectorAll("form[data-dsl-form]").forEach(function (form) {
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
            "This form isn’t connected yet. Please email me directly — my address is in the footer below.";
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
                "Got it — your message is in. I’ll get back to you within 48 hours.";
              status.className = "form-status ok show";
            }
          } else {
            throw new Error("Request failed");
          }
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "Something went wrong sending the form. Please try again, or email me directly — my address is in the footer.";
            status.className = "form-status err show";
          }
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Send"; }
        });
    });
  });
})();
