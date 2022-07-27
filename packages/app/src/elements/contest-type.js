import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'
import './contest-type-info'

export default customElements.define('contest-type', class ContestType extends LitElement {
  static properties = {
    items: {
      type: Array,
      reflect: false
    },
    type: {
      type: String,
      reflect: false
    },
    description: {
      type: String,
      reflect: false
    },
    shown: {
      type: Boolean
    }
  }

  constructor() {
    super()
  }

  set items(value) {
    this._items = value
    this.requestUpdate()
  }

  get items() {
    return this._items
  }

  set type(value) {
    this._type = value
    this.requestUpdate()
  }

  get type() {
    return this._type
  }

  set description(value) {
    this._description = value
    this.requestUpdate()
  }

  get description() {
    return this._description
  }

  #click(event) {
    const target = event.composedPath()[0]
    if (!target.hasAttribute('disabled')) location.hash = `#!/rankings?competition=${target.getAttribute('address')}`
  }

  async #toggle() {
    this.shown = !this.shown
  }

  render() {
    return html`
    <style>
      * {
        user-select: none;
      }
      :host {
        display: flex;
        height: 100%;
        flex-direction: column;
        color: var(--main-color);
        font-family: 'Noto Sans', sans-serif;
      }

      competition-info-item {
        width: 100%;
      }

      [hidden] {
        display: none;
      }

      .toggle {
        pointer-events: auto;
        cursor: pointer;
        background: #2e3838b0;
        padding: 10px 24px;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 1px solid #355050;
      }

      h3 {
        margin: 0;
        padding-bottom: 6px;
        text-transform: capitalize;
      }

      description {
        font-size: 16px;
      }
      .container {
        background: #272e2eb3;
        padding: 10px 24px 0 24px;
        box-sizing: border-box;
        pointer-events: auto;
        cursor: pointer;
        overflow-y: auto;
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
      }

      [disabled] {
        pointer-events: none !important;
      }
    </style>
    <flex-row class="toggle" @click="${this.#toggle}">
      <flex-column>
        <h3>${this.type}</h3>
      </flex-column>
      <flex-one></flex-one>
      ${this.shown ? html`<custom-svg-icon icon="icons::arrow-drop-up"></custom-svg-icon>` : html`<custom-svg-icon icon="icons::arrow-drop-down"></custom-svg-icon>`}

    </flex-row>
    <flex-column class="container" ?hidden=${!this.shown}>
      ${map(this.items, item => html`
        <contest-type-info name="${item.name}">
          ${map(item.items, item => html`<competition-info-item name="${item.name}" participants="${item.participants}" description="${item.description}" data-address="${item.address}" address="${item.address}" startTime="${item.startTime.toString()}" date="${item.startTime.toString()}" @click="${this.#click}" ?disabled="${item.startTime > new Date().getTime()}"></competition-info-item>`)}
        </contest-type-info>
        `)}

    </flex-column>
    `
  }
})
