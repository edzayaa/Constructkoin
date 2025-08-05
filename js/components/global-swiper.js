export class CustomSwiper {
  constructor() {
    this.swiperList = [];
    this.swiperMap = new Map();
    this.syncPairs = [];

    this.init();
    this.bindEvents();
  }

  init() {
    this.setUpSwiper();
    this.setupSync();
  }

  setUpSwiper() {
    const swiperClass = Array.from(document.querySelectorAll("[data-swiper-class]"));

    swiperClass.forEach((el) => {
      const className = el.getAttribute("data-swiper-class");
      const syncTarget = el.getAttribute("data-swiper-sync") || null;

      const slidesPerView = el.getAttribute("data-swiper-slides-per-view");
      const slidesPerViewMobile = el.getAttribute("data-swiper-slides-per-view-mobile");
      const centered = el.getAttribute("data-swiper-centered");
      const centeredMobile = el.getAttribute("data-swiper-centered-mobile");
      const spaceBetween = el.getAttribute("data-swiper-space-between") || 0;
      const spaceBetweenMobile = el.getAttribute("data-swiper-space-between-mobile") || 0;
      const initialSlide = el.getAttribute("data-swiper-initial-slide") || 0;
      const initialSlideMobile = el.getAttribute("data-swiper-initial-slide-mobile") || 0;
      const effect = el.getAttribute("data-swiper-effect") || "slide";
      const loop = el.getAttribute("data-swiper-loop") || false;
      const directionLandscape = el.getAttribute("data-swiper-direction-landscape") || "horizontal";
      const directionPortrait = el.getAttribute("data-swiper-direction-portrait") || "horizontal";

      const store = el.getAttribute("data-swiper-store") || false;

      const swiper = new Swiper(`.${className}-swiper-container`, {
        wrapperClass: `${className}-swiper-wrapper`,
        slideClass: `${className}-swiper-slide`,
        speed: 800,
        grabCursor: true,
        loop: loop,
        effect: effect,
        pagination: {
          el: `.${className}-swiper-pagination`,
          clickable: true,
          bulletClass: `${className}-swiper-pagination-bullet`,
          bulletActiveClass: `${className}-swiper-pagination-bullet-active`,
        },
        navigation: {
          el: `.${className}-swiper-navigation`,
          nextEl: `.${className}-swiper-button-next`,
          prevEl: `.${className}-swiper-button-prev`,
          disabledClass: `${className}-swiper-button-disabled`,
        },
        breakpoints: {
          "@0.1": {
            slidesPerView: slidesPerViewMobile,
            centeredSlides: centeredMobile ? true : false,
            spaceBetween: spaceBetweenMobile ? spaceBetweenMobile : 0,
            initialSlide: initialSlideMobile,
            direction: directionPortrait,
          },
          "@1.0": {
            slidesPerView: slidesPerView,
            centeredSlides: centered ? true : false,
            spaceBetween: spaceBetween,
            initialSlide: initialSlide,
            direction: directionLandscape,
          },
        },
      });

      this.swiperList.push(swiper);
      this.swiperMap.set(className, swiper);

      if (syncTarget) {
        this.syncPairs.push([className, syncTarget]);
      }

      if (store) {
        window.swiperStore = window.swiperStore || {};
        window.swiperStore[className] = swiper;
      }
    });
  }

  setupSync() {
    this.syncPairs.forEach(([swiperAName, swiperBName]) => {
      const swiperA = this.swiperMap.get(swiperAName);
      const swiperB = this.swiperMap.get(swiperBName);

      if (swiperA && swiperB) {
        swiperA.controller.control = swiperB;
        swiperB.controller.control = swiperA;
      }
    });
  }

  bindEvents() {
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        this.swiperList.forEach((swiper) => {
          if (swiper && typeof swiper.update === "function") {
            swiper.update();
          }
        });
      }, 250);
    });
  }
}
