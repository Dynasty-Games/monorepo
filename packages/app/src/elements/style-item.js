import { LitElement, html } from 'lit'

export default customElements.define('style-item', class StyleItem extends LitElement {
  static properties = {
    name: {
      type: String
    },
    fee: {
      type: Number
    }
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
        user-select: none;
      }
      :host {
        display: flex;
        flex-direction: row;
        padding: 24px;
        box-sizing: border-box;
        align-items: center;
        cursor: pointer;
        border-radius: 12px;
        pointer-events: auto;
        width: 100%;
        border-radius: 24px;
        border: 1px solid #355050;
        margin-bottom: 6px;
      }

      h4 {
        margin: 0;
        text-transform: uppercase;
        padding-top: 24px;
      }

      custom-svg-icon {
        --svg-icon-size: 54px;
        --svg-icon-color: var(--accent-color);
      }
    </style>

    <span>${this.name}</span>
    <flex-one></flex-one>
    <span>${this.fee}</span>
    `
  }
})
