export class CryptoData {
  constructor() {
    this.isFetching = false;
    this.navbarPriceElement = document.querySelector(".navbar-price__text span");
    this.init();
  }

  async init() {
    const data = await this.fetchCryptoData();
    if (data) {
      this.updateNavbarPrice(data.price);
      this.updateCardData(data);
    }

    this.setupPriceButton();
  }

  async fetchCryptoData() {
    try {
      this.isFetching = true;

      document.documentElement.setAttribute("data-price-loading", "");
      const response = await fetch("https://apidashboard.constructkoin.com/api/wallet/data");
      this.isFetching = false;

      document.documentElement.removeAttribute("data-price-loading");
      if (!response.ok) throw new Error("Error al obtener datos");

      return await response.json();
    } catch (error) {
      this.isFetching = false;
      console.error("Error fetching crypto data:", error);
      return null;
    }
  }

  updateNavbarPrice(price) {
    this.navbarPriceElement.textContent = `$${price}`;
  }

  updateCardData(data) {
    const tokensSold = parseFloat(data.tokensSold);
    const totalTokens = parseFloat(data.totalTokens);
    const percentageSold = ((tokensSold / totalTokens) * 100).toFixed(2);

    const tokenSoldPercentageElement = document.querySelector(".protocol-card__loader-text");
    const tokenSoldElement = document.querySelector(".protocol-card__token-sold strong");
    const tokenSoldLineElement = document.querySelector(".protocol-card__loader-line");
    const currentPriceElement = document.querySelector(".protocol-card__current-price strong");
    // const nextPriceElement = document.querySelector(".protocol-card__next-price strong");

    if (tokenSoldPercentageElement) tokenSoldPercentageElement.textContent = `${percentageSold}% Sold`;
    if (tokenSoldElement) tokenSoldElement.textContent = tokensSold.toLocaleString();
    if (tokenSoldLineElement) tokenSoldLineElement.style = `transform: translateX(${percentageSold * 100}%)`;
    if (currentPriceElement) currentPriceElement.textContent = `$${data.price}`;
    // if (nextPriceElement) nextPriceElement.textContent = `$${data.price}`;
  }

  setupPriceButton() {
    this.navbarPriceElement.addEventListener("click", async () => {
      if (!this.isFetching) {
        const data = await this.fetchCryptoData();
        if (data) {
          this.updateNavbarPrice(data.price);
          this.updateCardData(data);
        }
      }
    });
  }
}
