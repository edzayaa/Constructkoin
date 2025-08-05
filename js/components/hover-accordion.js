export class HoverAccordion {
  constructor() {
    this.init();
    window.addEventListener("resize", this.debouncedInit.bind(this));
  }

  debouncedInit() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.init(), 200);
  }

  init() {
    const isMobile = window.innerWidth < 991;

    document.querySelectorAll("[data-hover-accordion-css-init]").forEach((accordion) => {
      const items = accordion.querySelectorAll("[data-accordion-status]");

      items.forEach((item) => {
        const toggle = item.querySelector("[data-accordion-toggle]");

        // if (item && !item._hasTransitionEndListener) {
        //   item._hasTransitionEndListener = true;

        //   item.addEventListener("transitionend", (e) => {
        //     if (e.propertyName === "grid-template-rows") {
        //       // ScrollTrigger.refresh();
        //     }
        //   });
        // }

        if (!toggle) return;

        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        if (isMobile) {
          newToggle.addEventListener("click", () => {
            const isActive = item.getAttribute("data-accordion-status") === "active";
            items.forEach((el) => el.setAttribute("data-accordion-status", "not-active"));

            if (!isActive) {
              item.setAttribute("data-accordion-status", "active");
            }
          });
        } else {
          let hoverTimeout;

          newToggle.addEventListener("mouseenter", () => {
            hoverTimeout = setTimeout(() => {
              item.setAttribute("data-accordion-status", "active");

              items.forEach((sibling) => {
                if (sibling !== item) {
                  sibling.setAttribute("data-accordion-status", "not-active");
                }
              });
            }, 300); 
          });

          item.addEventListener("mouseleave", () => {
            clearTimeout(hoverTimeout);

            items.forEach((el) => {
              el.setAttribute("data-accordion-status", "not-active");
            });
          });
        }
      });
    });
  }
}
