/* Youth Dividend — site configuration.
   Published posts are NOT defined here: they are Markdown files in research/,
   data-lab/ and resources/, discovered automatically (see assets/js/content.js).
   This file only holds the "In research" pipeline and the "On the horizon" list. */
window.YD = (() => {
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

  return { UPCOMING, HORIZON };
})();
