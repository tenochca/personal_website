document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("project-modal");
  const closeButton = document.getElementById("project-modal-close");
  const titleEl = document.getElementById("project-modal-title");
  const descriptionEl = document.getElementById("project-modal-description");
  const repoLinkEl = document.getElementById("project-modal-link");
  const projectButtons = document.querySelectorAll(".project-node");

  if (!modal || !closeButton || !titleEl || !descriptionEl || !repoLinkEl) {
    return;
  }

  function normalizeRepoUrl(url) {
    const trimmed = (url || "").trim();
    if (!trimmed) {
      return "";
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  function openModal(title, description, repoUrl) {
    titleEl.textContent = title;
    descriptionEl.textContent = description;

    const normalizedUrl = normalizeRepoUrl(repoUrl);

    if (normalizedUrl) {
      repoLinkEl.href = normalizedUrl;
      repoLinkEl.hidden = false;
    } else {
      repoLinkEl.removeAttribute("href");
      repoLinkEl.hidden = true;
    }

    modal.hidden = false;
    closeButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
  }

  projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.getAttribute("data-project-title") || "Project";
      const description =
        button.getAttribute("data-project-desc") || "More details coming soon.";
      const repoUrl = button.getAttribute("data-project-url") || "";

      openModal(title, description, repoUrl);
    });
  });

  closeButton.addEventListener("click", closeModal);

  repoLinkEl.addEventListener("click", (event) => {
    if (!repoLinkEl.getAttribute("href")) {
      event.preventDefault();
    }
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
});
