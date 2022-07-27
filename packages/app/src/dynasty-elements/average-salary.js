import { LitElement, html } from 'lit'

export default customElements.define('dynasty-average-salary', class DynastyAverageSalary extends LitElement {
  static properties = {
    max: {
      type: Number
    },
    positions: {
      type: Number
    },
    value: {
      type: Number
    },
    positionsFilled: {
      type: Number
    }
  }

  constructor() {
    super()
    this.max = Number(this.getAttribute('max')) || 50000
    this.positions = Number(this.getAttribute('positions')) || 8
    this.value = this.max / this.positions

    pubsub.subscribe('portfolio-salary', this.#updateSalary.bind(this))
  }

  #updateSalary(detail) {
    this.calculate(detail, currentCompetition.portfolio.length)
  }

  calculate(salary, positions) {
    if (positions === 0) {
      this.value = this.max /  8 - positions
    } else if (positions === 7) {
      this.value = salary
    } else if (positions === 8) {
      this.value = '-'
    } else {
      this.value = salary / (8 - positions)
    }

    if (this.value < 0) this.style.color = 'red'
    else this.style.color = 'green'
  }

  reset() {
    this.style.color = 'green'
    this.value = this.max / 8
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

${this.value === '-' ? '-' : Number(this.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '')}
    `
  }
})
