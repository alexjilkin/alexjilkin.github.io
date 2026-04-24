# Personal Academic Website

This repository contains a minimal academic website built on top of the open-source [`al-folio`](https://github.com/alshedivat/al-folio) Jekyll theme and configured for GitHub Pages deployment.

## What is included

- short homepage / about section
- featured research section on the homepage
- publications page
- publication links for DOI, arXiv, GitHub, and Zenodo
- contact links for GitHub, Google Scholar, ORCID, LinkedIn, and email
- GitHub Actions deployment to GitHub Pages

## Edit your identity and links

Update these placeholders before deploying:

1. Edit [`_config.yml`](/home/alexz/Documents/personal-website/_config.yml) and replace:
   - `title`
   - `author.name`
   - `author.github`
   - `url` and `baseurl` if you move the site to a different GitHub Pages location
2. Edit [`index.md`](/home/alexz/Documents/personal-website/index.md) and replace:
   - homepage text
   - optional bio/about wording

## Edit publications

All publication content lives in [`_data/publications.yml`](/home/alexz/Documents/personal-website/_data/publications.yml).

Each publication entry supports these fields:

```yml
- title: "Paper title"
  authors: "Author One, Author Two"
  venue: "Conference or Journal"
  year: 2025
  status: "optional"
  featured: true
  summary: "One or two sentence description."
  doi: "10.0000/example"
  arxiv: "2501.01234"
  github: "https://github.com/your-user/your-repo"
  zenodo: "https://zenodo.org/records/1234567"
```

Notes:

- Set `featured: true` to show a paper in the homepage featured section.
- `doi` should be the DOI identifier only, not the full `https://doi.org/...` URL.
- `arxiv` should be the arXiv identifier only, not the full URL.
- `github` and `zenodo` should be full URLs.
- Publications are shown newest-first automatically.

## Run locally

Prerequisites:

- Ruby and Bundler installed

Commands:

```bash
bundle install
bundle exec jekyll serve
```

Then open `http://127.0.0.1:4000`.

## Deploy to GitHub Pages

1. Push this repository to the `main` branch on GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push another commit if needed, or manually run the `Deploy Jekyll site to Pages` workflow from the `Actions` tab.
5. After the workflow succeeds, the site will be published at the URL set by GitHub Pages. For a user site, that is typically `https://<github-username>.github.io/`.
5. For a user-site repository named `alexjilkin.github.io`, the published URL should be `https://alexjilkin.github.io/`.

## Ongoing maintenance

- Edit homepage content in [`index.md`](/home/alexz/Documents/personal-website/index.md).
- Edit publication records in [`_data/publications.yml`](/home/alexz/Documents/personal-website/_data/publications.yml).
- Edit layout or styling only if needed in [`_layouts/home.html`](/home/alexz/Documents/personal-website/_layouts/home.html), [`_layouts/publications.html`](/home/alexz/Documents/personal-website/_layouts/publications.html), and [`assets/css/custom.scss`](/home/alexz/Documents/personal-website/assets/css/custom.scss).
