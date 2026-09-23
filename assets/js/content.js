/* Youth Dividend — content store.
   Discovers every post in the content folders, reads its frontmatter and body, and
   exposes them newest first. Adding a post = adding a Markdown file to the right folder:

     research/   data-lab/   resources/

   The list of files comes from content-manifest.json (written by tools/build_content.py
   and generated live by tools/serve.py). If the manifest is missing, the folder listing
   of the web server is used instead. See README.md for the post format. */
window.YD_CONTENT = (() => {
  /* One entry per folder. The folder decides a post's type. */
  const TYPES = {
    research: {
      label: 'Research', code: 'RE', icon: 'book',
      blurb: 'Policy briefs and investigations that start with a problem young people face and follow it across countries.',
      empty: ['Research — coming soon', 'New investigations', 'are on the way.', 'Suggest a problem'],
    },
    'data-lab': {
      label: 'Data Lab', code: 'DL', icon: 'bars',
      blurb: 'Datasets, charts and visuals built from open data and our own surveys.',
      empty: ['Data Lab — opening soon', 'Datasets and interactive tools', 'are on the way.', 'Suggest a dataset'],
    },
    resources: {
      label: 'Resources', code: 'RS', icon: 'doc',
      blurb: 'Guides, explainers and templates for young people, practitioners and policymakers.',
      empty: ['Resources — opening soon', 'Guides and explainers', 'are on the way.', 'Tell us what would help'],
    },
  };
  const REQUIRED = ['title', 'date', 'type', 'tags', 'description', 'slug'];

  let posts = [];
  const problems = [];
  const warn = (path, msg) => {
    problems.push(`${path}: ${msg}`);
    console.warn(`[content] ${path}: ${msg}`);
  };

  async function listFiles() {
    try {
      const r = await fetch('content-manifest.json', { cache: 'no-cache' });
      if (r.ok) {
        const m = await r.json();
        if (Array.isArray(m.files)) return m.files;
      }
    } catch (e) { /* fall through to the directory listing */ }
    const found = [];
    await Promise.all(Object.keys(TYPES).map(async folder => {
      try {
        const r = await fetch(`${folder}/`, { cache: 'no-cache' });
        if (!r.ok) return;
        const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
        doc.querySelectorAll('a[href]').forEach(a => {
          const name = decodeURIComponent(a.getAttribute('href')).split('/').filter(Boolean).pop() || '';
          if (/\.md$/i.test(name) && !/^[_.]/.test(name)) found.push(`${folder}/${name}`);
        });
      } catch (e) { /* folder not reachable */ }
    }));
    if (!found.length) console.warn('[content] No content-manifest.json and no folder listing — run `python tools/build_content.py`.');
    return found;
  }

  const isoDate = d => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? '').trim().slice(0, 10));
  const toTags = v => [...new Set((Array.isArray(v) ? v : v ? String(v).split(',') : []).map(s => String(s).trim()).filter(Boolean))];

  function parse(path, text) {
    const m = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/.exec(text);
    if (!m) throw new Error('missing frontmatter block (--- … ---) at the top of the file');
    const fm = window.jsyaml.load(m[1]) || {};
    const folder = path.split('/')[0];
    const file = path.split('/').pop().replace(/\.md$/i, '');
    if (fm.type && fm.type !== folder) warn(path, `type "${fm.type}" does not match its folder; treating it as "${folder}"`);
    const post = {
      ...fm,
      type: folder,
      slug: String(fm.slug || file.replace(/^\d+[-_]/, '')).trim(),
      title: fm.title == null ? '' : String(fm.title),
      description: fm.description == null ? '' : String(fm.description),
      date: isoDate(fm.date),
      tags: toTags(fm.tags),
      number: fm.number == null || fm.number === '' ? null : Number(fm.number),
      body: m[2] || '',
      path,
    };
    REQUIRED.forEach(k => {
      const v = k === 'type' ? fm.type : post[k];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) warn(path, `missing "${k}" in frontmatter`);
    });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) warn(path, `date "${post.date}" should look like 2026-09-23`);
    post.plainTitle = post.title.replace(/\*/g, '');
    post.label = TYPES[folder].label;
    post.code = fm.code ? String(fm.code) : `${TYPES[folder].code}${post.number != null ? ' ' + String(post.number).padStart(2, '0') : ''}`;
    post.href = `#/${folder}/${post.slug}`;
    return post;
  }

  // Newest first. Posts published on the same date are ordered by number (highest first), then title.
  const compare = (a, b) =>
    b.date.localeCompare(a.date) ||
    (b.number ?? -Infinity) - (a.number ?? -Infinity) ||
    a.plainTitle.localeCompare(b.plainTitle);

  // Posts bundled into assets/js/content-bundle.js (always current on tools/serve.py; rebuilt by
  // tools/build_content.py). Used when files can't be fetched, e.g. index.html opened directly.
  const BUNDLE = window.YD_BUNDLE || null;

  const ready = (async () => {
    let files = location.protocol === 'file:' ? [] : await listFiles();
    const useBundle = BUNDLE && (!files.length || location.protocol === 'file:');
    if (useBundle) files = Object.keys(BUNDLE);
    const loaded = await Promise.all(files.map(async path => {
      if (!TYPES[path.split('/')[0]]) return null;
      try {
        if (useBundle) return parse(path, BUNDLE[path]);
        const r = await fetch(path, { cache: 'no-cache' });
        if (!r.ok) throw new Error(`could not be loaded (HTTP ${r.status})`);
        return parse(path, await r.text());
      } catch (e) {
        warn(path, e.message);
        return null;
      }
    }));
    const seen = new Set();
    posts = loaded.filter(p => {
      if (!p || !p.title || !p.slug || p.draft === true) return false;
      const key = `${p.type}/${p.slug}`;
      if (seen.has(key)) { warn(p.path, `duplicate slug "${p.slug}" — this file is skipped`); return false; }
      seen.add(key);
      return true;
    }).sort(compare);
  })();

  /* Markdown → HTML. Posts are written by the site's editors, so their HTML is trusted. */
  const md = text => (window.marked ? window.marked.parse(text || '', { gfm: true, breaks: false }) : `<p>${String(text || '')}</p>`);

  return {
    TYPES,
    ready,
    md,
    all: () => posts,
    ofType: type => posts.filter(p => p.type === type),
    get: (type, slug) => posts.find(p => p.type === type && p.slug === slug),
    problems: () => problems.slice(),
  };
})();
