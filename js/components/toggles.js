export class Toggles {
  constructor() {
    this.closeToggles = document.querySelectorAll("[data-close-modal]");
    this.modalWrapper = document.querySelector(".modal-wrapper");
    this.modalVideoInner = document.querySelector(".modal-video__inner");

    this.lenis = window.lenis;

    this.currentVideo = {
      element: null,
      originalParent: null,
      originalNextSibling: null,
    };

    this.init();
  }

  init() {
    this.setupCloseToggles();
    this.setupMenuToggle();
    this.setupVideoToggle();
  }

  setupCloseToggles() {
    this.closeToggles.forEach((closeToggle) => {
      closeToggle.addEventListener("click", () => {
        this.modalWrapper.removeAttribute("data-modal-open");
        this.restoreVideoToOriginalPlace();
        this.lenis.start();
      });
    });
  }

  setupMenuToggle() {
    document.querySelectorAll("[data-toggle-menu]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        document.querySelector(".menu").toggleAttribute("data-menu-active");
        if (this.lenis.isStopped) {
          this.lenis.start();
        } else {
          this.lenis.stop();
        }
      });
    });
  }

  setupVideoToggle() {
    document.querySelectorAll("[data-video-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const videoId = trigger.getAttribute("data-video-trigger");
        const videoSrc = trigger.getAttribute("data-video-src");
        const videoType = trigger.getAttribute("data-video-type") || "video";

        this.openVideoModal(videoId, videoSrc, videoType);
      });
    });
  }

  openVideoModal(videoId, videoSrc = null, videoType = "video") {
    let videoElement = document.querySelector(`[data-video-id="${videoId}"]`);

    let isExistingVideo = !!videoElement;

    if (!videoElement && videoSrc) {
      videoElement = this.createVideoElement(videoId, videoSrc, videoType);
      isExistingVideo = false;
    }

    if (!videoElement) {
      console.warn(`Video con ID "${videoId}" no encontrado y no se proporcionó src`);
      return;
    }

    if (isExistingVideo) {
      videoElement.controls = true;
      this.currentVideo.element = videoElement;
      this.currentVideo.originalParent = videoElement.parentNode;
      this.currentVideo.originalNextSibling = videoElement.nextSibling;
    } else {
      this.currentVideo.element = videoElement;
      this.currentVideo.originalParent = null;
      this.currentVideo.originalNextSibling = null;
    }

    this.modalVideoInner.appendChild(videoElement);

    this.modalWrapper.setAttribute("data-modal-open", "video");
    this.lenis.stop();

    if (videoElement.tagName === "VIDEO") {
      videoElement.play().catch((e) => console.log("Autoplay prevented:", e));
    }
  }

  createVideoElement(videoId, videoSrc, videoType) {
    let videoElement;

    switch (videoType) {
      case "youtube":
        videoElement = document.createElement("iframe");
        videoElement.src = videoSrc;
        videoElement.setAttribute("frameborder", "0");
        videoElement.setAttribute("allowfullscreen", "");
        videoElement.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        break;

      case "iframe":
        videoElement = document.createElement("iframe");
        videoElement.src = videoSrc;
        videoElement.setAttribute("frameborder", "0");
        videoElement.setAttribute("allowfullscreen", "");
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        break;

      case "video":
      default:
        videoElement = document.createElement("video");
        videoElement.src = videoSrc;
        videoElement.setAttribute("controls", "");
        videoElement.setAttribute("preload", "metadata");
        break;
    }

    videoElement.setAttribute("data-video-id", videoId);
    videoElement.setAttribute("data-dynamic-video", "true");

    return videoElement;
  }

  restoreVideoToOriginalPlace() {
    if (this.currentVideo.element) {
      if (this.currentVideo.element.tagName === "VIDEO") {
        this.currentVideo.element.pause();
        this.currentVideo.element.currentTime = 0;
      }

      if (this.currentVideo.element.getAttribute("data-dynamic-video") === "true") {
        this.currentVideo.element.remove();
      } else if (this.currentVideo.originalParent) {
        this.currentVideo.element.controls = false;
        this.currentVideo.element.muted = true;
        this.currentVideo.element.play();
        console.log("sd");
        

        if (this.currentVideo.originalNextSibling) {
          this.currentVideo.originalParent.insertBefore(this.currentVideo.element, this.currentVideo.originalNextSibling);
        } else {
          this.currentVideo.originalParent.appendChild(this.currentVideo.element);
        }
      }

      this.currentVideo = {
        element: null,
        originalParent: null,
        originalNextSibling: null,
      };
    }
  }
}
