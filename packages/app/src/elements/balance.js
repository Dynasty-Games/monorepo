import { LitElement, html } from 'lit'

export default customElements.define('balance-element', class BalanceElement extends LitElement {
  static properties = {
    amount: {
      type: Number
    },
    icon: {
      type: String
    },
    link: {
      type: String
    }
  }

  constructor() {
    super()
    this.amount = 0
  }

  set amount(value) {
    if (globalThis?.connector?.accounts?.length > 0) {
      if (Number(value) === 0)  this.link = `https://dynastyfaucet.web.app?address=${connector.accounts[0]}`
      else this.link = null
      this._amount = value
    } else {
      this.link = `https://dynastyfaucet.web.app`
    }
  }

  get amount() {
    return Number(this._amount)
  }

  set icon(value) {
    this.shadowRoot.querySelector('img').src= value
  }

  get icon() {
    return this.getAttribute('icon')
  }

  render() {
    return html`
    <style>
      :host {
        display: flex;
        align-items: center;
        padding: 6px 12px;
      }

      .amount {
        padding-right: 6px;
      }

      a {
        text-decoration: none;
        color: var(--accent-color);
        pointer-events: auto;
      }
    </style>
    ${this.link ? html`<a href="${this.link}">Get USDD</a>` : html`<span class="amount">${this._amount}</span>
    <flex-one></flex-one>
    <img src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/usdc.svg"></img>`}

    `
  }
})
