import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'
import {competition as getCompetition} from './../api.js'
import { scrollbar } from '../shared/styles.js';
export default customElements.define('game-type-info', class GameTypeInfo extends LitElement {
  static properties = {
    name: {
      type: String
    },
    category: {
      type: Number
    },
    gameStyle: {
      type: Number
    },
    description: {
      type: String,
      reflect: false
    },
    shown: {
      reflect: true,
      type: Boolean
    }
  }

  constructor() {
    super()
  }

  async #toggle(event) {
    event.stopPropagation()
    if (!this.shown) {
      const length = Array.from(this.querySelectorAll('competition-info-item')).length
      this.style.setProperty('--items-length', `${length * 64}px`)
    }
    this.shown = !this.shown
  }

  #showCompetitionNameView() {
    location.hash = `#!/competition-list?category=${this.category}&gameStyle=${this.gameStyle}&name=${this.name}`
  }

  render() {
    return html`
    <style>
      * {
        user-select: none;
      }
      ${scrollbar}
      
      :host {
        display: flex;
        height: auto;
        flex-direction: column;
        color: var(--main-color);
        font-family: 'Noto Sans', sans-serif;
        border-radius: 24px;
        overflow: hidden;
        min-height: 64px;
        margin-bottom: 12px;     
        background: #262626;
        justify-content: center;
        box-sizing: border-box;
        // border: 1px solid var(--main-color);
      }

      competition-info-item {
        width: 100%;
      }

      [hidden] {
        display: none;
      }

      :host([shown]) {        
        min-height: var(--items-length);
        max-height: 480px;
      }

      .toggle {
        pointer-events: auto;
        cursor: pointer;
        padding: 10px 24px;
        box-sizing: border-box;
        align-items: center;
      }

      h3 {
        margin: 0;
        text-transform: capitalize;
      }

      description {
        font-size: 16px;
      }
      .container {
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
    <flex-row class="toggle" @click="${this.#showCompetitionNameView}">
      <flex-column>
        <h3>${this.name}</h3>
      </flex-column>
      <flex-one></flex-one>
      ${this.shown ? html`<custom-svg-icon icon="icons::arrow-drop-up"  @click="${this.#toggle}"></custom-svg-icon>` : html`<custom-svg-icon icon="icons::info" @click="${this.#toggle}"></custom-svg-icon>`}

    </flex-row>
    <flex-column class="container" ?hidden=${!this.shown}>
      <slot></slot>
    </flex-column>
    `
  }
})
