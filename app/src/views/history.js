import { LitElement, html } from 'lit'
import coinmarketcap from './../apis/coinmarketcap'

import { calculateFantasyPoints, calculateBaseSalary } from './../../node_modules/@dynasty-games/lib/src/lib'

const oneDay = 1000 * 60 * 60 * 24;

export default customElements.define('history-view', class HistoryView extends LitElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    super.connectedCallback()
    this.items = await coinmarketcap.currencies()
    this.items = await this.items.map(async (item) => {
      const date = new Date()
      const year = date.getFullYear()
      const ref = firebase.ref(firebase.database, `currencies/${year}/${item.id.replace('[', '').replace(']', '')}`)

      let stamps = await firebase.get(ref)
      stamps = await stamps.val()
      let twelve = []
      let twentyfour = []
      let thirtysix = []
      let fourtyeight = []
      let seventytwo = []
      let sixty = []

      Object.entries(stamps).forEach(([key, item]) => {
        if (date.getTime() - Number(key) > 0.5 * oneDay && date.getTime() - Number(key) < 1 * oneDay) twelve.push(item)
        else if (date.getTime() - Number(key) >= 1 * oneDay && date.getTime() - Number(key) <= 1.5 * oneDay) twentyfour.push(item)
        else if (date.getTime() - Number(key) >= 1.5 * oneDay && date.getTime() - Number(key) <= 2 * oneDay) thirtysix.push(item)
        else if (date.getTime() - Number(key) >= 2 * oneDay && date.getTime() - Number(key) <= 2.5 * oneDay) fourtyeight.push(item)
        else if (date.getTime() - Number(key) >= 2.5 * oneDay && date.getTime() - Number(key) <= 3 * oneDay) sixty.push(item)
        else if (date.getTime() - Number(key) >= 3 * oneDay && date.getTime() - Number(key) <= 3.5 * oneDay) seventytwo.push(item)
      })
      twelve = twelve.reverse()
      twentyfour = twentyfour.reverse()
      thirtysix = thirtysix.reverse()
      fourtyeight = fourtyeight.reverse()
      seventytwo = seventytwo.reverse()
      sixty = sixty.reverse()

      return {
        name: twentyfour[0].name,
        marketCap: twentyfour[0].marketCap,
        rank: twentyfour[0].rank,
        twelve: twelve[0] || {},
        twentyfour: twentyfour[0] || {},
        thirtysix: thirtysix[0] || {},
        fourtyeight: fourtyeight[0] || {},
        seventytwo: seventytwo[0] || {},
        sixty: sixty[0] || {}
      }
    })

      this.items = await Promise.all(this.items)
      this.items = this.items.sort((a, b) => a.rank - b.rank)
      this.items = calculateBaseSalary(this.items)
      this.items = this.items.map(item => {
        if (item.twentyfour) return {
          twentyfour: Math.round(calculateFantasyPoints({
            priceDifference: item.twentyfour.priceChange24hPercentage,
            volumeDifference: item.twentyfour.volumeChange24hPercentage,
            marketCapDifference: 0
          }) * 100) / 100,
          thirtysix: Math.round(calculateFantasyPoints({
            priceDifference: item.thirtysix.priceChange24hPercentage,
            volumeDifference: item.thirtysix.volumeChange24hPercentage,
            marketCapDifference: 0
          }) * 100) / 100,
          fourtyeight: Math.round(calculateFantasyPoints({
            priceDifference: item.fourtyeight.priceChange24hPercentage,
            volumeDifference: item.fourtyeight.volumeChange24hPercentage,
            marketCapDifference: 0
          }) * 100) / 100,
          seventytwo: Math.round(calculateFantasyPoints({
            priceDifference: item.seventytwo.priceChange24hPercentage,
            volumeDifference: item.seventytwo.volumeChange24hPercentage,
            marketCapDifference: 0
          }) * 100) / 100,
          sixty: Math.round(calculateFantasyPoints({
            priceDifference: item.sixty.priceChange24hPercentage,
            volumeDifference: item.sixty.volumeChange24hPercentage,
            marketCapDifference: 0
          }) * 100) / 100
        }
    })

    this.#arrayRepeat.items = [...this.items]
  }

  get #arrayRepeat() {
    return this.shadowRoot.querySelector('array-repeat')
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
      }

      :host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        overflow-y: auto;
        pointer-events: auto !important;
      }

      .container {
        max-width: 720px;
        width: 100%;
        height: 100%;
      }

      .header {
        padding-bottom: 24px;
      }

      .twentyfour, .fourtyeight, .salary {
        box-sizing: border-box;
        display: flex;
        width: 64px;
        padding-right: 36px;
      }

      array-repeat {
        width: 100%;
        height: 100%;
        max-height: 720px;
        overflowY: auto;
      }
    </style>
    <flex-column class="container">
      <flex-row class="header">
        <strong>name</strong>
        <flex-one></flex-one>
        <span class="salary">salary</span>
        <span class="twentyfour">24h</span>
        <span class="fourtyeight">48h</span>
        <span class="72h">72h</span>
      </flex-row>

      <array-repeat max="100">
      <style>
      flex-row {
        height: 48px;
      }
        </style>
        <template>
          <flex-row>
            <span class="name">[[item.name]]</span>
            <flex-one></flex-one>
            <span class="salary">[[item.salary]]</span>

            <span class="twentyfour">[[item.twentyfour]]</span>

            <span class="fourtyeight">[[item.fourtyeight]]</span>

            <span class="72h">[[item.seventytwo]]</span>
          </flex-row>
        </template>
      </array-repeat>
    </flex-column>
    `
  }
})
