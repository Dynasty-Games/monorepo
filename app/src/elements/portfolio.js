import './portfolio-item'
import './../dialogs/info'
import {html, LitElement} from 'lit'
import {map} from 'lit/directives/map.js'
import erc20 from './../data/abis/erc20'
import './competition-bar'
import addresses from '@dynasty-games/addresses/goerli.json'
import TreasuryABI from '@dynasty-games/abis/Treasury-ABI.json'
import USDDToken from '@dynasty-games/abis/USDDToken.json'

import { competitionContract } from './../api.js'

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
    this.submitDisabled = true
    console.log(connector.accounts[0]);
    let contract = await competitionContract(currentCompetition.address)
    contract = await contract.connect(connector)
    const edits = await contract.portfolioEditsCounter(connector.accounts[0])
    console.log(edits);
    this.edits = edits.toNumber()
    let i = 0
    let salary = currentCompetition.maxSalary
    const els = Array.from(this.shadowRoot.querySelectorAll(`[index]`))
    els.forEach(el => el.reset())
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

    this.positionsFilled += 1
    if (els.length === 1) this.submitDisabled = false
  }

  #save() {
    let els = Array.from(this.shadowRoot.querySelectorAll(`[index]`))
    els = els.filter(el => el.salary !== 0).map(el => el.id)
    firebase.set(
      firebase.child(globalThis.userRef, currentCompetition.address),
      els
    )
  }

  #clear() {
    this.positionsFilled = 0
    currentCompetition.portfolio = []
    pubsub.publish('load-user-portfolio', [])
    pubsub.publish('portfolio-salary-reset')
    let els = Array.from(this.shadowRoot.querySelectorAll(`[index]`))
    els.forEach(el => el.setAttribute('placeholder', 'true'));

    firebase.set(
      firebase.child(globalThis.userRef, currentCompetition.address),
      null
    )
    this.submitDisabled = true
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

  async #enter(event) { 

      let contract = await competitionContract(currentCompetition.address)

      const params = await contract.callStatic.competitionParams()
      contract = await contract.connect(connector)

      const maxEdits = params.allowEdits

      if (this.edits < maxEdits.toNumber()) {
        await this.#save()
        if (currentCompetition.portfolio.length === params.portfolioSize.toNumber()) {
          const treasury = new _ethers.Contract(addresses.Treasury, TreasuryABI, connector)
          const USDD = new _ethers.Contract(addresses.USDDToken, USDDToken, connector)
          let allowance = await USDD.allowance(connector.accounts[0], treasury.address)
          let tx
          if (Number(_ethers.utils.formatUnits(allowance)) < Number(_ethers.utils.formatUnits(params.feeDGC.toString()))) {
            tx = await USDD.approve(treasury.address, _ethers.utils.parseUnits(params.feeDGC.toString()))
            if (tx.wait) await tx.wait()
          }

          const gdc = await contracts.dynastyContest.dgcAddress()
          const gdcContract = new _ethers.Contract(gdc, erc20, connector)
          allowance = await gdcContract.allowance(connector.accounts[0], contract.address)

          if (Number(_ethers.utils.formatUnits(allowance, 0)) < params.feeDGC.toNumber()) {
            tx = await gdcContract.approve(contract.address, params.feeDGC.toNumber())
            if (tx.wait) await tx.wait()
          }

          const balance = await gdcContract.balanceOf(connector.accounts[0])
          if (Number(_ethers.utils.formatUnits(balance)) < params.feeDGC.toNumber()) {
            tx = await treasury.deposit(_ethers.utils.parseUnits(params.feeDGC.toString()))
            if (tx.wait) await tx.wait()
          }

          
          const snap = await firebase.get(firebase.ref(firebase.database, `competitions/${currentCompetition.address.toLowerCase()}/${connector.accounts[0].toLowerCase()}`))
          const exists = await snap.exists()
          if (!exists) {
          // if (this.edits === 0) {
            tx = await contract.register_submit(currentCompetition.portfolio, {gasLimit: 21000000})
          } else {
            tx = await contract.editPortfolio(currentCompetition.portfolio, {gasLimit: 21000000})
          }
          
          if (tx.wait) await tx.wait()

          location.hash = '#!/contests'
          this.edits += 1
          // let tx = await contract.populateTransaction.submitPortfolio([els])
          try {
            // tx = {
            //   from: connector.accounts[0],
            //   data: tx.data,
            //   to: tx.to
            // }
            // if (localStorage.getItem('dynasty.selectedWalletProvider') === 'walletConnect') tx = await connector.signTransaction(tx)
            // tx = await connector.sendTransaction(tx)
            // if (tx.wait) await tx.wait()
          } catch (e) {
            alert(e)
            console.error(e);
            // alert(e)
          }
      
      

        }  }
  }

  render() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        background: #000;
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
