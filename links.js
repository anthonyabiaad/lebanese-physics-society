function setSharedLinks() {
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

setSharedLinks();
