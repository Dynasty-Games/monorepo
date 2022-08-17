
import {scrollbar} from './../shared/styles'
import './../elements/member-rankings-item'
import { competition as getCompetition, currencies as getCurrencies } from './../api'
import './../dynasty-elements/countdown.js'
import { LitElement, html } from 'lit'

import {map} from 'lit/directives/map.js'
import { calculateBaseSalary } from '../../../lib/src/lib'
import { getCompetitionData } from '../utils'

export default customElements.define('member-rankings-view', class MemberRankingsView extends LitElement {
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
    let query = location.hash.split('?')
    query.shift()
    console.log(query);
    query = query[0].split('&')

    query.forEach(q => {
      const parts = q.split('=')
      const [key, value] = parts
      if (key !== 'competition') this[key] = value
    })
    console.log(this.category, this.competitionStyle, this.#competition);
    const {params, items, rankById, maxSalary} = await getCompetitionData({category: this.category, style: this.competitionStyle, id: this.#competition})
    this.competitionName = params.name
    this.category = params.category
    this.startTime = params.startTime
    this.price = params.price

    const member = location.hash.split('member=')[1]
    const contract = await contracts.dynastyContest.connect(connector)

    const portfolio = await contract.memberPortfolio(this.category, this.competitionStyle, this.#competition, member)

    this.items = portfolio.items.map(item => ({...items[rankById.indexOf(item)]}))
  }

  #edit() {
    location.hash = `#!/competition?category=${this.category}&competitionStyle=${this.competitionStyle}&competition=${this.#competition}`
  }

  set competition(value) {
    this.#competition = value
    pubsub.subscribe("wallet.ready", this.#setCompetition.bind(this))
    pubsub.subscribers?.["wallet.ready"]?.value && this.#setCompetition()
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
        height: 100%;
        width: 100%;
      }
      .container {
        height: 100%;
        overflow: hidden;
        justify-content: center;
        box-sizing: border-box;
        padding-bottom: 24px;
      }
      .list {
        position: relative;
        max-width: 640px;
        width: 100%;
        overflow-y: auto;
        pointer-events: auto;
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
        max-width: 640px;
      }

      .info-header.two {
        height: 32px;
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
        }

        .inner-header {
          max-width: 100%;
        }
      }

      [disabled] {
        pointer-events: none;
        color: #eee;
      }

      [shown] {
        pointer-events: auto !important;
        opacity: 1 !important;
      }

      .edit {
        pointer-events: none;
        opacity: 0;
        align-items: center;
      }
      </style>
      <flex-row class="header">
        <flex-row class="inner-header">
          <custom-svg-icon icon="chevron-left" @click="${this.back}"></custom-svg-icon>
          <h4>Portfolio</h4>
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
          <span>${this.price}</span>
          <flex-one></flex-one>
          <flex-row>              
            <custom-svg-icon icon="mode-edit" @click="${this.#edit}" ?shown="${connector?.accounts ? connector.accounts[0] === location.hash.split('member=')[1] : false}"></custom-svg-icon>
            <strong>edit</strong>
          </flex-row>
          
          <dynasty-countdown value="${this.startTime}" hide-past></dynasty-countdown>
        </flex-row>
      </flex-row>
      <flex-row class="container">     
        <flex-wrap-between class="list">
          ${map(this.items, (item,  i) => html`
            <member-rankings-item id="${item.id}" name="${item.name}" image="${item.image}" salary="${item.salary}" points="${item.points}" position="${i + 1}"></member-rankings-item>
            `)}
        </flex-wrap-between>
      </flex-row>
      `
    }
  })
