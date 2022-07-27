import { LitElement, html } from 'lit'

export default customElements.define('news-view', class NewsView extends LitElement {
  constructor() {
    super()
  }

  render() {
    return html`
    <style>
      * {
        pointer-events: none;
      }

      :host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      iframe {
        pointer-events: auto;
        max-width: 960px;
      }
    </style>
    <iframe scrolling="no" allowtransparency="true" frameborder="0" src="https://s.tradingview.com/embed-widget/timeline/?locale=en&amp;market=crypto#%7B%22market%22%3A%22crypto%22%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22regular%22%2C%22width%22%3A980%2C%22height%22%3A830%2C%22utm_source%22%3A%22dynastyweb.azurewebsites.net%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22timeline%22%7D" style="box-sizing: border-box; height: 100%; width: 100%;" lazy-load></iframe>
    `
  }
})
