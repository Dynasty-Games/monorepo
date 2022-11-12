import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'
import { closedCompetitions, openCompetitions } from './../api'
import { scrollbar } from './../shared/styles'

export default customElements.define('contest-list', class ContestList extends LitElement {
  static properties = {
    items: {
      type: Array,
      reflect: false
    },
    type: {
      type: String,
      reflect: false
    },
    description: {
      type: String,
      reflect: false
    },
    shown: {
      type: Boolean
    }
  }

  constructor() {
    super()
  }


  async #loadUserItems() {
    const contract = contracts.dynastyContest.connect(connector)
    let competitions = [...await closedCompetitions(), ...await openCompetitions()]
    const category = 0
    const style = 0

    competitions = competitions.filter(({members}) => (members.find(member => member === connector.accounts[0])))
    competitions = competitions.sort((a, b) => b.endTime - a.endTime)

    console.log(competitions);
    

    if (competitions.length > 0) {
      this.items = competitions
    }

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

  #click(event) {
    const target = event.composedPath()[0]
    if (!target.hasAttribute('disabled'))
      location.hash = `#!/rankings?category=${target.category}&competitionStyle=${target.competitionStyle}&competition=${target.competition}`
  }

  async #toggle() {
    this.shown = !this.shown
  }

  render() {
    return html`
    <style>
      * {
        user-select: none;
      }
      :host {
        display: flex;
        height: 100%;
        flex-direction: column;
        color: var(--main-color);
        font-family: 'Noto Sans', sans-serif;
        overflow: hidden;
        width: 100%;
        max-width: 640px;
      }

      competition-info-item {
        width: 100%;
      }

      [hidden] {
        display: none;
      }

      .toggle {
        pointer-events: auto;
        cursor: pointer;
        padding: 10px 24px;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 1px solid #355050;
      }

      h3 {
        margin: 0;
        padding-bottom: 6px;
        text-transform: capitalize;
      }

      description {
        font-size: 16px;
      }
      .container {
        padding: 10px 12px 12px 0;
        box-sizing: border-box;
        pointer-events: auto;
        cursor: pointer;
        overflow-y: auto;
        width: 100%;
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
      }

      [disabled] {
        pointer-events: none !important;
      }
      competition-info-item {
        width: 100%;
      }

      ${scrollbar}
    </style>
    
    <flex-column class="container">
      
          ${map(this.items, item => html`<competition-info-item
            name="${item.name}"
            category="${item.category}"
            competitionStyle=${item.style}
            competition=${item.id}
            participants="${item.participants}"
            description="${item.description}"
            startTime="${item.startTime.toString()}"
            date="${item.startTime.toString()}"
            @click="${this.#click}"
            ?disabled="${item.startTime > new Date().getTime()}"></competition-info-item>`)}
        

    </flex-column>
    `
  }
})
