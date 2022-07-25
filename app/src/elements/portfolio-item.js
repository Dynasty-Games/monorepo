import { LitElement, html } from 'lit'

export default customElements.define('portfolio-item', class PortfolioItem extends LitElement {
  static properties = {
    name: {
      type: String
    },
    symbol: {
      type: String
    },
    placeholder: {
      type: Boolean
    },
    image: {
      type: String
    },
    salary: {
      type: Number
    },
    id: {
      type: String
    },
    index: {
      type: Number
    }
  }

  constructor() {
    super()
  }

  #infoEvent() {
    pubsub.publish('portfolio-item-info', { ...this.#detail })
  }

  #removeEvent() {
    pubsub.publish('portfolio-item-removed', { ...this.#detail })
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

  reset() {
    this.salary = 0
    this.placeholder = true
  }

  get styleTemplate() {
    return html`<style>
      * {
        pointer-events: none;
      }
      :host {
        display: flex;
        flex-direction: row;
        height: 86px;
        padding: 12px 24px;
        box-sizing: border-box;
        align-items: center;
        color: var(--main-color);
        pointer-events: auto;
        cursor: pointer;

        background: #272e2eb3;

        padding: 10px 24px;
        box-sizing: border-box;
        align-items: center;
        border: 1px solid #355050;
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
        pointer-events: auto;
      }

      custom-svg-icon[icon="cancel"] {
        --svg-icon-color: red;
      }

      img {
        height: 32px;
        width: 32px;
      }

      .name {
        padding-left: 10px;
      }

      .add {
        pointer-events: auto;
      }

      flex-row.add {
        align-items: center;
      }

      span {
        text-transform: capitalize;
      }

      a {
        pointer-events: auto;
      }
      .salary {
        padding-right: 16px;
      }
    </style>`
  }
  render() {
    return html`
    ${this.styleTemplate}

    ${this.placeholder ? html`
    <style>
      :host {
        justify-content: center;
      }
    </style>
    <span>select asset</span>
    <flex-one></flex-one>
    <custom-svg-icon icon="chevron-right"></custom-svg-icon>
  ` : html`<img loading="lazy" src="${this.image}"></img>
    <span class="name">${this.name}</span>
    <custom-svg-icon icon="assessment" @click="${this.#infoEvent}"></custom-svg-icon>
    <flex-one></flex-one>
    <span class="salary">${this.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')}</span>
    <custom-svg-icon data-action="remove" icon="cancel" @click="${this.#removeEvent}"></custom-svg-icon>
    `}

    `
  }
})
