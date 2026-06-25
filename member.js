const profile = document.getElementById("profile");
const errorBox = document.getElementById("errorBox");
const pageTitle = document.getElementById("pageTitle");

function setSiteLinks() {
  const links = [
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
  event.target.src = "https://placehold.co/500x500?text=LPS";
}

function link(label, url) {
  if (!url) return "";
  const href = url.startsWith("http") || url.startsWith("mailto:") ? url : `https://${url}`;
  return `<a href="${safeText(href)}" target="_blank" rel="noopener">${safeText(label)}</a>`;
}

function infoRow(label, value) {
  if (!value) return "";
  return `<div class="info-row"><strong>${safeText(label)}</strong><span>${safeText(value)}</span></div>`;
}

async function initProfile() {
  setSiteLinks();
  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const members = await loadMembers();
    const member = members.find(item => item.slug === slug);

    if (!member) {
      throw new Error("Member not found. Go back to the directory and try again.");
    }

    pageTitle.textContent = member.full_name;
    document.title = `${member.full_name} — Lebanese Physics Society`;

    profile.innerHTML = `
      <div class="profile-header">
        <img class="profile-photo" src="${safeText(member.photo_url || "https://placehold.co/500x500?text=LPS")}" alt="Photo of ${safeText(member.full_name)}" onerror="imageFallback(event)" />
        <div>
          <p class="eyebrow">${safeText(member.branch || "Lebanese Physics Society")}</p>
          <h2>${safeText(member.full_name)}</h2>
          <p>${safeText(member.display_institution)}</p>
          <div class="profile-links">
            ${member.email_public ? link("Email", `mailto:${member.email_public}`) : ""}
            ${link("LinkedIn", member.linkedin)}
          </div>
        </div>
      </div>

      <section class="profile-section">
        <h3>Research profile</h3>
        ${infoRow("Branch", member.branch)}
        ${infoRow("Keywords", member.keywords)}
      </section>

      <section class="profile-section">
        <h3>Academic path</h3>
        ${infoRow("PhD lab/institution", member.phd_institution)}
        ${infoRow("MSc institution", member.msc_institution)}
        ${infoRow("BSc institution", member.bsc_institution)}
      </section>

      <section class="profile-section">
        <h3>Network and details</h3>
        ${infoRow("Notable contacts", member.notable_contacts)}
        <p>${safeText(member.details || "No additional details added yet.")}</p>
      </section>
    `;
  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent = error.message;
  }
}

initProfile();
