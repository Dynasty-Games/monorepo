import coinmarketcap from './../apis/coinmarketcap'
import './../elements/currency-info-item'

export default customElements.define('currency-select-dialog', class CurrencySelectDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }

  async connectedCallback() {
    // const currencies = await coinmarketcap.currencies()
    // this.shadowRoot.querySelector('array-repeat').items = currencies.map(({name, id, rank, symbol}) => {
    //   return {name, id, rank, symbol}
    // }).sort((a, b) => a.rank -b.rank)
  }

  get template() {
    return `
    <style>
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        flex-direction: column;
        border-radius: 24px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 240px;
        height: 320px;
        margin: 0;
        z-index: 0;
        background: var(--dialog-background-color);
        padding: 12px;
        box-sizing: border-box;
        opacity: 0;
        pointer-events: none;
      }

      :host([open]) {
        z-index: 1000;
        opacity: 1;
        pointer-events: auto;
      }

      .header flex-row {
        padding-bottom: 24px;
      }
      h4 {
        margin: 0;
      }
      .header {
        box-sizing: border-box;
        background: var(--drawer-background);
        padding: 12px 12px 24px 12px;
        border-bottom: 1px solid #eee;
        color: #fff;
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
       array-repeat {
         height: 100%;
         flex-direction: column;
         display: flex;
       }
    </style>
      <flex-column class="header">
        <flex-row>
          <h4>Select a token</h4>
          <flex-one></flex-one>
          <custom-svg-icon icon="cancel"></custom-svg-icon>
        </flex-row>
        <custom-input type="search" placeholder="Search by name/address"></custom-input>
      </flex-column>
      <array-repeat>
        <template>
          <currency-info-item name="[[item.name]]" symbol="[[item.symbol]]" rank="[[item.rank]]" data-id="[[item.id]]"></currency-info-item>
        </template>
      </array-repeat>
    `
  }
})
