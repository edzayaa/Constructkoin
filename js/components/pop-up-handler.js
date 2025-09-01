export class PopUpHandler {
  constructor(ipService, lenis) {
    this.ipService = ipService;
    this.lenis = lenis.getLenisInstance();

    this.getUserIp();
  }

  setUpPopup(target) {
    const modalWrapper = document.querySelector(".modal-wrapper");
    modalWrapper.setAttribute("data-modal-open", target);
    this.lenis.stop();
  }

  setupForbiddenPopup() {
    this.setUpPopup("forbidden");

    const leaveSiteButton = document.getElementById("leave-site-btn");

    if (leaveSiteButton) {
      leaveSiteButton.addEventListener("click", function () {
        if (history.length > 1) {
          history.back();
        } else {
          window.location.href = "https://www.google.com";
        }
      });
    }
  }

  getUserIp() {
    this.ipService.getIP().then((ip) => {
      const country = ip.country;

      if (country === "GB") {
        this.setupForbiddenPopup();
      }

      // to activate newsletter popup
      // if (country !== "GB") {
      //   this.setUpPopup("newsletter");
      // }
    });
  }
}
