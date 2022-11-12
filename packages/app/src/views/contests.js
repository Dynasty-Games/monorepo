import './../elements/competition-info-item'
import {LitElement, html, css} from 'lit';
import './../elements/contest-list'


export default customElements.define('contests-view', class ContestsView extends LitElement {
  static properties = {
    items: {
      type: Array
    }
  }

  constructor() {
    super()
  }

 

  back() {
    history.back()
  }

  render() {
    return html`

    <style>
      * {
        pointer-events: none;
      }

      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .container {
        height: 100%;
        overflow-y: auto;
      }


      .drawer {
        position: absolute;
        top: 84px;
      }

      [slot="content"] {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        width: 100%;
      }

      a {
        text-decoration: none;
        color: var(--main-color);
        width: 100%;
        padding: 12px 24px;
      }

      .container {
        width: 100%;
        max-width: 640px;
      }

      competition-info-item {
        width: 100%;
      }

      h2, h4 {
        margin: 0;
        padding: 0;
      }

      .header {
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        height: 54px;
      }
      .inner-header {
        max-width: 640px;
        width: 100%;
        align-items: center;
        height: 54px;
      }

      custom-svg-icon {
        --svg-icon-color: var(--main-color);
        pointer-events: auto;
        cursor: pointer;
        padding-right: 12px;
      }
      @media(min-width: 860px) {
        .container {
          height: 80%;
        }
      }
    </style>
    <flex-row class="header">
      <flex-row class="inner-header">
        <custom-svg-icon icon="chevron-left" @click=${this.back}></custom-svg-icon>
        <h2>contests</h2>
        <flex-one></flex-one>
      </flex-row>
    </flex-row>

    <contest-list></contest-list>
    `
  }
})
