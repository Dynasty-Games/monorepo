import coinmarketcap from './../apis/coinmarketcap'
import {calculate} from './../apis/contests'
import './../../node_modules/custom-tabs/custom-tabs'
import './../../node_modules/custom-tabs/custom-tab'
import {scrollbar} from  './../shared/styles'
import { calculateFantasyPoints, calculateBaseSalary } from './../../node_modules/@dynasty-games/lib/src/lib'

export default customElements.define('info-dialog', class InfoDialog extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = this.template
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.backdrop').addEventListener('click', this._click.bind(this))
    this.#tabs.addEventListener('selected', this.#onSelect.bind(this))
  }

  _click(event) {
    const target = event.composedPath()[0]
    console.log(target);

    if (target.classList?.contains('backdrop') || target.dataset?.action === 'cancel') this.hide()
  }

  get #tabs() {
    return this.shadowRoot.querySelector('custom-tabs')
  }

  async show(item) {
    console.log({item});
    this.item = item
    this.#tabs.select('24h')
    let response = await fetch(`https://api.dynastygames.games/currency-info?id=${item.id}`)
    response = await response.json()
    this.shadowRoot.querySelector('.description').innerHTML = response.description

    this.shadowRoot.querySelector('.name').innerHTML = item.name
    this.shadowRoot.querySelector('.price').innerHTML = item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    this.shadowRoot.querySelector('img').src = item.image
    this.shadowRoot.querySelector('.volume').innerHTML = item.volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    this.shadowRoot.querySelector('.marketCap').innerHTML = item.marketCap.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    // this.shadowRoot.querySelector('.totalSupply').innerHTML = item.totalSupply.toLocaleString()
    this.shadowRoot.querySelector('.twentyFourhourPercentage').innerHTML = `${item.priceChange24hPercentage}%`



    this.setAttribute('shown', '')
  }

  async #onSelect({detail}) {
    const date = new Date()
    const year = date.getFullYear()
    const ref = firebase.ref(firebase.database, `currencies/${year}/${this.item.id}`)

    const salary = calculateBaseSalary(Number(this.item.rank))

    let stamps = await firebase.get(ref)
    stamps = stamps.val()
    stamps = Object.entries(stamps).filter(([key, item]) => {
      if (detail === '12h') {
        if (date.getTime() - Number(key) > 12 * 60 * 60000 && date.getTime() - Number(key) < 24 * 60 * 60000) return item
      } else if (detail === '24h') {
        if (date.getTime() - Number(key) > 24 * 60 * 60000 && date.getTime() - Number(key) < 36 * 60 * 60000) return item
      } else if (detail === '36h') {
        if (date.getTime() - Number(key) > 36 * 60 * 60000 && date.getTime() - Number(key) < 48 * 60 * 60000) return item
      } else if (detail === '48h') {
        if (date.getTime() - Number(key) > 48 * 60 * 60000) return item
      }
    })

    stamps = stamps.reverse()


    this.shadowRoot.querySelector('.price').innerHTML = stamps[0][1].price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    this.shadowRoot.querySelector('.volume').innerHTML = stamps[0][1].volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    this.shadowRoot.querySelector('.marketCap').innerHTML = stamps[0][1].marketCap.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

    const points = await calculateFantasyPoints({
      priceDifference: Number(stamps[0][1].priceChange24hPercentage),
      volumeDifference: Number(stamps[0][1].volumeChange24hPercentage),
      // marketCapDifference: Number(stamps[0][1].rankChange24h)
      marketCapDifference: 0
    })
    // const _salary = await salary(item.id)
    this.shadowRoot.querySelector('.points').innerHTML = points
    this.shadowRoot.querySelector('.salary').innerHTML = salary
    // .toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  }

  hide() {
    this.removeAttribute('shown')
    this.parentNode.host.shadowRoot.removeChild(this)
  }

  get template() {
    return `
    <style>

      * {
        pointer-events: none;
      }

      :host, .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }



      .dialog {
        display: flex;
        flex-direction: column;
        border-radius: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 760px;
        width: 100%;
        height: 100%;
        max-height: 760px;
        margin: 0;
        z-index: 0;
        // background: var(--dialog-background-color);
        background: #fff;
        padding: 12px;
        box-sizing: border-box;
        opacity: 0;
        pointer-events: none;
        color: #333;
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
        background: var(--drawer-background);
        border-bottom: 1px solid #eee;
        color: #333;
        font-weight: 700;
        align-items: center;
          box-sizing: border-box;
          padding-bottom: 12px;
      }

       img {
         height: 40px;
         width: 40px;
         padding-right: 12px;
       }
       :host([shown]) button, :host([shown]) custom-svg-icon {
         pointer-events: auto;
       }


       :host([shown]) .dialog {
         z-index: 100000;
         opacity: 1;
       }

       :host([shown]) .backdrop {
         pointer-events: auto !important;
       }

       custom-tabs {
         margin-bottom: 24px;
         pointer-events: none;
       }

       custom-tab {
         pointer-events: auto;
       }

       custom-tab span {
         pointer-events: none;
       }

       .description {
          -webkit-user-modify: read-write-plaintext-only;
       }

       p {
       }

       .description-container {
        
        max-height: 400px;
        height: 100%;
        padding: 12px;
        box-sizing: border-box;
        pointer-events: auto;
        overflow: hidden;
        overflow-y: auto;
        user-select: none;
       }

       ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

       ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgb(34 36 36 / 50%);
        }

        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgb(104 113 120 / 30%);
          border-radius: 10px;
        }
    </style>
    <flex-column class="backdrop">
      <flex-column class="dialog">
        <flex-row class="header">
          <img></img>
          <span class="name"></span>
          <flex-one></flex-one>
          <custom-svg-icon icon="cancel" data-action="cancel"></custom-svg-icon>
        </flex-row>
       <flex-column class="description-container">
          <p class="description"></p>
       </flex-column>
        <custom-tabs attr-for-selected="data-route">

          <custom-tab data-route="24h">
            <span>24h</span>
          </custom-tab>

          <custom-tab data-route="48h">
            <span>48h</span>
          </custom-tab>

          <custom-tab data-route="62h">
            <span>72h</span>
          </custom-tab>
        </custom-tabs>
        <flex-one></flex-one>
        <flex-row>
          <strong>salary</strong>
          <flex-one></flex-one>
          <span class="salary"></span>
        </flex-row>
        <flex-one></flex-one>
        <flex-row>
          <strong>FP</strong>
          <flex-one></flex-one>
          <span class="points"></span>
        </flex-row>
        <flex-one></flex-one>
        <flex-row>
          <strong>price</strong>
          <flex-one></flex-one>
          <span class="price"></span>
        </flex-row>
        <flex-one></flex-one>
        <flex-row>
          <strong>24h</strong>
          <flex-one></flex-one>
          <span class="twentyFourhourPercentage"></span>
        </flex-row>
        <flex-one></flex-one>
        <flex-row>
          <strong>volume</strong>
          <flex-one></flex-one>
          <span class="volume"></span>
        </flex-row>
        <flex-one></flex-one>
        <flex-row>
          <strong>marketCap</strong>
          <flex-one></flex-one>
          <span class="marketCap"></span>
        </flex-row>
        <flex-one></flex-one>
      </flex-column>
    </flex-column>
    `
  }
})
