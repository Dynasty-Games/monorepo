import '../elements/competition-info-item'
import { liveCompetitions } from '../api'
import '../elements/contest-type'
import {LitElement, html, css} from 'lit';
import {map} from 'lit/directives/map.js'


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
    let competitionMembers = await Promise.allSettled(
      competitions.map(
        async ({category, style, id}, i) => {
          const members = await contract.members(category, style, id)
          return {
            category,
            style,
            id,
            members,
            i
          }
        }
        )
    )

    
    
    
    competitionMembers = await Promise.all(competitionMembers.filter(({status, value}) => status === 'fulfilled' && value.members.indexOf(connector.accounts[0]) !== -1))
    competitionMembers = competitionMembers.map(({value}) => value)
    
    competitionMembers = competitionMembers.reduce((set, current) => {
      const params = competitions[current.i]
      const name = competitions[current.i].name.toLowerCase()
      params.members = current.members
      set[name] = set[name] || { name, items: [] }
      set[name].items.push(params)
      return set
    }, {})

    console.log(competitionMembers)
    if (Object.keys(competitionMembers).length > 0) {
      this.items = [
        {type: 'classic', description: 'create a 8 crypto lineup', items: JSON.stringify(Object.values(competitionMembers))}
      ]
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
        <h2>live contests</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <flex-one></flex-one>
    <flex-column class="container">
      ${this.items?.length > 0 ? map(this.items, item => html`<contest-type description="${item.description}" type="${item.type}" items="${item.items}"></contest-type>`) : html`
      <flex-column style="height: 100%; align-items: center; justify-content: center;"><h3>Your live contests will appear here</h3></flex-column>
      `}
    </flex-column>
    <flex-one></flex-one>
    `
  }
})
