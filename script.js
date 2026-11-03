const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status ${type || ""}`.trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (form && statusEl) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      company: String(formData.get("company") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("Fyll ut namn, e-post og melding.", "error");
      return;
    }

    if (!isValidEmail(payload.email)) {
      setStatus("Skriv inn ei gyldig e-postadresse.", "error");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    setStatus("Sender melding ...", "");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Noko gjekk gale. Prøv igjen seinare.");
      }

      form.reset();
      setStatus("Takk! Meldinga er send.", "success");
    } catch (error) {
      setStatus(error.message || "Noko gjekk gale. Prøv igjen seinare.", "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}
