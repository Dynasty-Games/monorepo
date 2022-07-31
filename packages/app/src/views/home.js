import './../elements/contest-item'
import contests from './../data/contests.js'
import {html, LitElement} from 'lit'
import {map} from 'lit/directives/map.js'

export default customElements.define('home-view', class HomeView extends LitElement {
  static properties = {
    items: {
      type: Array
    }
  }

  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.items = contests
  }

  render() {
    return html`
    <style>

      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        justify-content: center;
        pointer-events: auto;
        padding: 0 0 186px 0;
      }

      .container {
        width: 100%;
        max-width: 320px;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        width: 100%;
      }

      ::-webkit-scrollbar {
        width: 12px;
      }
      ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
      }

      [disabled] {
        pointer-events: none;
        opacity: 0.65;
      }
    </style>
    <span class="container">
    ${map(this.items, item => html`
      <contest-item name="${item.name}" icon="${item.icon}" data-id="${item.id}" ?disabled="${item.disabled}" @click="${() => location.hash = `#!/competitions?contest=${item.name}`}"></contest-item>
      `)}
      </span>
    `
  }
})
