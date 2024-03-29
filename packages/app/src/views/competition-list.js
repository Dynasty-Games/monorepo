import '../elements/competition-info-item'
import '../elements/game-type-info'
import { openCompetitions, openCompetitionNames } from '../../../utils/src/utils'
import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'

export default customElements.define('competition-list-view', class CompetitionListView extends LitElement {
  static properties = {
    category: {
      type: Number
    },
    gameStyle: {
      type: Number
    },
    name: {
      type: String
    },
    items: {
      type: Array
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

  set category(value) {
    this._category = value;
    this.#parseContest()
  }

  set gameStyle(value) {
    this._gameStyle = value;
    this.#parseContest()
  }

  set name(value) {
    this._name = value;
    this.#parseContest()
  }

  #shouldUpdate() {
    if (!this._category || !this._gameStyle || !this._name) return false
    if (this._category === this.__category && this._name === this.__name && this._gameStyle === this.__gameStyle) return false

    this.__category = this._category
    this.__name = this._name
    this.__gameStyle = this._gameStyle
    return true
  }

  async #parseContest() {
    if (!this.#shouldUpdate()) return  

    let items = await openCompetitions(`category=${this._category}&style=${this._gameStyle}&name=${this._name}`)

    items = items
      .filter(item => item.name.toLowerCase() === this._name)
      .sort((a, b) => a.startTime - b.startTime)

    // items = items.reduce((set, current) => {
    //   const name = current.name.toLowerCase()
    //   set[name] = set[name] || { name, items: [] }
    //   set[name].items.push(current)
    //   return set
    // }, {})

    this.items = items
console.log(this.items);    
    // this.requestUpdate();
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
        display: flex;
        height: 100%;
        flex-direction: column;
        color: var(--main-color);
        font-family: 'Noto Sans', sans-serif;
        border-radius: 24px;
        overflow: hidden;
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
        max-width: 640px;
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
        max-width: 640px;
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
      [hidden] {
        display: none;
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
      ${map(this.items, (item, i) => html`
        <competition-info-item name="${item.name}" competitionStyle=${item.style} competition="${item.id}" description="${item.description}" category="${item.category}" startTime="${item.startTime.toString()}" date="${item.startTime.toString()}" participants="${item.participants}" @click="${this.#click}" ?disabled="${item.startTime > new Date().getTime()}"></competition-info-item>        
      `)}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
