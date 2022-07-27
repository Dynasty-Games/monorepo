import { LitElement, html } from 'lit'

export default customElements.define('simple-button', class SimpleButton extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
<style>
  :host {
    height: 48px;
    justify-content: center;
    align-items: center;
    display: flex;
    pointer-events: auto;
    cursor: pointer;
    padding: 12px;
    box-sizing: border-box;
    color: var(--accent-color);

    text-transform: uppercase;
  }

  :host([disabled]) {
    color: var(--disabled-color);
    pointer-events: none;
  }
</style>

<slot></slot>
    `
  }
})
