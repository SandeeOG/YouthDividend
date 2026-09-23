---
# ───────────────────────────────────────────────────────────────────────────
#  DATA LAB POST TEMPLATE
#  Copy this file, rename it (e.g. 11-youth-wages-over-time.md) and fill it in.
#  Files whose names start with "_" are ignored, so this template is never published.
# ───────────────────────────────────────────────────────────────────────────
title: "Your Data Question, as a Title"
slug: your-data-post                     # the web address: #/data-lab/your-data-post
type: data-lab                           # must match the folder name
number: 11                               # shown as “DL 11”; also orders posts published on the same day
date: 2026-10-01                         # YYYY-MM-DD — Explore lists the newest first
tags: ["Work", "Europe"]
description: "The data question this post answers, written as a question?"

# ── Optional ────────────────────────────────────────────────────────────────
art: bars                                # illustration shown in Explore
draft: true                              # true keeps the post off the site until you are ready
stat:                                    # the headline number in the header
  value: "00.0"
  unit: "%"
  label: "what the number measures, where and when"
sources:                                 # listed under “Sources” at the end of the post
  - name: "Eurostat — dataset title (dataset_code)"
    url: "https://ec.europa.eu/eurostat/databrowser/view/dataset_code/default/table"
    note: "Retrieved 2026-10-01"

# To reuse one of the built-in datasets instead (its stat and sources are added
# automatically), set `dataset:` to one of: independence, cost, paycheck, migration,
# jobs, gap, eduwork, day, population, digital — and use {{ answer … }} / {{ figure … }}
# in the body, e.g. {{ figure independence/trend }}.
---

A short introduction: what the data shows, in two or three sentences.
Every number you write here must come from the chart data below and its source.

```chart
# A declarative chart. type: dots | bars | lines
# EXAMPLE VALUES — replace them with real, sourced data before publishing.
type: dots
title: "Chart title"
subtitle: "What is measured, unit, geography, year"
unit: "%"                 # appended to every value
decimals: 1
series:                   # colours: young (brand orange) or ref (ink blue)
  - name: "Aged 15–29"
    color: young
  - name: "Total population"
    color: ref
highlight: ["EU-27"]      # rows to emphasise
rows:                     # label, then one value per series
  - ["Country A", 20.0, 15.0]
  - ["EU-27", 12.0, 10.0]
  - ["Country B", 8.0, 9.0]
source: "Organisation (dataset code), year"
note: "Anything a reader needs to interpret the chart."
```

What the chart shows, in a sentence or two.

```chart
# Bars: one value per row. Add `diverging: true` for values either side of zero,
# and `reference:` for a vertical line such as an average.
# EXAMPLE VALUES — replace them with real, sourced data before publishing.
type: bars
title: "Chart title"
subtitle: "What is measured"
unit: "%"
series:
  - name: "Share of young people"
    color: young
reference:
  value: 12
  label: "EU-27 12%"
rows:
  - ["Country A", 20.0]
  - ["Country B", 8.0]
source: "Organisation (dataset code), year"
```

```chart
# Lines: one value per x position for each line.
# EXAMPLE VALUES — replace them with real, sourced data before publishing.
type: lines
title: "Chart title"
subtitle: "What is measured, years"
unit: "%"
x: [2021, 2022, 2023, 2024, 2025]
lines:
  - name: "Aged 15–29"
    color: young
    values: [10.1, 9.9, 10.0, 9.7, 9.1]
  - name: "Total population"
    color: ref
    values: [8.7, 8.7, 8.8, 8.2, 7.7]
source: "Organisation (dataset code), years"
```

## About the data

- How the indicator is defined.
- Coverage, breaks in series, and anything the reader should know.
