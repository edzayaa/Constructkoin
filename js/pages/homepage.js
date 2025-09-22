import "../config/gsap-config.js";
import { LenisSmooth } from "../config/scrollsmooth.js";
import { Navbar } from "../components/navbar.js";
import { CustomSwiper } from "../components/global-swiper.js";
import { HomepageAnimations } from "../animations/homepage.js";
import { SharedAnimations } from "../animations/shared-animations.js";
import { Accordion } from "../components/accordion.js";
import { Toggles } from "../components/toggles.js";
import { CryptoData } from "../components/crypto-data.js";
import { VimeoBGVideo } from "../utils/vimeo-bg-video.js";
import { Newsletter } from "../components/newsletter.js";
import { CryptoSwap } from "../components/crypto-swap.js";
import { CountdownTimer } from "../components/countdown.js";
import { IPservice } from "../services/ip-service.js";
import { CryptoService } from "../services/crypto-service.js";
import { PopUpHandler } from "../components/pop-up-handler.js";

window.addEventListener("DOMContentLoaded", async () => {
  const lenis = new LenisSmooth();
  new CustomSwiper();
  new HomepageAnimations(lenis);
  new SharedAnimations();
  new Navbar();
  new Accordion();
  new Toggles(lenis);
  new VimeoBGVideo(lenis);

  const ipService = new IPservice("https://ipapi.co/json");
  new PopUpHandler(ipService, lenis);

  // for newsletter form handler
  // new Newsletter();

  const cryptoService = new CryptoService("https://apidashboard.constructkoin.com/api/wallet/data");
  const cryptoData = await new CryptoData(cryptoService).init();
  
  new CryptoSwap(cryptoData);
  // new CountdownTimer(cryptoData.timeRemaining, ".countdown", { expiredMessage: "" });
});
