import config from "./config.js";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const yearTarget = document.querySelector("[data-year]");
const quoteForms = document.querySelectorAll("[data-quote-form]");
const revealables = document.querySelectorAll(".reveal");
const serviceNotes = {
  "recurring-housecleaning":
    "We will ask for the home layout and square footage so the quote reflects recurring upkeep rather than a one-time reset.",
  "deep-cleaning":
    "We will ask for home size and room count so deep-clean scope can be estimated without making you fill an office or pet-care form.",
  "office-cleaning":
    "We will focus on square footage, restrooms, workstations, and timing instead of home-specific questions.",
  "short-term-rental-cleaning":
    "We will focus on turnover timing, linens, and guest-ready details instead of a full recurring-home intake.",
  "pet-care":
    "We will focus on pets, care style, and travel timing instead of bedrooms and bathrooms.",
  "home-sitting":
    "We will focus on property size, travel dates, and check-in needs without making you complete pet-only questions.",
  "combined-care-plan":
    "We will show both home and pet-care fields so one request can cover the full plan."
};
const serviceGroupVisibility = {
  "recurring-housecleaning": ["cleaning"],
  "deep-cleaning": ["cleaning"],
  "office-cleaning": ["office"],
  "short-term-rental-cleaning": ["turnover"],
  "pet-care": ["pet"],
  "home-sitting": ["home"],
  "combined-care-plan": ["cleaning", "combined"]
};

const updateQuoteForm = (form) => {
  const serviceField = form.querySelector("[name='service']");
  const serviceNote = form.querySelector("[data-service-note]");
  const activeGroups = new Set(serviceGroupVisibility[serviceField?.value || ""] || []);

  if (serviceNote) {
    serviceNote.textContent =
      serviceNotes[serviceField?.value || ""] ||
      "Tell us the service type first and the form will narrow down to just the quote details that apply.";
  }

  form.querySelectorAll("[data-service-group]").forEach((section) => {
    const groups = (section.dataset.serviceGroup || "").split(/\s+/).filter(Boolean);
    const isVisible = groups.some((group) => activeGroups.has(group));
    section.hidden = !isVisible;

    section.querySelectorAll("input, select, textarea").forEach((input) => {
      input.disabled = !isVisible;
    });
  });
};

const applyBusinessDetails = () => {
  document.querySelectorAll("[data-business-name]").forEach((node) => {
    node.textContent = config.businessName || "Greenwich Cleaning";
  });

  document.querySelectorAll("[data-email]").forEach((node) => {
    node.textContent = config.email || "hello@greenwichcleaning.com";
  });

  document.querySelectorAll("[data-email-link]").forEach((node) => {
    node.setAttribute("href", `mailto:${config.email || "hello@greenwichcleaning.com"}`);
  });
};

const renderTestimonials = () => {
  const section = document.querySelector("[data-testimonials-section]");
  const container = document.querySelector("[data-testimonials]");
  const testimonials = config.testimonials || [];

  if (!container || testimonials.length === 0) {
    if (section) {
      section.hidden = true;
    }
    return;
  }

  container.innerHTML = testimonials
    .map(
      (item) => `
        <article class="faq-card reveal">
          <h3>${item.context || "Client feedback"}</h3>
          <p>"${item.quote || ""}"</p>
          <p class="small-note" style="margin-top: 1rem;"><strong>${item.author || "Client"}</strong></p>
        </article>
      `
    )
    .join("");

  container.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
};

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const nextOpen = header.dataset.open !== "true";
    header.dataset.open = String(nextOpen);
    toggle.setAttribute("aria-expanded", String(nextOpen));
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (header) {
      header.dataset.open = "false";
    }
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealables.forEach((item) => observer.observe(item));

applyBusinessDetails();
renderTestimonials();

quoteForms.forEach((form) => {
  updateQuoteForm(form);

  form.querySelector("[name='service']")?.addEventListener("change", () => {
    updateQuoteForm(form);
  });

  form.addEventListener("submit", async (event) => {
    const action = form.getAttribute("action") || "";
    const successRedirect = form.dataset.successRedirect;

    if (!action.includes("formspree.io")) {
      return;
    }

    event.preventDefault();

    try {
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      if (successRedirect) {
        window.location.assign(successRedirect);
        return;
      }

      form.reset();
    } catch (error) {
      window.alert("There was a problem sending your request. Please try again.");
    }
  });
});
