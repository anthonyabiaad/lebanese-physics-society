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

  const headers = rows.shift().map(header => normalizeKey(header));
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
}

function normalizeKey(key) {
  return (key || "")
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
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

function cleanDash(value) {
  const cleaned = (value || "").trim();
  return cleaned === "-" ? "" : cleaned;
}

function extractEmail(text) {
  const match = (text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function expandBranchCode(value) {
  const raw = cleanDash(value).toUpperCase().trim();
  if (!raw) return "";

  const codeMap = {
    T: "Theory",
    N: "Numerical",
    E: "Experimental"
  };

  // Handles T, N, E, but also combinations like T/N, T + E, T,N, or TN.
  const tokens = raw
    .replace(/\bTHEORY\b/g, "T")
    .replace(/\bNUMERICAL\b/g, "N")
    .replace(/\bEXPERIMENTAL\b/g, "E")
    .split(/[^TNE]+/)
    .flatMap(token => token.length > 1 ? token.split("") : [token])
    .filter(token => codeMap[token]);

  const unique = [...new Set(tokens)];
  return unique.length ? unique.map(token => codeMap[token]).join(" / ") : value;
}

function parseBranchAndKeywords(text) {
  const raw = cleanDash(text);
  if (!raw) return { branch: "", keywords: "" };

  const slashParts = raw.split("/");
  if (slashParts.length >= 2 && slashParts[0].trim().length <= 8) {
    return {
      branch: expandBranchCode(slashParts[0]),
      keywords: slashParts.slice(1).join("/").trim()
    };
  }

  // If the cell contains only a branch code, still expand it.
  if (/^[TNE\s,;+&/-]+$/i.test(raw) && raw.length <= 12) {
    return { branch: expandBranchCode(raw), keywords: "" };
  }

  return { branch: "", keywords: raw };
}

function hasPublishColumn(row) {
  return Object.prototype.hasOwnProperty.call(row, "publish") ||
         Object.prototype.hasOwnProperty.call(row, "public") ||
         Object.prototype.hasOwnProperty.call(row, "published");
}

function isPublished(row) {
  if (!hasPublishColumn(row)) return true;
  const value = (row.publish || row.public || row.published || "").toLowerCase().trim();
  return ["yes", "y", "true", "1", "public", "published"].includes(value);
}

function adaptMember(row) {
  const branchText = row.branch_keywords_about_your_research || row.research_field || row.keywords || "";
  const parsed = parseBranchAndKeywords(branchText);
  const contact = row.contact_mail_phone_number || row.contact || "";
  const email = row.email_public || row.email || extractEmail(contact);

  const fullName = row.name || row.full_name || "";
  const phd = cleanDash(row.phd_lab_institution || row.phd_institution || "");
  const msc = cleanDash(row.msc_institution || row.master_institution || "");
  const bsc = cleanDash(row.bsc_institution || row.bachelor_institution || "");
  return {
    full_name: fullName,
    slug: row.slug || slugify(fullName),
    photo_url: row.photo_url || row.photo || row.picture || row.image_url || "",
    branch: parsed.branch,
    keywords: parsed.keywords,
    email_public: email,
    phd_institution: phd,
    msc_institution: msc,
    bsc_institution: bsc,
    notable_contacts: cleanDash(row.notable_contacts || ""),
    linkedin: cleanDash(row.linkedin_link || row.linkedin || ""),
    details: cleanDash(row.details || row.short_bio || ""),
    display_institution: phd || msc || bsc,
    raw_search: [fullName, parsed.branch, parsed.keywords, phd, msc, bsc, row.notable_contacts, row.linkedin_link, row.details, row.short_bio].join(" ")
  };
}

function publicMembers(rows) {
  return rows
    .filter(row => isPublished(row))
    .map(adaptMember)
    .filter(member => member.full_name);
}

async function loadMembers() {
  if (!CSV_URL || CSV_URL.includes("PASTE_YOUR")) {
    throw new Error("Paste your published Google Sheet CSV URL inside config.js first.");
  }

  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error("Could not load the Google Sheet CSV. Check that the tab is published to the web as CSV.");
  }

  const csvText = await response.text();
  return publicMembers(parseCSV(csvText));
}
