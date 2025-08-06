export class HomepageAnimations {
  constructor() {
    this.mm = gsap.matchMedia();
    this.orientation = null;

    this.init();
  }

  init() {
    this.setOrientation();
    this.updateBackground();
    this.initFlipOnScroll();
    this.heroFade();
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

  updateBackground() {
    const targetBg = document.querySelector(".backgrounds .backgrounds-color");
    const targetPixels = document.querySelector(".backgrounds .backgrounds-pixels");

    document.querySelectorAll("[data-bg]").forEach((element) => {
      const bg = element.dataset.bg;

      let start = element.dataset.bgStart || "top 80%";
      let end = element.dataset.bgEnd || "top 20%";

      let fromBgConfig = bg === "clear" ? { backgroundColor: "#000102" } : { backgroundColor: "#fff" };
      let toBgConfig = bg === "clear" ? { backgroundColor: "#fff" } : { backgroundColor: "#000102" };

      let fromPxConfig = bg === "clear" ? { autoAlpha: 1 } : { autoAlpha: 0 };
      let toPxConfig = bg === "clear" ? { autoAlpha: 0 } : { autoAlpha: 1 };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: element,
            start: start,
            end: end,
            scrub: 1.1,
          },
        })
        .fromTo(targetBg, { ...fromBgConfig }, { ...toBgConfig }, 0)
        .fromTo(targetPixels, { ...fromPxConfig }, { ...toPxConfig }, 0);
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
}
