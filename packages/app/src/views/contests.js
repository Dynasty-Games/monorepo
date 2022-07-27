import './../elements/competition-info-item'
import {competitions as getCompetitions, competitionAddresses} from './../api'
import './../elements/contest-type'
import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js'


export default customElements.define('contests-view', class ContestsView extends LitElement {
  static properties = {
    items: {
      type: Array
    }
  }

  constructor() {
    super()
  }

  async #loadUserItems() {
    const competitionParams = await getCompetitions()
    console.log(competitionParams);
    let competitions = await Promise.all(competitionParams.map(async params => {
      const snap = await firebase.get(firebase.ref(firebase.database, `competitions/${params.address.toLowerCase()}/${connector.accounts[0].toLowerCase()}`))
      snap.params = params
      return snap
    }))
    competitions = await Promise.all(competitions.filter(snap => snap.exists()))
    competitions = competitions.reduce((set, current) => {
      set[current.params.name] = set[current.params.name] || { name: current.params.name, items: [] }
      set[current.params.name].items.push(current.params)
      return set
    }, {})
    if (Object.keys(competitions).length > 0) {
      this.items = [
        {type: 'classic', description: 'create a 8 crypto lineup', items: JSON.stringify(Object.values(competitions))}
      ]
    }
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.#loadUserItems()
    }, 30000);
  }

  loadUserItems() {
    pubsub.subscribe("wallet.ready", this.#loadUserItems.bind(this))
    pubsub.subscribers?.["wallet.ready"]?.value && this.#loadUserItems()
  }

  async connectedCallback() {
    super.connectedCallback()

    pubsub.subscribe("firebase.ready", this.loadUserItems.bind(this))
    pubsub.subscribers?.["firebase.ready"]?.value && this.loadUserItems()
  }

  #click(event) {
    const target = event.composedPath()[0]
    location.hash = `#!/competition?competition=${target.getAttribute('address')}`
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
        background: #2e3838;
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
        <h2>contests</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <flex-one></flex-one>
    <flex-column class="container">
      ${this.items?.length > 0 ? map(this.items, item => html`<contest-type description="${item.description}" type="${item.type}" items="${item.items}"></contest-type>`) : html`
      <flex-column style="height: 100%; align-items: center; justify-content: center;"><h3>Your entered contests will appear here</h3></flex-column>
      `}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
