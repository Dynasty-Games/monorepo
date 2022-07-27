import {LitElement, html} from 'lit'
import './../animations/busy'
export default customElements.define('custom-dialog', class CustomDialog extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        transition: transform 120ms ease-out;
        pointer-events: auto;
        opacity: 1;
        position: absolute;

        background: var(--secondary-background-color);
        max-width: 480px;
        width: 100%;
        height: 256px;
        border-radius: 48px;
        box-shadow: 0 0 7px 9px #00000012;
        overflow: hidden;
        justify-content: center;
        align-items: center;
      }


      .busy-container {
        position: absolute;
        max-width: 480px;
        width: 100%;
        height: 256px;
        justify-content: center;
        align-items: center;
        background: var(--secondary-background-color);
        opacity: 0;
        pointer-events: none;
      }

      :host([busy]) .busy-container {
        opacity: 1;
      }

      :host([busy]) {
        pointer-events: none;
      }
    </style>

    <flex-column class="busy-container">
      <h4>Sending funds!</h4>
      <busy-animation></busy-animation>
    </flex-column>
    <slot></slot>
    `
  }
})
