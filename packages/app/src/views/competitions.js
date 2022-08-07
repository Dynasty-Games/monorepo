import './../elements/competition-info-item'
import { openCompetitions } from './../api'
import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js'

export default customElements.define('competitions-view', class CompetitionsView extends LitElement {
  static properties = {
    category: {
      type: Number
    },
    gameStyle: {
      type: Number
    }
  }
  constructor() {
    super()
  }

  back() {
    // console.log();
    history.back()
  }

  #click(event) {
    const target = event.composedPath()[0]
    if (!target.hasAttribute('disabled')) location.hash = `#!/competition?competition=${target.competition}&category=${target.category}&competitionStyle=${target.competitionStyle}`
  }

  attributeChangedCallback(name, old, value) {
    if (old !== value) this[name] = value
  }

  set category(value) {
    this._category = value;
    if (this._gameStyle) this.#parseContest()
  }

  set gameStyle(value) {
    this._gameStyle = value;
    if (this._category) this.#parseContest()
  }

  async #parseContest() {
    let items = await openCompetitions()
    this.items = items.filter(item => item.category == this._category && item.style == this._gameStyle).sort((a, b) => a.startTime - b.startTime)
    this.requestUpdate();
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
        overflow-y: auto;
        pointer-events: auto;
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
      @media(min-width: 860px) {
        .container {
          height: 80%;
        }
      }
    </style>
    <flex-row class="header">
      <flex-row class="inner-header">
        <custom-svg-icon icon="chevron-left" @click=${this.back}></custom-svg-icon>
        <h2>Choose a competition</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <flex-one></flex-one>
    <flex-column class="container">
      ${map(this.items, item => html`<competition-info-item name="${item.name}" competitionStyle=${item.style} competition="${item.id}" description="${item.description}" category="${item.category}" startTime="${item.startTime.toString()}" date="${item.startTime.toString()}" participants="${item.participants}" @click="${this.#click}" ?disabled="${item.startTime > new Date().getTime()}"></competition-info-item>`)}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
