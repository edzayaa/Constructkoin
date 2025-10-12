import "../config/gsap-config.js";
import { LenisSmooth } from "../config/scrollsmooth.js";
import { Navbar } from "../components/navbar.js";
import { SharedAnimations } from "../animations/shared-animations.js";
import { VimeoBGVideo } from "../utils/vimeo-bg-video.js";
import { CryptoService } from "../services/crypto-service.js";
import { CryptoData } from "../components/crypto-data.js";
import { Toggles } from "../components/toggles.js";

window.addEventListener("DOMContentLoaded", async () => {
  const lenis = new LenisSmooth();
  new SharedAnimations();
  new Navbar();
  new VimeoBGVideo(lenis);
  new Toggles(lenis);

  const cryptoService = new CryptoService("https://apidashboard.constructkoin.com/api/wallet/data");
  const cryptoData = await new CryptoData(cryptoService).init();
});
