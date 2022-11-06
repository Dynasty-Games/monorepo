import '../elements/competition-info-item'
import { liveCompetitions } from '../api'
import '../elements/contest-type'
import categories from './../data/contests'
import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js'
import awesomefont from './../icons/awesomefont-icons'

export default customElements.define('live-view', class LiveView extends LitElement {
  static properties = {
    items: {
      type: Array
    }
  }

  constructor() {
    super()
  }

  async #loadUserItems() {
    const contract = contracts.dynastyContest.connect(connector)
    let competitions = await liveCompetitions()
    const category = 0
    const style = 0

    competitions = await Promise.all(competitions.map(async competition => {
      competition.icon = categories[competition.category].icon
      const style = await contracts.dynastyContest.style(competition.style)
      competition.style = {
        fee: style.fee,
        name: style.name,
        id: competition.style
      }
      return competition
    }))
    
    this.items = competitions.filter(value => value.members.indexOf(connector.accounts[0]) !== -1)

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.#loadUserItems()
    }, 30000);
  }

  async connectedCallback() {
    super.connectedCallback()
    
    pubsub.subscribe("wallet.ready", this.#loadUserItems.bind(this))
    pubsub.subscribers?.["wallet.ready"]?.value && this.#loadUserItems()
  }

  back() {
    history.back()
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
        color: #555;
        background: #fff;
      }


      .drawer {
        position: absolute;
        top: 84px;
      }

      [slot="content"] {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        width: 100%;
      }

      a {
        text-decoration: none;
        color: var(--main-color);
        width: 100%;
        padding: 12px 24px;
      }

      .container {
        width: 100%;
        max-width: 760px;
      }

      competition-info-item {
        width: 100%;
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
        max-width: 760px;
        width: 100%;
        align-items: center;
        height: 54px;
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
        pointer-events: auto;
        cursor: pointer;
        padding-right: 12px;
      }
      .game-style, .category, .name, .price, .prizepool, .members {
        display: flex;
        padding-right: 12px;
      }

      .game-style {
        min-width: 64px;
      }

      .category {
        min-width: 74px;
      }

      .top-row, .item {
        padding: 12px 24px;
        align-items: center;
      }
      .name {
        min-width: 120px;
        width: 100%;
      }

      .price {
        min-width: 46px;
      }

      .prizepool {
        min-width: 72px;
      }

      .members {
        min-width: 52px;
      }
      @media(min-width: 860px) {
        .container {
          height: 80%;
        }
      }

      .container {
        grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];
        grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];
      }
    </style>
    ${awesomefont}
    <flex-row class="header">
      <flex-row class="inner-header">
        <custom-svg-icon icon="chevron-left" @click=${this.back}></custom-svg-icon>
        <h2>live contests</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <flex-one></flex-one>
    <flex-column class="container">
      <flex-row class="top-row">
        <strong class="category">category</strong>
        <strong class="game-style" style="align-items: center; justify-content: center;">style</strong>
        <strong class="name">name</strong>
        <flex-one></flex-one>
        <strong class="prizepool">prizepool</strong>
        <strong class="members">entries</strong>
        <strong style="96px">ends in</strong>
      </flex-row>
      ${this.items?.length > 0 ? map(this.items, item => html`
        <flex-row class="item">
          <flex-row class="category" style="align-items: center; justify-content: center;">
            <custom-svg-icon icon=${item.icon}></custom-svg-icon>
          </flex-row>
          <flex-row class="game-style" style="align-items: center; justify-content: center;">${item.style.name}</flex-row>
          <flex-row class="name" style="align-items: center;">${item.name}</flex-row>
          <flex-row class="prizepool">${item.prizePool}</flex-row>
          <flex-row class="members">${item.members.length}</flex-row>
        </flex-row>
      `) : html`
      <flex-column style="height: 100%; align-items: center; justify-content: center;"><h3>Your live contests will appear here</h3></flex-column>
      `}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
