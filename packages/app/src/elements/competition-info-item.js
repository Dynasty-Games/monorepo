import {LitElement, html} from 'lit';
import prettyMilliseconds from 'pretty-ms';
import { calendar } from './../time'
import './../dynasty-elements/countdown.js'

export default customElements.define('competition-info-item', class CompetitionInfoItem extends LitElement {
  static properties = {
    date: {
      converter: (value) => {
        return calendar(new Date(Number(value)).getTime())
      }
    },
    name: {
      type: String
    },
    category: {
      type: Number
    },
    competitionStyle: {
      type: Number
    },
    competition: {
      type: Number
    },
    startTime: {
      type: Number
    },
    participants: {
      type: Number
    }
  }

  constructor() {
    super()
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
        height: 54px;
        padding: 12px 12px;
        box-sizing: border-box;
        pointer-events: auto !important;
        cursor: pointer;
        border-bottom: 1px solid #355050;
        // background: var(--dialog-background-color);
      }

      flex-row {
        align-items: center;
      }
    </style>

    <flex-row>
      <span class="name">${this.name}</span>
      <flex-one></flex-one>
      <span style="padding-right: 6px;">participants</span>
      <span class="participants">${this.participants}</span>
    </flex-row>
    <flex-row>
      <span class="startTime">${this.date}</span>
      <flex-one></flex-one>
      <dynasty-countdown value="${this.startTime}" hide-past></dynasty-countdown>
    </flex-row>
    `
  }
})
