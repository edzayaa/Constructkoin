export class CountdownTimer {
  constructor(timeRemaining, containerSelector, options = {}) {
    this.timeRemaining = Number(timeRemaining); // viene en segundos
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
      this.timeRemaining--;

      if (this.timeRemaining < 0) {
        clearInterval(this.interval);
        this.showExpired();
        return;
      }

      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const days = Math.floor(this.timeRemaining / (60 * 60 * 24));
    const hours = Math.floor((this.timeRemaining % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((this.timeRemaining % (60 * 60)) / 60);
    const seconds = Math.floor(this.timeRemaining % 60);

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
      // countdownNumbers.style.display = "none";
    }

    const titleElement = this.container.querySelector(".countdown-card__h2");
    if (titleElement) {
      // titleElement.textContent = this.options.expiredMessage;
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

  updateTimeRemaining(newTimeRemaining) {
    this.timeRemaining = Number(newTimeRemaining);
    this.stop();

    const countdownNumbers = this.container.querySelector(".cound-down__flex");
    if (countdownNumbers) {
      countdownNumbers.style.display = "flex";
    }

    this.start();
  }
}
