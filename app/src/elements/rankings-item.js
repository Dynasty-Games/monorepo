import {LitElement, html} from 'lit'
import {map} from 'lit/directives/map.js'

export default customElements.define('rankings-item', class RankingsItem extends LitElement {
  static properties = {
    address: {
      type: String
    },
    points: {
      type: String
    }
  }

  constructor() {
    super()
  }

  set points(value) {
    this._points = Math.round(value * 100) / 100
    this.requestUpdate()
  }

  get points() {
    return this._points
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
        height: 86px;
        padding: 12px 24px;
        box-sizing: border-box;
        align-items: center;
        color: var(--main-color);
        pointer-events: auto !important;
        cursor: pointer;

        background: #272e2eb3;

        padding: 10px 24px;
        box-sizing: border-box;
        align-items: center;
        width: 100%;
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

      @media(min-width: 680px) {
        :host {
          max-width: 680px;
        }

      }
    </style>
    ${this.points}
    <flex-one></flex-one>

    ${this.address}
    `
  }
})
