import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'
import './game-type-info'
export default customElements.define('game-type', class GameType extends LitElement {
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
    console.log(value);
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
    if (!target.hasAttribute('disabled')) location.hash = `#!/competition?competition=${target.competition}&category=${target.category}&competitionStyle=${target.competitionStyle}`
  }

  async #toggle() {
    this.shown = !this.shown
    if (this.shown) {
      // const els = Array.from(this.shadowRoot.querySelectorAll('competition-info-item'))
      // let data = els.map(el => contracts[el.address])
      // data = await Promise.all(data.map(contract => contract.membersCount()))
      // data = data.map(data => data.toString())

    }
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
        overflow: hidden;
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
        padding: 10px 24px;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 1px solid #355050;
        border-radius: 24px;
        border: 1px solid #18b3cc4a;
      }

      h3 {
        margin: 0;
        text-transform: capitalize;
      }

      description {
        font-size: 16px;
      }
      .container {
        padding: 24px;
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
      ${map(this.items, (item, i) => html`
        <game-type-info name="${item.name}">
          ${map(item.items, item => html`<competition-info-item name="${item.name}" competitionStyle=${item.style} competition="${item.id}" description="${item.description}" category="${item.category}" startTime="${item.startTime.toString()}" date="${item.startTime.toString()}" participants="${item.participants}" @click="${this.#click}" ?disabled="${item.startTime > new Date().getTime()}"></competition-info-item>`)}
        </game-type-info>
        `)}

    </flex-column>
    `
  }
})
