export class CountdownTimer {
  constructor(targetDate, containerSelector, options = {}) {
    this.targetDate = new Date(targetDate).getTime();
    this.container = document.querySelector(containerSelector);
    this.options = {
      daysText: options.daysText || "Days",
      hoursText: options.hoursText || "Hours",
      minutesText: options.minutesText || "Minutes",
      secondsText: options.secondsText || "Seconds",
      expiredMessage: options.expiredMessage || "EXPIRED",
      ...options,
    };

    this.interval = null;
    this.init();
  }

  init() {
    if (!this.container) {
      console.error(`Container with selector "${this.containerSelector}" not found`);
      return;
    }

    this.start();
  }

  start() {
    this.updateCountdown();

    this.interval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      clearInterval(this.interval);
      this.showExpired();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.updateDisplay(days, hours, minutes, seconds);
  }

  updateDisplay(days, hours, minutes, seconds) {
    const daysElement = this.container.querySelector(".is-days .countdown-card__number");
    const hoursElement = this.container.querySelector(".is-hours .countdown-card__number");
    const minutesElement = this.container.querySelector(".is-minutes .countdown-card__number");
    const secondsElement = this.container.querySelector(".is-seconds .countdown-card__number");

    const daysTextElement = this.container.querySelector(".is-days .countdown-card__text");
    const hoursTextElement = this.container.querySelector(".is-hours .countdown-card__text");
    const minutesTextElement = this.container.querySelector(".is-minutes .countdown-card__text");
    const secondsTextElement = this.container.querySelector(".is-seconds .countdown-card__text");

    if (daysElement) daysElement.textContent = this.formatTime(days);
    if (hoursElement) hoursElement.textContent = this.formatTime(hours);
    if (minutesElement) minutesElement.textContent = this.formatTime(minutes);
    if (secondsElement) secondsElement.textContent = this.formatTime(seconds);

    if (daysTextElement && this.options.daysText) daysTextElement.textContent = this.options.daysText;
    if (hoursTextElement && this.options.hoursText) hoursTextElement.textContent = this.options.hoursText;
    if (minutesTextElement && this.options.minutesText) minutesTextElement.textContent = this.options.minutesText;
    if (secondsTextElement && this.options.secondsText) secondsTextElement.textContent = this.options.secondsText;
  }

  showExpired() {
    const countdownNumbers = this.container.querySelector(".cound-down__flex");
    if (countdownNumbers) {
      countdownNumbers.style.display = "none";
    }

    const titleElement = this.container.querySelector(".countdown-card__h2");
    if (titleElement) {
      titleElement.textContent = this.options.expiredMessage;
    }
  }

  formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateTargetDate(newDate) {
    this.targetDate = new Date(newDate).getTime();
    this.stop();

    const countdownNumbers = this.container.querySelector(".cound-down__flex");
    if (countdownNumbers) {
      countdownNumbers.style.display = "flex";
    }

    this.start();
  }
}
