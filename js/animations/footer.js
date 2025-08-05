export class FooterAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.fadeIn();
  }

  fadeIn() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".footer-grid",
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1.1,
        },
      })
      .fromTo(".footer-grid", { autoAlpha: 0 }, { autoAlpha: 1 }, "0")
      .fromTo(".footer-back-to-top", { autoAlpha: 0, x: 150 }, { autoAlpha: 1, x: 0 }, "0"),
      
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".footer",
            start: "top center",
            end: "bottom bottom",
            scrub: 1.1,
          },
        })
        .to({}, { duration: 1 })
        .from(
          [".footer-copyright", ".footer-terms", ".footer-by-mdx"],
          {
            y: 40,
            autoAlpha: 0,
            duration: 0.2,
          },
          0.8
        );
  }
}
