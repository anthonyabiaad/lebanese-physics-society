# Lebanese Physics Society Website

This static website is connected to the published Google Sheet CSV in `config.js` and is hosted with GitHub Pages.

## Main pages

- `index.html` — members directory
- `board.html` — board members
- `news.html` — news section
- `offers.html` — opportunities section
- `member.html` — individual member profile page

## Main scripts

- `config.js` — Google Sheet CSV link, WhatsApp group link, and WhatsApp member-request message
- `csv.js` — reads and adapts the Google Sheet data
- `app.js` — renders the member cards on the directory page
- `member.js` — renders individual member profiles
- `links.js` — applies shared footer links on static pages

## Photos

Member and board photos should be uploaded to the `photos/` folder. Use links like:

`https://anthonyabiaad.github.io/lebanese-physics-society/photos/filename.jpg`

Example:

`https://anthonyabiaad.github.io/lebanese-physics-society/photos/john-el-hajj.jpg`

## Updating the site

Upload the modified files to the root of the GitHub repository, except board/member photos, which should go inside `photos/`.
