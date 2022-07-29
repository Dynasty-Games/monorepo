import { LitElement, html } from 'lit'

export default customElements.define('nav-bar', class NavBar extends LitElement {
  constructor() {
    super()
  }

  select(selected) {
    this.shadowRoot.querySelector('custom-selector').select(selected)
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
      }

      :host {
        height: 64px;
        border-top: 1px solid #434651;
        z-index: 1000;
        justify-content: center;
        display: flex;
      }

      custom-selector {
        height: 100%;
        max-width: 414px;
        display: flex;
        flex-direction: row;
      }

      a {
        text-decoration: none;
        color: var(--main-color);
        pointer-events: auto;
        box-sizing: border-box;
        padding: 6px 24px;
        height: 48px;
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14px;
      }

      .custom-selected {
        border: none;
        color: var(--accent-color);
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
      }

      .custom-selected custom-svg-icon {
        --svg-icon-color: var(--accent-color);
      }

    </style>
    <custom-selector attr-for-selected="data-route">
      <a href="#!/home" data-route="home">
        <custom-svg-icon icon="icons::home"></custom-svg-icon>
        home
      </a>

      <a href="#!/contests" data-route="contests">
        <custom-svg-icon icon="icons::track-changes"></custom-svg-icon>
        contests
      </a>

      <a href="#!/news" data-route="news">
        <custom-svg-icon icon="icons::news"></custom-svg-icon>
        news
      </a>

      <a href="#!/live" data-route="live">
        <custom-svg-icon icon="icons::track-changes"></custom-svg-icon>
        live
      </a>
    </custom-selector>
    `



    // <a href="#!/history" data-route="history">
    //   <custom-svg-icon icon="icons::news"></custom-svg-icon>
    //   history
    // </a>
  }
})
