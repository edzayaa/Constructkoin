export class VimeoBGVideo {
  constructor(lenis) {
    this.currentPlayer = null;
    this.lenis = lenis.getLenisInstance();

    this.init();
  }

  init() {
    this.initVimeoBGVideo();
    this.initVimeoLightboxAdvanced();
    this.initVimeoPlayer();
  }

  initVimeoBGVideo() {
    const vimeoPlayers = document.querySelectorAll("[data-vimeo-bg-init]");

    if (!vimeoPlayers.length) return;

    vimeoPlayers.forEach((vimeoElement, index) => {
      const vimeoVideoID = vimeoElement.getAttribute("data-vimeo-video-id");
      if (!vimeoVideoID) return;

      const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=1&loop=1&muted=1`;
      vimeoElement.querySelector("iframe").setAttribute("src", vimeoVideoURL);

      // Assign an ID to each element
      const videoIndexID = "vimeo-bg-basic-index-" + index;
      vimeoElement.setAttribute("id", videoIndexID);

      const iframeID = vimeoElement.id;
      const player = new Vimeo.Player(iframeID);

      player.setVolume(0);

      player.on("bufferend", () => {
        vimeoElement.setAttribute("data-vimeo-activated", "true");
        vimeoElement.setAttribute("data-vimeo-loaded", "true");
      });

      let videoAspectRatio;
      if (vimeoElement.getAttribute("data-vimeo-update-size") === "true") {
        player.getVideoWidth().then((width) => {
          player.getVideoHeight().then((height) => {
            videoAspectRatio = height / width;
            const beforeEl = vimeoElement.querySelector(".vimeo-bg__before");
            if (beforeEl) {
              beforeEl.style.paddingTop = videoAspectRatio * 100 + "%";
            }
          });
        });
      }

      // Function to adjust video sizing
      const adjustVideoSizing = () => {
        const containerAspectRatio = (vimeoElement.offsetHeight / vimeoElement.offsetWidth) * 100;

        const iframeWrapper = vimeoElement.querySelector(".vimeo-bg__iframe-wrapper");
        if (iframeWrapper && videoAspectRatio) {
          if (containerAspectRatio > videoAspectRatio * 100) {
            iframeWrapper.style.width = `${(containerAspectRatio / (videoAspectRatio * 100)) * 100}%`;
          } else {
            iframeWrapper.style.width = "";
          }
        }
      };
      // Adjust video sizing initially
      if (vimeoElement.getAttribute("data-vimeo-update-size") === "true") {
        adjustVideoSizing();
        player.getVideoWidth().then((width) => {
          player.getVideoHeight().then((height) => {
            adjustVideoSizing();
          });
        });
      } else {
        adjustVideoSizing();
      }
      // Adjust video sizing on resize
      window.addEventListener("resize", adjustVideoSizing);
    });
  }

  initVimeoLightboxAdvanced() {
    const modalWrapper = document.querySelector(".modal-wrapper");

    // Single lightbox container
    const lightbox = document.querySelector("[data-vimeo-lightbox-init]");

    if (!lightbox) return;

    // Open & close buttons
    const openButtons = document.querySelectorAll('[data-vimeo-lightbox-control="open"]');
    const closeButtons = document.querySelectorAll('[data-vimeo-lightbox-control="close"]');

    // Core elements inside lightbox
    let iframe = lightbox.querySelector("iframe"); // ← now let
    const placeholder = lightbox.querySelector(".vimeo-lightbox__placeholder");
    const calcEl = lightbox.querySelector(".vimeo-lightbox__calc");
    const wrapEl = lightbox.querySelector(".vimeo-lightbox__calc-wrap");
    const playerContainer = lightbox.querySelector("[data-vimeo-lightbox-player]");

    // State
    let player = null;
    let currentVideoID = null;
    let videoAspectRatio = null;
    let globalMuted = lightbox.getAttribute("data-vimeo-muted") === "true";
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const playedOnce = new Set(); // track first play on touch

    // Format time (seconds → "m:ss")
    const formatTime = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60)
        .toString()
        .padStart(2, "0");
      return `${m}:${sec}`;
    };

    // Clamp wrap height
    const clampWrapSize = (ar) => {
      const w = calcEl.offsetWidth;
      const h = calcEl.offsetHeight;
      wrapEl.style.maxWidth = Math.min(w, h / ar) + "px";
    };

    // Adjust sizing in "cover" mode
    const adjustCoverSizing = () => {
      if (!videoAspectRatio) return;
      const cH = playerContainer.offsetHeight;
      const cW = playerContainer.offsetWidth;
      const r = cH / cW;
      const wEl = lightbox.querySelector(".vimeo-lightbox__iframe");
      if (r > videoAspectRatio) {
        wEl.style.width = (r / videoAspectRatio) * 100 + "%";
        wEl.style.height = "100%";
      } else {
        wEl.style.height = (videoAspectRatio / r) * 100 + "%";
        wEl.style.width = "100%";
      }
    };

    // Close & pause lightbox
    const closeLightbox = () => {
      lightbox.setAttribute("data-vimeo-activated", "false");

      modalWrapper.removeAttribute("data-modal-open");
      this.lenis.start();

      if (player) {
        player.pause();
        lightbox.setAttribute("data-vimeo-playing", "false");
      }
    };

    // Wire Escape key & close buttons
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
    closeButtons.forEach((btn) => btn.addEventListener("click", closeLightbox));

    // Setup Vimeo Player event handlers
    const setupPlayerEvents = () => {
      // Hide placeholder when playback starts
      player.on("play", () => {
        lightbox.setAttribute("data-vimeo-loaded", "true");
        lightbox.setAttribute("data-vimeo-playing", "true");
      });
      // Close on video end
      player.on("ended", closeLightbox);

      // Paused
      player.on("pause", () => {
        lightbox.setAttribute("data-vimeo-playing", "false");
      });

      // Duration UI
      const durEl = lightbox.querySelector("[data-vimeo-duration]");
      player.getDuration().then((d) => {
        if (durEl) durEl.textContent = formatTime(d);
        lightbox.querySelectorAll('[data-vimeo-control="timeline"],progress').forEach((el) => (el.max = d));
      });

      // Timeline & progress updates
      const tl = lightbox.querySelector('[data-vimeo-control="timeline"]');
      const pr = lightbox.querySelector("progress");
      player.on("timeupdate", (data) => {
        if (tl) tl.value = data.seconds;
        if (pr) pr.value = data.seconds;
        if (durEl) durEl.textContent = formatTime(Math.trunc(data.seconds));
      });
      if (tl) {
        ["input", "change"].forEach((evt) =>
          tl.addEventListener(evt, (e) => {
            const v = e.target.value;
            player.setCurrentTime(v);
            if (pr) pr.value = v;
          })
        );
      }

      // Hover → hide controls after a timeout
      let hoverTimer;
      playerContainer.addEventListener("mousemove", () => {
        lightbox.setAttribute("data-vimeo-hover", "true");
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          lightbox.setAttribute("data-vimeo-hover", "false");
        }, 3000);
      });

      // Fullscreen toggle on player container
      const fsBtn = lightbox.querySelector('[data-vimeo-control="fullscreen"]');
      if (fsBtn) {
        const isFS = () => document.fullscreenElement || document.webkitFullscreenElement;
        if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
          fsBtn.style.display = "none";
        }
        fsBtn.addEventListener("click", () => {
          if (isFS()) {
            lightbox.setAttribute("data-vimeo-fullscreen", "false");
            (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          } else {
            lightbox.setAttribute("data-vimeo-fullscreen", "true");
            (playerContainer.requestFullscreen || playerContainer.webkitRequestFullscreen).call(playerContainer);
          }
        });
        ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => document.addEventListener(evt, () => lightbox.setAttribute("data-vimeo-fullscreen", isFS() ? "true" : "false")));
      }
    };

    // Run sizing logic
    const runSizing = async () => {
      const mode = lightbox.getAttribute("data-vimeo-update-size");
      const w = await player.getVideoWidth();
      const h = await player.getVideoHeight();
      const ar = h / w;
      const bef = lightbox.querySelector(".vimeo-lightbox__before");

      if (mode === "true") {
        if (bef) bef.style.paddingTop = ar * 100 + "%";
        clampWrapSize(ar);
      } else if (mode === "cover") {
        videoAspectRatio = ar;
        if (bef) bef.style.paddingTop = "0%";
        adjustCoverSizing();
      } else {
        clampWrapSize(ar);
      }
    };

    // Re-run sizing on viewport resize
    window.addEventListener("resize", () => {
      if (player) runSizing();
    });

    // Open or switch video
    const openLightbox = async (id, placeholderBtn) => {
      // Enter loading state immediately
      lightbox.setAttribute("data-vimeo-activated", "loading");
      lightbox.setAttribute("data-vimeo-loaded", "false");

      // — FULL RESET if new video ID —
      if (player && id !== currentVideoID) {
        await player.pause();
        await player.unload();

        // Replace old iframe with a fresh one
        const oldIframe = iframe;
        const newIframe = document.createElement("iframe");
        newIframe.className = oldIframe.className;
        newIframe.setAttribute("allow", oldIframe.getAttribute("allow"));
        newIframe.setAttribute("frameborder", "0");
        newIframe.setAttribute("allowfullscreen", "true");
        newIframe.setAttribute("allow", "autoplay; encrypted-media");
        oldIframe.parentNode.replaceChild(newIframe, oldIframe);

        // Reset state
        iframe = newIframe;
        player = null;
        currentVideoID = null;
        lightbox.setAttribute("data-vimeo-playing", "false");
      }

      // Update placeholder image attributes
      if (placeholderBtn) {
        ["src", "srcset", "sizes", "alt", "width"].forEach((attr) => {
          const val = placeholderBtn.getAttribute(attr);
          if (val != null) placeholder.setAttribute(attr, val);
        });
      }

      // Build a brand-new player if needed
      if (!player) {
        iframe.src = `https://player.vimeo.com/video/${id}?api=1&background=1&autoplay=0&loop=0&muted=0`;
        player = new Vimeo.Player(iframe);
        setupPlayerEvents();
        currentVideoID = id;
        await runSizing();
      }

      // Now sizing is ready — show lightbox
      const isNotActive = lightbox.getAttribute("data-vimeo-activated") === "false";
      if (isNotActive) return;

      lightbox.setAttribute("data-vimeo-activated", "true");

      // Autoplay logic
      if (!isTouch) {
        player.setVolume(globalMuted ? 0 : 1).then(() => {
          lightbox.setAttribute("data-vimeo-playing", "true");
          setTimeout(() => player.play(), 50);
        });
      } else if (playedOnce.has(currentVideoID)) {
        player.setVolume(globalMuted ? 0 : 1).then(() => {
          lightbox.setAttribute("data-vimeo-playing", "true");
          player.play();
        });
      }
    };

    // Internal controls
    lightbox.querySelector('[data-vimeo-control="play"]').addEventListener("click", () => {
      if (isTouch) {
        if (!playedOnce.has(currentVideoID)) {
          player.setVolume(0).then(() => {
            lightbox.setAttribute("data-vimeo-playing", "true");
            player.play();
            if (!globalMuted) {
              setTimeout(() => {
                player.setVolume(1);
                lightbox.setAttribute("data-vimeo-muted", "false");
              }, 100);
            }
            playedOnce.add(currentVideoID);
          });
        } else {
          player.setVolume(globalMuted ? 0 : 1).then(() => {
            lightbox.setAttribute("data-vimeo-playing", "true");
            player.play();
          });
        }
      } else {
        player.setVolume(globalMuted ? 0 : 1).then(() => {
          lightbox.setAttribute("data-vimeo-playing", "true");
          setTimeout(() => player.play(), 50);
        });
      }
    });

    lightbox.querySelector('[data-vimeo-control="pause"]').addEventListener("click", () => {
      player.pause();
    });

    lightbox.querySelector('[data-vimeo-control="mute"]').addEventListener("click", () => {
      globalMuted = !globalMuted;
      player.setVolume(globalMuted ? 0 : 1).then(() => lightbox.setAttribute("data-vimeo-muted", globalMuted ? "true" : "false"));
    });

    // Wire up open buttons
    openButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const vid = btn.getAttribute("data-vimeo-lightbox-id");
        const img = btn.querySelector("[data-vimeo-lightbox-placeholder]");
        this.lenis.stop();
        modalWrapper.setAttribute("data-modal-open", "video");
        openLightbox(vid, img);
      });
    });
  }

  initVimeoPlayer() {
    // Select all elements that have [data-vimeo-player-init]
    const vimeoPlayers = document.querySelectorAll("[data-vimeo-player-init]");

    vimeoPlayers.forEach(function (vimeoElement, index) {
      // Add Vimeo URL ID to the iframe [src]
      // Looks like: https://player.vimeo.com/video/1019191082
      const vimeoVideoID = vimeoElement.getAttribute("data-vimeo-video-id");
      if (!vimeoVideoID) return;
      const vimeoVideoURL = `https://player.vimeo.com/video/${vimeoVideoID}?api=1&background=1&autoplay=0&loop=0&muted=1`;
      vimeoElement.querySelector("iframe").setAttribute("src", vimeoVideoURL);

      // Assign an ID to each element
      const videoIndexID = "vimeo-player-advanced-index-" + index;
      vimeoElement.setAttribute("id", videoIndexID);

      const iframeID = vimeoElement.id;
      const player = new Vimeo.Player(iframeID);

      // Update Aspect Ratio if [data-vimeo-update-size="true"]
      if (vimeoElement.getAttribute("data-vimeo-update-size") === "true") {
        player.getVideoWidth().then(function (width) {
          player.getVideoHeight().then(function (height) {
            const beforeEl = vimeoElement.querySelector(".vimeo-player__before");
            if (beforeEl) {
              beforeEl.style.paddingTop = (height / width) * 100 + "%";
            }
          });
        });
      }

      // Update sizing if [data-vimeo-update-size="cover"]
      let videoAspectRatio;

      if (vimeoElement.getAttribute("data-vimeo-update-size") === "cover") {
        player.getVideoWidth().then(function (width) {
          player.getVideoHeight().then(function (height) {
            videoAspectRatio = height / width;
            const beforeEl = vimeoElement.querySelector(".vimeo-player__before");
            if (beforeEl) {
              beforeEl.style.paddingTop = "0%";
            }
            adjustVideoSizing();
          });
        });
      }

      // Function to adjust video sizing (to cover the video)
      function adjustVideoSizing() {
        const containerRatio = vimeoElement.offsetHeight / vimeoElement.offsetWidth;

        const iframeWrapper = vimeoElement.querySelector(".vimeo-player__iframe");
        if (iframeWrapper && videoAspectRatio) {
          if (containerRatio > videoAspectRatio) {
            // Container is taller relative to the video
            const widthFactor = containerRatio / videoAspectRatio;
            iframeWrapper.style.width = widthFactor * 100 + "%";
            iframeWrapper.style.height = "100%";
          } else {
            // Container is wider relative to the video
            const heightFactor = videoAspectRatio / containerRatio;
            iframeWrapper.style.height = heightFactor * 100 + "%";
            iframeWrapper.style.width = "100%";
          }
        }
      }

      // Adjust video sizing on resize
      if (vimeoElement.getAttribute("data-vimeo-update-size") === "cover") {
        window.addEventListener("resize", adjustVideoSizing);
      }

      // Loaded & play
      player.on("play", function () {
        vimeoElement.setAttribute("data-vimeo-loaded", "true");
        vimeoElement.setAttribute("data-vimeo-playing", "true");
      });

      // Autoplay
      if (vimeoElement.getAttribute("data-vimeo-autoplay") === "false") {
        // Autoplay = false
        player.setVolume(1);
        player.pause();
      } else {
        // Autoplay = true
        player.setVolume(0);
        vimeoElement.setAttribute("data-vimeo-muted", "true");

        // If paused-by-user === false, do scroll-based autoplay
        if (vimeoElement.getAttribute("data-vimeo-paused-by-user") === "false") {
          function checkVisibility() {
            const rect = vimeoElement.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            inView ? vimeoPlayerPlay() : vimeoPlayerPause();
          }

          // Initial check
          checkVisibility();

          // Handle scroll
          window.addEventListener("scroll", checkVisibility);
        }
      }

      // Function: Play Video
      function vimeoPlayerPlay() {
        vimeoElement.setAttribute("data-vimeo-activated", "true");
        vimeoElement.setAttribute("data-vimeo-playing", "true");
        player.play();
      }

      // Function: Pause Video
      function vimeoPlayerPause() {
        player.pause();
      }

      // Paused
      player.on("pause", function () {
        vimeoElement.setAttribute("data-vimeo-playing", "false");
      });

      // Click: Play
      const playBtn = vimeoElement.querySelector('[data-vimeo-control="play"]');
      if (playBtn) {
        playBtn.addEventListener("click", function () {
          // Always set volume to 0 first to avoid pop
          player.setVolume(0);
          vimeoPlayerPlay();

          // If muted attribute is 'true', keep volume at 0, else 1
          if (vimeoElement.getAttribute("data-vimeo-muted") === "true") {
            player.setVolume(0);
          } else {
            player.setVolume(1);
          }
        });
      }

      // Click: Pause
      const pauseBtn = vimeoElement.querySelector('[data-vimeo-control="pause"]');
      if (pauseBtn) {
        pauseBtn.addEventListener("click", function () {
          vimeoPlayerPause();
          // If paused by user => kill the scroll-based autoplay
          if (vimeoElement.getAttribute("data-vimeo-autoplay") === "true") {
            vimeoElement.setAttribute("data-vimeo-paused-by-user", "true");
            // Removing scroll listener (if you’d like)
            window.removeEventListener("scroll", checkVisibility);
          }
        });
      }

      // Click: Mute
      const muteBtn = vimeoElement.querySelector('[data-vimeo-control="mute"]');
      if (muteBtn) {
        muteBtn.addEventListener("click", function () {
          if (vimeoElement.getAttribute("data-vimeo-muted") === "false") {
            player.setVolume(0);
            vimeoElement.setAttribute("data-vimeo-muted", "true");
          } else {
            player.setVolume(1);
            vimeoElement.setAttribute("data-vimeo-muted", "false");
          }
        });
      }

      // Fullscreen
      // Check if Fullscreen API is supported
      const fullscreenSupported = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);

      const fullscreenBtn = vimeoElement.querySelector('[data-vimeo-control="fullscreen"]');

      // Hide the fullscreen button if not supported
      if (!fullscreenSupported && fullscreenBtn) {
        fullscreenBtn.style.display = "none";
      }

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
          const fullscreenElement = document.getElementById(iframeID);
          if (!fullscreenElement) return;

          const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

          if (isFullscreen) {
            // Exit fullscreen
            vimeoElement.setAttribute("data-vimeo-fullscreen", "false");
            (document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen).call(document);
          } else {
            // Enter fullscreen
            vimeoElement.setAttribute("data-vimeo-fullscreen", "true");
            (fullscreenElement.requestFullscreen || fullscreenElement.webkitRequestFullscreen || fullscreenElement.mozRequestFullScreen || fullscreenElement.msRequestFullscreen).call(fullscreenElement);
          }
        });
      }

      const handleFullscreenChange = () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

        vimeoElement.setAttribute("data-vimeo-fullscreen", isFullscreen ? "true" : "false");
      };

      // Add event listeners for fullscreen changes (with vendor prefixes)
      ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"].forEach((event) => {
        document.addEventListener(event, handleFullscreenChange);
      });

      // Convert seconds to mm:ss
      function secondsTimeSpanToHMS(s) {
        let h = Math.floor(s / 3600);
        s -= h * 3600;
        let m = Math.floor(s / 60);
        s -= m * 60;
        return m + ":" + (s < 10 ? "0" + s : s);
      }

      // Duration
      const vimeoDuration = vimeoElement.querySelector("[data-vimeo-duration]");
      player.getDuration().then(function (duration) {
        if (vimeoDuration) {
          vimeoDuration.textContent = secondsTimeSpanToHMS(duration);
        }
        // Update timeline + progress max
        const timelineAndProgress = vimeoElement.querySelectorAll('[data-vimeo-control="timeline"], progress');
        timelineAndProgress.forEach((el) => {
          el.setAttribute("max", duration);
        });
      });

      // Timeline
      const timelineElem = vimeoElement.querySelector('[data-vimeo-control="timeline"]');
      const progressElem = vimeoElement.querySelector("progress");

      function updateTimelineValue() {
        player.getDuration().then(function () {
          const timeVal = timelineElem.value;
          player.setCurrentTime(timeVal);
          if (progressElem) {
            progressElem.value = timeVal;
          }
        });
      }

      if (timelineElem) {
        ["input", "change"].forEach((evt) => {
          timelineElem.addEventListener(evt, updateTimelineValue);
        });
      }

      // Progress Time & Timeline (timeupdate)
      player.on("timeupdate", function (data) {
        if (timelineElem) {
          timelineElem.value = data.seconds;
        }
        if (progressElem) {
          progressElem.value = data.seconds;
        }
        if (vimeoDuration) {
          vimeoDuration.textContent = secondsTimeSpanToHMS(Math.trunc(data.seconds));
        }
      });

      // Hide controls after hover on Vimeo player
      let vimeoHoverTimer;
      vimeoElement.addEventListener("mousemove", function () {
        if (vimeoElement.getAttribute("data-vimeo-hover") === "false") {
          vimeoElement.setAttribute("data-vimeo-hover", "true");
        }
        clearTimeout(vimeoHoverTimer);
        vimeoHoverTimer = setTimeout(vimeoHoverTrue, 3000);
      });

      function vimeoHoverTrue() {
        vimeoElement.setAttribute("data-vimeo-hover", "false");
      }

      // Video Ended
      function vimeoOnEnd() {
        if (vimeoElement.getAttribute("data-vimeo-autoplay") === "false") {
          vimeoElement.setAttribute("data-vimeo-activated", "false");
          vimeoElement.setAttribute("data-vimeo-playing", "false");
          player.unload();
        } else {
          player.play();
        }
      }
      player.on("ended", vimeoOnEnd);
    });
  }
}
