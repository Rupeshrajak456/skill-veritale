/* Veritale project site: interactions.
   Data comes from data.js (window.VT_CASES, window.VT_MODULES). */
(function () {
  'use strict';

  var CASES = window.VT_CASES || [];
  var MODULES = window.VT_MODULES || [];
  var REPO = 'https://github.com/Rupeshrajak456/skill-veritale';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var fmt = function (n) { return n.toLocaleString('en-GB'); };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, reduceMotion ? 0 : ms); }); };
  var cls = { Verified: 'v', Disputed: 'd', Legend: 'l' };
  var LABELS = ['Verified', 'Disputed', 'Legend'];
  var wordCount = function (t) { var m = String(t).match(/\S+/g); return m ? m.length : 0; };
  var byFile = {};
  MODULES.forEach(function (m) { byFile[m.file] = m; });

  // Description words, read from the SKILL.md front matter.
  var DESC_WORDS = (function () {
    var s = byFile['SKILL.md'];
    if (!s) return 0;
    var m = s.text.match(/description:\s*(.+)/);
    return m ? wordCount(m[1]) : 0;
  })();
  var TOTAL_WORDS = MODULES.reduce(function (a, m) { return a + m.words; }, 0);

  function badge(label, pop) {
    return '<span class="badge ' + cls[label] + (pop ? ' pop' : '') + '">' + label + '</span>';
  }

  /* ---------------- theme ---------------- */
  var root = document.documentElement;
  var themeBtn = $('#theme-toggle');
  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeLabel() {
    var t = effectiveTheme();
    root.setAttribute('data-theme', t);
    $('.theme-label', themeBtn).textContent = t === 'dark' ? 'Day' : 'Night';
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to day mode' : 'Switch to night mode');
  }
  themeBtn.addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('vt-theme', next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  /* ---------------- menu ---------------- */
  var nav = $('#nav'), menuBtn = $('#menu-btn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'Menu';
    });
  });

  /* ---------------- progress, back to top, active link ---------------- */
  var bar = $('#progress-bar'), toTop = $('#to-top');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = p + '%';
    toTop.classList.toggle('show', h.scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    $('.wordmark').focus({ preventScroll: true });
  });

  var navLinks = $$('.nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { io.observe(s); });
  }

  // Run a callback once when an element first scrolls into view.
  function whenVisible(el, fn) {
    if (!el) return;
    if (!('IntersectionObserver' in window) || reduceMotion) { fn(); return; }
    var o = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { o.disconnect(); fn(); } });
    }, { threshold: 0.2 });
    o.observe(el);
  }

  /* ---------------- hero specimen ---------------- */
  (function () {
    var specs = $$('#specimen .spec');
    var delay = reduceMotion ? 0 : 650;
    specs.forEach(function (s, i) { setTimeout(function () { s.classList.add('on'); }, 500 + i * delay); });
  })();

  /* ---------------- tooltip ---------------- */
  var tip = $('#tip');
  document.body.appendChild(tip);
  tip.style.position = 'fixed';
  function showTip(target, html) {
    tip.innerHTML = html;
    tip.hidden = false;
    var r = target.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 8);
    var y = r.top - th - 10;
    if (y < 70) y = r.bottom + 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hideTip() { tip.hidden = true; }
  window.addEventListener('scroll', hideTip, { passive: true });
  function claimTip(c) {
    return '<strong>' + esc(c.id) + ' &middot; <span class="tip-lab">' + c.label + '</span></strong>' +
      esc(c.claim) + '<br><em>Source: ' + esc(c.source) + '</em>' + (c.note ? '<br>' + esc(c.note) : '');
  }
  function bindTip(el, html) {
    el.addEventListener('mouseenter', function () { showTip(el, html); });
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', function () { showTip(el, html); });
    el.addEventListener('blur', hideTip);
  }

  /* ---------------- tiny markdown renderer ---------------- */
  function inline(s) {
    var codes = [];
    s = esc(s).replace(/`([^`]+)`/g, function (_, c) { codes.push(c); return '\u0000' + (codes.length - 1) + '\u0000'; });
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
         .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
         .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return '<code>' + codes[+i] + '</code>'; });
  }
  function renderMarkdown(src) {
    var lines = src.replace(/\r/g, '').split('\n');
    var out = [], i = 0;
    if (lines[0] === '---') {
      var end = lines.indexOf('---', 1);
      if (end > 0) {
        out.push('<div class="front">' + lines.slice(1, end).map(function (l) {
          var k = l.indexOf(':');
          return k > 0 ? '<div><b>' + esc(l.slice(0, k)) + ':</b> ' + esc(l.slice(k + 1).trim()) + '</div>' : esc(l);
        }).join('') + '</div>');
        i = end + 1;
      }
    }
    var special = /^(#{1,6}\s|```|>|\s*[-*]\s|\d+\.\s|\|)/;
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) { i++; continue; }
      if (/^```/.test(line)) {
        var buf = []; i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
        continue;
      }
      var h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) { var n = h[1].length; out.push('<h' + n + '>' + inline(h[2]) + '</h' + n + '>'); i++; continue; }
      if (/^\|/.test(line) && lines[i + 1] && /^\|?\s*:?-{2,}/.test(lines[i + 1])) {
        var split = function (r) { return r.replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); };
        var head = split(line); i += 2;
        var rows = [];
        while (i < lines.length && /^\|/.test(lines[i])) rows.push(split(lines[i++]));
        out.push('<table><thead><tr>' + head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + rows.map(function (r) {
            return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table>');
        continue;
      }
      if (/^>/.test(line)) {
        var q = [];
        while (i < lines.length && /^>/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
        out.push('<blockquote>' + q.join('\n').split(/\n\s*\n/).map(function (p) { return '<p>' + inline(p.replace(/\n/g, ' ')) + '</p>'; }).join('') + '</blockquote>');
        continue;
      }
      if (/^\s*[-*]\s/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s/, ''));
        out.push('<ul>' + items.map(function (t) {
          var task = t.match(/^\[( |x)\]\s+(.*)$/);
          return task ? '<li class="task">' + inline(task[2]) + '</li>' : '<li>' + inline(t) + '</li>';
        }).join('') + '</ul>');
        continue;
      }
      if (/^\d+\.\s/.test(line)) {
        var ol = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) ol.push(lines[i++].replace(/^\d+\.\s/, ''));
        out.push('<ol>' + ol.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</ol>');
        continue;
      }
      var para = [];
      while (i < lines.length && lines[i].trim() && !special.test(lines[i])) para.push(lines[i++]);
      if (!para.length) { para.push(lines[i++]); }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  /* ---------------- tiers ---------------- */
  (function () {
    var modulesWords = TOTAL_WORDS - (byFile['SKILL.md'] ? byFile['SKILL.md'].words : 0);
    $$('.tier-w').forEach(function (el) {
      var k = el.getAttribute('data-words');
      var n = k === 'desc' ? DESC_WORDS : k === 'modules' ? modulesWords : (byFile[k] ? byFile[k].words : 0);
      el.textContent = fmt(n) + ' words';
    });
  })();

  /* ---------------- module explorer ---------------- */
  (function () {
    var list = $('#explorer-list'), head = $('#explorer-head'), view = $('#explorer-md');
    if (!list) return;
    var liveCache = {};
    MODULES.forEach(function (m, idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mod-btn';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      b.innerHTML = '<span class="mb-file">' + esc(m.file) + '</span><span class="mb-title">' + esc(m.title) +
        '</span><span class="mb-when">' + esc(m.when) + '</span>';
      b.addEventListener('click', function () { select(idx); });
      list.appendChild(b);
    });
    function show(m, text, live) {
      head.innerHTML = '<span class="eh-file">' + esc(m.file) + '</span>' +
        '<span class="eh-meta">' + fmt(m.lines) + ' lines, ' + fmt(m.words) + ' words</span>' +
        '<span class="eh-links"><a class="btn" href="' + REPO + '/blob/main/' + encodeURIComponent(m.file) + '" target="_blank" rel="noopener">View on GitHub</a>' +
        '<a class="btn" href="' + encodeURIComponent(m.file) + '" download>Download</a></span>' +
        '<p class="eh-role">' + esc(m.role) + '</p>' +
        '<span class="eh-src">' + (live ? 'Loaded live from the published file.' : 'Showing the copy bundled with this page.') + '</span>';
      view.innerHTML = renderMarkdown(text);
      view.scrollTop = 0;
    }
    function select(idx) {
      $$('.mod-btn', list).forEach(function (b, i) { b.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
      var m = MODULES[idx];
      show(m, liveCache[m.file] || m.text, !!liveCache[m.file]);
      if (liveCache[m.file] || location.protocol === 'file:') return;
      fetch(m.file, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.text() : null; }).then(function (t) {
        if (t && t.trim()) { liveCache[m.file] = t; if ($('.mod-btn[aria-selected="true"]', list) === $$('.mod-btn', list)[idx]) show(m, t, true); }
      }).catch(function () {});
    }
    list.addEventListener('keydown', function (e) {
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) < 0) return;
      var btns = $$('.mod-btn', list), cur = btns.indexOf(document.activeElement);
      if (cur < 0) return;
      e.preventDefault();
      var nxt = (cur + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
      btns[nxt].focus(); select(nxt);
    });
    select(0);
  })();

  /* ---------------- story helpers ---------------- */
  var SPAN = /\[\[(\w+)\|([\s\S]+?)\]\]/g;
  function claimMap(c) { var m = {}; c.claims.forEach(function (x) { m[x.id] = x; }); return m; }
  function storyHTML(c, inlineLabels) {
    var map = claimMap(c);
    return c.story.map(function (p) {
      var html = '', last = 0, m;
      SPAN.lastIndex = 0;
      while ((m = SPAN.exec(p))) {
        html += esc(p.slice(last, m.index));
        var cl = map[m[1]];
        html += '<span class="cl ' + cls[cl.label] + '" tabindex="0" data-id="' + cl.id + '">' + esc(m[2]) + '</span>' +
          (inlineLabels ? '<span class="inl ' + cls[cl.label] + '">[' + cl.label + ']</span>' : '');
        last = m.index + m[0].length;
      }
      return '<p>' + html + esc(p.slice(last)) + '</p>';
    }).join('');
  }
  function bindStoryTips(container, c) {
    var map = claimMap(c);
    $$('.cl', container).forEach(function (el) { bindTip(el, claimTip(map[el.getAttribute('data-id')])); });
  }
  function counts(claims) {
    var o = { Verified: 0, Disputed: 0, Legend: 0 };
    claims.forEach(function (c) { o[c.label]++; });
    return o;
  }

  /* ---------------- live demonstration ---------------- */
  (function () {
    var app = $('#demo-app');
    if (!app || !CASES.length) return;
    var STEPS = [
      { key: 'intake', title: 'Intake', file: 'module-1-intake.md' },
      { key: 'facts', title: 'Fact table', file: 'module-2-fact-table.md' },
      { key: 'grade', title: 'Evidence grading', file: 'module-3-evidence-grading.md' },
      { key: 'timeline', title: 'Timeline', file: 'module-4-timeline.md', modes: ['full', 'timeline'] },
      { key: 'story', title: 'Narrative', file: 'module-5-narrative.md', modes: ['full', 'story'] },
      { key: 'note', title: 'Uncertainty note', file: 'module-6-uncertainty-note.md' }
    ];
    var state = { caseIdx: 0, mode: 'full', cur: -1, done: {}, loaded: [], token: 0, running: false };
    var stepper = $('#demo-stepper'), stage = $('#demo-stage');
    var caseSeg = $('#demo-case'), modeSeg = $('#demo-mode');
    var runBtn = $('#demo-run'), nextBtn = $('#demo-next'), resetBtn = $('#demo-reset');

    CASES.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
      b.textContent = c.short;
      b.addEventListener('click', function () { state.caseIdx = i; setChecked(caseSeg, b); reset(); });
      caseSeg.appendChild(b);
    });
    $$('button', modeSeg).forEach(function (b) {
      b.addEventListener('click', function () { state.mode = b.getAttribute('data-mode'); setChecked(modeSeg, b); reset(); });
    });
    function setChecked(group, btn) { $$('button', group).forEach(function (x) { x.setAttribute('aria-checked', x === btn ? 'true' : 'false'); }); }
    function active(step) { return !step.modes || step.modes.indexOf(state.mode) >= 0; }
    function theCase() { return CASES[state.caseIdx]; }

    function drawStepper() {
      stepper.innerHTML = '';
      STEPS.forEach(function (s, i) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        var skipped = !active(s);
        b.className = 'step' + (state.done[i] ? ' done' : '') + (state.cur === i ? ' current' : '') + (skipped ? ' skipped' : '');
        b.disabled = skipped || !state.done[i] || state.running;
        b.innerHTML = '<span class="dot">' + (state.done[i] ? '&#10003;' : (i + 1)) + '</span><span><span class="st-title">' +
          esc(s.title) + '</span><span class="st-file">' + (skipped ? 'skipped in this mode' : esc(s.file)) + '</span></span>';
        b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + s.title + (skipped ? ', skipped in this mode' : ''));
        b.addEventListener('click', function () { if (state.done[i]) { state.cur = i; drawStepper(); render(i, false); } });
        li.appendChild(b);
        stepper.appendChild(li);
      });
    }

    function meter() {
      var used = state.loaded.reduce(function (a, f) { return a + (f === 'description' ? DESC_WORDS : byFile[f].words); }, 0);
      $('#meter-words').textContent = fmt(used);
      $('#meter-total').textContent = fmt(TOTAL_WORDS);
      $('#meter-fill').style.height = (TOTAL_WORDS ? used / TOTAL_WORDS * 100 : 0) + '%';
      $('#meter-files').innerHTML = state.loaded.map(function (f) {
        return '<li>' + (f === 'description' ? 'description (' + DESC_WORDS + ')' : esc(f) + ' (' + fmt(byFile[f].words) + ')') + '</li>';
      }).join('');
      var pct = TOTAL_WORDS ? Math.round(used / TOTAL_WORDS * 100) : 0;
      $('#meter-note').textContent = state.loaded.length
        ? pct + '% of the skill so far. A single-file skill would load all ' + fmt(TOTAL_WORDS) + ' words at the start.'
        : 'Before a task, the agent sees only the ' + DESC_WORDS + '-word description.';
    }
    function load(file) { if (state.loaded.indexOf(file) < 0) state.loaded.push(file); meter(); }

    function empty() {
      stage.innerHTML = '<div class="stage-empty"><div><p>Press <strong>Next step</strong> to watch the agent work one module at a time, or <strong>Run all steps</strong> to play the whole sequence.</p></div></div>';
      $('#demo-request-text').textContent = '"' + theCase().request + '"';
    }

    function header(i, lead) {
      return '<div class="stage-head anim-in"><h3>' + (i + 1) + '. ' + esc(STEPS[i].title) + '</h3><span class="loaded">opened ' +
        esc(STEPS[i].file) + '</span></div><p class="stage-lead anim-in">' + lead + '</p>';
    }

    function factRows(c, withLabels) {
      return c.claims.map(function (x) {
        return '<tr data-id="' + x.id + '"><td class="id">' + x.id + '</td><td class="date">' + esc(x.date) + '</td><td>' + esc(x.claim) +
          '</td><td class="src">' + esc(x.source) + '</td><td class="lab">' + (withLabels ? badge(x.label) : '<span class="pending">to grade</span>') + '</td></tr>';
      }).join('');
    }
    function tableShell(c, withLabels) {
      return '<div class="ftable-wrap anim-in"><table class="ftable"><thead><tr><th>ID</th><th>Date</th><th>Claim</th><th>Earliest source</th><th>Label</th></tr></thead><tbody>' +
        factRows(c, withLabels) + '</tbody></table></div>';
    }
    function briefFor(c) { return c.brief.replace(/Mode: \w+/, 'Mode: ' + state.mode); }

    async function render(i, animate) {
      var c = theCase(), tok = state.token, s = STEPS[i].key, rows, k;
      hideTip();
      if (s === 'intake') {
        var settings = [['Topic', c.title], ['Mode', state.mode], ['Audience', c.audience], ['Length', 'Medium']];
        stage.innerHTML = header(i, 'The agent reads the request and fills in a one-line brief. The topic is clear, so module 1 tells it not to ask any questions.') +
          '<div class="brief-line anim-in" id="brief"></div><div class="settings">' + settings.map(function (x, j) {
            return '<div class="setting anim-in" style="animation-delay:' + (animate ? 0.3 + j * 0.15 : 0) + 's"><span>' + x[0] + '</span><strong>' + esc(x[1]) + '</strong></div>';
          }).join('') + '</div>';
        var line = briefFor(c), el = $('#brief');
        if (!animate || reduceMotion) { el.textContent = line; return; }
        for (k = 0; k <= line.length; k += 2) {
          if (tok !== state.token) return;
          el.innerHTML = esc(line.slice(0, k)) + '<span class="caret"></span>';
          await sleep(14);
        }
        el.textContent = line;
      } else if (s === 'facts') {
        stage.innerHTML = header(i, 'Every claim the answer will use, one per row, with its earliest source. Compound claims are split, so a death and the way it happened become two rows. Nothing is labelled yet.') + tableShell(c, false);
        if (animate && !reduceMotion) {
          rows = $$('tbody tr', stage);
          rows.forEach(function (r) { r.style.opacity = 0; });
          for (k = 0; k < rows.length; k++) {
            if (tok !== state.token) return;
            rows[k].style.opacity = ''; rows[k].classList.add('row-in');
            await sleep(70);
          }
        }
      } else if (s === 'grade') {
        var tally = { Verified: 0, Disputed: 0, Legend: 0 };
        var final = counts(c.claims);
        stage.innerHTML = header(i, 'Module 3 runs four ordered tests on each row: is the source late, do credible sources disagree, is there early evidence and agreement? When unsure, it takes the weaker label.') +
          '<div class="tally anim-in">' + LABELS.map(function (l) {
            return '<span class="' + cls[l] + '">' + l + ' <b data-t="' + l + '">' + (animate ? 0 : final[l]) + '</b></span>';
          }).join('') + '</div>' + tableShell(c, !animate);
        if (animate) {
          var cells = $$('td.lab', stage);
          for (k = 0; k < c.claims.length; k++) {
            if (tok !== state.token) return;
            var x = c.claims[k];
            cells[k].innerHTML = badge(x.label, true);
            tally[x.label]++;
            $('b[data-t="' + x.label + '"]', stage).textContent = tally[x.label];
            if (k > 5) { var wrap = $('.ftable-wrap', stage); var row = cells[k].parentNode; wrap.scrollTop = row.offsetTop - wrap.clientHeight + row.offsetHeight + 8; }
            await sleep(150);
          }
          var w = $('.ftable-wrap', stage); if (w) w.scrollTop = 0;
        }
      } else if (s === 'timeline') {
        stage.innerHTML = header(i, 'The graded claims in date order. Every line keeps its label. Undated legends sit beside the event they belong to.') +
          '<ol class="gtl anim-in" style="--draw:1">' + c.claims.map(function (x, j) {
            return '<li class="gtl-item ' + cls[x.label] + (animate ? ' anim-in' : '') + '" style="animation-delay:' + (animate ? j * 0.05 : 0) + 's"><span class="gtl-date">' + esc(x.date) +
              '</span><span class="gtl-mark"></span><div class="gtl-card" style="cursor:default"><div class="gc-top"><span class="gc-claim">' + esc(x.claim) + '</span>' + badge(x.label) + '</div></div></li>';
          }).join('') + '</ol>';
      } else if (s === 'story') {
        var inl = c.audience === 'students';
        stage.innerHTML = header(i, 'Verified claims carry the plot. Disputed and Legend claims appear only with framing. Hover over or tab to any underlined passage to see its row in the fact table.') +
          '<div class="story-tools anim-in"><label class="switch"><input type="checkbox" id="inl-toggle"' + (inl ? ' checked' : '') + '> Show labels inline</label>' +
          LABELS.map(function (l) { return badge(l); }).join(' ') + '</div><div class="story anim-in" id="story"></div>';
        var st = $('#story', stage);
        var paint = function (on) { st.innerHTML = storyHTML(c, on); bindStoryTips(st, c); };
        paint(inl);
        $('#inl-toggle', stage).addEventListener('change', function (e) { paint(e.target.checked); });
      } else if (s === 'note') {
        var doubtful = c.claims.filter(function (x) { return x.label !== 'Verified'; })
          .sort(function (a, b) { return (a.label === 'Disputed' ? 0 : 1) - (b.label === 'Disputed' ? 0 : 1); });
        var checks = ['Every story claim is in the fact table', 'Every timeline line has a label', 'Disputed and Legend claims are framed',
          'No invented dialogue, names, numbers or motives', 'Approximate dates use "c."', 'Both sides named where sources disagree',
          'Source statements kept apart from events', 'Uncertainty note lists every doubtful item', 'Length matches the brief', 'Label key is included'];
        stage.innerHTML = header(i, 'A short "What we are unsure about" section, followed by a ten-point check the agent runs before it replies.') +
          '<ul class="unsure">' + doubtful.map(function (x, j) {
            return '<li class="anim-in" style="animation-delay:' + (animate ? j * 0.08 : 0) + 's">' + badge(x.label) + '<span><strong>' + esc(x.claim) + '.</strong> ' + esc(x.note) + '</span></li>';
          }).join('') + '</ul><ul class="checklist">' + checks.map(function (t) {
            return '<li' + (animate ? '' : ' class="ok"') + '><span class="tick">&#10003;</span><span>' + esc(t) + '</span></li>';
          }).join('') + '</ul><div id="done-slot"></div>';
        var lis = $$('.checklist li', stage);
        if (animate) {
          await sleep(doubtful.length * 80 + 200);
          for (k = 0; k < lis.length; k++) { if (tok !== state.token) return; lis[k].classList.add('ok'); await sleep(110); }
        }
        var used = state.loaded.reduce(function (a, f) { return a + (f === 'description' ? DESC_WORDS : byFile[f].words); }, 0);
        $('#done-slot', stage).innerHTML = '<div class="done-banner anim-in">Answer ready: ' + c.claims.length + ' claims graded, using ' +
          fmt(used) + ' of ' + fmt(TOTAL_WORDS) + ' words of instruction.</div>';
      }
    }

    function nextIndex() {
      for (var i = state.cur + 1; i < STEPS.length; i++) if (active(STEPS[i])) return i;
      return -1;
    }
    async function advance(animate) {
      var i = nextIndex();
      if (i < 0) return false;
      if (state.cur < 0) { load('SKILL.md'); }
      if (state.cur >= 0) state.done[state.cur] = true;
      state.cur = i;
      load(STEPS[i].file);
      drawStepper();
      await render(i, animate);
      if (nextIndex() < 0) { state.done[i] = true; drawStepper(); }
      syncButtons();
      return true;
    }
    function syncButtons() {
      var finished = nextIndex() < 0 && state.cur >= 0;
      nextBtn.disabled = state.running || finished;
      runBtn.disabled = state.running || finished;
      runBtn.textContent = state.running ? 'Running...' : 'Run all steps';
    }
    function reset() {
      state.token++; state.cur = -1; state.done = {}; state.loaded = []; state.running = false;
      drawStepper(); meter(); empty(); syncButtons();
    }
    nextBtn.addEventListener('click', async function () {
      state.running = true; syncButtons(); drawStepper();
      var tok = state.token;
      await advance(true);
      if (tok !== state.token) return;
      state.running = false; syncButtons(); drawStepper();
    });
    runBtn.addEventListener('click', async function () {
      state.running = true; syncButtons();
      var tok = state.token;
      while (tok === state.token) {
        var more = await advance(true);
        if (!more || tok !== state.token) break;
        if (nextIndex() < 0) break;
        await sleep(STEPS[state.cur].key === 'story' ? 2600 : 1100);
      }
      if (tok !== state.token) return;
      state.running = false; syncButtons(); drawStepper();
    });
    resetBtn.addEventListener('click', reset);
    reset();
  })();

  /* ---------------- visualisation ---------------- */
  (function () {
    var tabs = $$('#viz-tabs [role="tab"]');
    var caseSeg = $('#viz-case');
    var vizCase = 0;
    var drawn = {};

    CASES.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
      b.textContent = c.short;
      b.addEventListener('click', function () {
        vizCase = i;
        $$('button', caseSeg).forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        drawTimeline(true);
      });
      caseSeg.appendChild(b);
    });

    function selectTab(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false');
        x.tabIndex = on ? 0 : -1;
        $('#' + x.getAttribute('aria-controls')).hidden = !on;
      });
      var id = t.getAttribute('aria-controls');
      caseSeg.style.visibility = id === 'v-timeline' ? 'visible' : 'hidden';
      hideTip();
      if (id === 'v-mix' && !drawn.mix) { drawMix(); drawn.mix = true; }
      if (id === 'v-ribbon' && !drawn.ribbon) { drawRibbon(); drawn.ribbon = true; }
      if (id === 'v-load' && !drawn.load) { drawLoad(); drawn.load = true; }
    }
    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { selectTab(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        tabs[n].focus(); selectTab(tabs[n]);
      });
    });

    // Graded timeline
    var filters = { Verified: true, Disputed: true, Legend: true };
    $$('#tl-filters .chip').forEach(function (ch) {
      ch.addEventListener('click', function () {
        var l = ch.getAttribute('data-l');
        filters[l] = !filters[l];
        ch.setAttribute('aria-pressed', filters[l] ? 'true' : 'false');
        applyFilters();
      });
    });
    function applyFilters() {
      $$('#gtl .gtl-item').forEach(function (li) { li.classList.toggle('hide', !filters[li.getAttribute('data-l')]); });
    }
    function drawTimeline(animate) {
      var c = CASES[vizCase], ol = $('#gtl'), cnt = counts(c.claims);
      $$('#tl-filters .chip').forEach(function (ch) { $('b', ch).textContent = cnt[ch.getAttribute('data-l')]; });
      ol.innerHTML = c.claims.map(function (x, j) {
        return '<li class="gtl-item ' + cls[x.label] + (animate && !reduceMotion ? ' anim-in' : '') + '" data-l="' + x.label + '" style="animation-delay:' + (j * 0.04) + 's">' +
          '<span class="gtl-date">' + esc(x.date) + '</span><span class="gtl-mark" aria-hidden="true"></span>' +
          '<button type="button" class="gtl-card" aria-expanded="false"><span class="gc-top"><span class="gc-claim">' + esc(x.claim) + '</span>' + badge(x.label) +
          '<span class="gc-id">' + x.id + '</span></span><span class="gc-more"><strong>Source:</strong> ' + esc(x.source) + (x.note ? '<br>' + esc(x.note) : '') + '</span></button></li>';
      }).join('');
      $$('.gtl-card', ol).forEach(function (b) {
        b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); });
      });
      applyFilters();
    }
    var gtl = $('#gtl');
    gtl.style.setProperty('--draw', reduceMotion ? 1 : 0);
    drawTimeline(false);
    whenVisible(gtl, function () { gtl.style.setProperty('--draw', 1); });
    gtl.classList.add('anim-host');

    // Label mix donuts
    function donut(title, claims) {
      var cnt = counts(claims), total = claims.length, R = 70, C = 2 * Math.PI * R, off = 0;
      var arcs = LABELS.map(function (l) {
        var len = cnt[l] / total * C;
        var s = '<circle class="seg-arc" tabindex="0" r="' + R + '" cx="95" cy="95" stroke="var(--' + cls[l] + ')" ' +
          'stroke-dasharray="0 ' + C.toFixed(2) + '" data-dash="' + Math.max(0, len - 2).toFixed(2) + ' ' + (C - Math.max(0, len - 2)).toFixed(2) + '" ' +
          'stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 95 95)" data-l="' + l + '" data-n="' + cnt[l] + '" data-t="' + total + '"></circle>';
        off += len;
        return s;
      }).join('');
      return '<div class="donut-card"><h3>' + esc(title) + '</h3><svg class="donut" viewBox="0 0 190 190" role="img" aria-label="' + esc(title) + ': ' +
        LABELS.map(function (l) { return cnt[l] + ' ' + l; }).join(', ') + '">' +
        '<circle r="' + R + '" cx="95" cy="95" fill="none" stroke="var(--paper-2)" stroke-width="22"></circle>' + arcs +
        '<text class="d-total" x="95" y="100" text-anchor="middle">' + total + '</text><text class="d-sub" x="95" y="120" text-anchor="middle">claims</text></svg>' +
        '<div class="donut-legend">' + LABELS.map(function (l) {
          return '<span><i style="background:var(--' + cls[l] + ')"></i>' + l + ' ' + cnt[l] + ' (' + Math.round(cnt[l] / total * 100) + '%)</span>';
        }).join('') + '</div></div>';
    }
    function drawMix() {
      var all = [];
      CASES.forEach(function (c) { all = all.concat(c.claims); });
      $('#mix').innerHTML = CASES.map(function (c) { return donut(c.short, c.claims); }).join('') + donut('Both cases', all);
      var arcs = $$('#mix .seg-arc');
      arcs.forEach(function (a) {
        bindTip(a, '<strong>' + a.getAttribute('data-l') + '</strong>' + a.getAttribute('data-n') + ' of ' + a.getAttribute('data-t') + ' claims');
      });
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        arcs.forEach(function (a) { a.setAttribute('stroke-dasharray', a.getAttribute('data-dash')); });
      }); });
    }

    // Story ribbon
    function drawRibbon() {
      $('#ribbon').innerHTML = CASES.map(function (c, ci) {
        var map = claimMap(c), segs = [], share = { Verified: 0, Disputed: 0, Legend: 0, link: 0 }, total = 0;
        c.story.forEach(function (p) {
          var last = 0, m;
          SPAN.lastIndex = 0;
          var pushGap = function (t) { var n = t.trim().length; if (n > 2) { segs.push({ k: 'x', n: n, text: t.trim() }); share.link += n; total += n; } };
          while ((m = SPAN.exec(p))) {
            pushGap(p.slice(last, m.index));
            var cl = map[m[1]], n = m[2].length;
            segs.push({ k: cls[cl.label], n: n, c: cl });
            share[cl.label] += n; total += n;
            last = m.index + m[0].length;
          }
          pushGap(p.slice(last));
        });
        var pct = function (v) { return Math.round(v / total * 100); };
        return '<div class="ribbon-case"><h3>' + esc(c.title) + '</h3><p class="rc-sum">Share of story text: Verified ' + pct(share.Verified) + '%, Disputed ' +
          pct(share.Disputed) + '%, Legend ' + pct(share.Legend) + '%, linking sentences ' + pct(share.link) + '%.</p>' +
          '<div class="ribbon" data-ci="' + ci + '">' + segs.map(function (s, j) {
            return '<span class="rs ' + s.k + '" tabindex="0" style="flex-grow:' + s.n + ';transition-delay:' + (j * 0.03) + 's" data-j="' + j + '"></span>';
          }).join('') + '</div><div class="ribbon-share" aria-hidden="true">' +
          ['Verified', 'Disputed', 'Legend'].map(function (l) { return '<span class="' + cls[l] + '" style="width:' + (share[l] / total * 100) + '%"></span>'; }).join('') +
          '<span class="x" style="width:' + (share.link / total * 100) + '%"></span></div></div>';
      }).join('');
      $$('#ribbon .ribbon').forEach(function (rb) {
        var c = CASES[+rb.getAttribute('data-ci')], map = claimMap(c), segs = [];
        c.story.forEach(function (p) {
          var last = 0, m; SPAN.lastIndex = 0;
          var gap = function (t) { if (t.trim().length > 2) segs.push({ text: t.trim() }); };
          while ((m = SPAN.exec(p))) { gap(p.slice(last, m.index)); segs.push({ c: map[m[1]] }); last = m.index + m[0].length; }
          gap(p.slice(last));
        });
        $$('.rs', rb).forEach(function (el, j) {
          var s = segs[j];
          bindTip(el, s.c ? claimTip(s.c) : '<strong>Linking text</strong>' + esc(s.text));
        });
        requestAnimationFrame(function () { requestAnimationFrame(function () { rb.classList.add('drawn'); }); });
      });
    }

    // Instruction load bars
    function bars(el, rows, max) {
      el.innerHTML = rows.map(function (r) {
        return '<div class="bar-row"><span class="bl">' + r.label + '</span><span class="bar-track"><span class="bar-fill' + (r.muted ? ' muted' : '') +
          '" data-w="' + (r.n / max * 100).toFixed(1) + '"></span></span><span class="bn">' + fmt(r.n) + '</span></div>';
      }).join('');
    }
    function drawLoad() {
      var w = function (f) { return byFile[f] ? byFile[f].words : 0; };
      var maxFile = Math.max.apply(null, MODULES.map(function (m) { return m.words; }));
      bars($('#load-files'), MODULES.map(function (m) { return { label: '<code>' + esc(m.file) + '</code>', n: m.words, muted: m.file === 'examples.md' }; }), maxFile);
      var core = w('SKILL.md') + w('module-1-intake.md') + w('module-2-fact-table.md') + w('module-3-evidence-grading.md') + w('module-6-uncertainty-note.md');
      var rows = [
        { label: 'Before any task', n: DESC_WORDS },
        { label: 'Timeline only', n: core + w('module-4-timeline.md') },
        { label: 'Story only', n: core + w('module-5-narrative.md') },
        { label: 'Full', n: core + w('module-4-timeline.md') + w('module-5-narrative.md') },
        { label: 'Single file', n: TOTAL_WORDS, muted: true }
      ];
      bars($('#load-modes'), rows, TOTAL_WORDS);
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        $$('#v-load .bar-fill').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      }); });
    }
  })();

  /* ---------------- analysis counters ---------------- */
  $$('.fig-n[data-count]').forEach(function (el) {
    var target = +el.getAttribute('data-count');
    if (reduceMotion) return;
    el.textContent = '0';
    whenVisible(el, function () {
      var t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / 900);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  });

  /* ---------------- citation ---------------- */
  (function () {
    var TITLE = 'Veritale: An Evidence-Graded Skill for Telling History as a Story with Large Language Models';
    var SITE = 'https://rupeshrajak456.github.io/skill-veritale/';
    var STY = {
      apa: 'Rajak, R. (2026). Veritale: An evidence-graded skill for telling history as a story with large language models [Agent skill and project website]. Indian Institute of Technology (Indian School of Mines) Dhanbad. ' + SITE,
      mla: 'Rajak, Rupesh. "' + TITLE + '." Indian Institute of Technology (Indian School of Mines) Dhanbad, 2026, rupeshrajak456.github.io/skill-veritale/.',
      chicago: 'Rajak, Rupesh. 2026. "' + TITLE + '." Agent skill and project website. Indian Institute of Technology (Indian School of Mines) Dhanbad. ' + SITE + '.',
      bibtex: '@misc{rajak2026veritale,\n  author       = {Rajak, Rupesh},\n  title        = {' + TITLE + '},\n  year         = {2026},\n  howpublished = {\\url{' + SITE + '}},\n  note         = {Agent skill and project website, M.A. Digital Humanities and Social Sciences, Indian Institute of Technology (Indian School of Mines) Dhanbad. Source: ' + REPO + '}\n}'
    };
    var pre = $('#cite-text'), copyBtn = $('#cite-copy'), cur = 'apa';
    var btns = $$('#cite-tabs [role="tab"]');
    function pick(b) {
      btns.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      cur = b.getAttribute('data-style');
      pre.textContent = STY[cur];
      copyBtn.textContent = 'Copy citation';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { pick(b); }); });
    pick(btns[0]);
    copyBtn.addEventListener('click', function () {
      var text = STY[cur];
      var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy citation'; }, 1800); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(pre);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand('copy'); done(); } catch (e) { copyBtn.textContent = 'Press Ctrl+C to copy'; }
      }
    });
  })();
})();
