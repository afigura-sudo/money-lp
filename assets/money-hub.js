/* U.S. News Money hub page: goal picker, topic tabs, calculators, jump nav, menu, forms. */
(function () {
  'use strict';

  var M = 'https://money.usnews.com';
  var W = 'https://www.usnews.com';
  var GOAL_KEY = 'usn-money-goal';

  var usd = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  function fmt(v, kind) {
    if (kind === 'usd') return usd(v);
    if (kind === 'pct') return v + '%';
    if (kind === 'rate') return Number(v).toFixed(2) + '%';
    return v + (v === 1 ? ' year' : ' years');
  }

  function calcOut(mode, v) {
    if (mode === 'savings') {
      var i = Math.pow(1 + v.apy / 100, 1 / 12) - 1, n = v.years * 12, g = Math.pow(1 + i, n);
      var fv = v.initial * g + v.monthly * (g - 1) / i, put = v.initial + v.monthly * n;
      return { label: 'Balance after ' + fmt(v.years, 'yrs'), value: usd(fv), sub: usd(fv - put) + ' earned in interest on ' + usd(put) + ' deposited.', fullHref: W + '/banking/calculators/savings-calculator', rankHref: W + '/banking/high-yield-savings-accounts', rankLabel: 'Best high-yield savings' };
    }
    var P = mode === 'mortgage' ? v.price * (1 - v.down / 100) : v.amount, r = v.rate / 1200, m = v.years * 12;
    var pmt = r ? P * r / (1 - Math.pow(1 + r, -m)) : P / m;
    return mode === 'mortgage'
      ? { label: 'Monthly principal & interest', value: usd(pmt), sub: 'On a ' + usd(P) + ' loan. Total interest over ' + v.years + ' years: ' + usd(pmt * m - P) + '. Taxes and insurance not included.', fullHref: M + '/loans/mortgages/mortgage-calculator', rankHref: M + '/loans/mortgages/best-mortgage-lenders', rankLabel: 'Best mortgage lenders' }
      : { label: 'Monthly payment', value: usd(pmt), sub: 'Total interest over ' + fmt(v.years, 'yrs') + ': ' + usd(pmt * m - P) + '.', fullHref: M + '/loans/loan-calculator', rankHref: M + '/loans/personal-loans/best-personal-loans', rankLabel: 'Best personal loans' };
  }

  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Roving-tabindex keyboard support shared by the radio group and the tablists.
  function arrowNav(items, onPick) {
    items.forEach(function (el, idx) {
      el.addEventListener('click', function () { onPick(el); });
      el.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = items[(idx + 1) % items.length];
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = items[(idx - 1 + items.length) % items.length];
        else if (e.key === 'Home') next = items[0];
        else if (e.key === 'End') next = items[items.length - 1];
        if (!next) return;
        e.preventDefault();
        next.focus();
        onPick(next);
      });
    });
  }

  function select(items, chosen, attr) {
    items.forEach(function (el) {
      var on = el === chosen;
      el.setAttribute(attr, String(on));
      el.tabIndex = on ? 0 : -1;
    });
  }

  // ---------- Header menu ----------
  var burger = document.querySelector('.site-header__burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    });
  }

  // ---------- Goal picker ----------
  var goals = $$('.goal');
  var results = $$('[data-goal-result]');
  function pickGoal(btn, persist) {
    var key = btn.dataset.goal;
    select(goals, btn, 'aria-checked');
    results.forEach(function (r) { r.hidden = r.dataset.goalResult !== key; });
    if (persist) { try { localStorage.setItem(GOAL_KEY, key); } catch (e) {} }
  }
  arrowNav(goals, function (btn) { pickGoal(btn, true); });
  try {
    var saved = localStorage.getItem(GOAL_KEY);
    var savedBtn = saved && document.getElementById('goal-' + saved);
    if (savedBtn) pickGoal(savedBtn, false);
  } catch (e) {}

  // ---------- Topic tabs ----------
  var topicTabs = $$('.pill-tab');
  arrowNav(topicTabs, function (tab) {
    select(topicTabs, tab, 'aria-selected');
    topicTabs.forEach(function (t) { document.getElementById(t.getAttribute('aria-controls')).hidden = t !== tab; });
  });

  // ---------- Calculators ----------
  var calcTabs = $$('.seg-tab');
  var outEls = {};
  $$('[data-out]').forEach(function (el) { outEls[el.dataset.out] = el; });
  var activeCalc = (calcTabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || calcTabs[0]).dataset.calc;

  function renderCalc() {
    var panel = document.querySelector('[data-calc-panel="' + activeCalc + '"]');
    var vals = {};
    $$('input[type="range"]', panel).forEach(function (input) {
      var v = parseFloat(input.value);
      vals[input.dataset.field] = v;
      panel.querySelector('[data-display="' + input.id + '"]').textContent = fmt(v, input.dataset.kind);
    });
    var out = calcOut(activeCalc, vals);
    outEls.label.textContent = out.label;
    outEls.value.textContent = out.value;
    outEls.sub.textContent = out.sub;
    outEls.fullHref.href = out.fullHref;
    outEls.rankHref.href = out.rankHref;
    outEls.rankLabel.textContent = out.rankLabel;
  }
  arrowNav(calcTabs, function (tab) {
    activeCalc = tab.dataset.calc;
    select(calcTabs, tab, 'aria-selected');
    $$('[data-calc-panel]').forEach(function (p) { p.hidden = p.dataset.calcPanel !== activeCalc; });
    renderCalc();
  });
  $$('.calc__fields input[type="range"]').forEach(function (input) { input.addEventListener('input', renderCalc); });
  if (calcTabs.length) renderCalc();

  // ---------- Jump nav active state ----------
  var jumpLinks = $$('.jump-nav__link');
  var ticking = false;
  function updateJump() {
    ticking = false;
    var cur = jumpLinks[0];
    jumpLinks.forEach(function (link) {
      var el = document.getElementById(link.getAttribute('href').slice(1));
      if (el && el.getBoundingClientRect().top < 140) cur = link;
    });
    jumpLinks.forEach(function (link) {
      if (link === cur) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  if (jumpLinks.length) {
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateJump); }
    }, { passive: true });
    updateJump();
  }

  // ---------- Advisor search: drop the empty query param ----------
  var advForm = document.querySelector('.advisor-form');
  if (advForm) {
    advForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = advForm.elements.location.value.trim();
      window.open(advForm.action + (q ? '?location=' + encodeURIComponent(q) : ''), '_blank', 'noopener');
    });
  }

  // ---------- Newsletter ----------
  var nlForm = document.querySelector('[data-newsletter]');
  var nlDone = document.querySelector('[data-newsletter-done]');
  if (nlForm && nlDone) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: post to the newsletter subscription endpoint once it's wired up.
      nlForm.hidden = true;
      nlDone.hidden = false;
    });
  }
})();
