# Youth Dividend — website

A static site: HTML, CSS and plain JavaScript, with no framework. Posts are Markdown files that
the site discovers on its own.

## Run it locally

```bash
python tools/serve.py
```

Then open <http://localhost:5173>. The dev server rebuilds the list of posts on every page
load, so a new file shows up as soon as you refresh.

## Adding a post

Create one Markdown file in the right folder. Nothing else needs editing: navigation,
Explore, counts and "next post" links all update themselves.

| Folder        | Appears as | Web address                  |
|---------------|------------|------------------------------|
| `research/`   | Research   | `#/research/<slug>`          |
| `data-lab/`   | Data Lab   | `#/data-lab/<slug>`          |
| `resources/`  | Resources  | `#/resources/<slug>`         |

Each folder has a `_template.md` to copy. Files starting with `_` are never published.

### Frontmatter

Every post starts with a YAML block between `---` lines.

| Field         | Required | Notes |
|---------------|----------|-------|
| `title`       | yes      | Wrap words in `*asterisks*` to set them in orange. |
| `slug`        | yes      | Lower-case words joined by hyphens. Must be unique within the folder. |
| `type`        | yes      | `research`, `data-lab` or `resources`. Must match the folder. |
| `date`        | yes      | `YYYY-MM-DD`. Explore lists the newest first. |
| `tags`        | yes      | A list, e.g. `["Housing", "Europe"]`. The first tag is used as the post's main topic. |
| `description` | yes      | One or two sentences, shown under the title and in Explore. For Data Lab, the data question. |
| `number`      | no       | Shown as the post code (`RE 01`, `DL 10`, `RS 03`). Among posts published on the same date, the higher number is listed first. |
| `series`      | no       | A label shown instead of the type, e.g. `Policy Brief #02` or `Guide`. |
| `art`         | no       | Line illustration: `house`, `bars`, `rooms`, `book`, `ladder`, `grid`, `pulse`, `queue`, `route`, `phone`, `ballot`, `globe`, `clock`, `wave`, `town`, `screen`. |
| `stat`        | no       | Headline number: `value`, `unit`, `label`, `source`. |
| `read`, `author` | no    | Reading time and byline. |
| `draft`       | no       | `true` keeps the post off the site. |
| `questions`   | no       | Research: list of `{ icon, text }` shown after the first paragraph. |
| `file`, `fileLabel` | no | Resources: a downloadable file. |
| `dataset`     | no       | Data Lab: one of the built-in datasets (below). |
| `sources`     | no       | Data Lab: list of `{ name, url, note }` shown under "Sources". |

If a post has a problem (such as a missing field, a wrong date format or a duplicate slug), the
browser console shows a `[content]` warning naming the file.

### Writing the body

Use ordinary Markdown. Some elements get special styling:

- **The first paragraph** is set with a drop cap. This applies to Research and Resources.
- **`## Headings`** start sections and fill the "In this piece" contents list.
- **Numbered lists** are styled as key findings, with large numbers.
- **Block quotes** become pull quotes. End a quote with a line that starts with `— ` to credit the speaker.

### Data Lab charts

A Data Lab post can draw charts in two ways.

1. **A declarative chart**: a fenced ```` ```chart ```` block of YAML with `type: dots | bars | lines`.
   This needs no code. Each chart gets hover tooltips, a table view and a CSV download.
   See `data-lab/_template.md` for the format.
2. **A built-in dataset**: set `dataset:` in the frontmatter, then write `{{ answer <dataset> }}`
   and `{{ figure <dataset>/<chart> }}` in the body. These charts are computed from
   `assets/js/datalab-data.js`, which `tools/build_datalab.py` builds from the Eurostat and World Bank APIs:

   | Dataset        | Charts |
   |----------------|--------|
   | `independence` | `gender`, `trend` |
   | `cost`         | `compare`, `trend` |
   | `paycheck`     | `compare`, `ratio` |
   | `migration`    | `age`, `net` |
   | `jobs`         | `map`, `trend` |
   | `gap`          | `poverty`, `trend`, `income` |
   | `eduwork`      | `levels`, `vocational` |
   | `day`          | `24h`, `diff` |
   | `population`   | `map`, `regions` |
   | `digital`      | `ai`, `purposes`, `skills` |

   To refresh these figures with the latest releases, run `python tools/build_datalab.py`.

Only publish numbers that come from a named, verifiable source.

## Deploying

A browser can't list a folder on a static host, so the site reads the list of posts from
`content-manifest.json`. Write it before every deploy:

```bash
python tools/build_content.py
```

On a host with a build step (Netlify, Vercel, Cloudflare Pages), set that command as the build
command and the project root as the publish directory. Without a manifest, the site falls back
to the server's folder listing where one is available.

## Project layout

```
index.html                 page shell (navigation, footer)
research/  data-lab/  resources/    posts, one Markdown file each
assets/css/styles.css      all styles
assets/js/content.js       finds and parses posts
assets/js/app.js           routing, pages and animation
assets/js/datalab.js       Data Lab charts and post renderer
assets/js/datalab-data.js  generated data (do not edit by hand)
assets/js/art.js           line illustrations
assets/js/data.js          "In research" and "On the horizon" lists
tools/                     dev server and build scripts
```
