
import {scrollbar} from './../shared/styles'
import {currencies} from './../../../utils/src/utils'
import './../elements/portfolio'
import './../elements/portfolio-selector'
import { competition } from './../api.js'
import './../dynasty-elements/countdown.js'
import { LitElement, html } from 'lit'
import { calculateBaseSalary } from './../../../lib/src/lib'
import { getCompetitionData } from '../utils'

export default customElements.define('competition-view', class CompetitionView extends LitElement {
  static properties = {
    selected: { type: String },
    backHidden: { type: Boolean },
    competition: { type: Number },
    category: { type: Number },
    competitionStyle: { type: Number },
    submitDisabled: { type: Boolean },
    competitionName: { type: String },
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
    
    // const snap = await firebase.get(firebase.child(globalThis.userRef, `${currentCompetition.category}/${currentCompetition.style}/${currentCompetition.id}`))

    // if (await snap.exists()) {
    //   let ids = snap.val()

    //   ids = ids.filter(id => id.length > 0)
    //   pubsub.publish('load-user-portfolio', ids)
    // }
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
    if (this.#category && this.#competitionStyle) this.#setCompetition(this.#category, this.#competitionStyle, value)
  }

  set category(value) {
    this.#category = value
    if (this.#competitionStyle && this.#competition) this.#setCompetition(value, this.#competitionStyle, this.#competition)
  }

  set competitionStyle(value) {
    this.#competitionStyle = value
    if (this.#category && this.#competition) this.#setCompetition(this.#category, value, this.#competition)
  }

  #shouldUpdate() {
    if (!this.#category || !this.#competitionStyle || !this.#competition) return false
    if (this.#category === this._category && this.#competitionStyle === this._competitionStyle && this.#competition === this._competition) return false
    
    this._category = this.#category
    this._competitionStyle = this.#competitionStyle
    this._competition = this.#competition

    return true
  }

  async #setCompetition(category, style, id) {
    if (!this.#shouldUpdate()) return;

    const {params, items, rankById, maxSalary} = await getCompetitionData({category: this.#category, style: this.#competitionStyle, id: this.#competition})

    globalThis.currentCompetition = {
      category,
      style,
      id,
      params,
      items,
      rankById,
      maxSalary,
      portfolio: []
    }

    this.startTime = params.startTime
    this.price = params.price
    // this.competitionCategory = params.category
    this.competitionName = params.name
    this.loadUserItems()
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
