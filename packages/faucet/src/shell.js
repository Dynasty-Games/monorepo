import './../node_modules/@vandeurenglenn/flex-elements/src/flex-elements'
import icons from './ui/icons'
import pages from './ui/pages'
import {LitElement, html} from 'lit'


export default customElements.define('faucet-shell', class FaucetShell extends LitElement {
  get _pages() {
    return this.shadowRoot.querySelector('custom-pages')
  }
  constructor() {
    super()
  }

  connectedCallback() {
    super.connectedCallback()
    this.setTheme('default')
    this._select('home')
  }

  async _select(selected) {
    !await customElements.get(`${selected}-view`) && await import(`./${selected}.js`)
    this._previousSelected = this._pages.selected
    this._pages.select(selected)
  }

  async setTheme(theme) {
    const importee = await import(`./themes/${theme}.js`)
    for (const prop of Object.keys(importee.default)) {
      document.querySelector('body').style.setProperty(`--${prop}`, importee.default[prop])
    }
  }

  render() {
    return html`
<style>
  * {
    user-select: none;
    pointer-events: none;
  }
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--main-background-color);
  }

  .logo {
    height: 32px;
    width: 32px;
    padding: 12px;
  }
</style>
${icons}
<flex-row center>
  <img class="logo" src="https://dynastycontests.web.app/assets/logo.png"></img>
</flex-row>
${pages}
    `
  }
})
