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
        flex-direction: column;
        height: 176px;
        width: calc(98% / 3);
        box-sizing: border-box;
        align-items: center;
        color: var(--main-color);
        pointer-events: auto !important;
        cursor: pointer;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        border-radius: 24px;
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
        padding: 10px 0 20px 0;
      }

      flex-column {
        align-items: center;
      }

      flex-row {
        align-items: center;
        box-sizing: border-box;
        padding-bottom: 6px;
      }

      span {
        color: var(--accent-color);
        text-transform: capitalize;
      }

      a {
        pointer-events: auto;
      }

      h4 {
        margin: 0;
      }

      flex-row h4 {
        padding-right: 4px;
      }
      

      @media(min-width: 680px) {
        :host {
          max-width: 680px;
        }

      }
    </style>
    
    <flex-column>
      <img src="${this.image}"></img>
      <h4 class="name">${this.name}</h4>
      <flex-row>
        <h4>salary</h4>
        <span>${this.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')}</span>
      </flex-row>
      <flex-row>
        <h4>points</h4>
        <span>${this.points}</span>
      </flex-row>
    </flex-column>
    `
  }
})
