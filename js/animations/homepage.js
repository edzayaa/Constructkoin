import { initDetectScrollingDirection } from "../utils/detect-scroll-direction.js";


export class HomepageAnimations {
  constructor(lenis) {
    this.lenis = lenis.getLenisInstance();

    this.mm = gsap.matchMedia();
    this.orientation = null;

    this.init();
  }

  init() {
    this.updateNavbarColors();
    this.loader();
    this.updateVideoSource();
    this.setOrientation();
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
    this.lenis.stop();

    const heroElements = document.querySelector(".hero-content").children;

    gsap.set([ heroElements], { willChange: "transform" });

    gsap
      .timeline({
        defaults: {
          ease: "CTK-ease",
        },
      })
      .to(".navbar", { autoAlpha: 1,  duration: 0.8,  })
      .fromTo(".hero-left", { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 1.5, delay: 0.1, clearProps: "transform" }, "<")
      .fromTo(".hero-bottom", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.5, delay: 0.1, clearProps: "transform," }, "<")
      .fromTo([".hero-tagline", ".hero-heading", ".hero-description", ".hero-loop", ".hero-text.is--portrait", ".hero-buttons.is--portrait", ".hero-discover"], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, duration: 1, y: 0, delay: 0.1, stagger: 0.08, clearProps: "willChange" }, "<")
   
      .call(() => {
        this.heroFade();
        initDetectScrollingDirection();
        this.lenis.start();
        // this.setUpNewsletter();
        ScrollTrigger.refresh();
      });
  }

  updateNavbarColors() {
    const navbar = document.querySelector(".navbar");

    document.querySelectorAll("[data-nav]").forEach((element) => {
      const theme = element.dataset.nav;
      const start = element.dataset.navStart || "top 20%";
      const end = element.dataset.navEnd || "bottom top";

      ScrollTrigger.create({
        trigger: element,
        start: start,
        end: end,
        onEnter: () => {
          navbar.setAttribute("data-navbar-theme", theme);
        },
        onEnterBack: () => {
          navbar.setAttribute("data-navbar-theme", theme);
        },
        onLeave: () => {
          navbar.removeAttribute("data-navbar-theme");
        },
        onLeaveBack: () => {
          navbar.removeAttribute("data-navbar-theme");
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

  setUpNewsletter() {
    const modalWrapper = document.querySelector(".modal-wrapper");
    setTimeout(() => {
      modalWrapper.setAttribute("data-modal-open", "newsletter");
      this.lenis.stop();
    }, 700);
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
}
