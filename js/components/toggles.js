export class Toggles {
  constructor() {
    this.closeToggles = document.querySelectorAll("[data-close-modal]");
    this.modalWrapper = document.querySelector(".modal-wrapper");
    this.lenis = window.lenis;

    this.init();
  }

  init() {
    this.setupCloseToggles();
    this.setupMenuToggle();
    this.setupVideoToggle();
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
        if(this.lenis.isStopped) {
          this.lenis.start();

        }
        else {
          this.lenis.stop();
        }
      });
    });
  }

  setupVideoToggle() {
    document.querySelectorAll("[data-open-video]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        this.modalWrapper.setAttribute("data-modal-open", "video");
        this.lenis.stop();
      });
    });
  }
}
