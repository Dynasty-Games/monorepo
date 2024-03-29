import {LitElement, html} from 'lit';
import {map} from 'lit/directives/map.js'
import '@lit-labs/virtualizer'

import './portfolio-selector-item'
import {scrollbar} from './../shared/styles'
import './../dialogs/info'

export default customElements.define('portfolio-selector', class PortfolioSelector extends LitElement {
  static properties = {
    items: {
      type: Array
    },
    itemSet: {
      type: Array
    },
    filter: {
      type: Array
    }
  }

  #currentSalary = 0
  constructor() {
    super()
    this.items = []
    pubsub.subscribe('load-user-portfolio', this.#init.bind(this))
    pubsub.subscribe('portfolio-item-selected', this.#itemSelected.bind(this))
    pubsub.subscribe('portfolio-item-removed', this.#itemRemoved.bind(this))
    pubsub.subscribe('portfolio-salary-reset', this.#reset.bind(this))
    pubsub.subscribe('portfolio-salary', this.#updateSalary.bind(this))
  }

  #updateSalary(salary) {
    this.#currentSalary = salary
    const els = Array.from(this.shadowRoot.querySelectorAll('portfolio-selector-item'))
    this.items = this.items.map(item => {
      item.overSalary = salary - item.salary < 0
      return item
    })
  }

  #reset() {
    this.items.forEach(item => {
      item.overSalary = false
    })

    const els = Array.from(this.shadowRoot.querySelectorAll('portfolio-selector-item'))
    els.forEach(el => el.removeAttribute('hidden'))
  }

  #init(items) {
    this.#currentSalary = 0
    console.log({items});
    if (Array.isArray(items) && items?.length > 0) this.filter = items
    else this.filter = []

    this.shadowRoot.querySelector('input').value = ''
    this.itemSet = currentCompetition.items
    this.items = this.itemSet.filter(item => this.filter.indexOf(item.id) === -1)
  }

  #itemSelected(detail) {
    if (currentCompetition.portfolio.length === 8) return
    currentCompetition.portfolio.push(detail.id)
    this.filter.push(detail.id)
    this.items = currentCompetition.items.filter(item => this.filter.indexOf(item.id) === -1)
    this.shadowRoot.querySelector(`portfolio-selector-item[id=${detail.id}]`)?.setAttribute('hidden', '')
  }

  #itemRemoved(detail) {
    console.log(detail);
    console.log(detail.id);
    if (this.filter.length === 0) return

    this.filter.splice(this.filter.indexOf(detail.id), 1)
    currentCompetition.portfolio.splice(detail.id, 1)
    this.items = currentCompetition.items.filter(item => this.filter.indexOf(item.id) === -1)
    this.shadowRoot.querySelector(`portfolio-selector-item[id=${detail.id}]`)?.removeAttribute('hidden')
  }

  // TODO: PUBSUB!!!
  /**
   *
   */
  #search() {
    if (this.searchTimeaout) clearTimeout(this.searchTimeaout)
    const items = []
    this.searchTimeaout = setTimeout(() => {
      const query = this.shadowRoot.querySelector('input').value
      if (query.length === 0) this.items = currentCompetition.items.filter(item => this.filter.indexOf(item.id) === -1)
      else {
        currentCompetition.items.forEach(item => {
          if (this.filter.indexOf(item.id) === -1) {
            if (item.id.includes(query) ||
                item.name.includes(query) ||
                item.symbol.includes(query)) {
                  const overSalary = this.shadowRoot.querySelector(`portfolio-selector-item[id=${item.id}]`)?.hasAttribute('over-salary')
                  item.overSalary = overSalary
                  items.push(item)
                }
          }
        })
        this.items = items.filter(item => this.filter.indexOf(item.id) === -1)
      }      
      this.#updateSalary(this.#currentSalary)
    }, 250);
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
        user-select: none;
      }
      a {
        text-decoration: none;
        color: var(--main-color);
      }
      :host {
        display: flex;
        flex-direction: column;
        max-width: 416px;
        width: 100%;
        box-sizing: border-box;
        height: 100%;
        align-items: center;
      }

      [hidden] {
        pointer-events: none;
        display: none;
      }

      input {
        cursor: pointer;
        box-shadow: 0px 1px 3px -1px #fff;
        border-radius: 12px;
        color: var(--main-color);
        height: 48px;
        width: 100%;
        padding: 12px 24px;
        background: transparent;
        box-sizing: border-box;
        border: 1px solid #fff;
        pointer-events: auto;
      }

      custom-svg-icon {
        margin-left: 12px;
        pointer-events: auto;
        --svg-icon-color: var(--main-color);
      }

      flex-row {
        align-items: center;
      }

      .list {
        overflow-y: auto;
        pointer-events: auto;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
      }

      portfolio-selector-item {
        width: 100%;
      }

      ${scrollbar}

      @media(min-width: 680px) {
        .list {
          max-width: 416px;
          max-height: 80%;
        }
        input {
          max-width: 416px;
        }
      }
    </style>
    <flex-column class="list">
      <lit-virtualizer
        scroller
        style="pointer-events: auto; height: 100%;"
        .items=${this.items}
        .renderItem=${item => html`<portfolio-selector-item
        ?over-salary="${item.overSalary}"
        href="${item.href}"
        salary="${item.salary}"
        name="${item.name}"
        symbol="${item.symbol}"
        image="${item.image}"
        data-id="${item.id}"
        id="${item.id}"
        data-action="show-info">
        </portfolio-selector-item>
        `}
      ></lit-virtualizer>
    </flex-column>

    <flex-row style="justify-content: center; align-items: center; padding: 12px; width: 100%; box-sizing: border-box;">
      <input placeholder="search" @input="${this.#search}"></input>
    </flex-row>


    `
  }
})
