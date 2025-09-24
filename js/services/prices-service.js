export class PricesService {
  constructor(url) {
    this.url = url;
  }

  async getPricesData() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      // const data = {
      //   "prices": {
      //     "bitcoin": 113556.9,
      //     "bnb": 1018.43,
      //     "ethereum": 4167.47,
      //     "solana": 212.09
      //   },
      //   "success": true,
      //   "supported_chains": [
      //     "solana",
      //     "ethereum",
      //     "bitcoin",
      //     "bnb"
      //   ],
      //   "timestamp": "2025-09-24T21:02:40.179967"
      // }
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
