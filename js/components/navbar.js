export class Navbar {
  constructor() {
    this.init();
  }

  init() {
    this.setupActiveNavbarSection();
  }

  setupActiveNavbarSection() {
    const navbar = document.querySelector(".navbar-center-list");
    const menu = document.querySelector(".menu-list");

    const listItems = Array.from(navbar.children);
    const menuItems = Array.from(menu.children);

    const removeActiveClass = () => {
      listItems.forEach((item) => {
        item.classList.remove("is--active");
      });

      menuItems.forEach((item) => {
        item.classList.remove("is--active");
      });
    };

    document.querySelectorAll("[data-active]").forEach((element) => {
      let index = element.dataset.active;
      let end = "bottom center";

      if (index == 2) {
        end = "bottom+=100% top";
      }

      ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: end,
        onEnter: () => {
          listItems[index].classList.add("is--active");
          menuItems[index].classList.add("is--active");
        },

        onEnterBack: () => {
          listItems[index].classList.add("is--active");
          menuItems[index].classList.add("is--active");
        },
        onLeave: () => {
          removeActiveClass();
        },
        onLeaveBack: () => {
          removeActiveClass();
        },
      });
    });
  }
}
