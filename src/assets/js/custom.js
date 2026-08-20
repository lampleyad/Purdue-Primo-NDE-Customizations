// ============================================================================
// Primo NDE custom.js  (Purdue)
// - Place in assets/javascript/custom.js in the NDE customization package
// - Contains only framework-agnostic JS (no AngularJS)
// - Includes:
//    1. Google Analytics 4 (GA4)
//    2. LibAnswers / LibChat combo widget
//    3. Google Tag Manager
// ============================================================================

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Google Analytics 4 (GA4)
  //    Uses existing Measurement ID: G-E4ENXKEG9R
  // --------------------------------------------------------------------------
  (function initGA4() {
    var googleAnalyticsUrl = document.createElement('script');
    googleAnalyticsUrl.src = 'https://www.googletagmanager.com/gtag/js?id=G-E4ENXKEG9R';
    googleAnalyticsUrl.type = 'text/javascript';
    googleAnalyticsUrl.async = true;
    document.head.appendChild(googleAnalyticsUrl);

    var googleAnalyticsCode = document.createElement('script');
    googleAnalyticsCode.innerHTML = [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      'gtag("js", new Date());',
      'gtag("config", "G-E4ENXKEG9R", { "anonymize_ip": true });'
    ].join('\n');
    document.head.appendChild(googleAnalyticsCode);
  })();

 

  // --------------------------------------------------------------------------
  // 2. LibAnswers / LibChat combo slide-out widget
  //    Same “combo” widget you’re using now, just isolated.
  // --------------------------------------------------------------------------
  (function initLibAnswersCombo() {
    var lc = document.createElement('script');
    lc.type = 'module';
    lc.async = true;
    lc.src =
      (document.location.protocol === 'https:' ? 'https://' : 'http://') +
      'answers.lib.purdue.edu/widgets/combo/d1409d10-59e5-11f1-9ce4-12b8ddef24ed';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(lc, s);
  })();


  // --------------------------------------------------------------------------
  // 3. Google Tag Manager (GTM-WZKRSVR)
  // --------------------------------------------------------------------------
  (function initGTM(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', 'GTM-WZKRSVR');

  // --------------------------------------------------------------------------
  // 4. Auto-expand Get It library/location sections
  //    Expands each collapsed library section in the Get It area once, so
  //    item tables (barcodes + item-level request links) show without a
  //    click. Also lets the ASC rule in custom.css hide the bib-level Aeon
  //    request card as soon as an item-level Aeon link renders. Sections a
  //    user collapses again are left alone (the marker prevents re-expand).
  // --------------------------------------------------------------------------
  (function initAutoExpandLocations() {
    var MARKER = 'data-purdue-auto-expanded';

    function autoExpand() {
      var buttons = document.querySelectorAll(
        'button[aria-expanded="false"]:not([' + MARKER + '])'
      );
      buttons.forEach(function (btn) {
        if (btn.querySelector('.getit-library-title')) {
          btn.setAttribute(MARKER, 'true');
          btn.click();
        }
      });
    }

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        autoExpand();
      });
    });

    function start() {
      autoExpand();
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();

  // --------------------------------------------------------------------------
  // 5. Reorder View Online sections
  //    NDE renders "Additional services" (ILL/research assistance) above
  //    "Full text availability" (e.g. HathiTrust) when a record has both.
  //    Show the direct full-text link first, additional services below it.
  // --------------------------------------------------------------------------
  (function initReorderViewItSections() {
    var MARKER = 'data-purdue-view-it-reordered';

    function reorder() {
      var parents = document.querySelectorAll(
        'nde-view-it:not([' + MARKER + '])'
      );
      parents.forEach(function (parent) {
        var sections = parent.querySelectorAll('nde-view-it-section');
        var fullText = null;
        var additionalServices = null;
        sections.forEach(function (section) {
          var titleEl = section.querySelector('.view-it-title');
          if (!titleEl) return;
          var text = titleEl.textContent.trim();
          if (text === 'Full text availability') fullText = section;
          if (text === 'Additional services') additionalServices = section;
        });
        if (fullText && additionalServices) {
          parent.setAttribute(MARKER, 'true');
          parent.insertBefore(fullText, additionalServices);
        }
      });
    }

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        reorder();
      });
    });

    function start() {
      reorder();
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();

  // Optional: tiny console marker to confirm custom.js loaded
  console.log('NDE custom.js loaded (GA4 + LibAnswers + GTM + auto-expand + view-it reorder).');

})();