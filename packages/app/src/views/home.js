import {html, LitElement} from 'lit'
import './../elements/balance'
import './../elements/credit'
import { gameCredits, balance } from '../api'
import {map} from 'lit/directives/map.js'

export default customElements.define('home-view', class HomeView extends LitElement {
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
    if (globalThis.connector?.accounts) this.account = globalThis.connector.accounts[0]
  }

  set account(value) {
    this._account = value;
    const totalBalanceElement = this.querySelector('balance-element.total')
    const balanceElement = this.querySelector('balance-element.usdc')
    const creditElement = this.querySelector('credit-element')
    if (value) {
      (async () => {
        if (!globalThis.multiavatar) {
          let importee = await import('@multiavatar/multiavatar/esm')
          globalThis.multiavatar = importee.default
        }
    
        let svgCode = multiavatar(value)
        this.querySelector('.avatar').innerHTML = svgCode

        balanceElement.amount = await balance(value)
        creditElement.amount = await gameCredits(value)
        totalBalanceElement.amount = Number(balanceElement.amount) + Number(creditElement.amount)
      })()
    } else {
      balanceElement.amount = 0
      creditElement.amount = 0
      totalBalanceElement.amount = 0
      this.querySelector('.avatar').innerHTML = ''
    }
    
  }

  render() {
    return html`
    <style>

      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        justify-content: center;
        pointer-events: auto;
        padding: 0 0 186px 0;

        --svg-icon-color: var(--main-color);
      }

      .container {
        width: 100%;
        max-width: 480px;
        display: flex;
        width: 100%;
      }

      .ref-container {
        align-items: center;
      }

      flex-row {
        width: 100%;
      }
      button {
        color: var(--main-color);
        background: transparent;
        cursor: pointer;
        pointer-events: auto;
        border-radius: 12px;
        padding: 6px 24px;
        box-sizing: border-box;
      }

      button[title="click to copy"] {
        margin-left: 12px;
      }

      ::slotted(.avatar) {
        height: 128px;
        width: 128px;
      }

      [disabled] {
        pointer-events: none;
        opacity: 0.65;
      }
    </style>
    <flex-column class="container">
      
      <flex-row class="ref-container">
        <slot name="avatar"></slot>
        
        <flex-one></flex-one>
        <flex-column>
          <h3>${this._account ? `${this._account.slice(0, 10)}...${this._account.slice(-10)}` : ''}</h3>
          <flex-row>
            <button title="click to share" @click="${() => navigator.share({ url: `https://dynastygames.games?ref=${this._account}`})}">
              <custom-svg-icon icon="share"></custom-svg-icon>
              <strong>share</strong>
            </button>
            
            <button title="click to copy" @click="${() => navigator.clipboard.writeText(`https://dynastygames.games?ref=${this._account}`)}">
              <custom-svg-icon icon="copy"></custom-svg-icon>
              <strong>copy</strong>
            </button>
          </flex-row>
        </flex-column>
      </flex-row>
      <slot></slot>
      
      <h3>staking</h3>
      <flex-row>
        <strong>stake</strong>
        <input></input>
        <button>
          <custom-svg-icon icon="done"></custom-svg-icon>
        </button>
      </flex-row>
      <h3>referrals</h3>
    </flex-column>
    `
  }
})
