export class HomepageAnimations {
  constructor() {
    this.lenis = window.lenis;
    this.lenis.scrollTo(0, {immediate:true})
    this.lenis.stop();

    this.mm = gsap.matchMedia();
    this.orientation = null;

    this.init();
  }

  init() {
    this.loader();
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
    const heroElements = document.querySelector(".hero-content").children;

    gsap.set([".navbar", heroElements], { willChange: "transform" });

    gsap
      .timeline({
        defaults: {
          ease: "CTK-ease",
        },
      })

      .fromTo([".loader-logo", ".loader-bar__container"], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 2, stagger: 0.1, clearProps: "transform" }, 0)

      .to(".loader-bar", { xPercent: 33, duration: 1 })
      .to(".loader-bar", { xPercent: 66, duration: 1, delay: 0.3 })
      .to(".loader-bar", { xPercent: 100, duration: 1, delay: 0.3 })

      .to(".loader-bar__container", { autoAlpha: 0, y: 30, delay: 0.2, duration: 1.5 })
      .to(".loader-logo", { scale: 0.3, autoAlpha: 0, rotate: -15, duration: 1.5 }, "<")
      .to(".loader-bg", {  autoAlpha: 0,  duration: 1.2 }, "<")


      .fromTo(".navbar", { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 1.5, clearProps: "willChange" })
      .fromTo(".hero-left", { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 1.5, delay: 0.1, clearProps: "transform" }, "<")
      .fromTo(".hero-bottom", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.5, delay: 0.1, clearProps: "transform," }, "<")
      .fromTo([".hero-tagline", ".hero-heading", ".hero-description", ".hero-loop", ".hero-text.is--portrait", ".hero-buttons.is--portrait", ".hero-discover"], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, duration: 1, y: 0, delay: 0.1, stagger: 0.08, clearProps: "willChange" }, "<")

      .set(".loader", { display: "none" })
      .call(() => {
        this.heroFade();
        this.initFlipOnScroll();
        this.updateBackground();
        this.lenis.start();
        this.setUpNewsletter();
      });
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
            scrub: true,
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

  setUpNewsletter() {
    const modalWrapper = document.querySelector(".modal-wrapper");
    setTimeout(() => {
      modalWrapper.setAttribute("data-modal-open", "newsletter");
      this.lenis.stop();
    }, 700);
  }
}
