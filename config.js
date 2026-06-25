/*
  Lebanese Physics Society Directory

  This website reads the public member directory from the published Google Sheet CSV.
  Update the links below if the spreadsheet, WhatsApp group, or member form changes.
*/

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQlZB_yrUvpRD2YUaVe8-ECNTjIdV2xQy0_HV_BvAOew6zcwIAotm37GuwpiAFPA_ZSJ-blZVbg1ySa/pub?gid=1148582899&single=true&output=csv";

const WHATSAPP_URL = "https://chat.whatsapp.com/Jg8feDmGYYs3R0Xxuo2sx2?mode=gi_t";
const MEMBER_MESSAGE = `Hello Anthony, I would like to be added to the Lebanese Physics Society member directory.

Name:
Name FAMILY NAME

Branch/Keywords about your research:
Theory "T", Experimental "E", Numerical "N", a mixed: TE, EN, ... and keywords about your research field

Contact (mail/phone number):
Any type of contact if someone wants to talk to you

PhD lab/institution:
Where you did your PhD

MSc institution:
Where you did your master degree

BSc institution:
Where you did your bachelor degree

Notable contacts (PhD/past interns/supervisors, ...):
People that you worked with or supervised you during your research/studies

LinkedIn link:
A link into your LinkedIn profile, if available

Current position:
Your current position

Details:
Any detail you'd like to add`;

const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const MEMBER_FORM_URL =
  (IS_MOBILE ? "https://api.whatsapp.com/send" : "https://web.whatsapp.com/send") +
  "?phone=33662436766&text=" +
  encodeURIComponent(MEMBER_MESSAGE);
