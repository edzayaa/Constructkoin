export class CryptoData {
  constructor(cryptoService) {
    this.isFetching = false;
    this.navbarPriceElement = document.querySelector(".navbar-price__text-info span");
    this.currentPrice = 0;
    this.nextPrice = 0;
    this.timeRemaining = 0;
    this.cryptoService = cryptoService;
  }

  async init() {
    this.isFetching = true;
    const data = await this.cryptoService.getCryptoData();
    this.isFetching = false;

    if (data) {
      this.currentPrice = data.tokenPrice;
      this.currentPrice = data.tokenPrice;
      this.nextPrice = data.nextPhase.tokenPrice;
      this.updateNavbarPrice(data.tokenPrice);
      this.updateCardData(data);
    }

    this.setupPriceButton();

    return this;
  }

  updateNavbarPrice(price) {
    if (!price) return;
    this.navbarPriceElement.textContent = `$${price}`;
  }

  updateCardData(data) {
    if (!data) return;
    console.log(data)
    const tokensSold = parseFloat(data.tokensSold);

    const totalTokens = parseFloat(data.tokenLimit);
    const percentageSold = ((tokensSold / totalTokens) * 100).toFixed(2);
    const usdRaised = parseFloat(data.total_usdt_raised).toFixed(2);

    const tokenSoldPercentageElement = document.querySelector(".protocol-card__loader-text");
    const tokenSoldElement = document.querySelector(".protocol-card__token-sold strong");
    const tokenSoldLineElement = document.querySelector(".protocol-card__loader-line");
    const currentPriceElement = document.querySelector(".protocol-card__current-price strong");
    const heroCurrentPriceElement = document.querySelector(".hero-current-price");
    const heroNextPriceElement = document.querySelectorAll("[data-next-price-tag]");
    const usdRaisedElement = document.querySelector(".protocol-card__token-raised strong");

    if (tokenSoldPercentageElement) tokenSoldPercentageElement.textContent = `${percentageSold}% Sold`;
    if (tokenSoldElement) tokenSoldElement.textContent = tokensSold.toLocaleString();
    if (tokenSoldLineElement) tokenSoldLineElement.style = `transform: translateX(${(tokensSold / totalTokens) * 100}%)`;
    if (currentPriceElement) currentPriceElement.textContent = `$${data.tokenPrice}`;
    if (heroCurrentPriceElement) heroCurrentPriceElement.textContent = `$${data.tokenPrice}`;
    if (currentPriceElement) currentPriceElement.textContent = `$${data.tokenPrice}`;
    if (heroCurrentPriceElement) heroCurrentPriceElement.textContent = `$${data.tokenPrice}`;
    if (usdRaisedElement) usdRaisedElement.textContent = `$${usdRaised}`;

    heroNextPriceElement.forEach((element) => {
      element.textContent = `$${this.nextPrice.toFixed(3)}`;
    });
  }

  setupPriceButton() {
    this.navbarPriceElement.addEventListener("click", async () => {
      if (!this.isFetching) {
        this.isFetching = true;
        const data = await this.cryptoService.getCryptoData();

        this.isFetching = false;
        if (data) {
          this.updateNavbarPrice(data.tokenPrice);
          this.updateCardData(data);
        }
      }
    });
  }
}
