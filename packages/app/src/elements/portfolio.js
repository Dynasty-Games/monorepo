import './portfolio-item'
import './../dialogs/info'
import {html, LitElement} from 'lit'
import {map} from 'lit/directives/map.js'
import './competition-bar'
import { DynastyTreasury } from './../../../addresses/goerli.json'
import { editPortfolio, gameCredits } from '../api'

export default customElements.define('portfolio-element', class PortfolioElement extends LitElement {
  static properties = {
    items: {
      type: Array
    },
    submitDisabled: {
      type: Boolean
    },
    edits: {
      type: Number
    },
    positionsFilled: {
      type: Number
    }
  }
  constructor() {
    super()
    this.submitDisabled = true
    this.edits = 0
    this.items = [{
      placeholder: true
    }, {
      placeholder: true
    }, {
      placeholder: true
    }, {
      placeholder: true
    }, {
      placeholder: true
    }, {
      placeholder: true
    }, {
      placeholder: true
    }, {
      placeholder: true
    }]
  }

  connectedCallback() {
    super.connectedCallback()
    pubsub.subscribe('load-user-portfolio', this.#loadUserItems.bind(this))
    pubsub.subscribe('portfolio-item-selected', this.#itemSelected.bind(this))
    pubsub.subscribe('portfolio-item-removed', this.#itemRemoved.bind(this))
  }

  #itemSelected(detail) {
    this.add(detail)
  }

  #itemRemoved(detail) {
    this.positionsFilled -= 1
    this.submitDisabled = true
    this.shadowRoot.querySelector(`[index="${detail.index}"]`).reset()
  }

  async #loadUserItems(ids) {
    await this.#reset()
    this.submitDisabled = true
    const contract = await contracts.dynastyContest.connect(connector)
    let edits
    try {
      const portfolio = await contract.memberPortfolio(currentCompetition.category, currentCompetition.style, currentCompetition.id, connector.accounts[0])
      edits = portfolio.submits.toNumber()
    } catch(e) {
      edits = 0
    }

    this.edits = edits

    let i = 0
    let salary = currentCompetition.maxSalary
    
    const els = Array.from(this.shadowRoot.querySelectorAll(`[index]`))
    els.forEach(el => el.reset())
    console.log(els);

    this.positionsFilled = 0

    for (const id of ids) {
      const item = currentCompetition.items[currentCompetition.rankById.indexOf(id)]
      const el = this.shadowRoot.querySelector(`[index="${i}"]`)
      this.positionsFilled += 1
      el.placeholder = false
      el.setAttribute('name', item.name)
      el.setAttribute('image', item.image)
      el.setAttribute('id', item.id)
      el.setAttribute('salary', item.salary)
      salary -= item.salary
      currentCompetition.portfolio.push(item.id)      
      i++
    }
    this.#competitionBar.shadowRoot.querySelector('dynasty-salary').value = salary
    if (salary < 0) this.submitDisabled = true
    else if (salary > 0 && ids.length === 8) this.submitDisabled = false
  }

  get #competitionBar() {
    return this.shadowRoot.querySelector('competition-bar')
  }

  add(item, id) {
    let els = Array.from(this.shadowRoot.querySelectorAll(`[index]`))
    els = els.filter(el => (el.salary === 0))
    if (els.length === 0) return
    if (els.length !== 0) id = els[0].index
    const el = this.shadowRoot.querySelector(`[index="${id}"]`)
    el.placeholder = false
    el.setAttribute('name', item.name)
    el.setAttribute('image', item.image)
    el.setAttribute('id', item.id)
    el.setAttribute('salary', item.salary)
    
    const salary = this.#competitionBar.shadowRoot.querySelector('dynasty-salary').value

    this.positionsFilled += 1
    if (els.length === 1) this.submitDisabled = false
    
    if (els.length > 8 || salary - item.salary < 0) this.submitDisabled = true
  }

  async #save() {
    await editPortfolio(currentCompetition)
  }

  #reset() {
    currentCompetition.portfolio = []
    this.positionsFilled = 0
    let els = Array.from(this.shadowRoot.querySelectorAll(`[index]`))
    els.forEach(el => el.setAttribute('placeholder', 'true'));
    pubsub.publish('portfolio-salary-reset')
    this.submitDisabled = true
    
  }

  #clear() {
    if (currentCompetition.portfolio.length == 0) return
    this.#reset()
    pubsub.publish('load-user-portfolio', [])
    // firebase.set(
    //   firebase.child(globalThis.userRef, currentCompetition.address),
    //   null
    // )
    
    return 
  }

  #select() {
    pubsub.publish('portfolio-item-clicked')
  }

  getSalary() {
    return Number(this.shadowRoot.querySelector('competition-bar').shadowRoot.querySelector('dynasty-salary').value)
  }

  getMaxSalary() {
    return 50000
  }

  async #enter() {
      const contract = await globalThis.contracts.dynastyContest.connect(connector)
      const params = await contract.callStatic.competition(currentCompetition.category, currentCompetition.style, currentCompetition.id)
      // const maxEdits = params.freeSubmits.toNumber()

      // if (this.edits < maxEdits) {
      try {
        await this.#save()
      } catch (e) {
        
      }
      if (currentCompetition.portfolio.length === params.portfolioSize.toNumber()) {
        let tx
        const USDC = contracts.usdc.connect(connector)
        
        

        let allowance = await USDC.allowance(connector.accounts[0], DynastyTreasury)
        
        if (Number(_ethers.utils.formatUnits(allowance, 8)) < Number(_ethers.utils.formatUnits(params.price, 8))) {
          tx = await USDC.approve(DynastyTreasury, params.price)
          if (tx.wait) await tx.wait()
        }
          
        // tx = await contract.submitPortfolio(currentCompetition.category, currentCompetition.style, currentCompetition.id, currentCompetition.portfolio)
        
        // if (tx.wait) await tx.wait()

        let withCredit = await gameCredits()
        withCredit = Number(withCredit) > 0 ? 1 : 0
        try {
          tx = await contract.populateTransaction.submitPortfolio(currentCompetition.category, currentCompetition.style, currentCompetition.id, currentCompetition.portfolio, withCredit)
          tx = {
            from: connector.accounts[0],
            data: tx.data,
            to: tx.to
          }
          if (localStorage.getItem('dynasty.selectedWalletProvider') === 'walletConnect') tx = await connector.signTransaction(tx)
          tx = await connector.sendTransaction(tx)
          if (tx.wait) await tx.wait()
        } catch (e) {
          alert(e)
          console.error(e);
          // alert(e)
        }
      
      
          location.hash = '#!/contests'
          this.edits += 1

        }  
      // }
  }

  render() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        width: 100%;
      }

      :host(.custom-selected) {
        pointer-events: auto !important;
      }

      .container {
        flex: 1;
        overflow-y: auto;
        width: 100%;
        height: 100%;

        box-sizing: border-box;
      }

      .footer {
        min-height: 96px;
        height: 96px;
        width:100%;
        box-sizing: border-box;
        padding: 12px 24px;
        align-items: center;
      }

      

      @media(min-width: 680px) {
        .container, :host {
          max-width: 416px !important;
        }

        .footer {
          max-width: 416px;
        }
      }
    </style>
    <flex-column class="container">
      ${map(this.items, (item, i) => html`
        <portfolio-item
        index="${i}"
        data-id="${item.id}"
        salary="${item.salary}"
        name="${item.name}"
        image="${item.image}"
        id="${item.id}"
        placeholder="${item.placeholder}"
        @click="${this.#select}">
        </portfolio-item>
      `)}
    </flex-column>
    
    <competition-bar positionsFilled="${this.positionsFilled}" positions="8" @clear="${this.#clear}"  @save="${this.#save}" @submit="${this.#enter}" ?submit-disabled="${this.submitDisabled}" edits="${this.edits}"></competition-bar>
    `
  }
})
