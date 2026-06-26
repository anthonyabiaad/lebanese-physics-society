const grid = document.getElementById("membersGrid");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const count = document.getElementById("count");
const errorBox = document.getElementById("errorBox");

let allMembers = [];

function setSiteLinks() {
  const links = [
    ["whatsappLink", typeof WHATSAPP_URL !== "undefined" ? WHATSAPP_URL : ""],
    ["memberFormLink", typeof MEMBER_FORM_URL !== "undefined" ? MEMBER_FORM_URL : ""],
    ["footerWhatsappLink", typeof WHATSAPP_URL !== "undefined" ? WHATSAPP_URL : ""],
    ["footerMemberFormLink", typeof MEMBER_FORM_URL !== "undefined" ? MEMBER_FORM_URL : ""]
  ];

  links.forEach(([id, url]) => {
    const element = document.getElementById(id);
    if (!element) return;
    if (url) {
      element.href = url;
    } else {
      element.style.display = "none";
    }
  });
}

function imageFallback(event) {
  event.target.src = "https://placehold.co/400x400?text=LPS";
}

function uniqueValues(members, key) {
  return [...new Set(members.map(member => member[key]).filter(Boolean))].sort();
}

function populateFilter(select, values) {
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function memberMatches(member) {
  const query = searchInput.value.toLowerCase().trim();
  const branch = fieldFilter.value;

  const searchableText = [
    member.full_name,
    member.branch,
    member.keywords,
    member.display_institution,
    member.phd_institution,
    member.msc_institution,
    member.bsc_institution,
    member.notable_contacts,
    member.details,
    member.current_position,
    member.raw_search
  ].join(" ").toLowerCase();

  return (!query || searchableText.includes(query)) &&
         (!branch || member.branch === branch);
}

function renderMembers() {
  const visibleMembers = allMembers.filter(memberMatches);
  count.textContent = `${visibleMembers.length} member${visibleMembers.length === 1 ? "" : "s"} shown`;

  if (!visibleMembers.length) {
    grid.innerHTML = `<div class="empty-state">No members found. Check the search/filter, or verify that the Google Sheet contains public rows.</div>`;
    return;
  }

  grid.innerHTML = visibleMembers.map(member => `
    <a class="member-card" href="member.html?slug=${encodeURIComponent(member.slug)}">
      <img class="avatar" src="${safeText(member.photo_url || "https://placehold.co/400x400?text=LPS")}" alt="Photo of ${safeText(member.full_name)}" loading="lazy" onerror="imageFallback(event)" />
      <div class="card-body">
        <h2>${safeText(member.full_name)}</h2>
        <p>${safeText(member.display_institution)}</p>
        ${member.current_position ? `<p class="position">${safeText(member.current_position)}</p>` : ""}
        <p class="field">${safeText(member.branch ? `Branch: ${member.branch}` : "")}</p>
        <p class="keywords">${safeText(member.keywords)}</p>
      </div>
    </a>
  `).join("");
}

async function init() {
  setSiteLinks();
  try {
    allMembers = await loadMembers();
    populateFilter(fieldFilter, uniqueValues(allMembers, "branch"));
    renderMembers();
  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent = error.message;
  }
}

searchInput.addEventListener("input", renderMembers);
fieldFilter.addEventListener("change", renderMembers);

init();
