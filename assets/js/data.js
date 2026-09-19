/* Youth Dividend — publication data.
   NOTE: figures marked "source:" are real; quotes and participant details are
   editorial placeholders. Replace before publishing. */
window.YD = (() => {
  const THEMES = [
    { name: 'Housing',    icon: 'house',  blurb: 'Leaving home, renting, owning — and the long wait in between.' },
    { name: 'Education',  icon: 'book',   blurb: 'What learning costs, what it returns, and who gets to finish.' },
    { name: 'Work',       icon: 'ladder', blurb: 'First jobs, precarious jobs, and the jobs that are disappearing.' },
    { name: 'Health',     icon: 'pulse',  blurb: 'Mental and physical wellbeing, and the systems meant to protect it.' },
    { name: 'Mobility',   icon: 'route',  blurb: 'Getting around, getting out, and the geography of opportunity.' },
    { name: 'Technology', icon: 'phone',  blurb: 'Platforms, algorithms, AI — and who they are built for.' },
    { name: 'Society',    icon: 'people', blurb: 'Voice, trust, participation and the social contract.' },
  ];

  const FORMATS = ['Policy Brief', 'Research', 'Youth Voices', 'Data Story', 'Emerging Issue'];

  const METHOD = {
    'Policy Brief': 'Comparative review of national and city-level policy, triangulated with published statistics and interviews with young people in each country studied.',
    'Research': 'Mixed-methods study combining secondary data analysis with structured interviews and a standing youth advisory panel.',
    'Youth Voices': 'Participatory interviews led by trained young co-researchers. Names are changed and quotes lightly edited for length, always with participants’ approval.',
    'Data Story': 'Built from open data and our own collected datasets. Every chart links to its source, and methodology notes accompany each dataset.',
    'Emerging Issue': 'Horizon-scanning note: an early signal we are tracking, drawn from expert interviews, literature review and youth panel discussion. Treat as provisional.',
  };

  /* Published archive */
  const ARTICLES = [
    {
      no: 1, slug: 'who-gets-to-leave-home', format: 'Policy Brief', series: '#01', theme: 'Housing',
      date: '2026-09-01', read: '22 min', art: 'house', edition: true,
      title: 'Who Gets to *Leave Home?*',
      dek: 'The global struggle for affordable youth housing — and what different countries are doing about it.',
      stat: { v: '26.3', unit: 'yrs', l: 'average age young Europeans leave the parental home', source: 'Eurostat, 2023' },
      questions: [
        { icon: 'house', text: 'Why do young people in some countries achieve independent living much earlier than others?' },
        { icon: 'bars', text: 'Which housing policies appear to reduce the barriers to independence?' },
        { icon: 'globe', text: 'What does each approach actually give young people — and what does it cost them, their families, taxpayers, or the wider housing market?' },
      ],
      lede: 'Across Europe, the age at which young people leave home varies by roughly a decade — from the early twenties in the Nordic countries to over thirty in parts of the south and east. Income explains some of that gap. Policy explains a surprising amount of the rest. This brief compares how different countries help — or fail to help — young people take the first step into a home of their own.',
      findings: [
        'Countries with large social, cooperative or non-profit rental sectors see earlier independence, even where youth incomes are lower.',
        'Direct cash subsidies for young renters help individuals, but can push up prices where housing supply is fixed.',
        'The most effective packages pair supply — homes young people can actually rent — with security of tenure once they are in.',
      ],
      quote: { text: 'I have a job, a degree and a partner. What I don’t have is a door with my own name on it.', who: 'Marta, 29' },
    },
  ];

  /* Investigations currently in the pipeline (not yet published) */
  const UPCOMING = [
    {
      slug: 'first-experience-problem', theme: 'Work', art: 'ladder', status: 'In research',
      title: 'The First Experience Problem',
      dek: 'Why are young people expected to have experience before they can get their first experience — and what can different systems teach us?',
      note: 'Interviews open',
    },
    {
      slug: 'apprenticeship-paradox', theme: 'Education', art: 'book', status: 'In research',
      title: 'The Apprenticeship Paradox',
      dek: 'Why do some countries make it possible to earn while learning, while others force young people to choose between education and work?',
      note: 'Country selection',
    },
  ];

  /* Early signals we are tracking */
  const HORIZON = [
    {
      title: 'The Youth Support Gap', art: 'grid',
      dek: 'How much support is actually available to young people — and how much of it do they know exists?',
    },
    {
      title: 'The Return Migration Question', art: 'town',
      dek: 'Can countries actually convince the young people who leave to come back?',
    },
    {
      title: 'The 25-Year-Old Test', art: 'clock',
      dek: 'If you were 25 today, what would your country’s policies actually change in your life?',
    },
  ];

  ARTICLES.forEach(a => { a.method = METHOD[a.format]; });

  return { THEMES, FORMATS, ARTICLES, UPCOMING, HORIZON };
})();
