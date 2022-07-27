import connect from './../wallet/connect'

export default customElements.define('connect-view', class ConnectView extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template

    this.shadowRoot.addEventListener('click', this.#click.bind(this))
  }

  #click(event) {
    const target = event.composedPath()[0]

    this.selectedWalletProvider = target.dataset.provider
    localStorage.setItem('dynasty.selectedWalletProvider', this.selectedWalletProvider)
    connect(this.selectedWalletProvider)
  }

  get template() {
    return `
    <style>

      * {
        pointer-events: none;
      }

      .container {
        display: flex;
        flex-direction: column;
        border-radius: 24px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 240px;
        max-height: 320px;
        margin: 0;
        z-index: 0;
        // background: var(--dialog-background-color);
        background: #fff;
        padding: 12px;
        box-sizing: border-box;
      }

      custom-svg-icon {
        // --svg-icon-color: var(--main-color);
        pointer-events: auto;
        cursor: pointer;
      }
      h4 {
        margin: 0;
      }
      .header {
        box-sizing: border-box;
        background: var(--drawer-background);
        padding: 12px 12px 12px 12px;
        border-bottom: 1px solid #eee;
        margin-bottom: 24px;
        color: #333;
        font-weight: 700;
      }
      custom-input {
         border-radius: 20px;
         pointer-events: auto;
         color: rgb(255, 255, 255);
         font-weight: 500;
         outline: none;
         border: 1px solid #fff;
         background: var(--drawer-background);
         font-size: 24px;
         --custom-input-background: var(--drawer-background);
         --custom-input-outline: none;
         --custom-input-radius: 20px;
         --custom-input-color: #fff;
         --custom-input-placeholder-color: #fff;
       }

       button {
         height: 48px;
         box-sizing: border-box;
         font-weight: 700;
         padding: 12px;
         align-items: center;
         display: flex;
         background: var(--dialog-background-color);
         color: var(--main-color);
         border-radius: 12px;
         border-color: var(--main-color);
         margin-bottom: 12px;
         cursor: pointer;
         pointer-events: auto;
       }

       img {
         height: 40px;
         width: 40px;
       }
       :host([open]) button, :host([open]) custom-svg-icon {
         pointer-events: auto;
       }
    </style>
    <flex-column class="container">
      <flex-column class="header">
        <flex-row>
          <h4>Connect</h4>
          <flex-one></flex-one>
        </flex-row>
      </flex-column>
      <flex-one></flex-one>
      <flex-column>
        <button data-provider="walletConnect" class="walletConnect"><img src="assets/walletconnect.svg"></img>
          <flex-one></flex-one>
          walletConnect
        </button>
        <button data-provider="metamask" class="metamask"><img src="https://assets.artonline.site/metamask-fox.svg"></img>
          <flex-one></flex-one>
          metamask
        </button>
      </flex-column>
      <flex-one></flex-one>
    </flex-column>
    `
  }
})
