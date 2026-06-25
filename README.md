# Lebanese Physics Society — Directory Website

This static website reads members from the published Google Sheet CSV in `config.js` and displays a searchable public directory.

## Latest update

- Added the WhatsApp group link in the header and footer.
- Added the member-directory spreadsheet/form link in the header and footer.
- Members are sorted alphabetically by family name.
- `T`, `N`, and `E` branch codes are displayed as `Theory`, `Numerical`, and `Experimental`.
- Status/current-position fields are not shown on the public website.
- Empty `Publish` cells no longer hide members. Only explicit values such as `NO`, `FALSE`, `PRIVATE`, `HIDDEN`, or `DRAFT` hide a member.
- The CSV parser is more tolerant of updated column names such as `Full Name`, `First Name`, `Family Name`, `Branch`, and `Research Keywords`.
- The CSV fetch uses cache busting so recent Google Sheet updates appear more reliably.

## Links configured in `config.js`

- `CSV_URL` — published Google Sheet CSV used as the public database.
- `WHATSAPP_URL` — Lebanese Physics Society WhatsApp invitation link.
- `MEMBER_FORM_URL` — spreadsheet/form link for people who want to be added.

## Files to upload to GitHub

Upload all files in this folder to the root of the GitHub repository:

- `index.html`
- `member.html`
- `styles.css`
- `config.js`
- `csv.js`
- `app.js`
- `member.js`
- `Logo.png`
- `README.md`

Then commit changes. GitHub Pages will rebuild automatically.


## News and Offers pages

This version adds:

- `news.html` — a page for announcements, seminars, events, and society updates.
- `offers.html` — a page for jobs, PhD theses, internships, postdocs, and other opportunities.
- `links.js` — a small shared script that inserts the WhatsApp and directory links in the new pages.
- `phd-thesis-lpl-optical-fiber-geophysics.pdf` — the PDF thesis proposal linked from the Offers page.

The first offer currently displayed is a PhD thesis opportunity at Laboratoire de Physique des Lasers, Université Sorbonne Paris Nord, with date published set to 25 June 2026.

Upload all files, including `news.html`, `offers.html`, `links.js`, and the PDF, to the root of the GitHub repository.
