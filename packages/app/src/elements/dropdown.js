import { LitElement, html } from 'lit'

export default customElements.define('dropdown-element', class DropDownElement extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
    <style>
      :host {
        position: absolute;
        width: 240px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: opacity 120ms cubic-bezier(0.22, 0.36, 0.61, 1), height 160ms cubic-bezier(0.22, 0.36, 0.61, 1), width 160ms cubic-bezier(0.22, 0.36, 0.61, 1);
        // transform: scale(0);
        width: 0px;
        height: 0px;
      }

      .container {
        display: flex;
        flex-direction: column;
        max-height: 240px;
        width: 100%;
        overflow-y: auto;
      }

      :host([right]) {
        right: 12px;
      }

      :host([left]) {
        left: 12px;
      }

      :host([open]) {
        opacity: 1;
        z-index: 1000;
        width: auto;
        height: auto;
        pointer-events: auto;
        transition: opacity 120ms cubic-bezier(0.22, 0.36, 0.61, 1), height 240ms cubic-bezier(0.22, 0.36, 0.61, 1), width 240ms cubic-bezier(0.22, 0.36, 0.61, 1);
        border: 1px solid #eee;
        // transform: scale(1);
      }
    </style>

    <span class="container">
      <slot></slot>
    </span>

    <slot name="bottom"></slot>

    `
  }
})
