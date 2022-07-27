import { LitElement, html } from 'lit'

export default customElements.define('dynasty-salary', class DynastySalary extends LitElement {
  static properties = {
    max: {
      type: Number
    },
    value: {
      type: Number
    }
  }

  constructor() {
    super()
    this.max = Number(this.getAttribute('max')) || 50000
    this.value = this.max
    pubsub.subscribe('portfolio-item-selected', this.#itemSelected.bind(this))
    pubsub.subscribe('portfolio-item-removed', this.#itemRemoved.bind(this))
    pubsub.subscribe('portfolio-salary-reset', this.#reset.bind(this))
  }

  #itemSelected(detail) {
    this.value -= detail.salary
    this.#updateSalary()
  }

  #itemRemoved(detail) {
    this.value += detail.salary
    this.#updateSalary()
  }

  #reset() {
    this.value = this.max
    this.#updateSalary()
  }

  #updateSalary() {
    if (this.value < 0) {
      this.style.color = 'red'
    } else {
      this.style.color = 'green'
    }
    pubsub.publish('portfolio-salary', this.value)
  }

  reset() {
    this.value = this.max
    this.style.color = 'green'
  }

  render() {
    return html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    color: green;
  }

</style>

${Number(this.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')}
    `
  }
})
