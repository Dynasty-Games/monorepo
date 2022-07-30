import { LitElement, html } from 'lit'
import './balance'
import './credit'
import './dropdown'
import { balance, gameCredits } from './../api'

export default customElements.define('account-menu-element', class AccountMenuElement extends LitElement {
  static properties = {
    account: {
      type: String
    }
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.shadowRoot.addEventListener('click', this.#onclick.bind(this))
  }

  get #dropdown() {
    return this.shadowRoot.querySelector('dropdown-element')
  }

  set account(value) {
    this.#setAccount(value)
  }

  get account() {
    return this.getAttribute('account')
  }

  async #setAccount(value) {
    const balanceElement = this.shadowRoot.querySelector('balance-element.usdc')
    const totalBalanceElement = this.shadowRoot.querySelector('balance-element.total')
    const creditElement = this.shadowRoot.querySelector('credit-element')
    if (value !== 'undefined' && value !== undefined) {
      const connectAction = this.shadowRoot.querySelector(`[data-action="connect"]`)

      if (!globalThis.multiavatar) {
        let importee = await import('@multiavatar/multiavatar/esm')
        globalThis.multiavatar = importee.default
      }

      connectAction.dataset.action = 'menu'


      let svgCode = multiavatar(value)
      connectAction.innerHTML = svgCode
      balanceElement.amount = await balance(this.account)
      creditElement.amount = await gameCredits(this.account)
      totalBalanceElement.amount = Number(balanceElement.amount) + Number(creditElement.amount)

      if (this.timeout) clearTimeout(this.timeout)

      this.timeout = setTimeout(async () => {
        balanceElement.amount = await balance(this.account)
        creditElement.amount = await gameCredits(this.account)
        totalBalanceElement.amount = Number(balanceElement.amount) + Number(creditElement.amount)
      }, 10000);

    } else {
      const menuAction = this.shadowRoot.querySelector(`[data-action="menu"]`)
      menuAction.dataset.action = 'connect'
      menuAction.innerHTML = 'connect'

      balanceElement.amount = 0
      if (this.#dropdown.hasAttribute('open')) this.#toggleDropdown()
    }


  }

  #toggleDropdown() {
    const isOpen = this.#dropdown.hasAttribute('open')
    isOpen ? this.#dropdown.removeAttribute('open') : this.#dropdown.setAttribute('open', '')
    isOpen ? this.removeAttribute('open') : this.setAttribute('open', '')
  }

  #onclick(event) {
    const target = event.composedPath()[0]
    if (target.hasAttribute('data-action')) {
      const action = target.getAttribute('data-action')
      if (action === 'menu') this.#toggleDropdown()
      else document.querySelector('app-shell')[action]()
    }
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
      }

      :host {
        display: flex;
        poition: relative;
        z-index: 1000000;
      }

      button {
        box-sizing: border-box;
        padding: 6px 12px;
        pointer-events: auto;
        cursor: pointer;
        background: transparent;
        color: var(--main-color);
        border: 1px solid var(--main-color);
        border-radius: 24px;
        pointer-events: auto !important;
      }

      .avatar {
        width: 220px;
        height: 220px;
      }

      button[data-action="menu"] {
        border: none;
        border-radius: 50%;
        padding: 0;

        height: 54px;
        width: 54px;
        box-sizing: border-box;
        z-index: 10000;
      }

      dropdown-element {
        background: var(--dialog-background-color);
        // top: 72px;
        padding: 12px;
        box-sizing: border-box;
        border-radius: 12px;
        min-width: 256px;
      }

      .spacer {
        display: flex;
        height: 72px;
      }

      flex-row[slot="bottom"] {
        // width: 240px;
      }

      :host([open]) button[data-action="menu"] {
        padding-top: 10px;
      }
      balance-element, credit-element {
        padding: 0 12px;
      }
    </style>

    <balance-element class="total"></balance-element>
    <button data-action="connect">connect</button>

    <dropdown-element right>
      <flex-column>
        <span class="spacer"></span>
        <credit-element></credit-element>
        <balance-element class="usdc"></balance-element>
      </flex-column>
      <flex-row slot="bottom">
        <flex-one></flex-one>
        <button data-action="disconnect">disconnect</button>
        <flex-one></flex-one>
      </flex-row>
    </dropdown-element>
    `
  }
})
