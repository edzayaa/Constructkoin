import "../config/gsap-config.js";
import { LenisSmooth } from "../config/scrollsmooth.js";
import { ActiveLinks } from "../components/active-links.js";
import { Navbar } from "../components/navbar.js";
import { CustomSwiper } from "../components/global-swiper.js";
import { HomepageAnimations } from "../animations/homepage.js";
import { SharedAnimations } from "../animations/shared-animations.js";
import { Accordion } from "../components/accordion.js";
import { DragFollower } from "../animations/drag-follower.js";

window.addEventListener("load", async () => {
  new LenisSmooth();
  new ActiveLinks();
  new Navbar();
  new CustomSwiper();
  new HomepageAnimations();
  new SharedAnimations();
  new Accordion();
  new DragFollower();
});
