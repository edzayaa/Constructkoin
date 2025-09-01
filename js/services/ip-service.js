export class IPservice  {
    constructor(url) {
        this.url = url;
    }

    async getIP() {
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