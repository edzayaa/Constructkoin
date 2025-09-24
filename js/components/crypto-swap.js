export class CryptoSwap {
  constructor(prices, ctkPrice) {
    this.ctkPrice = ctkPrice;

    this.prices = {};
    this.prices.usdt = 1;
    this.prices.sol = prices.solana;
    this.prices.eth = prices.ethereum;
    this.prices.bnb = prices.bnb;
    this.prices.btc = prices.bitcoin;
    this.selectedPrice = this.prices["usdt"];

    this.init();
  }

  init() {
    const swaps = document.querySelectorAll("[data-crypto-swap]");

    if (!swaps.length) return;
    if (!this.prices) return;

    swaps.forEach((swap) => {
      const swapButton = swap.querySelectorAll("[data-crypto-swap-btn]");
      const textTarget = swap.querySelector("[data-crypto-swap-text]");
      const iconTarget = swap.querySelector("[data-crypto-swap-icon]");

      const payInput = swap.querySelector("#pay");
      const receiveInput = swap.querySelector("#receive");

      swapButton.forEach((button) => {
        const value = button.getAttribute("data-crypto-swap-btn");
        const icon = `/assets/icons/${value}.png`;

        button.addEventListener("click", () => {
          textTarget.textContent = value;
          iconTarget.src = icon;
          this.selectedPrice = this.prices[value];

          if (payInput) payInput.value = "0.0";
          if (receiveInput) receiveInput.value = "0.0";
        });
      });

      if (payInput && receiveInput) {
        payInput.addEventListener("input", () => {
          const payValue = parseFloat(payInput.value) || 0;
          const ctkAmount = (payValue * this.selectedPrice) / this.ctkPrice; //
          receiveInput.value = ctkAmount.toFixed(2);
        });

        receiveInput.addEventListener("input", () => {
          const receiveValue = parseFloat(receiveInput.value) || 0;
          const payAmount = (receiveValue * this.ctkPrice) / this.selectedPrice;
          payInput.value = payAmount.toFixed(2);
        });
      }
    });
  }
}
