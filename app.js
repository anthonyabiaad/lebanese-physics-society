const grid = document.getElementById("membersGrid");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
const statusFilter = document.getElementById("statusFilter");
const count = document.getElementById("count");
const errorBox = document.getElementById("errorBox");

let allMembers = [];

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
  const status = statusFilter.value;

  const searchableText = [
    member.full_name,
    member.branch,
    member.keywords,
    member.current_position,
    member.display_institution,
    member.phd_institution,
    member.msc_institution,
    member.bsc_institution,
    member.notable_contacts,
    member.details,
    member.raw_search
  ].join(" ").toLowerCase();

  return (!query || searchableText.includes(query)) &&
         (!branch || member.branch === branch) &&
         (!status || member.current_position === status);
}

function renderMembers() {
  const visibleMembers = allMembers.filter(memberMatches);
  count.textContent = `${visibleMembers.length} member${visibleMembers.length === 1 ? "" : "s"} shown`;

  grid.innerHTML = visibleMembers.map(member => `
    <a class="member-card" href="member.html?slug=${encodeURIComponent(member.slug)}">
      <img class="avatar" src="${safeText(member.photo_url || "https://placehold.co/400x400?text=LPS")}" alt="Photo of ${safeText(member.full_name)}" loading="lazy" />
      <div class="card-body">
        <h2>${safeText(member.full_name)}</h2>
        <p class="role">${safeText(member.current_position || "Member")}</p>
        <p>${safeText(member.display_institution)}</p>
        <p class="field">${safeText(member.branch ? `Branch: ${member.branch}` : "")}</p>
        <p class="keywords">${safeText(member.keywords)}</p>
      </div>
    </a>
  `).join("");
}

async function init() {
  try {
    allMembers = await loadMembers();
    populateFilter(fieldFilter, uniqueValues(allMembers, "branch"));
    populateFilter(statusFilter, uniqueValues(allMembers, "current_position"));
    renderMembers();
  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent = error.message;
  }
}

searchInput.addEventListener("input", renderMembers);
fieldFilter.addEventListener("change", renderMembers);
statusFilter.addEventListener("change", renderMembers);

init();
