/*
  Lebanese Physics Society Directory

  This website reads the public member directory from the published Google Sheet CSV.
  Update the links below if the spreadsheet, WhatsApp group, or member form changes.
*/

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQlZB_yrUvpRD2YUaVe8-ECNTjIdV2xQy0_HV_BvAOew6zcwIAotm37GuwpiAFPA_ZSJ-blZVbg1ySa/pub?gid=1148582899&single=true&output=csv";

const WHATSAPP_URL = "https://chat.whatsapp.com/Jg8feDmGYYs3R0Xxuo2sx2?mode=gi_t";
const MEMBER_FORM_URL = "https://wa.me/33662436766?text=Hello%20Anthony%2C%20I%20would%20like%20to%20be%20added%20to%20the%20Lebanese%20Physics%20Society%20member%20directory.%0A%0AName%3A%0AName%20FAMILY%20NAME%0A%0ABranch%2FKeywords%20about%20your%20research%3A%0ATheory%20%22T%22%2C%20Experimental%20%22E%22%2C%20Numerical%20%22N%22%2C%20a%20mixed%3A%20TE%2C%20EN%2C%20...%20and%20keywords%20about%20your%20research%20field%0A%0AContact%20%28mail%2Fphone%20number%29%3A%0AAny%20type%20of%20contact%20if%20someone%20wants%20to%20talk%20to%20you%0A%0APhD%20lab%2Finstitution%3A%0AWhere%20you%20did%20your%20PhD%0A%0AMSc%20institution%3A%0AWhere%20you%20did%20your%20master%20degree%0A%0ABSc%20institution%3A%0AWhere%20you%20did%20your%20bachelor%20degree%0A%0ANotable%20contacts%20%28PhD%2Fpast%20interns%2Fsupervisors%2C%20...%29%3A%0APeople%20that%20you%20worked%20with%20or%20supervised%20you%20during%20your%20research%2Fstudies%0A%0ALinkedIn%20link%3A%0AA%20link%20into%20your%20LinkedIn%20profile%2C%20if%20available%0A%0ACurrent%20position%3A%0AYour%20current%20position%0A%0ADetails%3A%0AAny%20detail%20you%27d%20like%20to%20add";
