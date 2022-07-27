import './../../node_modules/custom-pages/src/custom-pages'
import {LitElement, html} from 'lit'

export default html`
<custom-pages attr-for-selected="data-route">
  <home-view data-route="home"></home-view>
</custom-pages>
`
