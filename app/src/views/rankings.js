
import {scrollbar} from './../shared/styles'
import './../elements/rankings-item'
import { competition as getCompetition } from './../api'
import { calendar } from './../time'
import './../dynasty-elements/countdown.js'
import { LitElement, html } from 'lit'

import {map} from 'lit/directives/map.js'
export default customElements.define('rankings-view', class RankingsView extends LitElement {
  static properties = {
    items: {
      type: Array
    },
    competition: {
      type: String
    }
  }
  #competition
  // static get observedAttributes() { return ["competition"] }

  constructor() {
    super()
  }

  back() {
    // console.log();
    history.back()
  }

  async #setCompetition() {
    const params = await getCompetition(this.#competition)
    this.competitionName = params[0]['name']
    this.category = params[0]['category']
    this.startTime = params[0]['startTime']
    this.feeDGC = _ethers.utils.formatUnits(params[0]['feeDGC'], 0)
    const snap = await firebase.get(firebase.ref(firebase.database, `competitions/${this.#competition.toLowerCase()}/${connector.accounts[0].toLowerCase()}`))
    this.items = await snap.val()
  }

  #_setCompetition(value) {
    pubsub.subscribe("wallet.ready", this.#setCompetition.bind(this))
    pubsub.subscribers?.["wallet.ready"]?.value && this.#setCompetition()
  }

  set competition(value) {
    this.#competition = value
    pubsub.subscribe("firebase.ready", this.#_setCompetition.bind(this))
    pubsub.subscribers?.["firebase.ready"]?.value && this.#_setCompetition()
  }

  get competition() {
    return this.#competition
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
        background: #000;
      }
      .container {
        width: 100%;
        align-items: center;
        height: 100%;
      }
      .drawer {
        position: absolute;
        top: 84px;
      }

      ${scrollbar}

      .header {
        width:100%;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        height: 54px;
        padding: 0 12px;
        pointer-events: none;
        user-select: none;
      }

      .info-header {
        width: 100%;
        padding: 0 12px;
        height: 54px;
        box-sizing: border-box;
        // background: #383838f2;
        align-items: center;
        justify-content: center;
      }

      custom-pages {
        height: 100%;
        width: 100%;
      }

      .inner-header {
        align-items: center;
        width: 100%;
        max-width: 640px;
      }

      .info-header.two {
        height: 32px;
        background: #2e3838;
      }

      button {
        background: transparent;
        padding: 12px 24px;
        box-sizing: border-box;
        color: var(--accent-color);
        border-radius: 12px;
        cursor: pointer;
        text-transform: uppercase;
        border: none;
        pointer-events: auto;
      }

      custom-svg-icon {
        padding-right: 12px;
        pointer-events: auto;
        cursor: pointer;
        --svg-icon-color: var(--main-color);
      }

      @media(max-width: 680px) {
        .container {
          box-sizing: border-box;
          max-height: 100%;
        }

        .inner-header {
          max-width: 100%;
        }
      }

      [disabled] {
        pointer-events: none;
        color: #eee;
      }
      </style>
      <flex-column class="container">
        <flex-row class="header">
          <flex-row class="inner-header">
            <custom-svg-icon icon="chevron-left" @click="${this.back}"></custom-svg-icon>
            <h4>Portfolio Rankings</h4>
            <flex-one></flex-one>

          </flex-row>
        </flex-row>
        <flex-row class="info-header">
          <flex-row class="inner-header">
            <h2>
            ${this.competitionName}
            </h2>
            <flex-one></flex-one>
          </flex-row>
        </flex-row>

        <flex-row class="info-header two">
          <flex-row class="inner-header">
            <span style="padding-right: 6px;">entry:</span>
            <span>${this.feeDGC}</span>
            <flex-one></flex-one>
            <dynasty-countdown value="${this.startTime}" hide-past></dynasty-countdown>
          </flex-row>
        </flex-row>

        ${map(this.items, (item,  i) => html`
          <rankings-item address="${item.member}" points="${item.points}" position="${i + 1}" @click="${() => {
            location.hash = `#!/member-rankings?competition=${this.#competition}&member=${item.member}`
          }}"></rankings-item>
          `)}
      </flex-column>`
    }
  })
