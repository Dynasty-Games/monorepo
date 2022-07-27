import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'
// import {competition as getCompetition} from './../apis/user.js'
export default customElements.define('contest-type-info', class ContestTypeInfo extends LitElement {
  static properties = {
    name: {
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

  #click(event) {
    const target = event.composedPath()[0]
    if (!target.hasAttribute('disabled')) location.hash = `#!/rankings?competition=${target.getAttribute('address')}`
  }

  async #toggle() {
    this.shown = !this.shown
    // if (this.shown) {
    //   const els = Array.from(this.shadowRoot.querySelectorAll('competition-info-item'))
    //   let data = els.map(el => getCompetition(el.address))
    //   data = await Promise.all(data.map(contract => contract.membersCount()))
    //   data = data.map(data => data.toString())
    //   els.forEach((el, i) => {
    //     el.memberCount = data[i]
    //   });
    //
    // }
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
        <h3>${this.name}</h3>
      </flex-column>
      <flex-one></flex-one>
      ${this.shown ? html`<custom-svg-icon icon="icons::arrow-drop-up"></custom-svg-icon>` : html`<custom-svg-icon icon="icons::arrow-drop-down"></custom-svg-icon>`}

    </flex-row>
    <flex-column class="container" ?hidden=${!this.shown}>
      <slot></slot>
    </flex-column>
    `
  }
})
