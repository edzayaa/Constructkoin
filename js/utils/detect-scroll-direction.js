function initDetectScrollingDirection() {
  let lastScrollTop = 0;
  const threshold = 0;
  const thresholdTop = 50;

  window.addEventListener("scroll", () => {
    const nowScrollTop = window.scrollY;

    if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {
      const direction = nowScrollTop > lastScrollTop ? "down" : "up";
      document.querySelectorAll("[data-scrolling-direction]").forEach((el) => el.setAttribute("data-scrolling-direction", direction));

      const started = nowScrollTop > thresholdTop;
      document.querySelectorAll("[data-scrolling-started]").forEach((el) => el.setAttribute("data-scrolling-started", started ? "true" : "false"));

      lastScrollTop = nowScrollTop;
    }
  });
}

export  {initDetectScrollingDirection};
