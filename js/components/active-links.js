export class ActiveLinks {
  constructor() {
    this.init();
  }

  init() {
    const items = document.querySelectorAll("[data-active]");

    items.forEach((item) => {
      const value = item.getAttribute("data-active");

      const currentURL = window.location.pathname.toLowerCase();

      item.classList.remove("--is-active");

      if (currentURL === `/${value}` || currentURL.includes(`/${value}`) || (value === "index" && (currentURL === "/" || currentURL === "/index"))) {
        item.classList.add("--is-active");
      }
    });
  }
}
