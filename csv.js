function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some(cell => cell !== "")) rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some(cell => cell !== "")) rows.push(currentRow);

  if (!rows.length) return [];

  const headers = rows.shift().map(header => normalizeKey(header));
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      if (!header) return;
      obj[header] = row[index] || "";
    });
    return obj;
  });
}

function normalizeKey(key) {
  return (key || "")
    .toString()
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[()\[\]]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function cleanDash(value) {
  const cleaned = (value || "").toString().trim();
  return ["-", "—", "–", "n/a", "N/A"].includes(cleaned) ? "" : cleaned;
}

function getFirst(row, keys) {
  for (const key of keys) {
    const normalized = normalizeKey(key);
    if (Object.prototype.hasOwnProperty.call(row, normalized)) {
      const value = cleanDash(row[normalized]);
      if (value) return value;
    }
  }
  return "";
}

function hasAnyColumn(row, keys) {
  return keys.some(key => Object.prototype.hasOwnProperty.call(row, normalizeKey(key)));
}

function slugify(text) {
  return (text || "member")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeText(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}

function extractEmail(text) {
  const match = (text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function expandBranchCode(value) {
  const cleaned = cleanDash(value);
  const raw = cleaned.toUpperCase().trim();
  if (!raw) return "";

  const codeMap = {
    T: "Theory",
    N: "Numerical",
    E: "Experimental"
  };

  const normalizedWords = cleaned
    .replace(/\bT\b/gi, "Theory")
    .replace(/\bN\b/gi, "Numerical")
    .replace(/\bE\b/gi, "Experimental");

  if (/theory|numerical|experimental/i.test(normalizedWords)) {
    return normalizedWords
      .replace(/\s*[/,+;&]\s*/g, " / ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Handles T, N, E, but also combinations like T/N, T + E, T,N, TN, or TEN.
  const tokens = raw
    .split(/[^TNE]+/)
    .flatMap(token => token.length > 1 ? token.split("") : [token])
    .filter(token => codeMap[token]);

  const unique = [...new Set(tokens)];
  return unique.length ? unique.map(token => codeMap[token]).join(" / ") : cleaned;
}

function parseBranchAndKeywords(text) {
  const raw = cleanDash(text);
  if (!raw) return { branch: "", keywords: "" };

  const slashParts = raw.split("/");
  if (slashParts.length >= 2 && slashParts[0].trim().length <= 12) {
    return {
      branch: expandBranchCode(slashParts[0]),
      keywords: slashParts.slice(1).join("/").trim()
    };
  }

  if (/^[TNE\s,;+&/-]+$/i.test(raw) && raw.length <= 16) {
    return { branch: expandBranchCode(raw), keywords: "" };
  }

  return { branch: "", keywords: raw };
}

function isPublished(row) {
  const publishKeys = ["publish", "public", "published", "show", "visible", "display", "publish_on_website"];
  if (!hasAnyColumn(row, publishKeys)) return true;

  const raw = getFirst(row, publishKeys).toLowerCase().trim();
  if (!raw) return true;

  const hiddenValues = ["no", "n", "false", "0", "private", "hidden", "hide", "draft", "not public", "non", "nope"];
  return !hiddenValues.includes(raw);
}

function isUppercaseSurnameToken(token) {
  const letters = (token || "").replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
  return letters.length >= 2 && letters === letters.toUpperCase() && letters !== letters.toLowerCase();
}

function familyNameFromFullName(fullName) {
  const name = cleanDash(fullName);
  if (!name) return "";

  if (name.includes(",")) return name.split(",")[0].trim();

  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return name;

  const trailingUppercase = [];
  for (let i = parts.length - 1; i >= 0; i--) {
    if (isUppercaseSurnameToken(parts[i])) trailingUppercase.unshift(parts[i]);
    else break;
  }

  if (trailingUppercase.length) return trailingUppercase.join(" ");
  return parts[parts.length - 1];
}

function sortKey(text) {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function compareMembersByFamilyName(a, b) {
  const familyComparison = sortKey(a.family_name).localeCompare(sortKey(b.family_name));
  if (familyComparison !== 0) return familyComparison;
  return sortKey(a.full_name).localeCompare(sortKey(b.full_name));
}

function buildFullName(row) {
  const directName = getFirst(row, [
    "name",
    "full_name",
    "full name",
    "member_name",
    "member name",
    "name_and_surname",
    "first_and_family_name",
    "first_name_family_name"
  ]);
  if (directName) return directName;

  const firstName = getFirst(row, ["first_name", "first name", "given_name", "given name", "prenom", "prénom"]);
  const familyName = getFirst(row, ["family_name", "family name", "last_name", "last name", "surname", "nom"]);
  return [firstName, familyName].filter(Boolean).join(" ").trim();
}

function adaptMember(row) {
  const fullName = buildFullName(row);
  const familyName = getFirst(row, ["family_name", "family name", "last_name", "last name", "surname", "nom"]) || familyNameFromFullName(fullName);

  const branchRaw = getFirst(row, [
    "branch",
    "research_branch",
    "research branch",
    "branch_t_n_e",
    "branch_tne",
    "research_type",
    "research type",
    "t_n_e",
    "theory_numerical_experimental",
    "theory_numerical_or_experimental"
  ]);

  const keywordsRaw = getFirst(row, [
    "research_keywords",
    "research keywords",
    "keywords",
    "branch_keywords_about_your_research",
    "branch_keywords_about_your_research",
    "keywords_about_your_research",
    "research_field",
    "research field",
    "field",
    "topic",
    "research_topic",
    "details_about_research"
  ]);

  let branch = "";
  let keywords = "";

  if (branchRaw) {
    const parsedBranchCell = parseBranchAndKeywords(branchRaw);
    branch = parsedBranchCell.branch || expandBranchCode(branchRaw);
    keywords = keywordsRaw || parsedBranchCell.keywords;
  } else {
    const parsedCombinedCell = parseBranchAndKeywords(keywordsRaw);
    branch = parsedCombinedCell.branch;
    keywords = parsedCombinedCell.keywords;
  }

  const contact = getFirst(row, ["contact_mail_phone_number", "contact mail phone number", "contact", "mail_phone_number", "email_phone", "email_and_phone"]);
  const email = getFirst(row, ["email_public", "email public", "email", "public_email", "mail"]) || extractEmail(contact);

  const phd = getFirst(row, ["phd_lab_institution", "phd lab institution", "phd_institution", "phd institution", "phd_lab", "phd lab"]);
  const msc = getFirst(row, ["msc_institution", "msc institution", "master_institution", "master institution", "ms_institution", "m_sc_institution"]);
  const bsc = getFirst(row, ["bsc_institution", "bsc institution", "bachelor_institution", "bachelor institution", "bs_institution", "b_sc_institution"]);
  const current = getFirst(row, ["current_institution", "current institution", "institution", "affiliation", "laboratory", "lab"]);
  const currentPosition = getFirst(row, ["current_position", "current position", "position", "current_role", "current role", "role"]);

  return {
    full_name: fullName,
    family_name: familyName,
    slug: getFirst(row, ["slug", "profile_slug", "url_slug"]) || slugify(fullName),
    photo_url: getFirst(row, ["photo_url", "photo url", "photo", "picture", "image_url", "image url", "profile_picture", "profile picture"]),
    branch,
    keywords,
    email_public: email,
    phd_institution: phd,
    msc_institution: msc,
    bsc_institution: bsc,
    notable_contacts: getFirst(row, ["notable_contacts", "notable contacts", "contacts", "network"]),
    linkedin: getFirst(row, ["linkedin_link", "linkedin link", "linkedin", "linkedin_url", "linkedin url"]),
    details: getFirst(row, ["details", "short_bio", "short bio", "bio", "description", "additional_details", "additional details"]),
    current_position: currentPosition,
    display_institution: current || phd || msc || bsc,
    raw_search: Object.values(row).join(" ")
  };
}

function publicMembers(rows) {
  const members = rows
    .filter(row => isPublished(row))
    .map(adaptMember)
    .filter(member => member.full_name)
    .sort(compareMembersByFamilyName);

  return members;
}

async function loadMembers() {
  if (!CSV_URL || CSV_URL.includes("PASTE_YOUR")) {
    throw new Error("Paste your published Google Sheet CSV URL inside config.js first.");
  }

  const cacheBreaker = `${CSV_URL}${CSV_URL.includes("?") ? "&" : "?"}lps_cache=${Date.now()}`;
  const response = await fetch(cacheBreaker, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load the Google Sheet CSV. Check that the tab is published to the web as CSV.");
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);
  const members = publicMembers(rows);

  if (!members.length) {
    throw new Error("The Google Sheet loaded, but no member names were found. Check that the public tab still has a Name, Full Name, First Name, or Family Name column.");
  }

  return members;
}
