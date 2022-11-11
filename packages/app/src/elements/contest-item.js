import { LitElement, html } from 'lit'

export default customElements.define('contest-item', class ContestItem extends LitElement {
  static properties = {
    name: {
      type: String
    },
    icon: {
      type: String
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
        flex-direction: column;
        padding: 24px;
        box-sizing: border-box;
        align-items: center;
        cursor: pointer;
        background: var(--contest-item-background-color);
        border-radius: 12px;
        pointer-events: auto;
        width: 100px;
        min-width: 100px;
        margin-bottom: 6px;
        border: 1px #1e3066 solid;
      }

      h4 {
        margin: 0;
        text-transform: uppercase;
        padding-top: 24px;
      }

      custom-svg-icon {
        --svg-icon-size: 54px;
        --svg-icon-color: #fff;
      }
    </style>
    <custom-svg-icon icon="${this.icon}"></custom-svg-icon>

    `
  }
})
