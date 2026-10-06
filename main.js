(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     SYS.01 — hero pipeline: leaks appear after a beat
     ------------------------------------------------------------ */
  function revealLeaks() {
    var stages = Array.prototype.slice.call(document.querySelectorAll('.stage[data-leak]'));
    if (!stages.length) return;

    var delay = reduceMotion ? 0 : 850;
    var stagger = reduceMotion ? 0 : 400;

    setTimeout(function () {
      stages.forEach(function (el, i) {
        setTimeout(function () { el.classList.add('is-leaking'); }, i * stagger);
      });
      var bar = document.querySelector('.pipeline__bar-item--right');
      if (bar) bar.textContent = 'STATUS: LEAKING';
    }, delay);
  }

  /* ------------------------------------------------------------
     Header: scroll progress + section status
     ------------------------------------------------------------ */
  var progressBar = document.getElementById('progressBar');
  var navStatus = document.getElementById('navStatus');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var sectionIndex = {
    hero: '01', leaks: '02', diagnostic: '03', systems: '04',
    work: '05', about: '06', method: '07', diagnose: '08'
  };
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (progressBar) {
        progressBar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0).toFixed(2) + '%';
      }

      if (navStatus) {
        var probe = window.scrollY + window.innerHeight * 0.4;
        var current = null;
        sections.forEach(function (s) {
          if (s.offsetTop <= probe) current = s;
        });
        if (!current || current.id === 'hero') {
          navStatus.textContent = 'SYSTEM ONLINE';
        } else {
          navStatus.textContent = 'SECTION ' + (sectionIndex[current.id] || '—') + ' / 08';
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------
     Scroll reveal (architecture rows)
     ------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------
     Qualification modal (diagnostic flow)
     ------------------------------------------------------------ */
  var modal = document.getElementById('diagnosticModal');
  var form = document.getElementById('diagForm');
  var done = document.getElementById('diagDone');

  function openModal() {
    if (!modal) return;
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }
  function closeModal() {
    if (!modal) return;
    if (typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-open-diagnostic]'), function (b) {
    b.addEventListener('click', openModal);
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-close-diagnostic]'), function (b) {
    b.addEventListener('click', closeModal);
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.checkValidity()) {
        form.hidden = true;
        if (done) done.hidden = false;
      } else {
        form.reportValidity();
      }
    });
  }

  if (modal && form) {
    modal.addEventListener('close', function () {
      form.hidden = false;
      if (done) done.hidden = true;
      form.reset();
    });
  }

  /* Project details: native dialogs handle Escape and focus return. */
  ['syllabusy', 'smokesignal', 'sherwood'].forEach(function (project) {
    var projectModal = document.getElementById(project + 'Modal');
    if (!projectModal) return;
    document.querySelector('[data-open-' + project + ']').addEventListener('click', function () {
      if (!projectModal.open) projectModal.showModal();
    });
    document.querySelector('[data-close-' + project + ']').addEventListener('click', function () {
      projectModal.close();
    });
  });

  /* ------------------------------------------------------------
     Init
     ------------------------------------------------------------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealLeaks);
  } else {
    revealLeaks();
  }
})();
