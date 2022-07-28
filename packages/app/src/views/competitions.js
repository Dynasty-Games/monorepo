import './../elements/competition-info-item'
import { openCompetitions } from './../api'
import './../elements/game-type'
import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js'

export default customElements.define('competitions-view', class CompetitionsView extends LitElement {
  static get observedAttributes() { return ['contest'] }
  constructor() {
    super()
  }

  async connectedCallback() {
    super.connectedCallback()
  }

  #click(event) {
    const target = event.composedPath()[0]
    location.hash = `#!/competition?category=${target.getAttribute('category')}&style=${target.getAttribute('style')}&competition=${target.getAttribute('competition')}`
  }

  back() {
    // console.log();
    history.back()
  }

  attributeChangedCallback(name, old, value) {
    if (old !== value) this[name] = value
  }

  set contest(value) {
    this.#parseContest(value)
  }

  async #parseContest(contest) {
    this._contest = contest
    let items = await openCompetitions()
    console.log(items);
    const byName = items.reduce((set, current) => {
      set[current.name] = set[current.name] || { name: current.name, items: [] }
      set[current.name].items.push(current)
      set[current.name].items.sort((a, b) => Number(a.startTime) - Number(b.startTime))
      return set
    }, {})
    items = []
    items.push({
      category: 0,
      style: 0,
      type: 'classic',
      description: 'create a 8 crypto lineup',
      items: JSON.stringify(Object.values(byName))
    })
    this.items = items
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
        background: #000;
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
        <h2>Select your game style</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <flex-one></flex-one>
    <flex-column class="container">
      ${map(this.items, item => html`<game-type description="${item.description}" type="${item.type}" items="${item.items}"></game-type>`)}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
