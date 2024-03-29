import './../node_modules/@vandeurenglenn/flex-elements/src/flex-elements'
import Pubsub from './../node_modules/@vandeurenglenn/little-pubsub/src/index'
import './../node_modules/custom-selector/src/index'
import './../node_modules/custom-pages/src/custom-pages'
import './../node_modules/custom-svg-iconset/custom-svg-iconset'
import './../node_modules/custom-svg-icon/custom-svg-icon'

import {LitElement, html} from 'lit'

import icons from './icons/icons'
import './elements/nav-bar'
import './elements/account-menu'



globalThis.pubsub = new Pubsub()
export default customElements.define('app-shell', class AppShell extends LitElement {
  static properties = {
    selected: {
      type: String,
      value: 'home'
    },
    isDesktop: {
      reflect: true,
      type: Boolean
    }
  }
  constructor() {
    super()
    this.#loadTheme('default')
    onpopstate = this.onpopstate.bind(this)
  }

  #lastSelectedView
  #previousSelected

  async #connect() {    
    const importee = await import('./wallet/connect')
    return importee.default(this.selectedWalletProvider)    
  }

  async connectedCallback() {
    super.connectedCallback()
    // document.addEventListener('click', event => {
    //   alert(event.composedPath()[0].localName)
    // })
    const matches = matchMedia('(min-width: 1120px)')
    this.#isDesktop(matches)
    matches.addListener(this.#isDesktop.bind(this))
    document.addEventListener('accountsChange', this.#onAccountsChange.bind(this))

    onhashchange = this.onhashchange.bind(this)

    this.selectedWalletProvider = localStorage.getItem('dynasty.selectedWalletProvider')
    this.walletConnected = localStorage.getItem('dynasty.wallet-connected')

    if (this.walletConnected === 'true' && this.selectedWalletProvider !== undefined) {      
      
      await this.#connect()
      this.onhashchange()
    } else {
      globalThis.location.hash = '#!/connect'      
    }
    this.onhashchange()
  }

  #isDesktop({matches}) {
    if (matches) this.isDesktop = true
    else this.isDesktop = false
    this.requestUpdate()
  }

  get #pages() {
    return this.shadowRoot.querySelector('custom-pages')
  }

  get #navbar() {
    return this.shadowRoot.querySelector('nav-bar')
  }

  async connect() {
    // this.#pages.select('connect')
    this.lastSelected = this.#pages.selected
    location.hash = '#!/connect'
  }

  async disconnect() {
    if (globalThis.walletConnect) await walletConnect.disconnect()
    localStorage.removeItem('dynasty.selectedWalletProvider')

    localStorage.setItem('dynasty.wallet-connected', false)

    this.shadowRoot.querySelector('account-menu-element').setAttribute('account', 'undefined')
    location.hash = '#!/connect'
  }

  async #onAccountsChange({detail}) {
    this.#pages.select(this.lastSelected)
    if (Array.isArray(detail)) {
      // pubsub.subscribe("firebase.ready", () => {
      //   globalThis.userRef = firebase.ref(firebase.database, `user/${detail[0].toLowerCase()}`)
      // })
      // if (pubsub.subscribers?.["firebase.ready"]?.value) globalThis.userRef = firebase.ref(firebase.database, `user/${detail[0].toLowerCase()}`)

      localStorage.setItem('dynasty.wallet-connected', true)
      this.shadowRoot.querySelector('account-menu-element').setAttribute('account', detail[0])
      this.shadowRoot.querySelector('home-view').setAttribute('account', detail[0])
      this.shadowRoot.querySelector('account-menu-element').setAttribute('icon',
        `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/usdc.svg`
      )
      pubsub.subscribe('wallet.ready', () => {})
      pubsub.publish('wallet.ready', true)
    } else {
      // globalThis.userRef = undefined
      localStorage.setItem('dynasty.wallet-connected', false)
      this.shadowRoot.querySelector('account-menu-element').setAttribute('account', undefined)
      this.shadowRoot.querySelector('home-view').setAttribute('account', undefined)
      this.shadowRoot.querySelector('account-menu-element').setAttribute('icon',
        `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/usdc.svg`
      )
    }


  }

  onpopstate(event) {
    if (globalThis.history.state !== null) {
      location.hash = `#!/${globalThis.history.state.view}?${globalThis.history.state.query.join('&')}`
    }
  }

  async onhashchange() {
    if (!location.hash) return location.hash = '#!/home'

    let view = location.hash.split('#!/')

    view = view[1]?.split('?')
    let query = view[1]
    view = view[0]
    if (view !== this.#lastSelectedView) {
      this.#lastSelectedView = view
      this.#previousSelected = this.selected
      this.selected = view
      if (!customElements.get(`${view}-view`)) await import(`./${view}.js`)
      this.shadowRoot.querySelector('custom-pages').select(view)
      this.#navbar.select(view)
      if (view === 'live') this.#navbar.shadowRoot.querySelector('custom-selector').scroll(this.#navbar.getBoundingClientRect().width, 0)
      
    }

    if (query) {
      const items = []
      query = query.split('&')
      for (let item of query) {
        item = item.split('=')
        this.shadowRoot.querySelector(`${view}-view`)[item[0]] = decodeURIComponent(item[1])
      }
    }
    // history.pushState({view, query}, view)
  }

  async #loadTheme(theme) {
    const importee = await import(`./themes/${theme}.js`)
    for (const prop of Object.keys(importee.default)) {
      document.querySelector('body').style.setProperty(`--${prop}`, importee.default[prop])
    }
  }

  back() {
    // previousSelected
    history.back()
  }

  render() {
    return html`
    <style>

      * {
        pointer-events: none;
        color: var(--main-color);
        font-family: 'Noto Sans', sans-serif;
        overflow-y: hidden;
      }

      :host {
        position: relative;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }

      custom-svg-icon {

        --svg-icon-color: var(--main-color);
        --svg-icon-size: 32px;
        margin-right: 6px;
      }

      .top-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 54px;
        align-items: center;
        padding: 12px 24px;
        box-sizing: border-box;
      }

      .header {
        height: 54px;
        align-items: center;
        padding: 12px 24px;
        box-sizing: border-box;
      }

      .main {
        width: 100%;
        height: 100%;
        background: var(--main-background);
      }

      custom-pages {
        height: 100%;
      }

      custom-svg-icon[icon="menu"] {
        opacity: 1;
        pointer-events: auto;
        cursor: pointer;
      }

      h1, h2, h3 {
        margin: 0;
      }

      .logo {
        height: 48px;
      }

      .home-wrapper {
        background: var(--accent-color);
      }

      @media(min-width: 960px) {
        .top-header {
          justify-content: center;
        }
      }

      @media(max-height: 640px) {
        home-view {
          justify-content: initial;
        }
      }

      @media(max-width: 959px) {
        nav-bar {
          height: 54px;
        }

        [headerhidden] {
          opacity: 0;
          pointer-events: none;
          height: 0;
          padding: 0;
        }
      }


      [hidden] {
        opacity: 0;
        pointer-events: none;
        height: 0;
        padding: 0;
      }
      home-view {
        opacity: 0;
      }
      home-view[loaded] {
        opacity: 1;
      }


      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,300;0,400;0,600;0,700;0,800;1,300;1,400&display=swap');
    </style>
    ${icons}
    <flex-column class="main">
      <flex-row class="header" ?headerhidden="${this.selected === 'competition'}">
        <flex-row class="top-header">
          <h1 class="appname" ?hidden="${!this.isDesktop}">DYNASTY GAMES</h1>
        </flex-row>
        <flex-one></flex-one>
        <account-menu-element></account-menu-element>
      </flex-row>
      
      <nav-bar ?hidden="${this.selected === 'competition'}"></nav-bar>
      <custom-pages attr-for-selected="data-route">
        <home-view data-route="home">
          <span class="avatar" slot="avatar"></span>
          <balance-element class="usdc"></balance-element>
          <credit-element></credit-element>
          <balance-element class="total"></balance-element>
        </home-view>
        <games-view data-route="games"></games-view>
        <styles-view data-route="styles"></styles-view>
        <competitions-view data-route="competitions"></competitions-view>        
        <competition-list-view data-route="competition-list"></competition-list-view>
        <competition-view data-route="competition" ?is-desktop="${this.isDesktop}"></competition-view>
        <history-view data-route="history"></history-view>
        <connect-view data-route="connect"></connect-view>
        <live-view data-route="live"></live-view>
        <contests-view data-route="contests"></contests-view>
        <rankings-view data-route="rankings"></rankings-view>
        <member-rankings-view data-route="member-rankings"></member-rankings-view>
        <news-view data-route="news"></news-view>
      </custom-pages>
    </flex-column>
    `
    // <img class="logo" src="/assets/logo.png" loading="lazy"></img>
  }
})
