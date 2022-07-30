import { LitElement, html } from 'lit'
import './simple-button.js'
import './../dynasty-elements/salary'
import './../dynasty-elements/average-salary'

export default customElements.define('competition-bar', class CompetitionBar extends LitElement {
  static properties = {
    positionsFilled: {
      type: Number
    },
    positions: {
      type: Number
    },
    submitdisabled: {
      type: Boolean
    },
    edits: {
      type: Number
    }
  }
  constructor() {
    super()
  }

  #importPortfolio() {
    this.dispatchEvent(new CustomEvent('import'))
  }

  #clear() {
    this.dispatchEvent(new CustomEvent('clear'))
  }

  #save() {
    this.dispatchEvent(new CustomEvent('save'))
  }

  #submit() {
    this.dispatchEvent(new CustomEvent('submit'))
  }

  render() {
    return html`
<style>
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 8px;
    box-sizing: border-box;
    font-size: 16px;
  }

  .salary-container {
    box-sizing: border-box;
    padding: 8px 24px;
  }

  .button-container, .salary-container {
    width: 100%;
    height: 64px;
    align-items: flex-start;
  }

  strong {
    display: flex;
  }

  dynasty-average-salary, dynasty-salary {
    width: auto;
  }

  @media(min-width: 680px) {
    :host {
      max-width: 416px;
    }
  }

  :host([submit-disabled]) .submit {
    pointer-events: none !important;
    color: var(--disabled-color);
  }
</style>

<flex-row class="salary-container">
  <flex-column>
    <strong>Positions Filled ${this.positionsFilled}/${this.positions}</strong>
  </flex-column>
  <flex-one></flex-one>
  <flex-column>
    <flex-row style="align-items: center;">
      <strong style="padding-right: 6px;">Rem Salary</strong>
      <flex-one></flex-one>
      <dynasty-salary></dynasty-salary>
    </flex-row>
    <flex-row>
      <strong style="padding-right: 6px;">Avg Rem/Asset</strong>
      <dynasty-average-salary positions="${this.positionsFilled}"></dynasty-average-salary>
    </flex-row>
  </flex-column>

</flex-row>

<flex-one></flex-one>
<flex-row class="button-container">
  <simple-button @click="${this.#clear}">clear</simple-button>
  <simple-button disabled @click="${this.#importPortfolio}">import</simple-button>
  <simple-button disabled @click="${this.#save}">reserve</simple-button>
  <flex-one></flex-one>
  <simple-button class="submit" @click="${this.#submit}">${this.edits > 0 ? 'submit edit' : 'submit'}</simple-button>
</flex-row>
    `
  }
})
