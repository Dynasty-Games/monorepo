import { LitElement, html } from 'lit'
import { scrollbar } from '../shared/styles'

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
      ${scrollbar}

      :host {
        height: 88px;
        z-index: 1000;
        justify-content: center;
        display: flex;
        padding-top: 24px;
      }

      custom-selector {
        height: 100%;
        max-width: 620px;
        width: 100%;        
        padding: 0 12px;
        display: flex;
        flex-direction: row;
        
        pointer-events: auto;
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
        flex-direction: row;
        align-items: center;
        font-size: 14px;
        border-radius: 24px;
      }

      .custom-selected {
        border: none;
        background: #3663ed;
      }

      custom-svg-icon {
        pointer-events: none;
        --svg-icon-color: var(--main-color);
        padding-right: 6px;
      }

      @media (max-width: 540px) {
        custom-selector {
          overflow-x: scroll;
        }

        a {
          padding: 6px 12px;
          height: 34px;
        }
      }
      

    </style>
    <custom-selector attr-for-selected="data-route">
      <a href="#!/home" data-route="home">
        <custom-svg-icon icon="icons::home"></custom-svg-icon>
        home
      </a>

      <a href="#!/games" data-route="games">
        <custom-svg-icon icon="icons::games"></custom-svg-icon>
        games
      </a>

      <flex-one></flex-one>

      <a href="#!/contests" data-route="contests">
        <custom-svg-icon icon="icons::track-changes"></custom-svg-icon>
        contests
      </a>

      <flex-one></flex-one>

      <a href="#!/news" data-route="news">
        <custom-svg-icon icon="icons::news"></custom-svg-icon>
        news
      </a>

      <flex-one></flex-one>

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
