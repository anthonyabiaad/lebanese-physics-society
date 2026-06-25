# Lebanese Physics Society Directory — Version Adapted to Your Excel File

This website is adapted to the Excel file you uploaded.

## Your current columns

The code reads these columns:

- Name
- Branch/Keywords about your research
- Contact (mail/phone number)
- PhD lab/institution
- Msc institution
- Bsc institution
- Notable contacts
- LinkedIn link
- Current position
- Details

## Strongly recommended extra columns

Add these columns to the Google Sheet before publishing:

- Publish — write YES for people who should appear publicly
- Photo URL — direct public image link for the profile picture
- Slug — optional clean URL name, e.g. anthony-abi-aad

If there is no Publish column, the website will show all non-empty rows.

## Privacy warning

Do not publish private phone numbers unless every person gave explicit consent.
The website displays only the extracted email, not the full contact cell, but the CSV itself is still public if the Google Sheet is published to the web.

Best practice:
create a separate public tab containing only public-safe information.

## How to use

1. Upload your Excel file to Google Sheets.
2. Create a public tab, for example `Public Directory`.
3. Keep only public-safe columns and rows.
4. Add `Publish` and `Photo URL` columns.
5. Go to File > Share > Publish to web.
6. Choose the public tab and CSV format.
7. Copy the CSV link.
8. Open `config.js` and paste the CSV link inside `CSV_URL`.
9. Upload all website files to GitHub Pages.

## Pages

- `index.html` is the directory.
- `member.html` is the profile page.


## Your published CSV link is already inserted

The `config.js` file already contains the Google Sheet CSV link you provided. If you publish a different tab later, replace the value of `CSV_URL` in `config.js`.
