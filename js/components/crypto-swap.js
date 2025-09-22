export class CryptoSwap {
  constructor(cryptoData) {
    this.price = cryptoData.currentPrice;
    
    this.init();
  }

  init() {
    const swaps = document.querySelectorAll("[data-crypto-swap]");

    if (!swaps.length) return;
    if (!this.price) return;

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
        });
      });

      if (payInput && receiveInput) {
        payInput.addEventListener("input", () => {
          const payValue = parseFloat(payInput.value) || 0;
          const ctkAmount = payValue / this.price; //
          receiveInput.value = ctkAmount.toFixed(2);
        });

        receiveInput.addEventListener("input", () => {
          const receiveValue = parseFloat(receiveInput.value) || 0;
          const payAmount = receiveValue * this.price;
          payInput.value = payAmount.toFixed(2);
        });
      }
    });
  }
}
