/* Youth Dividend — router, templates and motion. */
(() => {
  const { ARTICLES, THEMES, FORMATS, UPCOMING, HORIZON } = window.YD;
  const ART = window.YD_ART;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const view = $('#view');
  const nav = $('#nav');
  const loadbar = $('.loadbar');
  const progress = $('.progress');

  /* ---------- Helpers ---------- */
  const ARR_SVG = '<svg viewBox="0 0 24 12"><path d="M0 6h22M17 1l5 5-5 5"/></svg>';
  const ARROW = `<span class="arr" aria-hidden="true">${ARR_SVG}${ARR_SVG}</span>`;
  const ARROW_BACK = `<span class="arr back" aria-hidden="true">${ARR_SVG}${ARR_SVG}</span>`;
  const t = s => s.replace(/\*(.+?)\*/g, '<span class="o">$1</span>');
  const plain = s => s.replace(/\*/g, '');
  const pad = (n, l = 3) => String(n).padStart(l, '0');
  const fmtDate = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const fmtLabel = a => a.format + (a.series ? ' ' + a.series : '');
  const bySlug = s => ARTICLES.find(a => a.slug === s);
  const byDate = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date) || b.no - a.no);
  const themeCount = name => ARTICLES.filter(a => a.theme === name).length;

  const countable = v => {
    const m = /^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/.exec(v);
    return m ? `${m[1]}<span data-count="${m[2]}">${m[2]}</span>${m[3]}` : v;
  };
  const stat = (s, cls = '') => `
    <div class="stat ${cls}">
      <div class="stat-v">${countable(s.v)}${s.unit ? `<small>${s.unit}</small>` : ''}</div>
      <p class="stat-l">${s.l}${s.source ? `<span class="stat-src label">Source: ${s.source}</span>` : ''}</p>
    </div>`;
  const meta = (a, extra = '') => `
    <div class="meta"><span class="fmt">${fmtLabel(a)}</span><i></i><span>${a.theme}</span>${extra}</div>`;
  const fig = (a, n) => `
    <figure class="fig"><figcaption class="fig-cap"><span>Fig. ${pad(n, 2)}</span><span>${a.theme}</span></figcaption>${ART.render(a.art)}</figure>`;
  const href = a => `#/read/${a.slug}`;
  const STEPS = ['Problem', 'People', 'Policy', 'Proof', 'Lessons'];
  const secMark = kind => `<div class="sec-mark" data-reveal>${ART.rule(kind)}</div>`;

  /* ==========================================================================
     Pages
     ========================================================================== */
  const PAGES = {};

  /* ---------- Home ---------- */
  PAGES.home = () => {
    const lead = ARTICLES[0];

    const latest = `
      <a class="f-col hov" href="${href(lead)}" data-reveal>
        ${fig(lead, 1)}
        ${meta(lead, `<i></i><span>${fmtDate(lead.date)}</span>`)}
        <h3><span class="u">${plain(lead.title)}</span></h3>
        <p class="dek">${lead.dek}</p>
        <div class="foot"><b>${lead.stat.v}<small>${lead.stat.unit || ''}</small></b>${ARROW}</div>
      </a>` +
      UPCOMING.map((u, i) => `
      <a class="f-col soon hov" href="#/about?s=participate" data-reveal style="--rd:${i + 1}">
        <figure class="fig"><figcaption class="fig-cap"><span>Fig. ${pad(i + 2, 2)}</span><span>${u.theme}</span></figcaption>${ART.render(u.art)}</figure>
        <div class="meta"><span class="fmt">${u.status}</span><i></i><span>${u.theme}</span></div>
        <h3><span class="u">${u.title}</span></h3>
        <p class="dek">${u.dek}</p>
        <div class="foot"><span class="label dim">${u.note}</span>${ARROW}</div>
      </a>`).join('');

    return `
    <section class="band ink hero">
      <div class="container">
        <div class="hero-meta">
          <span class="label o" data-reveal>Independent youth research</span>
        </div>
        <h1 class="hero-title" data-split>Youth<br>Dividend<span class="o">.</span></h1>
        <div class="hero-foot">
          <p class="hero-tag" data-split>Bringing Young Lives to the Table.</p>
          <div class="hero-cta" data-reveal style="--rd:2"><a class="cta magnetic" href="#/explore"><span>Explore the research</span>${ARROW}</a></div>
        </div>
        <div class="hero-scene">${ART.scene()}</div>
      </div>
      <div class="ground" data-reveal></div>
    </section>

    <section class="band paper section">
      <div class="container">
        <div class="sec-head" data-reveal>
          <h2 class="sec-title">What’s at stake</h2>
          <span class="label dim">By the numbers</span>
        </div>
        ${secMark('dots')}
        <div class="numbers">
          <div class="num" data-reveal>
            <span class="num-v"><span data-count="1.2">1.2</span><span class="o">bn</span></span>
            <p>young people aged 15–24 — around one in six people on Earth.</p>
            <span class="label">Source: UN DESA</span>
          </div>
          <div class="num" data-reveal style="--rd:1">
            <span class="num-v">~<span data-count="10">10</span><span class="o">yrs</span></span>
            <p>gap in the age young people leave home between northern and southern Europe.</p>
            <span class="label">Source: Eurostat, 2023</span>
          </div>
          <div class="num" data-reveal style="--rd:2">
            <span class="num-v">1<span class="o"> in </span>5</span>
            <p>young people worldwide are not in employment, education or training.</p>
            <span class="label">Source: ILO</span>
          </div>
          <div class="num" data-reveal style="--rd:3">
            <span class="num-v"><span data-count="59">59</span><span class="o">%</span></span>
            <p>of young people in a ten-country survey are very or extremely worried about climate change.</p>
            <span class="label">Source: Lancet Planetary Health, 2021</span>
          </div>
        </div>
      </div>
    </section>

    <section class="band ink section">
      <div class="container">
        <div class="sec-head" data-reveal>
          <h2 class="sec-title">The Latest</h2>
          <a class="link" href="#/explore">All publications ${ARROW}</a>
        </div>
        ${secMark('step')}
        <div class="f-trio trio-art">${latest}</div>
      </div>
    </section>

    <section class="band paper section horizon">
      <div class="container">
        <div class="sec-head" data-reveal>
          <h2 class="sec-title">On the horizon</h2>
          <span class="label dim">Questions we’re tracking</span>
        </div>
        ${secMark('arc')}
      </div>
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          ${(() => {
            const words = ['The first job barrier', 'Housing deposits', 'Degree inflation', 'AI and entry-level work', 'Youth mobility', 'Digital exclusion', 'Access to mental health', 'Return migration'];
            const row = words.map(w => `<span>${w}</span>`).join('');
            return row + row;
          })()}
        </div>
      </div>
      <div class="container horizon-grid">
        ${HORIZON.map((h, i) => `
          <a class="horizon-item hov" href="#/about?s=participate" data-reveal style="--rd:${i}">
            <span class="no label dim">${pad(i + 1, 2)}</span>
            <h3><span class="u">${h.title}</span></h3>
            <p class="dek">${h.dek}</p>
            <span class="link">Tell us your experience ${ARROW}</span>
          </a>`).join('')}
      </div>
    </section>`;
  };
  PAGES.home.title = () => 'Youth Dividend — Bringing Young Lives to the Table';

  /* ---------- Explore ---------- */
  PAGES.explore = () => `
    <section class="band ink page-head">
      <div class="container">
        <div class="ph-top">
          <span class="label o" data-reveal>The archive</span>
          <span class="label dim" data-reveal style="--rd:1">Updated September 2026</span>
        </div>
        <h1 class="display-xxl" data-split>Explore</h1>
        <div class="ph-foot">
          <p class="lead" data-reveal>Policy briefs, research, youth voices, data stories and emerging issues — filed by theme, written with the people they’re about.</p>
          <dl class="ph-stats" data-reveal style="--rd:1">
            <div><dt data-count="${ARTICLES.length}">${ARTICLES.length}</dt><dd class="label dim">Published</dd></div>
            <div><dt data-count="${UPCOMING.length}">${UPCOMING.length}</dt><dd class="label dim">In research</dd></div>
            <div><dt data-count="${THEMES.length}">${THEMES.length}</dt><dd class="label dim">Themes</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="band paper">
      <div class="container filters" data-reveal>
        <div class="fl-row">
          <span class="label dim">Theme</span>
          <div class="chips" data-group="theme" role="group" aria-label="Filter by theme">
            ${['All', ...THEMES.map(x => x.name)].map(n => `
              <button class="chip" data-v="${n}" aria-pressed="false">${n}<sup>${n === 'All' ? ARTICLES.length : themeCount(n)}</sup></button>`).join('')}
          </div>
        </div>
        <div class="fl-row">
          <span class="label dim">Format</span>
          <div class="chips chips-sm" data-group="format" role="group" aria-label="Filter by format">
            ${['All', ...FORMATS].map(n => `<button class="chip" data-v="${n}" aria-pressed="false">${n}</button>`).join('')}
          </div>
        </div>
        <div class="fl-tools">
          <label class="search">
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.5"/><path d="M11 11l4 4"/></svg>
            <span class="sr">Search the archive</span>
            <input type="search" placeholder="Search the archive" autocomplete="off">
          </label>
          <span class="label dim result-count" aria-live="polite"></span>
          <div class="toggle" role="group" aria-label="View">
            <button data-view="index" aria-pressed="true">Index</button>
            <button data-view="editorial" aria-pressed="false">Editorial</button>
          </div>
        </div>
      </div>
      <div class="container archive"><div id="results"></div></div>
    </section>

    <section class="band ink section">
      <div class="container pipeline">
        <div class="sec-head" data-reveal>
          <h2 class="sec-title">In research</h2>
          <span class="label dim">Next from the desk</span>
        </div>
        ${secMark('cross')}
        <div class="f-trio">
          ${UPCOMING.map((u, i) => `
            <a class="f-col soon hov" href="#/about?s=participate" data-reveal style="--rd:${i}">
              <div class="meta"><span class="fmt">${u.status}</span><i></i><span>${u.theme}</span></div>
              <h3><span class="u">${u.title}</span></h3>
              <p class="dek">${u.dek}</p>
              <div class="foot"><span class="label dim">${u.note}</span>${ARROW}</div>
            </a>`).join('')}
        </div>
      </div>
    </section>`;
  PAGES.explore.title = () => 'Explore — Youth Dividend';

  const rowTpl = (a, i) => `
    <a class="a-row hov" href="${href(a)}" data-slug="${a.slug}" data-reveal style="--rd:${Math.min(i, 8)}">
      <span class="no">${pad(a.no)}</span>
      <div class="main">
        <span class="m-meta meta"><span class="fmt">${fmtLabel(a)}</span><i></i><span>${a.theme}</span><i></i><span>${fmtDate(a.date)}</span></span>
        <h3><span class="u">${plain(a.title)}</span></h3>
        <p class="dek">${a.dek}</p>
      </div>
      <span class="c">${a.theme}</span>
      <span class="c fmt">${fmtLabel(a)}</span>
      <span class="c c-date">${fmtDate(a.date)}</span>
      ${ARROW}
    </a>`;

  const edTpl = (a, i) => `
    <a class="ed-item hov" href="${href(a)}" data-reveal style="--rd:${i % 3}">
      ${fig(a, a.no)}
      ${meta(a, `<i></i><span>${fmtDate(a.date)}</span>`)}
      <h3><span class="u">${plain(a.title)}</span></h3>
      <p class="dek">${a.dek}</p>
      <div class="foot"><b>${a.stat.v}${a.stat.unit ? ' ' + a.stat.unit : ''}</b>${ARROW}</div>
    </a>`;

  function bindExplore(r) {
    const matchName = (list, v) => v && list.find(x => x.toLowerCase() === String(v).toLowerCase().replace(/-/g, ' '));
    let viewPref = 'index';
    try { viewPref = localStorage.getItem('yd-view') || 'index'; } catch (e) { /* storage unavailable */ }
    const st = {
      theme: matchName(THEMES.map(x => x.name), r.q.theme) || 'All',
      format: matchName(FORMATS, r.q.format) || 'All',
      q: '',
      view: viewPref === 'editorial' ? 'editorial' : 'index',
    };
    const results = $('#results');
    const countEl = $('.result-count');
    const input = $('.search input');

    const sync = () => {
      $$('[data-group="theme"] .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.theme));
      $$('[data-group="format"] .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === st.format));
      $$('.toggle button').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === st.view));
      const qs = new URLSearchParams();
      if (st.theme !== 'All') qs.set('theme', st.theme.toLowerCase());
      if (st.format !== 'All') qs.set('format', st.format.toLowerCase().replace(/ /g, '-'));
      history.replaceState(null, '', '#/explore' + (qs.toString() ? '?' + qs : ''));
    };

    const draw = () => {
      const q = st.q.trim().toLowerCase();
      const list = byDate.filter(a =>
        (st.theme === 'All' || a.theme === st.theme) &&
        (st.format === 'All' || a.format === st.format) &&
        (!q || [a.title, a.dek, a.theme, a.format].join(' ').toLowerCase().includes(q)));

      countEl.textContent = `Showing ${list.length} of ${ARTICLES.length}`;
      hidePreview();

      if (!list.length) {
        results.innerHTML = `
          <div class="empty" data-reveal>
            <span class="label o">Nothing filed here — yet</span>
            <h3>We haven’t published on this.<br><span class="dim">Should we?</span></h3>
            <a class="link" href="#/about?s=participate">Suggest a problem ${ARROW}</a>
          </div>`;
      } else if (st.view === 'index') {
        results.innerHTML = `
          <div class="a-head label"><span>No.</span><span>Title</span><span>Theme</span><span>Format</span><span class="c-date">Date</span><span></span></div>
          ${list.map(rowTpl).join('')}`;
      } else {
        results.innerHTML = `<div class="ed-grid">${list.map(edTpl).join('')}</div>`;
      }
      init();
    };

    $$('[data-group] .chip').forEach(b => b.addEventListener('click', () => {
      st[b.closest('[data-group]').dataset.group] = b.dataset.v;
      sync(); draw();
    }));
    $$('.toggle button').forEach(b => b.addEventListener('click', () => {
      st.view = b.dataset.view;
      try { localStorage.setItem('yd-view', st.view); } catch (e) { /* ignore */ }
      sync(); draw();
    }));
    let tmr;
    input.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(() => { st.q = input.value; draw(); }, 160); });

    if (fine && !reduce) {
      results.addEventListener('mouseover', e => {
        const row = e.target.closest('.a-row');
        if (row) showPreview(bySlug(row.dataset.slug));
      });
      results.addEventListener('mouseleave', hidePreview);
      results.addEventListener('mousemove', e => { pv.tx = e.clientX; pv.ty = e.clientY; });
    }

    sync(); draw();
  }

  /* ---------- Preview (follows cursor) ---------- */
  const pvEl = $('.preview');
  const pv = { x: 0, y: 0, tx: 0, ty: 0, slug: null, raf: 0, on: false };
  function showPreview(a) {
    if (!a) return;
    if (pv.slug !== a.slug) {
      pv.slug = a.slug;
      pvEl.innerHTML = `
        <div class="fig-cap"><span>No. ${pad(a.no)}</span><span>${a.theme}</span></div>
        ${ART.render(a.art)}
        <div class="pv-stat"><b>${a.stat.v}${a.stat.unit ? ' ' + a.stat.unit : ''}</b><span>${a.stat.l}</span></div>`;
      const svg = $('.art', pvEl);
      stagger(svg, 60);
      requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add('in')));
    }
    if (!pv.on) {
      pv.on = true;
      pv.x = pv.tx; pv.y = pv.ty;
      pvEl.classList.add('show');
      cancelAnimationFrame(pv.raf);
      const loop = () => {
        const w = pvEl.offsetWidth, h = pvEl.offsetHeight;
        let tx = pv.tx + 32, ty = pv.ty - h / 2;
        if (tx + w > innerWidth - 16) tx = pv.tx - w - 32;
        ty = Math.max(16, Math.min(innerHeight - h - 16, ty));
        pv.x += (tx - pv.x) * .16; pv.y += (ty - pv.y) * .16;
        pvEl.style.transform = `translate3d(${pv.x.toFixed(1)}px, ${pv.y.toFixed(1)}px, 0)`;
        if (pv.on) pv.raf = requestAnimationFrame(loop);
      };
      loop();
    }
  }
  function hidePreview() {
    pv.on = false; pv.slug = null;
    cancelAnimationFrame(pv.raf);
    pvEl.classList.remove('show');
  }

  /* ---------- About ---------- */
  PAGES.about = () => {
    const steps = [
      ['Problem', 'bars', 'We start with a concrete friction young people actually experience — then ask whether it is an individual problem or a structural pattern.'],
      ['People', 'people', 'We speak to the people living it: students, graduates, young workers, parents, employers and practitioners. Not to collect quotes, but to see how a system behaves in a life.'],
      ['Policy', 'book', 'Only then do we look at responses — comparing how different countries, cities and institutions have tried to solve the same problem.'],
      ['Proof', 'check', 'We test claims against existing evidence: OECD, Eurostat, national statistics, academic research — and say plainly where evidence is thin.'],
      ['Lessons', 'globe', 'We set out what helped, what didn’t, the trade-offs and the unanswered questions. Lessons, not verdicts on governments.'],
    ];
    const ways = [
      ['Submit a problem', 'What is one rule, cost or system that is currently making your life or career harder than it should be? Anonymous if you prefer.', '5 minutes', 'mailto:hello@youthdividend.org?subject=Problem%20submission'],
      ['Vote on the next question', 'Each month we put three possible research questions to the community. The one you pick becomes the next investigation.', 'Monthly', 'mailto:hello@youthdividend.org?subject=Community%20vote'],
      ['Share your experience', 'Selected contributors are invited to a 20-minute interview that turns a raw submission into structured qualitative evidence.', '20 minutes', 'mailto:hello@youthdividend.org?subject=Interview'],
      ['Collaborate with us', 'Researchers, youth organisations, universities and institutions who want to support — but never steer — independent research.', 'Institutions', 'mailto:hello@youthdividend.org?subject=Collaboration'],
    ];

    return `
    <section class="band ink page-head">
      <div class="container">
        <div class="ph-top">
          <span class="label o" data-reveal>About Youth Dividend</span>
          <span class="label dim" data-reveal style="--rd:1">Independent · Non-partisan · Open</span>
        </div>
        <h1 class="display-xl" data-split style="max-width:13ch">Evidence, from the people it’s <span class="o">about.</span></h1>
        <div class="ph-foot">
          <p class="lead" data-reveal>Youth Dividend is an independent, youth-focused research publication. We identify the problems young people actually face, investigate how different societies respond, and translate the findings into practical insight for the people making decisions.</p>
          <div class="about-art" data-reveal style="--rd:1"><div data-speed="-0.05">${ART.render('globe')}</div></div>
        </div>
      </div>
    </section>

    <section class="band paper section" id="mission">
      <div class="container mission-grid">
        <span class="label" data-reveal>01 — Mission</span>
        <p class="mission-statement" data-split>Governments make decisions about our future every day. We experience them as rent, tuition, jobs, visas and taxes. Somewhere between the policy document and real life, something gets lost. <em>We exist to find out what.</em></p>
        <div class="mission-cols">
          <p data-reveal>We start with problems and lived friction, not with judging policies. That keeps the work curious rather than cynical, and critical rather than partisan: the question is never who is to blame, but what is happening and what can be learned from how different societies are responding.</p>
          <p data-reveal style="--rd:1">We are independent. Sponsors and partners do not control our research questions, methodology, participant selection, analysis or conclusions — and funding and conflicts of interest are disclosed. Where the evidence is mixed or incomplete, we say so.</p>
        </div>
      </div>
    </section>

    <section class="band ink">
      <div class="container definition">
        <div class="def-term" data-reveal>
          <span class="label dim">02 — Definition</span>
          <h2>youth dividend</h2>
          <span class="pron">/ juːθ ˈdɪv.ɪ.dend / &nbsp;·&nbsp; <em>noun</em></span>
        </div>
        <ol class="def-list">
          <li data-reveal>The tangible benefit young people receive from the systems, institutions and policies that shape their early adult lives.</li>
          <li data-reveal style="--rd:1">A recurring question: who receives the benefit, who bears the cost, how large it is, when it arrives, and whether it is evenly shared.</li>
          <li data-reveal style="--rd:2"><em>(Youth Dividend)</em> An independent publication that asks, issue by issue: what are young people actually getting?</li>
        </ol>
      </div>
    </section>

    <section class="band paper section" id="method">
      <div class="container">
        <div class="sec-head" data-reveal>
          <h2 class="sec-title">How we work</h2>
          <span class="label dim">03 — Method</span>
        </div>
        <p class="lead" data-reveal style="margin-bottom:clamp(48px,6vw,88px);max-width:46ch">Every investigation follows the same five-step framework, so findings can be compared across issues, countries and editions.</p>
        <div class="steps">
          <div class="ground" data-reveal></div>
          ${steps.map((s, i) => `
            <div class="step" data-reveal style="--rd:${i}">
              <span class="n">${pad(i + 1, 2)}</span>
              ${ART.icon(s[1])}
              <h3>${s[0]}</h3>
              <p>${s[2]}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="band ink section" id="participate">
      <div class="container">
        <div class="sec-head" data-reveal>
          <span class="label o">Get involved</span>
          <span class="label dim">04 — Participate</span>
        </div>
        ${secMark('dots')}
        <div class="join-head">
          <h2 class="display-l" data-split>Your experience is evidence. <span class="o">Put it on the record.</span></h2>
          <p data-reveal>Young people aren’t the subject of this research — they set its agenda. There are four ways in, depending on how much time you have.</p>
        </div>
        <div class="join-list">
          ${ways.map((w, i) => `
            <a class="hov" href="${w[3]}" data-reveal style="--rd:${i}">
              <span class="no">${pad(i + 1, 2)}</span>
              <h3><span class="u">${w[0]}</span></h3>
              <p>${w[1]}</p>
              <span class="c">${w[2]}</span>
              ${ARROW}
            </a>`).join('')}
        </div>
      </div>
    </section>

    <section class="band paper section">
      <div class="container closer">
        <h2 class="display-xl" data-split>Start with <span class="o">the evidence.</span></h2>
        <div data-reveal><a class="cta magnetic" href="#/explore"><span>Explore the research</span>${ARROW}</a></div>
      </div>
    </section>`;
  };
  PAGES.about.title = () => 'About — Youth Dividend';

  /* ---------- Read (article) ---------- */
  PAGES.read = r => {
    const a = bySlug(r.arg);
    if (!a) return PAGES.notfound();
    const idx = byDate.indexOf(a);
    const next = byDate.length > 1 ? byDate[(idx + 1) % byDate.length] : null;

    return `
    <article>
      <section class="band ink">
        <header class="container read-head">
          <a class="back label" href="#/explore" data-reveal>${ARROW_BACK} The archive</a>
          <div data-reveal>${meta(a, `<i></i><span>${fmtDate(a.date)}</span><i></i><span>${a.read} read</span>`)}</div>
          <h1 class="display-xl" data-split>${t(a.title)}</h1>
          <p class="lead" data-reveal>${a.dek}</p>
        </header>
        <div class="container read-hero">
          <div data-reveal style="grid-column:1 / span 8">${fig(a, 1)}</div>
          <div data-reveal style="--rd:2;grid-column:9 / -1">${stat(a.stat)}</div>
        </div>
      </section>

      <section class="band paper">
        <div class="container read-body">
          <aside class="read-aside">
            <div class="read-aside-in" data-reveal>
              <nav class="toc" aria-label="In this piece">
                <span class="label dim" style="margin-bottom:6px">In this piece</span>
                <a href="#" data-jump="summary">Summary</a>
                <a href="#" data-jump="questions">The questions</a>
                <a href="#" data-jump="findings">Key findings</a>
                <a href="#" data-jump="voice">In their words</a>
                <a href="#" data-jump="method">Method</a>
              </nav>
              <dl>
                <div><dt class="label">No.</dt><dd>${pad(a.no)}</dd></div>
                <div><dt class="label">Published</dt><dd>${new Date(a.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</dd></div>
                <div><dt class="label">By</dt><dd>Youth Dividend Research Desk, with young contributors</dd></div>
              </dl>
            </div>
          </aside>

          <div class="read-main">
            <div class="prose" id="summary" data-reveal><p class="dropcap">${a.lede}</p></div>

            ${a.questions ? `
            <section id="questions">
              <div class="block-h" data-reveal><h2>The questions</h2><span class="label dim">${a.questions.length}</span></div>
              <ul class="questions">
                ${a.questions.map((q, i) => `<li data-reveal style="--rd:${i}">${ART.icon(q.icon)}<i></i><p>${q.text}</p></li>`).join('')}
              </ul>
            </section>` : ''}

            <section id="findings">
              <div class="block-h" data-reveal><h2>Key findings</h2><span class="label dim">${a.findings.length} points</span></div>
              <ol class="findings">
                ${a.findings.map((f, i) => `<li data-reveal style="--rd:${i}"><span class="n">${pad(i + 1, 2)}</span><p>${f}</p></li>`).join('')}
              </ol>
            </section>

            <blockquote class="pull" id="voice">
              <p data-split>“${a.quote.text}”</p>
              <footer class="label" data-reveal>— ${a.quote.who}</footer>
            </blockquote>

            <section class="method-box" id="method" data-reveal>
              <span class="label o">Method</span>
              <p>${a.method}</p>
              <div class="frame">${STEPS.map((s, i) => `${i ? ARROW : ''}<span>${s}</span>`).join('')}</div>
            </section>
          </div>
        </div>
      </section>

      <section class="band ink">
        ${next ? `
        <nav class="container read-next" aria-label="Next publication">
          <a class="hov" href="${href(next)}">
            <div class="l" data-reveal><span class="label dim">Next</span>${meta(next)}</div>
            <h2 class="display-l" data-split><span class="u">${plain(next.title)}</span></h2>
            ${ARROW}
          </a>
        </nav>` : `
        <div class="container read-next">
          <a class="hov" href="#/about?s=participate">
            <div class="l" data-reveal><span class="label dim">Next</span><div class="meta"><span class="fmt">Open call</span></div></div>
            <h2 class="display-l" data-split><span class="u">Help shape the next investigation.</span></h2>
            ${ARROW}
          </a>
        </div>`}
      </section>
    </article>`;
  };
  PAGES.read.title = r => { const a = bySlug(r.arg); return a ? `${plain(a.title)} — Youth Dividend` : 'Not found — Youth Dividend'; };

  /* ---------- 404 ---------- */
  PAGES.notfound = () => `
    <section class="band ink page-head" style="padding-bottom:clamp(96px,12vw,180px)">
      <div class="container">
        <span class="label o" data-reveal>Error 404</span>
        <h1 class="display-xxl" data-split style="margin-block:32px">Not <span class="o">found.</span></h1>
        <p class="lead" data-reveal style="margin-bottom:40px">This page has left home. It may have moved, or it may never have existed.</p>
        <div data-reveal><a class="cta magnetic" href="#/explore"><span>Explore the research</span>${ARROW}</a></div>
      </div>
    </section>`;
  PAGES.notfound.title = () => 'Not found — Youth Dividend';

  /* ==========================================================================
     Motion
     ========================================================================== */
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const wi = document.createElement('span');
            wi.className = 'wi';
            wi.style.setProperty('--i', i++);
            wi.textContent = part;
            w.appendChild(wi);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
  }

  function stagger(svg, step = 110) {
    $$('path, .dot', svg).forEach((p, i) => p.style.setProperty('--d', i * step));
  }

  function countUp(el) {
    const target = el.dataset.count;
    const n = parseFloat(target);
    const dec = (target.split('.')[1] || '').length;
    if (reduce || !n) return;
    const dur = 1700, t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = (n * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      $$('animateMotion', el).forEach(m => {
        if (reduce) m.setAttribute('dur', '0.001s');
        if (m.beginElementAt) m.beginElementAt(reduce ? 0 : 1.9);
      });
      if (el.dataset.count) countUp(el);
      $$('[data-count]', el).forEach(countUp);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  function magnet(el) {
    if (!fine || reduce || el.dataset.mag) return;
    el.dataset.mag = '1';
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transition = 'border-color .4s, background-color .4s, color .4s, transform .25s cubic-bezier(.19,1,.22,1)';
      el.style.transform = `translate(${x * .22}px, ${y * .32}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = '';
      el.style.transform = '';
    });
  }

  let px = [], bands = [];
  function init() {
    $$('[data-split]').forEach(split);
    $$('.art').forEach(svg => {
      if (svg.dataset.ready || svg.closest('.preview')) return;
      svg.dataset.ready = '1';
      if (!svg.classList.contains('art-scene')) stagger(svg, svg.classList.contains('icon') ? 140 : 110);
    });
    $$('[data-reveal]:not(.in), [data-split]:not(.in), .art:not(.in), [data-count]:not(.counted)').forEach(el => {
      if (el.closest('.preview')) return;
      if (el.dataset.count) el.classList.add('counted');
      if (el.dataset.count && el.parentElement.closest('[data-reveal]:not(.in)')) return;
      io.observe(el);
    });
    $$('.lockup').forEach(el => io.observe(el));
    px = $$('[data-speed]');
    bands = $$('.band');
    $$('.magnetic').forEach(magnet);
    tick();
  }

  /* Scroll: parallax, nav colour, reading progress */
  let lastY = 0, ticking = false;
  function tick() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (!reduce) {
      px.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -300 || r.top > vh + 300) return;
        const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    }
    // Which band sits under the navigation bar?
    const probe = 30;
    let onPaper = false;
    for (const b of bands) {
      const r = b.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { onPaper = b.classList.contains('paper'); break; }
    }
    nav.classList.toggle('on-paper', onPaper);
    nav.classList.toggle('scrolled', y > 12);
    if (y > 320 && y > lastY + 4) nav.classList.add('hidden');
    else if (y < lastY - 4 || y < 320) nav.classList.remove('hidden');
    lastY = y;
    if (document.body.classList.contains('reading')) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(tick));

  /* ==========================================================================
     Router + page transitions
     ========================================================================== */
  function parse() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = h.split('?');
    const parts = path.split('/').filter(Boolean);
    return { name: parts[0] || 'home', arg: parts[1], q: Object.fromEntries(new URLSearchParams(qs || '')) };
  }

  function setNav(name) {
    $$('.nav-links a').forEach(a => a.classList.toggle('active', a.dataset.nav === name));
  }

  function render(r) {
    const page = PAGES[r.name] && r.name !== 'notfound' ? PAGES[r.name] : PAGES.notfound;
    hidePreview();
    view.innerHTML = page(r);
    document.title = page.title(r);
    setNav(r.name === 'read' ? 'explore' : r.name);
    document.body.classList.toggle('reading', r.name === 'read');
    progress.style.transform = 'scaleX(0)';
    nav.classList.remove('hidden');
    window.scrollTo(0, 0);

    if (r.name === 'explore') bindExplore(r);
    init();

    $$('[data-jump]').forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      jump(a.dataset.jump);
    }));
    if (r.q.s) setTimeout(() => jump(r.q.s), reduce ? 0 : 500);
  }

  function jump(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY - 110;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }

  let first = true, token = 0;
  async function go() {
    const r = parse();
    const my = ++token;
    if (first || reduce) {
      first = false;
      render(r);
      return;
    }
    const b = document.body;
    loadbar.classList.remove('done');
    loadbar.style.transition = 'none';
    loadbar.style.transform = 'scaleX(0)';
    void loadbar.offsetWidth;
    loadbar.style.transition = '';
    loadbar.style.transform = '';
    b.classList.add('is-leaving');
    await wait(440);
    if (my !== token) return;
    b.classList.remove('is-leaving');
    b.classList.add('is-entering');
    render(r);
    view.focus({ preventScroll: true });
    void b.offsetHeight;
    b.classList.remove('is-entering');
    loadbar.classList.add('done');
  }

  addEventListener('hashchange', go);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute('href') === location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  });

  /* ---------- Newsletter ---------- */
  // TODO: connect to your newsletter provider (e.g. POST to its API) before launch.
  const form = $('.news-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('input', form), msg = $('.news-msg', form);
    if (!input.checkValidity() || !input.value) {
      msg.className = 'news-msg';
      msg.textContent = 'Please enter a valid email address.';
      input.focus();
      return;
    }
    msg.className = 'news-msg ok';
    msg.textContent = 'Thank you — you’ll hear from us with the next investigation.';
    input.value = '';
  });

  go();
})();
