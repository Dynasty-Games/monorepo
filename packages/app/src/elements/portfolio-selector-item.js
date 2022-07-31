
import {html, LitElement} from 'lit'
import {map} from 'lit/directives/map.js'

export default customElements.define('portfolio-selector-item', class PortfolioSelectorItem extends LitElement {
  static properties = {
    name: {
      type: String
    },
    symbol: {
      type: String
    },
    image: {
      type: String
    },
    id: {
      type: String
    },
    salary: {
      type: Number
    }
  }

  constructor() {
    super()
  }

  set salary(value) {
    this.__salary = value
    this._salary = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')
    this.requestUpdate()
  }

  get salary() {
    return this.__salary
  }

  get #detail() {
    return {
      index: this.index,
      name: this.name,
      symbol: this.symbol,
      id: this.id,
      salary: this.salary,
      image: this.image
    }
  }

  #addEvent() {
    if (currentCompetition.portfolio.length === 8) return
    pubsub.publish('portfolio-item-selected', { ...this.#detail })
  }

  #infoEvent() {
    pubsub.publish('portfolio-item-info', { ...this.#detail })
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        flex-direction: row;
        color: var(--main-color);
        pointer-events: auto;
        cursor: pointer;

        height: 72px;
        padding: 24px 24px;
        
        box-sizing: border-box;
        align-items: center;
        border: 1px solid #355050;
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
      }

      img {
        height: 32px;
        width: 32px;
      }

      .name {
        padding-left: 10px;
      }

      .info {
        display: flex;
        width: 100%;
        align-items: center;
        padding-right: 24px;
        pointer-events: auto;
      }

      .add {
        display: flex;
        align-items: center;
        pointer-events: auto;
      }

      .salary {
        color: var(--accent-color);
      }

      :host([over-salary]) .salary {
        color: red;
      }
    </style>
    <flex-row class="info" data-action="info" @click="${this.#infoEvent}">
      <img loading="lazy" src="${this.image}"></img>
      <span class="name">${this.name}</span>
      <custom-svg-icon icon="assessment"></custom-svg-icon>
    </flex-row>
    <flex-one></flex-one>
    <flex-row class="add" data-action="add" @click="${this.#addEvent}">
      <span class="salary">${this._salary}</span>
      <custom-svg-icon icon="add"></custom-svg-icon>
    </flex-row>
    `
  }
})
