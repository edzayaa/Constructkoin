export class Toggles {
  constructor() {
    this.closeToggles = document.querySelectorAll("[data-close-modal]");
    this.modalWrapper = document.querySelector(".modal-wrapper");

    this.init();
  }

  init() {
    this.setupCloseToggles();
    this.setUpNewsletter();
    this.setupMenuToggle();
    this.setupVideoToggle();
  }

  setupCloseToggles() {
    this.closeToggles.forEach((closeToggle) => {
      closeToggle.addEventListener("click", () => {
        this.modalWrapper.removeAttribute("data-modal-open");
      });
    });
  }

  setUpNewsletter() {
    setTimeout(() => {
      this.modalWrapper.setAttribute("data-modal-open", "newsletter");
    }, 2000);
  }

  setupMenuToggle() {
    document.querySelectorAll("[data-toggle-menu]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        document.querySelector(".menu").toggleAttribute("data-menu-active");
      });
    });
  }

  setupVideoToggle() {
    document.querySelectorAll("[data-open-video]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
              this.modalWrapper.setAttribute("data-modal-open", "video");
      });
    });

  }
}
