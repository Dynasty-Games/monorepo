import {LitElement, html} from 'lit'
import {map} from 'lit/directives/map.js'

export default customElements.define('member-rankings-item', class MemberRankingsItem extends LitElement {
  static properties = {
    points: {
      type: String
    },
    salary: {
      type: Number
    },
    name: {
      type: String
    },
    image: {
      type: String
    },
    points: {
      type: Number
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
        color: var(--accent-color);
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
    <img  style="padding-right: 8px" src="${this.image}"></img>
    ${this.name}
    <flex-one></flex-one>
    <h4 style="padding-right: 8px">points</h4>
    <span>${this.points}</span>

    <h4 style="padding: 0 8px 0 16px">salary</h4>
    <span>${this.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')}</span>
    `
  }
})
