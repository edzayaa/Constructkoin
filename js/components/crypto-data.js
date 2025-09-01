export class CryptoData {
  constructor(cryptoService) {
    this.isFetching = false;
    this.navbarPriceElement = document.querySelector(".navbar-price__text span");
    this.currentPrice = 0;
    this.timeRemaining = 0;
    this.cryptoService = cryptoService;
  }

  async init() {
    this.isFetching = true;
    const data = await this.cryptoService.getCryptoData();
    this.isFetching = false;

    if (data) {
      this.currentPrice = data.price;
      this.updateNavbarPrice(data.price);
      this.updateCardData(data);
    }

    this.setupPriceButton();

    return this;
  }

  updateNavbarPrice(price) {
    this.navbarPriceElement.textContent = `$${price}`;
  }

  updateCardData(data) {
    const tokensSold = parseFloat(data.tokensSold);
    const totalTokens = parseFloat(data.totalTokens);
    const percentageSold = ((tokensSold / totalTokens) * 100).toFixed(2);
    const nextPrice = parseFloat(data.price) + 0.01;

    const tokenSoldPercentageElement = document.querySelector(".protocol-card__loader-text");
    const tokenSoldElement = document.querySelector(".protocol-card__token-sold strong");
    const tokenSoldLineElement = document.querySelector(".protocol-card__loader-line");
    const currentPriceElement = document.querySelector(".protocol-card__current-price strong");
    const heroCurrentPriceElement = document.querySelector(".hero-current-price");
    const heroNextPriceElement = document.querySelector(".hero-next-price");
    const nextPriceElement = document.querySelector(".protocol-card__next-price strong");

    if (tokenSoldPercentageElement) tokenSoldPercentageElement.textContent = `${percentageSold}% Sold`;
    if (tokenSoldElement) tokenSoldElement.textContent = tokensSold.toLocaleString();
    if (tokenSoldLineElement) tokenSoldLineElement.style = `transform: translateX(${percentageSold * 100}%)`;
    if (currentPriceElement) currentPriceElement.textContent = `$${data.price}`;
    if (heroCurrentPriceElement) heroCurrentPriceElement.textContent = `$${data.price}`;
    if (nextPriceElement) nextPriceElement.textContent = `$${nextPrice.toFixed(2)}`;
    // if (heroNextPriceElement) heroNextPriceElement.textContent = `$${nextPrice.toFixed(2)}`;
    // if (heroNextPriceElement) heroNextPriceElement.textContent = `$1.00!`;
  }

  setupPriceButton() {
    this.navbarPriceElement.addEventListener("click", async () => {
      if (!this.isFetching) {
        this.isFetching = true;
        const data = await this.cryptoService.getCryptoData();
        this.isFetching = false;
        if (data) {
          this.updateNavbarPrice(data.price);
          this.updateCardData(data);
        }
      }
    });
  }
}
