function initVideoControls() {
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const wrapper = document.querySelector("[data-video-wrapper]");
  const video = wrapper.querySelector("video");

  wrapper.setAttribute("data-video-playing", "false");

  if (isTouchDevice) {
    wrapper.addEventListener("touchstart", () => {
      if (video.paused) {
        video.play();
        wrapper.setAttribute("data-video-playing", "true");
      } else {
        video.pause();
        wrapper.setAttribute("data-video-playing", "false");
      }
    });
  } else {
    wrapper.addEventListener("click", () => {
      if (video.paused) {
        wrapper.setAttribute("data-video-playing", "true");
      } else {
        wrapper.setAttribute("data-video-playing", "false");
      }
    });
  }

  let mouseTimeout;
  const fadeDuration = 300;
  const visibleDuration = 2000;

  function onVideoClick() {}

  wrapper.addEventListener("mousemove", function () {
    clearTimeout(mouseTimeout);
    wrapper.classList.add("show-controls");

    mouseTimeout = setTimeout(() => {
      wrapper.classList.remove("show-controls");
    }, visibleDuration);
  });

  video.addEventListener("play", function () {
    wrapper.setAttribute("data-video-playing", "true");
    wrapper.classList.remove("show-controls");
  });

  video.addEventListener("pause", function () {
    wrapper.setAttribute("data-video-playing", "false");
    wrapper.classList.add("show-controls");
  });
}

export { initVideoControls };
