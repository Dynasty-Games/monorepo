import{$ as e,s as t}from"./lit-element-a17b94b5.js";customElements.define("flex-column",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        display: flex;\n        flex-direction: column;\n      }      \n    </style>\n    <slot></slot>\n    "}}),customElements.define("flex-row",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        display: flex;\n        flex-direction: row;\n      }      \n    </style>\n    <slot></slot>\n    "}}),customElements.define("flex-one",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        flex: 1;\n      }\n    </style>\n    \n    <slot></slot>"}}),customElements.define("flex-two",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        flex: 2;\n      }\n    </style>\n    \n    <slot></slot>"}}),customElements.define("flex-three",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        flex: 3;\n      }\n    </style>\n    \n    <slot></slot>"}}),customElements.define("flex-four",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        flex: 4;\n      }\n    </style>\n    \n    <slot></slot>"}}),customElements.define("flex-wrap-around",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        display: flex;\n        flex-flow: row wrap;\n        justify-content: space-around;\n      }      \n    </style>\n    <slot></slot>\n    "}}),customElements.define("flex-wrap-evenly",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        display: flex;\n        flex-flow: row wrap;\n        justify-content: space-evenly;\n      }      \n    </style>\n    <slot></slot>\n    "}}),customElements.define("flex-wrap-between",class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.template}get template(){return"<style>\n      :host {\n        display: flex;\n        flex-flow: row wrap;\n        justify-content: space-between;\n      }      \n    </style>\n    <slot></slot>\n    "}}),((e=HTMLElement)=>{window.svgIconset=window.svgIconset||{},customElements.define("custom-svg-iconset",class extends e{static get observedAttributes(){return["name","theme","size"]}constructor(){super()}connectedCallback(){this.hasAttribute("name")||(this.name=this.name),this.style.display="none"}get name(){return this._name||"icons"}get theme(){return this._theme||"light"}get size(){return this._size||24}set name(e){this._name!==e&&(this._name=e,window.svgIconset[e]={host:this,theme:this.theme},window.dispatchEvent(new CustomEvent("svg-iconset-update")),window.dispatchEvent(new CustomEvent("svg-iconset-added",{detail:e})))}set theme(e){this._theme!==e&&this.name&&(window.svgIconset[this.name]={host:this,theme:e},window.dispatchEvent(new CustomEvent("svg-iconset-update"))),this._theme=e}set size(e){this._size=e}attributeChangedCallback(e,t,s){t!==s&&(this[e]=s)}applyIcon(e,t){e=e.shadowRoot||e,this.removeIcon(e),this._cloneIcon(t).then((t=>{e.insertBefore(t,e.childNodes[0]),e._iconSetIcon=t}))}removeIcon(e){(e=e.shadowRoot||e)._iconSetIcon&&(e.removeChild(e._iconSetIcon),e._iconSetIcon=null)}_cloneIcon(e){return new Promise(((t,s)=>{try{this._icons=this._icons||this._createIconMap(),t(this._prepareSvgClone(this._icons[e],this.size))}catch(e){s(e)}}))}_createIconMap(){var e=Object.create(null);return this.querySelectorAll("[id]").forEach((t=>{e[t.id]=t})),e}_prepareSvgClone(e,t){if(e){var s=e.cloneNode(!0),n=document.createElementNS("http://www.w3.org/2000/svg","svg"),o=s.getAttribute("viewBox")||"0 0 "+t+" "+t;return n.setAttribute("viewBox",o),n.setAttribute("preserveAspectRatio","xMidYMid meet"),n.style.cssText="pointer-events: none; display: block; width: 100%; height: 100%;",n.appendChild(s).removeAttribute("id"),n}return null}})})(),((e=HTMLElement)=>{customElements.define("custom-svg-icon",class extends e{static get observedAttributes(){return["icon"]}get iconset(){return window.svgIconset}set iconset(e){window.iconset=e}set icon(e){this.icon!==e&&(this._icon=e,this.__iconChanged__({value:e}))}get icon(){return this._icon}get template(){return"\n        <style>\n          :host {\n            width: var(--svg-icon-size, 24px);\n            height: var(--svg-icon-size, 24px);\n            display: inline-flex;\n            display: -ms-inline-flexbox;\n            display: -webkit-inline-flex;\n            display: inline-flex;\n            -ms-flex-align: center;\n            -webkit-align-items: center;\n            align-items: center;\n            -ms-flex-pack: center;\n            -webkit-justify-content: center;\n            justify-content: center;\n            position: relative;\n            vertical-align: middle;\n            fill: var(--svg-icon-color, #111);\n            stroke: var(--svg-icon-stroke, none);\n          }\n        </style>\n      "}constructor(){super(),this.attachShadow({mode:"open"}),this._onIconsetReady=this._onIconsetReady.bind(this)}render(){this.shadowRoot.innerHTML=this.template}connectedCallback(){this.icon=this.getAttribute("icon")||null,super.render||this.render()}_onIconsetReady(){window.removeEventListener("svg-iconset-added",this._onIconsetReady),this.__iconChanged__({value:this.icon})}__iconChanged__(e){if(this.iconset){if(e.value&&this.iconset){let t=e.value.split("::");1===t.length?this.iconset.icons.host.applyIcon(this,e.value):this.iconset[t[0]]&&this.iconset[t[0]].host.applyIcon(this,t[1])}else if(!e.value&&this.iconset&&this._icon){let e=this._icon.split("::");1===e.length?this.iconset.icons.host.removeIcon(this):this.iconset[e[0]].host.removeIcon(this)}this.iconset=this.iconset}else window.addEventListener("svg-iconset-added",this._onIconsetReady)}attributeChangedCallback(e,t,s){t!==s&&(this[e]=s)}})})();var s=e`<custom-svg-iconset><svg><defs><g id="add"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></g><g id="clear"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g><g id="done"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></g><g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g></defs></svg></custom-svg-iconset>`;window.Backed=window.Backed||{},window.Backed.PropertyStore=window.Backed.PropertyStore||new Map;var n=e=>class extends e{static get observedAttributes(){return Object.entries(this.properties).map((e=>e[1].reflect?e[0]:null))}get properties(){return customElements.get(this.localName).properties}constructor(){if(super(),this.properties)for(const e of Object.entries(this.properties))e[1],this.defineProperty(e[0],e[1])}connectedCallback(){if(super.connectedCallback&&super.connectedCallback(),this.attributes)for(const e of this.attributes)if(String(e.name).includes("on-")){const t=e.value,s=e.name.replace("on-","");this.addEventListener(String(s),(e=>{let s=e.path[0];for(;!s.host;)s=s.parentNode;s.host[t]&&s.host[t](e)}))}}attributeChangedCallback(e,t,s){this[e]=s}defineProperty(e=null,{strict:t=!1,observer:s,reflect:n=!1,renderer:o,value:i}){Object.defineProperty(this,e,{set(t){if(t!==this[`___${e}`]&&(this[`___${e}`]=t,n&&(t?this.setAttribute(e,String(t)):this.removeAttribute(e)),s&&(s in this?this[s]():console.warn(`observer::${s} undefined`)),o)){const s={};s[e]=t,o in this?this.render(s,this[o]):console.warn(`renderer::${o} undefined`)}},get(){return this[`___${e}`]},configurable:!t});const r=this.getAttribute(e);this[e]=r||this.hasAttribute(e)||i}},o=e=>class extends(n(e)){static get properties(){return((e={},t={})=>{for(const s of Object.keys(e))t[s]&&Object.assign(e[s],t[s]);for(const s of Object.keys(t))e[s]||(e[s]=t[s]);return e})(super.properties,{selected:{value:0,observer:"__selectedObserver__"}})}constructor(){super()}get slotted(){return this.shadowRoot?this.shadowRoot.querySelector("slot"):this}get _assignedNodes(){const e="assignedNodes"in this.slotted?this.slotted.assignedNodes():this.children,t=[];for(var s=0;s<e.length;s++){const n=e[s];1===n.nodeType&&t.push(n)}return t}get attrForSelected(){return this.getAttribute("attr-for-selected")||"name"}set attrForSelected(e){this.setAttribute("attr-for-selected",e)}attributeChangedCallback(e,t,s){t!==s&&(isNaN(s)||(s=Number(s)),this[e]=s)}select(e){e&&(this.selected=e),this.multi&&this.__selectedObserver__()}next(e){const t=this.getIndexFor(this.currentSelected);-1!==t&&t>=0&&this._assignedNodes.length>t&&t+1<=this._assignedNodes.length-1&&(this.selected=this._assignedNodes[t+1])}previous(){const e=this.getIndexFor(this.currentSelected);-1!==e&&e>=0&&this._assignedNodes.length>e&&e-1>=0&&(this.selected=this._assignedNodes[e-1])}getIndexFor(e){return e&&e instanceof HTMLElement==!1?console.error(`${e} is not an instanceof HTMLElement`):this._assignedNodes.indexOf(e||this.selected)}_updateSelected(e){e.classList.add("custom-selected"),this.currentSelected&&this.currentSelected!==e&&this.currentSelected.classList.remove("custom-selected"),this.currentSelected=e}__selectedObserver__(e){const t=typeof this.selected;if(Array.isArray(this.selected))for(const e of this._assignedNodes)1===e.nodeType&&(-1!==this.selected.indexOf(e.getAttribute(this.attrForSelected))?e.classList.add("custom-selected"):e.classList.remove("custom-selected"));else{if("object"===t)return this._updateSelected(this.selected);if("string"===t){for(const e of this._assignedNodes)if(1===e.nodeType&&e.getAttribute(this.attrForSelected)===this.selected)return this._updateSelected(e)}else{const e=this._assignedNodes[this.selected];e&&1===e.nodeType&&this._updateSelected(e)}}}};class i extends(o(HTMLElement)){constructor(){super(),this.slotchange=this.slotchange.bind(this),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style>\n        :host {\n          flex: 1;\n          position: relative;\n          --primary-background-color: #ECEFF1;\n          overflow: hidden;\n        }\n        ::slotted(*) {\n          display: flex;\n          position: absolute;\n          opacity: 0;\n          pointer-events: none;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          transition: transform ease-out 160ms, opacity ease-out 60ms;\n          /*transform: scale(0.5);*/\n          transform-origin: left;\n        }\n        ::slotted(.animate-up) {\n          transform: translateY(-120%);\n        }\n        ::slotted(.animate-down) {\n          transform: translateY(120%);\n        }\n        ::slotted(.custom-selected) {\n          opacity: 1;\n          pointer-events: auto;\n          transform: translateY(0);\n          transition: transform ease-in 160ms, opacity ease-in 320ms;\n          max-height: 100%;\n          max-width: 100%;\n        }\n      </style>\n      \x3c!-- TODO: scale animation, ace doesn\'t resize that well ... --\x3e\n      <div class="wrapper">\n        <slot></slot>\n      </div>\n    '}connectedCallback(){super.connectedCallback(),this.shadowRoot.querySelector("slot").addEventListener("slotchange",this.slotchange)}isEvenNumber(e){return Boolean(e%2==0)}slotchange(){let e=0;for(const t of this.slotted.assignedNodes())t&&1===t.nodeType&&(t.style.zIndex=99-e,this.isEvenNumber(e++)?t.classList.add("animate-down"):t.classList.add("animate-up"),this.dispatchEvent(new CustomEvent("child-change",{detail:t})))}}customElements.define("custom-pages",i);var r=e`<custom-pages attr-for-selected="data-route"><home-view data-route="home"></home-view></custom-pages>`,a=customElements.define("faucet-shell",class extends t{get _pages(){return this.shadowRoot.querySelector("custom-pages")}constructor(){super()}connectedCallback(){super.connectedCallback(),this.setTheme("default"),this._select("home")}async _select(e){!await customElements.get(`${e}-view`)&&await import(`./${e}.js`),this._previousSelected=this._pages.selected,this._pages.select(e)}async setTheme(e){const t=await import(`./themes/${e}.js`);for(const e of Object.keys(t.default))document.querySelector("body").style.setProperty(`--${e}`,t.default[e])}render(){return e`<style>*{user-select:none;pointer-events:none}:host{display:flex;flex-direction:column;height:100%;width:100%;background:var(--main-background-color)}.logo{height:32px;width:32px;padding:12px}</style>${s}<flex-row center><img class="logo" src="https://dynastycontests.web.app/assets/logo.png"></flex-row>${r}`}});export{a as default};