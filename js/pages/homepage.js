import "../config/gsap-config.js";
import { LenisSmooth } from "../config/scrollsmooth.js";
import { ActiveLinks } from "../components/active-links.js";
import { Navbar } from "../components/navbar.js";
import { CustomSwiper } from "../components/global-swiper.js";
import { HomepageAnimations } from "../animations/homepage.js";
import { SharedAnimations } from "../animations/shared-animations.js";
import { Accordion } from "../components/accordion.js";
import { Toggles } from "../components/toggles.js";
import { CryptoData } from "../components/crypto-data.js";

window.addEventListener("DOMContentLoaded", () => {
  new LenisSmooth();
  new ActiveLinks();
  new Navbar();
  new CustomSwiper();
  new HomepageAnimations();
  new SharedAnimations();
  new Accordion();
  new Toggles();
  new CryptoData();
});
