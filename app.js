const grid = document.getElementById("membersGrid");
const searchInput = document.getElementById("searchInput");
const fieldFilter = document.getElementById("fieldFilter");
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
    <article class="member-row">
      <div class="member-row-main">
        <a class="member-row-name" href="member.html?slug=${encodeURIComponent(member.slug)}">
          ${safeText(member.full_name)}
        </a>
        ${member.current_position ? `<p class="member-row-position">${safeText(member.current_position)}</p>` : ""}
      </div>
      <div class="member-row-branch">
        ${member.branch ? `<span class="branch-chip">${safeText(member.branch)}</span>` : `<span class="branch-chip muted-chip">No branch</span>`}
      </div>
      <p class="member-row-keywords">${safeText(member.keywords || "No keywords added yet.")}</p>
    </article>
  `).join("");
}

async function init() {
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
