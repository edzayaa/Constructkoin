import { initDetectScrollingDirection } from "../utils/detect-scroll-direction.js";

export class HomepageAnimations {
  constructor(lenis) {
    this.lenis = lenis.getLenisInstance();

    this.mm = gsap.matchMedia();
    this.orientation = null;

    this.init();
  }

  init() {
    this.loader();
    this.updateVideoSource();
    this.setOrientation();
    this.roadmap();
    this.updateNavbarColors();
  }

  setOrientation() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        this.orientation = context.conditions.isLandscape ? "landscape" : "portrait";
      }
    );
  }

  loader() {
    const heroElements = document.querySelector(".hero-content").children;

    gsap.set([heroElements], { willChange: "transform" });

    gsap
      .timeline({
        defaults: {
          ease: "CTK-ease",
        },
      })
      .to(".navbar", { autoAlpha: 1, duration: 0.8 })
      .fromTo(".hero-left", { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 1.5, delay: 0.1, clearProps: "transform" }, "<")
      .fromTo(".hero-bottom", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.5, delay: 0.1, clearProps: "transform," }, "<")
      .fromTo([".hero-tagline", ".hero-heading", ".hero-description", ".hero-loop", ".hero-text.is--portrait", ".hero-buttons.is--portrait", ".hero-discover"], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, duration: 1, y: 0, delay: 0.1, stagger: 0.08, clearProps: "willChange" }, "<")

      .call(() => {
        this.heroFade();
        initDetectScrollingDirection();
        // this.setupForbiddenPopup();
        ScrollTrigger.refresh();
      });
  }

  updateNavbarColors() {
    const navbar = document.querySelector(".navbar");
    const menu = document.querySelector(".menu");


    document.querySelectorAll("[data-nav]").forEach((element) => {
      const theme = element.dataset.nav;
      const start = element.dataset.navStart || "top 5%";
      const end = element.dataset.navEnd || "bottom 5%";

      ScrollTrigger.create({
        trigger: element,
        start: start,
        end: end,
        onEnter: () => {
          navbar.setAttribute("data-navbar-theme", theme);
          menu.setAttribute("data-menu-theme", theme);
        },
        onEnterBack: () => {
          navbar.setAttribute("data-navbar-theme", theme);
          menu.setAttribute("data-menu-theme", theme);

        },
        onLeave: () => {
          navbar.removeAttribute("data-navbar-theme");
          menu.removeAttribute("data-menu-theme");
        },
        onLeaveBack: () => {
          navbar.removeAttribute("data-navbar-theme");
          menu.removeAttribute("data-menu-theme");
        },
      });
    });
  }

  initFlipOnScroll() {
    document.querySelectorAll("[data-flip-video]").forEach((element) => {
      const key = element.dataset.flipVideo;

      let wrapperElements = document.querySelectorAll(`[data-flip-wrapper='${key}']`);
      let targetEl = document.querySelector(`[data-flip-target='${key}']`);

      let tl;

      function flipTimeline() {
        if (tl) {
          tl.kill();
          gsap.set(targetEl, { clearProps: "all" });
        }

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperElements[0],
            start: "top center",
            endTrigger: wrapperElements[1],
            end: "center center",
            scrub: true,
            ignoreMobileResize: true,
          },
        });

        tl.add(
          Flip.fit(
            targetEl,
            wrapperElements[1],
            {
              ease: "none",
              duration: 1,
            },
            0
          )
        );
        tl.to(targetEl, { borderRadius: "0rem", duration: 0.5 }, 0.5);
      }

      flipTimeline();

      let resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          flipTimeline();
        }, 100);
      });
    });
  }

  heroFade() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;

        const hero = document.querySelector(".hero");
        const elementsPortrait = hero.querySelectorAll(".hero-heading, .hero-description, .hero-text.is--portrait, .hero-buttons.is--portrait, .hero-discover");
        const elementsLandscape = hero.querySelectorAll(".hero-heading, .hero-description, .hero-left, .hero-bottom,.hero-discover");
        const target = isLandscape ? elementsLandscape : elementsPortrait;

        let fadeTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "20% top",
            end: "bottom top",
            scrub: 1.1,
          },
        });

        fadeTimeline.fromTo(target, { autoAlpha: 1 }, { autoAlpha: 0 }, 0);
      }
    );
  }

  setUpPopup(target) {
    const modalWrapper = document.querySelector(".modal-wrapper");
    modalWrapper.setAttribute("data-modal-open", target);
    this.lenis.stop();
  }

  setupForbiddenPopup() {
    this.setUpPopup("forbidden");

    const leaveSiteButton = document.getElementById("leave-site-btn");

    if (leaveSiteButton) {
      leaveSiteButton.addEventListener("click", function () {
        history.back();
      });
    }
  }

  updateVideoSource() {
    const video = document.querySelector(".presale-media__video");

    function updatePresaleVideoSource() {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      video.src = isPortrait ? "/assets/videos/presale-showreel-portrait.mp4" : "/assets/videos/presale-showreel-landscape.mp4";

      video.load();
    }

    window.addEventListener("orientationchange", updatePresaleVideoSource);
    window.addEventListener("resize", updatePresaleVideoSource);
  }

  roadmap() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;

        const blocks = document.querySelectorAll(".roadmap-block");
        const blockTop = blocks[1].querySelector(".roadmap-block__top");
        const blockBotttom = blocks[1].querySelector(".roadmap-block__bottom");

        gsap.set(blocks, { clearProps: "all" });

        if (!isLandscape) return;

        let timeline = gsap
          .timeline({
            scrollTrigger: {
              trigger: ".roadmap",
              start: "top top",
              end: "bottom+=50% top",
              scrub: 1.3,
              pin: true,
            },
          })
          .to({}, { duration: 10 })

          .to(blocks[0], { autoAlpha: 0, yPercent: -30, scale: 0.8, duration: 2 }, 1)
          .fromTo(blocks[1], { autoAlpha: 0.1, yPercent: 100, scale: 0.8 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 2 }, 1.1)
          .fromTo(blocks[2], { autoAlpha: 0, yPercent: 200 }, { autoAlpha: 0.1, yPercent: 100, scale: 0.8, duration: 2 }, 1.2)

          .fromTo(blockTop, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -10, duration: 1 }, 4)
          .fromTo(blockBotttom, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 2 }, 4)

          .to(blocks[1], { autoAlpha: 0, yPercent: -30, scale: 0.8, duration: 2 }, 6.9)
          .fromTo(blocks[2], { autoAlpha: 0.1, yPercent: 100, scale: 0.8 }, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 2, immediateRender: false }, 7);
      }
    );
  }
}
