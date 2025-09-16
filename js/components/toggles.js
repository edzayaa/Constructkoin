export class Toggles {
  constructor(lenis) {
    this.closeToggles = document.querySelectorAll("[data-close-modal]");
    this.modalWrapper = document.querySelector(".modal-wrapper");
    this.modalVideoInner = document.querySelector(".modal-video__inner");

    this.bounds = {
      width: this.modalWrapper.offsetWidth,
      height: this.modalWrapper.offsetHeight,
      ratio: this.modalWrapper.offsetWidth / this.modalWrapper.offsetHeight,
    };

    this.lenis = lenis.getLenisInstance();

    this.currentVideo = {
      element: null,
      originalParent: null,
      originalNextSibling: null,
    };

    this.init();
  }

  init() {
    this.setupCloseToggles();
    this.setupMenuToggle();
    this.setupAccordionToggle();
  }

  setupCloseToggles() {
    this.closeToggles.forEach((closeToggle) => {
      closeToggle.addEventListener("click", () => {
        this.modalWrapper.removeAttribute("data-modal-open");
        this.lenis.start();
      });
    });
  }

  setupMenuToggle() {
    document.querySelectorAll("[data-toggle-menu]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        document.querySelector(".menu").toggleAttribute("data-menu-active");
        document.querySelector(".navbar").toggleAttribute("data-menu-active");
      });
    });
  }

  setupAccordionToggle() {
    const triggers = document.querySelectorAll("[data-accordion-trigger]");
    const accordionStatus = document.querySelectorAll("[data-accordion-status]");
    const accordionWrapper = document.querySelector("[data-current-accordion]");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const target = trigger.getAttribute("data-accordion-trigger");

        triggers.forEach((trigger) => {
          trigger.classList.remove("is--active");
        });

        accordionStatus.forEach((accordionStatus) => {
          accordionStatus.setAttribute("data-accordion-status", "not-active");
        });

        trigger.classList.add("is--active");

        accordionWrapper.setAttribute("data-current-accordion", target);
        ScrollTrigger.refresh();
      });
    });
  }
}
