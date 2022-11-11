import { categories, styles } from './../../../utils/src/utils'
import '../elements/style-item'
import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js'

export default customElements.define('styles-view', class StylesView extends LitElement {
  static properties = {
    category: {
      type: String
    }
  }
  constructor() {
    super()
  }

  async connectedCallback() {
    super.connectedCallback()
  }

  #click(event) {
    const target = event.composedPath()[0]
    location.hash = `#!/competition?category=${target.getAttribute('category')}&style=${target.getAttribute('style')}&competition=${target.getAttribute('competition')}`
  }

  back() {
    // console.log();
    history.back()
  }

  attributeChangedCallback(name, old, value) {
    if (old !== value) this[name] = value
  }

  set category(value) {
    this._category = value
    this.#parseContest()
  }

  async #parseContest() {
    let items = await categories()
    let styles = await styles()
    console.log({items});
    this.items = items[this._category]
    this.requestUpdate();
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
        align-items: center;
        justify-content: center;
      }

      .container {
        height: 100%;
        overflow-y: auto;
      }

      a {
        text-decoration: none;
        color: var(--main-color);
        width: 100%;
        padding: 12px 24px;
      }

      .container {
        width: 100%;
        max-width: 640px;
      }

      h2, h4 {
        margin: 0;
        padding: 0;
      }

      .header {
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        height: 54px;
      }
      .inner-header {
        max-width: 640px;
        width: 100%;
        align-items: center;
        height: 54px;
      }
      style-item {
        pointer-events: auto;
        cursor: pointer;
      }
      custom-svg-icon {
        --svg-icon-color: var(--main-color);
        pointer-events: auto;
        cursor: pointer;
        padding-right: 12px;
      }
      @media(min-width: 860px) {
        .container {
          height: 80%;
        }
      }
    </style>
    <flex-row class="header">
      <flex-row class="inner-header">
        <custom-svg-icon icon="chevron-left" @click=${this.back}></custom-svg-icon>
        <h2>Select your game style</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <flex-one></flex-one>
    <flex-column class="container">
      ${map(this.items?.crypto, item => html`
        <style-item name="${item.name}" fee="${item.fee}" @click=${() => location.hash = `#!/competitions?category=${this._category}&gameStyle=${item.id}`}></style-item>
      `)}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
