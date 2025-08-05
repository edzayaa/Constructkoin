export class LenisSmooth {
  constructor(wrapper, content) {
    this.lenis = null;
    this.wrapper = wrapper;
    this.content = content;

    this.config = {
      wheelMultiplier: 0.8,
      duration: 1,
      ...(this.wrapper && { wrapper: this.wrapper }),
      ...(this.content && { content: this.content }),
    };

    this.setUpLenisScroll();
    this.setScrollTo();
  }

  setUpLenisScroll() {
    const lenis = new Lenis({
      ...this.config,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    this.lenis = lenis;
    window.lenis = lenis;
  }

  getLenisInstance() {
    return this.lenis;
  }

  setScrollTo() {
    const triggers = document.querySelectorAll("[data-scrollto]");

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        let target = trigger.getAttribute("data-scrollto");

        if (!isNaN(target)) {
          target = parseFloat(target);
        }

        this.lenis.scrollTo(target, {
          duration: 1.5,
          lock: true,
        });
      });
    });
  }
}
