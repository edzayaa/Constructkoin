export class CryptoService {
  constructor(url) {
    this.url = url;
  }

  async getCryptoData() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
