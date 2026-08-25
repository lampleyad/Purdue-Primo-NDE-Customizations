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

  // --------------------------------------------------------------------------
  // 6. Move "Available" next to the location in the Get It Locations section
  //    NDE renders the "Available" status on the right side of the location
  //    card, grouped with the "Locate" button/"View Items" toggle - a
  //    different layout than PrimoVE, which shows "Available" immediately
  //    before the location/call number on the left. "Available" and the
  //    location text are genuine DOM siblings-of-siblings here (not just a
  //    visual/flex-order difference), so matching PrimoVE's layout requires
  //    actually relocating the node, the same technique used above for the
  //    View Online section reorder - CSS alone can't move an element into a
  //    different container's subtree.
  // --------------------------------------------------------------------------
  (function initMoveLocationAvailableLabel() {
    var MARKER = 'data-purdue-available-moved';

    function moveLabels() {
      var labels = document.querySelectorAll(
        '.getit-location-available:not([' + MARKER + '])'
      );
      labels.forEach(function (label) {
        var card = label.closest('.getit-location-card');
        if (!card) return;
        var propsContainer = card.querySelector('.location-brief-properties-container');
        var locationLine = propsContainer && propsContainer.firstElementChild;
        if (!locationLine) return;
        label.setAttribute(MARKER, 'true');
        locationLine.insertBefore(label, locationLine.firstChild);
      });
    }

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        moveLabels();
      });
    });

    function start() {
      moveLabels();
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();

  // --------------------------------------------------------------------------
  // 7. Hide "Home Delivery" / "Office Address" from the Personal Delivery
  //    request dropdown
  //    PrimoVE hid these the same way this whole request type is scoped -
  //    but via `md-option[value*="USER_HOME_ADDRESS"]`/`[value*=
  //    "USER_WORK_ADDRESS"]`. NDE's Angular Material `<mat-option>` doesn't
  //    reflect its bound `value` as an HTML attribute at all, so that
  //    selector has nothing to match here - there's no stable attribute to
  //    key off, only the option's visible label text. mat-select panels are
  //    also portal-rendered into a CDK overlay appended to <body> only while
  //    open (destroyed on close), so this has to run on each open via the
  //    same MutationObserver approach used above, not just once on load.
  // --------------------------------------------------------------------------
  (function initHidePersonalDeliveryOptions() {
    var MARKER = 'data-purdue-delivery-option-hidden';
    var HIDDEN_LABEL_PREFIXES = ['Home Delivery', 'Office Address'];

    function hideOptions() {
      var groups = document.querySelectorAll('mat-optgroup');
      groups.forEach(function (group) {
        var groupLabel = group.querySelector('.mat-mdc-optgroup-label');
        if (!groupLabel || groupLabel.textContent.trim().toUpperCase() !== 'PERSONAL DELIVERY') {
          return;
        }
        var options = group.querySelectorAll('mat-option:not([' + MARKER + '])');
        options.forEach(function (option) {
          var labelEl = option.querySelector('.mdc-list-item__primary-text');
          var text = labelEl ? labelEl.textContent.trim() : '';
          var shouldHide = HIDDEN_LABEL_PREFIXES.some(function (prefix) {
            return text.indexOf(prefix) === 0;
          });
          if (shouldHide) {
            option.setAttribute(MARKER, 'true');
            option.style.display = 'none';
          }
        });
      });
    }

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        hideOptions();
      });
    });

    function start() {
      hideOptions();
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();

  // --------------------------------------------------------------------------
  // 8. Auto-expand "Get it from PurdueBorrow" section/institution panels
  //    This section (.getit_other) uses a different accordion component
  //    than the plain-<button> Locations section handled by #4 above -
  //    Angular Material's <mat-expansion-panel-header role="button"> - so
  //    that routine's button[aria-expanded] selector never matches it.
  //    Without this, a user has to click twice just to see whether another
  //    consortium institution even has the item (once to open the
  //    "Get it from PurdueBorrow" section, again to open the institution
  //    row under it).
  //
  //    The per-institution header (".inst-header") is permanently
  //    aria-disabled="true"/tabindex="-1" - NDE disabled Angular
  //    Material's own whole-header click-to-toggle and wired custom click
  //    handling onto the inner <mat-panel-title> (tabindex="0") instead,
  //    confirmed by testing: clicking ".inst-header" itself does nothing,
  //    clicking its <mat-panel-title> toggles it correctly. The top-level
  //    section header doesn't have this quirk - clicking it directly
  //    works - so each case uses whichever element actually responds.
  // --------------------------------------------------------------------------
  (function initAutoExpandGetItOther() {
    var MARKER = 'data-purdue-getit-other-expanded';

    function autoExpand() {
      var headers = document.querySelectorAll(
        '.getit_other mat-expansion-panel-header[aria-expanded="false"]:not([' + MARKER + '])'
      );
      headers.forEach(function (header) {
        // Skip the innermost per-item (barcode/loan period) panels - only
        // the section and per-institution levels should auto-expand, not
        // every individual copy's detail row.
        if (header.closest('nde-location-item')) return;
        header.setAttribute(MARKER, 'true');
        var title = header.querySelector('mat-panel-title');
        var clickTarget = header.getAttribute('aria-disabled') === 'true' && title ? title : header;
        clickTarget.click();
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
  // 9. Fix literal "<strong>...</strong>" text from Alma configuration labels
  //    Some Alma-configured label text (e.g. the "REQUEST OPTIONS:" label in
  //    the Get it from PurdueBorrow section) contains raw HTML markup that
  //    PrimoVE's older ng-bind-html-style templates rendered as real HTML
  //    (producing bold text). NDE's templates bind this same configured
  //    string via plain text interpolation instead, which escapes it - so
  //    the literal characters "<strong>REQUEST OPTIONS:</strong>" show up
  //    on the page as visible text instead of being parsed. There's no way
  //    to fix this from the Alma-side config text itself without breaking
  //    PrimoVE's rendering of the same string, so this finds any text node
  //    containing that pattern and replaces it with a real <strong> element,
  //    restoring the bold rendering PrimoVE already shows.
  //
  //    Only handles <strong>...</strong> specifically (the one instance
  //    found so far), not arbitrary HTML tags - keeps this predictable
  //    rather than trying to be a general-purpose HTML unescaper.
  // --------------------------------------------------------------------------
  (function initFixEscapedStrongTags() {
    var PATTERN = /<strong>([\s\S]*?)<\/strong>/gi;

    function fixTextNode(textNode) {
      var text = textNode.nodeValue;
      var frag = document.createDocumentFragment();
      var lastIndex = 0;
      var match;
      PATTERN.lastIndex = 0;
      while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }
        var strong = document.createElement('strong');
        strong.textContent = match[1];
        frag.appendChild(strong);
        lastIndex = PATTERN.lastIndex;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.replaceWith(frag);
    }

    function scan(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          return node.nodeValue.indexOf('<strong>') !== -1
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      });
      var nodes = [];
      var n;
      while ((n = walker.nextNode())) nodes.push(n);
      // Fixing a node removes the matched substring, so the next scan
      // naturally won't re-match it - no marker attribute needed.
      nodes.forEach(fixTextNode);
    }

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        scan(document.body);
      });
    });

    function start() {
      scan(document.body);
      observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  })();

  // Optional: tiny console marker to confirm custom.js loaded
  console.log('NDE custom.js loaded (GA4 + LibAnswers + GTM + auto-expand + view-it reorder + location-available move + hide delivery options + getit-other auto-expand + strong-tag fix).');

})();