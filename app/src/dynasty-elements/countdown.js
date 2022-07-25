import { LitElement, html } from 'lit'

export default customElements.define('dynasty-countdown', class DynastyCountdown extends LitElement {
  static properties = {
    value: {
      type: Number
    },
    when: {
      type: String
    },
    days: {
      type: Number
    },
    hours: {
      type: Number
    },
    minutes: {
      type: Number
    },
    seconds: {
      type: Number
    },
    showPast: {
      type: Boolean
    },
    hide: {
      type: Boolean
    },
    beforePrefix: {
      type: String
    },
    affterPrefix: {
      type: String
    }

  }

  constructor() {
    super()
    this.hide = true
    this.beforePrefix = 'Live in'
    this.afterPrefix = 'Closes in'
    this.showPast = !this.hasAttribute('hide-past')
  }

  connectedCallback() {
    super.connectedCallback()
    this.startCountdown()
  }

  startCountdown() {
    this.timeout = () => setTimeout(() => {
      const now = new Date().getTime();
      const distance = this.value - now;

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 0) {
        this.days += 1
        this.hours += 1
        if (this.hours > 12) this.when = this.afterPrefix
        else this.when = this.afterPrefix
      } else {
        this.when = this.beforePrefix
      }
      // if (String(this.hours).length === 1) this.hours = `0${this.hours}`
      // if (String(this.minutes).length === 1) this.minutes = `0${this.minutes}`
      // if (String(this.seconds).length === 1) this.seconds = `0${this.seconds}`
      this.hide = false
      if (this.showPast) return this.timeout()

      if (!this.showPast && distance > 0) return this.timeout()

      this.hide = true
    }, 1000);
    this.timeout()
  }

  render() {
    return html`
<style>
  :host {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
  }

  span {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    padding-right: 6px;
  }

  .last {
    padding: 0;
  }
</style>
${this.hide ? html`` : html`
  <span class="first">${this.when}</span>
  ${this.days ? html`<span>${this.days.toString().replace('-', '')}d</span>` : ''}
  ${this.hours ? html`<span>${this.hours.toString().replace('-', '')}h</span>` : ''}
  ${this.minutes ? html`<span>${this.minutes.toString().replace('-', '')}m</span>` : ''}
  ${this.seconds ? html`<span>${this.seconds.toString().replace('-', '')}s</span>` : ''}
  ${this.when !== 'Live in' ? html`<span class="last">ago</span>` : ''}
  `}

    `
  }
})
