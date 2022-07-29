
import {scrollbar} from './../shared/styles'
import {currencies} from './../apis/coinmarketcap'
import './../elements/portfolio'
import './../elements/portfolio-selector'
import { competition } from './../api.js'
import erc20 from './../data/abis/erc20'
import { calendar } from './../time'
import './../dynasty-elements/countdown.js'
import { LitElement, html } from 'lit'

export default customElements.define('competition-view', class CompetitionView extends LitElement {
  static properties = {
    selected: { type: String },
    backHidden: { type: Boolean },
    competition: { type: String },
    category: { type: String },
    competitionStyle: { type: String },
    submitDisabled: { type: Boolean },
    price: { type: String },
    startTime: { type: Number },
    date: {
      type: Number,
      converter: (value) => {
        return moment().calendar(value);
      }
    },
    items: { type: Array },
    selectorOpened: {
      type: Boolean,
      reflect: true
    }
  }

  #competition
  #category
  #competitionStyle


  constructor() {
    super()
    this.items = []
    this.rankById = []
    this.selectorOpened = false
    pubsub.subscribe('portfolio-item-info', this.#showInfo.bind(this))
    pubsub.subscribe('portfolio-item-selected', this.#itemSelected.bind(this))
    pubsub.subscribe('portfolio-item-clicked', this.#itemSelected.bind(this))
  }

  get isDesktop() {
    return this.hasAttribute('is-desktop')
  }

  get #pages() {
    return this.shadowRoot.querySelector('custom-pages')
  }

  #showInfo(detail) {
    const el = document.createElement('info-dialog')
    this.shadowRoot.appendChild(el)
    const index = currentCompetition.rankById.indexOf(detail.id)

    el.show(currentCompetition.items[index])
  }


  async _loadUserItems() {
    pubsub.publish('load-user-portfolio', [])
    
    const snap = await firebase.get(firebase.child(globalThis.userRef, `${currentCompetition.category}/${currentCompetition.style}/${currentCompetition.id}`))

    if (await snap.exists()) {
      let ids = snap.val()

      ids = ids.filter(id => id.length > 0)
      pubsub.publish('load-user-portfolio', ids)
    }
  }

  loadUserItems() {
    pubsub.subscribe("wallet.ready", this._loadUserItems.bind(this))
    pubsub.subscribers?.["wallet.ready"]?.value && this._loadUserItems()
  }

  get #portfioleElement() {
    return this.shadowRoot.querySelector("portfolio-element")
  }

  get #portfolioSelector() {
    return this.shadowRoot.querySelector("portfolio-selector")
  }

  back() {
    // if (this.#pages.selected === 'portfolio' || this.#pages.selected?.dataset?.route === 'portfolio') return this.parentNode.parentNode.parentNode.host.back()
    // this.#pages.previous()
    history.back()
  }

  async #itemSelected(event) {
    if (!this.isDesktop) this.#toggleSelector()
  }

  #toggleSelector() {
    this.selectorOpened = !this.selectorOpened
  }

  set competition(value) {
    this.#competition = value
    this.#setCompetition(this.#category, this.#competitionStyle, value)
  }

  set category(value) {
    this.#category = value
    this.#setCompetition(value, this.#competitionStyle, this.#competition)
  }

  set competitionStyle(value) {
    this.#competitionStyle = value
    this.#setCompetition(this.#category, value, this.#competition)
  }

  async #setCompetition(category, style, id) {
    if (category === undefined || style === undefined || id === undefined) return

    let items = await currencies()
    items = items.sort((a,b) => a.rank - b.rank)
    const rankById = []

    for (const item of items) {
      rankById.push(item.id)
    }

    let params = await competition(category, style, id)
    console.log(params);

    globalThis.currentCompetition = {
      category,
      style,
      id,
      params,
      items,
      rankById,
      maxSalary: 50000,
      portfolio: []
    }

    this.startTime = params.startTime
    this.price = params.price
    // this.competitionCategory = params.category
    this.competitionName = params.name

    pubsub.subscribe("firebase.ready", this.loadUserItems.bind(this))
    pubsub.subscribers?.["firebase.ready"]?.value && this.loadUserItems()
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
        max-width: 854px;
      }

      .info-header.two {
        height: 32px;
        background: #2e3838;
      }

      .portfolio-container {
        height: calc(100% - 200px);
        position: absolute;
        bottom: 0;
        width: 100%;
        align-items: center;
        justify-content: center;
        display: flex;
        left: 0;
        right: 0;
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

      portfolio-selector {
        margin-right: 24px;
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

      @media(max-width: 1120px) {

        .portfolio-container {
          height: calc(100% - 146px);
        }

        portfolio-selector {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          margin-right: 0;
          z-index: auto;
        }

        portfolio-element {
          z-index: 1000;
        }
      }

      [disabled] {
        pointer-events: none;
        color: #eee;
      }

      :host([selectoropened]) portfolio-selector {
        z-index: 1000;
        pointer-events: auto;
        opacity: 1;
      }

      :host([selectoropened]) portfolio-element {
        z-index: auto;
        pointer-events: none;
        opacity: 0;
      }

      [is-desktop] {

      }
      </style>
      <flex-column class="container">
        <flex-row class="header">
          <flex-row class="inner-header">
            <custom-svg-icon icon="chevron-left" @click="${this.back}"></custom-svg-icon>
            <h4>Create Portfolio</h4>
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

        </flex-row class>

        <flex-row class="info-header two">
          <flex-row class="inner-header">
            <span style="padding-right: 6px;">entry:</span>
            <span>${this.price}</span>
            <flex-one></flex-one>
            <dynasty-countdown value="${this.startTime}" hide-past></dynasty-countdown>
          </flex-row>
        </flex-row>
        <flex-row class="portfolio-container">
          <portfolio-selector data-route="portfolio-selector"></portfolio-selector>
          <portfolio-element data-route="portfolio"></portfolio-element>
        </flex-row>

      </flex-column>`
    }
  })
