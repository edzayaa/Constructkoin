export class SharedAnimations {
  constructor() {
    this.mm = gsap.matchMedia();
    this.init();

    
  }

  init() {
    this.fadeIn();
    this.fadeOut();
  }

  fadeIn() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;

        document.querySelectorAll("[data-fade]").forEach((el) => {
          if (!el) return;

          const scrub = el.dataset.fadeScrub === "false" ? false : 1.1;

          let fadeTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: isLandscape ? "top top" : "top 30%",
              scrub: scrub,
            },
          });

          el.querySelectorAll("[data-fade-element]").forEach((el, i) => {
            const { fadeX, fadeY, fadeScale, fadeAlpha } = el.dataset;

            let fromConfig = {
              ...(fadeX && { x: fadeX }),
              ...(fadeY && { y: fadeY }),
              ...(fadeScale && { scale: fadeScale }),
              ...(fadeAlpha && { autoAlpha: fadeAlpha }),
            };

            let toConfig = {
              ...(fadeX && { x: 0 }),
              ...(fadeY && { y: 0 }),
              ...(fadeScale && { scale: 1 }),
              ...(fadeAlpha && { autoAlpha: 1 }),
            };

            gsap.set(el, { willChange: "transform" });

            fadeTimeline.fromTo(el, { ...fromConfig }, { ...toConfig, clearProps: "transform", duration: 1 }, i * 0.1);
          });
        });
      }
    );
  }

  fadeOut() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;

        document.querySelectorAll("[data-fade-out]").forEach((el) => {
          if (!el) return;

          const { fadeOutScale } = el.dataset;

          let fromConfig = {
            ...(fadeOutScale && { scale: 1 }),
            autoAlpha: 1,
          };

          let toConfig = {
            ...(fadeOutScale && { scale: fadeOutScale }),
            autoAlpha: 0,
          };

          let fadeTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "20% top",
              end: "bottom top",
              scrub: 1.1,
            },
          });

          fadeTimeline.fromTo(el, { ...fromConfig }, { ...toConfig });
        });
      }
    );
  }
}
