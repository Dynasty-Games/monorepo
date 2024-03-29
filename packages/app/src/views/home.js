import {html, LitElement} from 'lit'
import './../elements/balance'
import './../elements/credit'
import { gameCredits, balance } from '../api'
import { scrollbar } from '../shared/styles'
import { avatar } from '../../../utils/src/utils'

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
    this.setAttribute('loaded', '')
  }

  set account(value) {
    this._account = value;
    const totalBalanceElement = this.querySelector('balance-element.total')
    const balanceElement = this.querySelector('balance-element.usdc')
    const creditElement = this.querySelector('credit-element')
    if (value) {
      requestIdleCallback(async () => {
    
        let svgCode = await avatar(`address=${value}`)
        this.querySelector('.avatar').innerHTML = svgCode

        balanceElement.amount = await balance(value)
        creditElement.amount = await gameCredits(value)
        totalBalanceElement.amount = Number(balanceElement.amount) + Number(creditElement.amount)
      })
    } else {
      balanceElement.amount = 0
      creditElement.amount = 0
      totalBalanceElement.amount = 0
      this.querySelector('.avatar').innerHTML = ''
    }

    this.requestUpdate()
    
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
        color: var(--main-color);
        --svg-icon-color: var(--main-color);
      }

      .container {
        width: 100%;
        max-width: 640px;
        display: flex;
        width: 100%;        
        background: #3763e836;
        padding: 48px 0 0 48px;
        box-sizing: border-box;
        border-radius: 12px;
        overflow-y: auto;
        pointer-events: auto;
        max-height: 364px;
        height: 100%;
        border: 1px #1e3066 solid;
      }

      .ref-container {
        align-items: center;
        box-sizing: border-box;
      }
      flex-row {
        width: 100%;
      }
      button {
        color: var(--main-color);
        background: #42aaf7;
        border: none;
        cursor: pointer;
        pointer-events: auto;
        border-radius: 12px;
        padding: 6px 24px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
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

      .right-container {
        max-width: 320px;
        width: 100%;
        background: #3663ed36;
        box-sizing: border-box;
        padding: 24px;
        border-radius: 12px;
        border: 1px #243e8b solid;
      }

      .ref-container h3 {
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        padding: 6px;
        margin: 12px 0;
        border-radius: 12px;
        font-size: 16px;
      }
      
      .staking {
        border-top: 1px solid #fff;
        padding-top: 24px;
        margin-top: 24px;
      }

      .ref-container flex-column {
        height: 100%;
      }

      ${scrollbar}
      @media (max-width: 759px) {

        .container {
          background: transparent;
          flex-direction: column;
          align-items: center;
          padding: 12px 24px 24px;
          max-height: 100%;
        }

      }
    </style>
    <flex-row class="container">
      
      <flex-column class="ref-container">

        <slot name="avatar"></slot>
        
        <flex-column  >
          <h3>${this._account ? `${this._account.slice(0, 6)}...${this._account.slice(-6)}` : ''}</h3>

          
          <flex-row style="padding: 12px 0;">
            <button title="click to share" @click="${() => navigator.share({ url: `https://dynastygames.games?ref=${this._account}`})}">
              <custom-svg-icon icon="share"></custom-svg-icon>
              <strong>share</strong>
            </button>
            
            <button title="click to copy" @click="${() => navigator.clipboard.writeText(`https://dynastygames.games?ref=${this._account}`)}">
              <custom-svg-icon icon="copy"></custom-svg-icon>
              <strong>copy</strong>
            </button>
          </flex-row>

          <button>
            <custom-svg-icon icon="done"></custom-svg-icon>
            <flex-one></flex-one>
            <strong>claim stakes</strong>
          </button>
        </flex-column>
      </flex-column>
      <flex-one></flex-one>
      <flex-column class="right-container">
        <slot></slot>
        
        
        
        <flex-column class="staking">
          <flex-row>
          <input style="margin-right: 12px;" placeholder="stake"></input>
          <flex-one></flex-one>
          <button>
            <custom-svg-icon icon="done"></custom-svg-icon>
          </button>
          </flex-row>
        </flex-column>
      </flex-column>
    </flex-row>
    `
  }
})
