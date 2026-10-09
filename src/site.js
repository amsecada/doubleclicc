(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Header: scroll progress + section status
     ------------------------------------------------------------ */
  var progressBar = document.getElementById('progressBar');
  var navStatus = document.getElementById('navStatus');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
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
          navStatus.textContent = 'SECTION ' + String(sections.indexOf(current) + 1).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0');
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

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

  document.querySelectorAll('[data-open-paper]').forEach(function (button) {
    var paper = document.getElementById(button.dataset.openPaper);
    if (!paper) return;
    button.addEventListener('click', function () {
      paper.showModal();
      paper.querySelector('.modal__panel').scrollTop = 0;
      document.body.classList.add('paper-is-open');
    });
    paper.querySelector('[data-close-paper]').addEventListener('click', function () {
      paper.close();
    });
    paper.addEventListener('click', function (event) {
      if (event.target === paper) paper.close();
    });
    paper.addEventListener('close', function () {
      document.body.classList.remove('paper-is-open');
      button.focus({ preventScroll: true });
    });
  });

  // Repeat the client strip once for a seamless loop; keep one accessible list.
  var clientCarousel = document.getElementById('clientCarousel');
  if (clientCarousel) {
    var clientTrack = clientCarousel.querySelector('.client-carousel__track');
    var clientCopy = clientTrack.querySelector('.client-grid').cloneNode(true);
    clientCopy.setAttribute('aria-hidden', 'true');
    clientCopy.removeAttribute('aria-label');
    clientCopy.inert = true;
    clientTrack.appendChild(clientCopy);
    clientCarousel.classList.add('is-ready');
    var clientMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateClientMotion() {
      // Make the static, scrollable strip reachable with the keyboard.
      if (clientMotion.matches) {
        clientCarousel.tabIndex = 0;
        clientCarousel.setAttribute('role', 'region');
        clientCarousel.setAttribute('aria-label', 'Client organizations; scroll to see more');
      } else {
        clientCarousel.removeAttribute('tabindex');
        clientCarousel.removeAttribute('role');
        clientCarousel.removeAttribute('aria-label');
      }
    }
    clientMotion.addEventListener('change', updateClientMotion);
    updateClientMotion();
  }

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.client-card, .protocol__step, .paper-card').forEach(function (surface) {
    surface.classList.add('pointer-surface');
    surface.addEventListener('pointermove', function (event) {
      if (reduceMotion || !finePointer.matches) return;
      var rect = surface.getBoundingClientRect();
      surface.style.setProperty('--pointer-x', (event.clientX - rect.left) + 'px');
      surface.style.setProperty('--pointer-y', (event.clientY - rect.top) + 'px');
    });
  });

})();
