import {LitElement, html} from 'lit'
import './../ui/dialog.js'

export default customElements.define('home-view', class HomeView extends LitElement {
  static properties = {
    dialogShown: {
      type: Boolean
    },
    submitDisabled: {
      type: Boolean
    },
    busyShown: {
      type: Boolean
    },
    address: {
      type: String
    }
  }
  constructor() {
    super()
    this.submitDisabled = true
    this.dialogShown = false
    this.busyShown = true
    this.dgcTX = ''
    this.etherTX = ''
    // this.attachShadow({mode: 'open'})
    // this.shadowRoot.innerHTML = this.template
  }

  connectedCallback() {
    super.connectedCallback()

    this.address = location.href.split('=')[1]
    if (this.address) this.submitDisabled = false
  }

  async #addToken() {
    try {
      if (ethereum.chainId !== '0x5') {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId: '0x5'}]
        })
      }

      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: this.tokenAddress, // The address that the token is at.
            symbol: 'USDD', // A ticker symbol or shorthand, up to 5 chars.
            decimals: 8, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });

    } catch (error) {
      console.log(error);
    }
  }

  #oninput() {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      const value = this.shadowRoot.querySelector('input').value
      if (value.length === 42) this.submitDisabled = false
      else this.submitDisabled = true
    }, 100);
  }

  async #submit() {
    this.submitDisabled = true
    this.dialogShown = true
    this.busyShown = true
    const value = this.shadowRoot.querySelector('input').value
    let response = await fetch(`https://api.dynastygames.games/faucet?address=${value}`)
    let data = await response.text()
    data = JSON.parse(data)
    this.etherTX = data.ether
    this.dgcTX = data.dgc
    this.tokenAddress = data.address
    this.shadowRoot.querySelector('input').value = null
    this.busyShown = false
  }

  render() {
    return html`
<style>
  * {
    font-family: 'Noto Sans', sans-serif;
  }
  :host {
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
  }
  h4 {
    margin: 0;
  }
  section {
    width: 100%;
    height: 220px;
    padding-bottom: 24px;
  }
  .container {
    background: var(--secondary-background-color);
    max-width: 480px;
    border-radius: 48px;
    box-shadow: 0 0 7px 9px #00000012;
    overflow: hidden;
  }
  .container, section {
    display: flex;
    flex-direction: column;
    width: 100%;


    align-items: center;
    justify-content: center;
  }

  flex-row {
    width: 100%;
    align-items: center;

    box-sizing: border-box;
    padding: 0 48px;
  }

  .top {
    padding-top: 24px;
    background: #573e6a;
    color: #eee;
  }

  .bottom {
    padding-bottom: 24px;
    background: #573e6a;
    color: #eee;
  }

  button, .applink {
    text-decoration: none;
    background: #573e6a;
    padding: 12px 24px;
    box-sizing: border-box;
    border-radius: 12px;
    color: #eee;
    border-color: #eee;
    font-weight: 700;
    text-transform: uppercase;
    pointer-events: auto;
    cursor: pointer;
  }

  input {
    width: 100%;
    pointer-events: auto;
    max-width: 332px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    height: var(--custom-input-height, 48px);
    background: var(--custom-input-background, transparent);
    width: 100%;
    box-shadow: 0px 1px 3px -1px #333;
    min-width: 240px;
    --custom-input-color: #555;
    --custom-input-outline: none;
    --webkit-visibility: none;
    border: none;
    background: transparent;
    height: var(--custom-input-height, 48px);
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    color: var(--custom-input-color, #555);
    outline: var(--custom-input-outline);
  }

  [hidden] a{
    pointer-events: none;
  }

  [hidden] {
    pointer-events: none;
    opacity: 0;
    transform: scale(-1);
  }

  [disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
</style>
<section class="container">
  <h1>Dynasty Games Faucet</h1>
  <flex-one></flex-one>
  <input placeholder="address" value="${this.address}" @input="${this.#oninput}"></input>
  <flex-two></flex-two>
  <button @click="${this.#submit}" ?disabled="${this.submitDisabled}">SUBMIT</button>
</section>

<custom-dialog ?hidden="${!this.dialogShown}" ?busy="${this.busyShown}">
  <flex-one></flex-one>
  <h4>0.01 ETH sended</h4>
  <a href="https://goerli.etherscan.io/tx/${this.etherTX}">${this.etherTX.slice(0, 10)}...${this.etherTX.slice(-10)}</a>

  <h4>100 USDD sended</h4>
  <a href="https://goerli.etherscan.io/tx/${this.dgcTX}">${this.dgcTX.slice(0, 10)}...${this.dgcTX.slice(-10)}</a>
  <flex-two></flex-two>

  <button @click="${this.#addToken}" ?disabled="${this.alreadyAdded}">Add USDD To Wallet</button>
  <a class="applink" href="https://dynastygames.games">Go to Dynasty contests</a>
  <flex-one></flex-one>
</custom-dialog>
    `
  }
})
