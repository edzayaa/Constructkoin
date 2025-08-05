import { HoverAccordion } from "../components/hover-accordion.js";

export class HomepageAnimations {
  constructor() {
    this.mm = gsap.matchMedia();
    this.orientation = null;

    this.init();
  }

  init() {
    this.setOrientation();
    this.hero();
    this.aboutMobile();
    this.contemporary();
    this.projects();
    this.choice();
    this.engineers();
    this.clients();
    this.reviews();
    this.location();
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

  hero() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isDesktop, isMobile, isLandscape, isPortrait } = context.conditions;

        gsap.set([".hero__screen-2 .hero__background-clip", ".hero__image-wrapper", ".hero__scroll-wrapper"], { clearProps: "all" });

        if (isLandscape) {
          gsap.set(".hero__screen-2 .hero__background-clip", {
            xPercent: -50,
            yPercent: -50,
            rotate: "45deg",
          });
          gsap.set(".hero__screen-2 .hero__flex-block-2", {
            yPercent: 110,
          });

          gsap
            .timeline({
              defaults: {},
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom+=100% top",
                scrub: 1.1,
                pin: true,
                onUpdate: (self) => {
                  // console.log(self.progress);
                },
              },
            })
            .to({}, { duration: 12 })

            // screen 1 headings
            .to(
              ".hero__screen-1 .hero__heading span",
              {
                xPercent: 100,
                autoAlpha: 0,
                duration: 4,
              },
              "0"
            )
            .to(
              ".hero__screen-1 .hero__subheading span",
              {
                xPercent: -100,
                autoAlpha: 0,
                duration: 4,
              },
              "0"
            )

            // divider
            .to(
              [".hero__screen-1 .hero__tagline", ".hero__screen-1 .hero__button", ".hero__screen-1 .hero__shadow"],
              {
                autoAlpha: 0,
                duration: 4,
              },
              "0"
            )
            .to(
              [".hero__line"],
              {
                scaleX: 0,
                duration: 4,
              },
              "0"
            )

            // scroll to explore
            .to(
              [".hero__screen-1 .hero__text", ".hero__screen-1 .hero__scroll-wrapper"],
              {
                autoAlpha: 0,
                y: 50,
                stagger: 0.1,
                duration: 4,
              },
              "0"
            )

            // clip path
            .to(
              ".hero__screen-2 .hero__background-clip",
              {
                duration: 5,
                rotate: "25deg",
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              },
              "0"
            )

            // center image wrapper
            .to(
              ".hero__screen-2 .hero__image-wrapper-1",
              {
                duration: 5,
                scale: 1,
                rotate: "-25deg",
              },
              "0"
            )
            .to(
              ".hero__screen-2 .hero__image-wrapper-2",
              {
                duration: 5,
                scale: 1,
              },
              "0"
            )
            .to(
              ".hero__screen-2 .hero__image-wrapper-2",
              {
                opacity: 1,
                duration: 4,
              },
              "1"
            )

            // tagline
            .fromTo(
              ".hero__tagline span:nth-child(1)",
              {
                autoAlpha: 0,
                yPercent: "100",
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 3,
              },
              "2.5"
            )

            // heading
            .fromTo(
              ".hero__screen-2 .hero__heading span",
              {
                autoAlpha: 0,
                xPercent: "-50",
              },
              {
                autoAlpha: 1,
                xPercent: 1,
                stagger: 0.1,
                duration: 3,
              },
              "2.5"
            )

            // rotating line
            .fromTo(
              ".hero__screen-2 .hero__rotating-line",
              {
                autoAlpha: 0,
                rotate: "0deg",
              },
              {
                autoAlpha: 1,
                rotate: "-180deg",
                duration: 3,
              },
              "3"
            )

            // media video and text
            .fromTo(
              [".hero__media video", ".hero__media-text"],
              {
                autoAlpha: 0,
                y: 50,
              },
              {
                autoAlpha: 1,
                y: 0,
                stagger: 0.3,
                duration: 3,
              },
              "3"
            )
            .set(".hero__screen-2", { pointerEvents: "all" }, "3.5")

            .fromTo(
              "  .hero__screen-2 .hero__cta",
              {
                autoAlpha: 0,
                yPercent: 50,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 3,
              },
              "3.5"
            )

            .fromTo(
              ".hero__screen-2 .hero__description",
              {
                autoAlpha: 0,
                yPercent: 50,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                stagger: 0.1,
                duration: 3,
              },
              "3.5"
            )

            // center image 2
            .fromTo(
              ".hero__screen-2 .hero__image-2",
              {
                yPercent: 100,
                scale: 1.5,
              },
              {
                scale: 1,
                yPercent: 0,
                duration: 4,
              },
              "7"
            )

            // hero lines
            .to(
              [".hero__screen-2 .hero__screen-2__lines"],
              {
                duration: 3,
                autoAlpha: 1,
              },
              "3"
            )

            // tagline 2
            .fromTo(
              ".hero__tagline span:nth-child(1)",
              {
                autoAlpha: 1,
              },
              {
                autoAlpha: 0,
                duration: 4,
              },
              "7"
            )
            .fromTo(
              ".hero__tagline span:nth-child(2)",
              {
                yPercent: "0",
              },
              {
                yPercent: "-100",
                duration: 4,
              },
              "7"
            )

            // media text
            .fromTo(
              ".hero__screen-2 .hero__media-text-1",
              {
                autoAlpha: "1",
              },
              {
                autoAlpha: "0",
                duration: 3,
              },
              "7"
            )
            .fromTo(
              ".hero__screen-2 .hero__media-text-2",

              {
                autoAlpha: "0",
              },
              {
                autoAlpha: "1",
                duration: 4,
              },
              "7"
            )

            // right blocks
            .fromTo(
              ".hero__screen-2 .hero__flex-block-1",
              {
                autoAlpha: "1",
                yPercent: "0",
              },
              {
                autoAlpha: "0",
                yPercent: -100,
                duration: 4,
              },
              "7"
            )
            .fromTo(
              ".hero__screen-2 .hero__flex-block-2",
              {
                yPercent: 110,
              },
              {
                yPercent: 0,
                duration: 5,
              },
              "7"
            );
        }

        if (isPortrait) {
          gsap.set([".hero__screen-1 .hero__scroll-wrapper", ".hero__heading span", ".hero__subheading span", ".hero__background-clip"], { clearProps: "all" });

          gsap
            .timeline({
              defaults: {},
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            })
            .to({}, { duration: 1 })
            .to(
              ".hero",
              {
                autoAlpha: 0,
                duration: 1,
              },
              0
            )
            .to(
              ".hero__heading span",
              {
                autoAlpha: 0,
                xPercent: 100,
                duration: 0.5,
              },
              0
            )
            .to(
              ".hero__subheading span",
              {
                autoAlpha: 0,
                xPercent: -100,
                duration: 0.5,
              },
              0
            )
            .to(
              ".hero__screen-1 .hero__scroll-wrapper",
              {
                yPercent: -10,
                autoAlpha: 0,
                duration: 0.3,
              },
              0
            );
        }
      }
    );
  }

  aboutMobile() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isPortrait } = context.conditions;

        gsap.set([".about-tagline span", ".about-heading span", ".about-image img", ".about-content__top video"], { clearProps: "all" });

        if (isPortrait) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".about-content__top",
                start: "top 80%",
                end: "top top",
                scrub: true,
              },
            })
            .to({}, { duration: 1 })
            .fromTo(
              ".about-content__top .about-tagline span",
              {
                yPercent: 100,
                autoAlpha: 0,
              },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.8,
              },
              0
            )
            .fromTo(
              ".about-content__top .about-heading span",
              {
                xPercent: 20,
                autoAlpha: 0,
              },
              {
                xPercent: 0,
                autoAlpha: 1,
                duration: 0.5,
                stagger: 0.1,
              },
              0
            )
            .fromTo(".about-content__top .about-image img", { scale: 1.3 }, { scale: 1, duration: 1 }, "0");

          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".about-content__bottom",
                start: "top 80%",
                end: "top top",
                scrub: true,
              },
            })
            .to({}, { duration: 1 })
            .fromTo(
              ".about-content__bottom .about-tagline span",
              {
                yPercent: 100,
                autoAlpha: 0,
              },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.8,
              },
              0
            )
            .fromTo(
              ".about-content__bottom .about-heading span",
              {
                xPercent: 20,
                autoAlpha: 0,
              },
              {
                xPercent: 0,
                autoAlpha: 1,
                duration: 0.5,
                stagger: 0.1,
              },
              0
            )
            .fromTo(".about-content__bottom .about-image img", { scale: 1.3 }, { scale: 1, duration: 1 }, "0");
        }
      }
    );
  }

  projects() {
    new HoverAccordion();
  }

  contemporary() {
    const flipImagesOnScroll = () => {
      const isLandscape = this.orientation === "landscape";

      const elementCenter = document.querySelector(".contemporary__image-center");
      const elementCenterBack = document.querySelector(".contemporary__image-center-back");
      const elementLeft = document.querySelector(".contemporary__image-left");
      const elementRight = document.querySelector(".contemporary__image-right");

      const whyFLex = document.querySelector(".why-flex");
      const contemporaryHeading = document.querySelector(".contemporary__heading");
      const contemporaryHeadingSpan = document.querySelector(".contemporary__heading span");

      const finalCenterContainer = document.querySelector(".why__floating-center");
      const finalCenterBackContainer = document.querySelector(".why__floating-center-back");
      const finalLeftContainer = document.querySelector(".why__floating-left");
      const finalRightContainer = document.querySelector(".why__floating-right");

      const finalCenterState = Flip.getState(finalCenterContainer);
      const finalLeftState = Flip.getState(finalLeftContainer);
      const finalRightState = Flip.getState(finalRightContainer);
      const finalCenterBackState = Flip.getState(finalCenterBackContainer);

      const oldTl = flipImagesOnScroll.tl;
      let progress = 0;

      if (oldTl) {
        progress = oldTl.progress();
        oldTl.progress(0).kill();
      }

      gsap.set([elementCenter, elementCenterBack, elementLeft, elementRight, contemporaryHeadingSpan, contemporaryHeading, whyFLex], { clearProps: "all" });

      gsap.set([elementCenter, elementCenterBack, elementLeft, elementRight], { willChange: "transform" });

      gsap.set(elementLeft, {
        rotate: "-5.875deg",
        yPercent: -53,
      });
      gsap.set(elementRight, {
        rotate: "5.875deg",
        yPercent: -53,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".contemporary__heading",
          start: isLandscape ? "top bottom" : "top 70%",
          end: "bottom bottom",
          endTrigger: ".why",
          scrub: 1,
        },
      });

      tl.to({}, { duration: 10 })
        .fromTo(
          contemporaryHeadingSpan,
          {
            autoAlpha: 0,
            yPercent: 100,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 3,
          },
          "0"
        )
        .fromTo([elementCenter, elementCenterBack], { scale: 0.8 }, { scale: 1, duration: 3 }, "0")
        .fromTo(
          elementLeft,
          {
            opacity: 0,
            xPercent: -30,
          },
          {
            opacity: 1,
            xPercent: isLandscape ? 20 : 5,

            duration: 3,
          },
          "0"
        )
        .fromTo(
          elementRight,
          {
            opacity: 0,
            xPercent: 30,
          },
          {
            opacity: 1,
            xPercent: isLandscape ? -20 : -5,
            duration: 3,
          },
          "0"
        )

        // floating texts
        .fromTo(
          [".contemporary__floating-text-1", ".contemporary__floating-text-2", ".contemporary__floating-text-3"],
          {
            autoAlpha: 0,
          },

          { autoAlpha: 1, duration: 3 },
          "0.5"
        )

        .to(
          contemporaryHeading,
          {
            autoAlpha: 0,
            duration: 3,
          },
          4
        )
        .from(
          whyFLex,
          {
            autoAlpha: 0,
            duration: 3,
          },
          7
        )
        .to(".contemporary__floating-text", { opacity: 0, duration: 3 }, 3)
        .to(".contemporary__image-layer", { opacity: 0, duration: 6 }, 4)
        .add(Flip.fit(elementCenter, finalCenterState, { scale: true, ease: "none", duration: 5.8 }), 3.6)
        .add(Flip.fit(elementRight, finalRightState, { scale: true, ease: "none", duration: 5.8 }), 3.6)
        .add(Flip.fit(elementCenterBack, finalCenterBackState, { scale: true, ease: "none", duration: 5.8 }), 3.6)
        .add(Flip.fit(elementLeft, finalLeftState, { scale: true, ease: "none", duration: 5.8 }), 3.6);

      tl.progress(progress);
      ScrollTrigger.refresh();

      flipImagesOnScroll.tl = tl;

      if (!flipImagesOnScroll.resizeHandler) {
        flipImagesOnScroll.resizeHandler = debounce(() => {
          flipImagesOnScroll();
        }, 200);

        window.addEventListener("resize", flipImagesOnScroll.resizeHandler);
      }

      return tl;
    };

    function debounce(fn, delay = 200) {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
      };
    }

    flipImagesOnScroll();
  }

  choice() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".choice",
              start: isLandscape ? "top 60%" : "top 80%",
              end: isLandscape ? "top 5%" : "top 20%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          })
          .fromTo(
            ".choice-swiper-slide",
            {
              autoAlpha: 0,
              yPercent: "50",
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              stagger: 0.1,
            },
            0
          )
          .fromTo(
            ".choice__heading span",
            {
              autoAlpha: 0,
              yPercent: "100",
            },
            {
              autoAlpha: 1,
              yPercent: 0,
            },
            0.2
          );
      }
    );
  }

  engineers() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        ScrollTrigger.create({
          trigger: ".engineers",
          start: isLandscape ? "top center" : "top 80%",
          end: isLandscape ? "top top" : "top 20%",
          scrub: isTouchDevice ? 1.05 : 1.1,
          animation: gsap.timeline().fromTo([".engineers__heading span"], { autoAlpha: 0, yPercent: "100" }, { autoAlpha: 1, yPercent: 0 }, "0").fromTo(".engineers__letters", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0 }, "0.3"),
        });
      }
    );
  }

  clients() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".clients",
              start: isLandscape ? "top center" : "top 80%",
              end: isLandscape ? "top top" : "top 20%",
              scrub: isTouchDevice ? 1.05 : 1.1,
            },
          })
          .fromTo(".clients-left__background-image img", { autoAlpha: 0, scale: 2 }, { autoAlpha: 1, scale: 1 }, "0")
          .fromTo(".clients__heading", { autoAlpha: 0, xPercent: "-100" }, { autoAlpha: 1, xPercent: 0 }, "0")
          .fromTo(".clients-left-swiper-container", { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0 }, "0");
      }
    );
  }

  reviews() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".reviews",
              start: isLandscape ? "top center" : "top 80%",
              end: isLandscape ? "top top" : "top 20%",
              scrub: isTouchDevice ? 1.05 : 1.1,
            },
          })
          .fromTo(".reviews__heading span", { autoAlpha: 0, yPercent: "100" }, { autoAlpha: 1, yPercent: 0 }, "0")
          .fromTo([".reviews-swiper-container"], { autoAlpha: 0, yPercent: "50" }, { autoAlpha: 1, yPercent: 0 }, "0.1");
      }
    );
  }

  location() {
    this.mm.add(
      {
        isDesktop: "(min-width: 992px)",
        isMobile: "(max-width: 991px)",
        isLandscape: "(orientation: landscape)",
        isPortrait: "(orientation: portrait)",
      },
      (context) => {
        const { isLandscape } = context.conditions;
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".location",
              start: isLandscape ? "top center" : "top 80%",
              end: isLandscape ? "top 10%" : "top 20%",
              scrub: isTouchDevice ? 1.05 : 1.1,
            },
          })
          .fromTo(".location-card", { autoAlpha: 0, xPercent: "-100" }, { autoAlpha: 1, xPercent: 0 }, "0")
          .fromTo(".location__map", { autoAlpha: 0, scale: 1.2 }, { autoAlpha: 1, scale: 1 }, "0")
          .fromTo(".location__pin", { autoAlpha: 0, y: -50 }, { autoAlpha: 1, y: 0 }, "0");
      }
    );
  }
}
