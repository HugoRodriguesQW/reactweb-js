(()=>{"use strict";const t={C100:"Multiple controllers not supported",C102:"required: targetName to create controller",C104:"required: target to create controller not found:",H100:"fail: not found component using id:",H102:"callback need be a function",H104:"variable can't sensible to effect:"};function e(e,n){const r=t[e];return new Error(`${e}: ${r} (${n}) > ${(new Error).stack}`)}class n{static clone=t=>JSON.parse(JSON.stringify(t));static Sop=t=>t.slice(1,t.length-1);static rex={html:/<([^<>]+)(?:>([^]*?)<\/\1>|\/>)/g};static traceOrigin=t=>t.replaceAll("\n"," ").replaceAll("Object.","").split(" ").find((t=>Object.keys(window.components).includes(t)));static strPop(t){return t.split("").pop()}static Fetch(t,e){return new Promise(((n,r)=>{fetch(t).then((t=>t[e]())).then((t=>n(t))).catch((t=>r(t)))}))}static slicep=(t,e,n)=>t.slice(e,t.length+n);static groupMessage(t,e){console.groupCollapsed(t,e);const n=()=>console.groupEnd(t),r=(t,e)=>(t.forEach((t=>{console[e||"info"]?.(t)})),{send:r,close:n});return{send:r,close:n}}}const r=[];function o(t,e,n){const r=s("c"),[o,i]=function(t,e){const n=function(t){const e=t.toString(),n=e.matchAll(/const\s*\[([\w\d]+)\s*,\s*(\w+)\]\s*=\s*useHook\(/g),r=[];for(const[t,e,o]of n)r.push({name:e,setter:o,call:t});return r}(t);let r=t.toString();n.length&&n.map((t=>{[t.name,t.setter].map((t=>{const n=new RegExp(`\\b${t}\\b`,"g");r=r.replace(n,(n=>`${t}_${e}c`))})),t.original={name:t.name,setter:t.setter},t.name=`${t.name}_${e}c`,t.setter=`${t.setter}_${e}c`,t.contextId=e}));return[new Function(`return ${r}`)(),n]}(t,r);return i.map((t=>(window.hookCalls[e]=[...window.hookCalls[e]||[],t],window.uses[r]=i,t))),o.contextId=r,o}function s(t,e){const n=`${t||""}${(new Date).getTime().toString(36)}${Math.random().toString(36).slice(2)}${e||""}`;return r.includes(n)?s(t,e):(r.push(n),n)}function i(t){const e=[],n=[];let r="",o=!1,s=!1,i=0;for(let c=0;c<t.length;c++){const a=t[c],l=t[c+1];if('"'===a&&"\\"!==t[c-1])o=!o;else if("<"!==a||"/"===l||o)if(">"!==a||o)if("{"!==a||o||s){if("}"===a&&!o&&!s&&0===i){const o=n.pop();if(void 0!==o&&0===n.length){const n=o-1,s=c+1;r=t.substring(n,s).trim(),e.push({expression:r,start:n,end:s}),r=""}}}else 0===i&&n.push(c);else s=!1;else s=!0,i++;0!==n.length||o||s||(r+=a),"<"===a&&"/"===l&&i--}return e.map((t=>t.expression))}function c(t){const e=[];let n=0;for(;n<t.length;){const r=t.indexOf("<",n);if(-1===r)break;const o=t.indexOf(">",r);if(-1===o)break;const s=r+1,i=Math.min(t.indexOf(" ",s),o),c=t.slice(s,i).trim(),a=`<${c}`,l=`</${c}>`;let u=o;if(i!==o){const e=t.indexOf(" ",s);-1!==e&&e<o&&(u=e)}let m=1,p=o;for(;m>0;){const e=t.indexOf(a,p),n=t.indexOf(l,p);if(-1===n)break;-1!==e&&e<n?(m++,p=e+a.length):(m--,p=n+l.length)}if(0!==m)break;{const o=t.slice(r,p+1);e.push(o),n=p+1}}return 0===e.length&&t.trim().startsWith("<")&&e.push(t.trim()),e}p({propagate:function(t){window.hookCalls||(window.hookCalls={}),window.components||(window.components={}),window.uses||(window.uses={});const e=s("comp_"),r=n=>o(t,e,n);r.componentId=e,Object.assign(window.components,{[t.name.toUpperCase()]:r}),window.componentsSize=window.componentsSize-1,n.groupMessage(t.name.toUpperCase(),"Propagating app function").send([t,{origin,ready:r}]).close()},extractParentExpressions:i,contextnize:o});class a{constructor(t){this._source=t}run(){const t=this.preserveChars(a.preserveHtml(n.Sop(this._source)));return new Function(`return ${t}`)()}static preserveHtml(t){return c(t).forEach((e=>{t=t.replace(e,`Expression.restoreHtml(\`${e}\`)`)})),t}static mapHookUse(t){return t=a.removeHtml(t),u.hooks.filter((e=>t.includes(`${e.name}(`)))}static removeHtml(t){return c(n.Sop(t)).forEach((e=>{t=t.replace(e,"")})),t}preserveChars(t){return t.replaceAll("&gt;",">").replaceAll("&lt;","<").replace(/\s+/g," ")}static preseveSymbol(t){return t.replaceAll("&gt;",">").replaceAll("&lt;","<")}static restoreHtml(t){return t}}Object.assign(window,{Expression:a});class l{constructor(t){this.outer=t}render(){return document.createRange().createContextualFragment(`<wrap>${this.outer}</wrap>`).firstChild.innerHTML}static mapAttributes(t){return Object.fromEntries(Object.values(t||[]).map((t=>[t.name,t.value])))}static removeAttributes(t){return Array.from(t.attributes).forEach((e=>{t.removeAttribute(e.name)})),t}static addAttributes(t,e){return e.forEach((e=>{t.setAttribute(e.name,e.value)})),t}static replaceAttributes(t,e){return this.addAttributes(this.removeAttributes(t),e)}static ProcessAttributes(t,e){const n=Array.from(t.attributes),r=n.map((t=>t.value)),o=[];return n.filter((t=>"_"===t.name)).map((e=>{t.removeAttribute(e.name);const n=new a(e.value).run();"object"==typeof n&&Object.entries(n).forEach((([e,n])=>{t.setAttribute(e,n)}))})),e.mapHookUse&&a.mapHookUse(r.join(" ")).forEach((t=>{o.push(t)})),Array.from(t.attributes).map((({name:e,value:n})=>{i(n).map((n=>{t.setAttribute(e,t.getAttribute(e).replace(n,new a(n).run()))}))})),{attributes:Array.from(t.attributes),hooksInUse:o}}}class u{static hooks=[];constructor(t,e,r){this._value=n.clone(r),this._listeners=[],this._effects=[],this.name=t,this.setterName=e,u.hooks.push(this)}write(t){this._value=n.clone(t),this.onchange()}read(){return n.clone(this._value)}onchange(){this.updateAsAttribute(this._listeners.filter((([t,e,n])=>"attribute"===n))),this.updateAsComponent(this._listeners.filter((([t,e,n])=>"component"===n))),this._effects.map((t=>{t()}))}updateAsComponent(t){t.map((t=>{let[e,n]=t;if(!document.body.contains(e)){if(console.warn("listener not found:",{listener:e,id:e.id}),e=document.getElementById(e.id),!e)return;console.log("listener retrieved from document!"),t[0]=e}Array.from(e.querySelectorAll("ho")).map((e=>(n=n.replace(e.originExpB,e.resultExp),t[1]=n,{origin:e.originExp,originB:e.originExpB,result:e.resultExp,exp:n}))),e.innerHTML=new a(n).run(),window.controller.traverseElements(e.children,{parseFunctions:!1});return Array.from(e.querySelectorAll("*")).filter((t=>window.controller.isFunctionComponent(t))).filter((t=>t.hasAttribute("funcoref"))).map((t=>t.replaceWith(window.parsedComponents[t.getAttribute("funcoref")]))),e})).filter((t=>t))}updateAsAttribute(t){t.map((([t,e])=>{l.replaceAttributes(t,e),l.ProcessAttributes(t,{mapHookUse:!1})}))}addListener(t){this._listeners.push(t)}addEffect(t){this._effects.push(t)}}function m(t,e){t.filter(((e,n)=>t.indexOf(e)===n)).forEach((t=>{t.addListener(e)}))}function p(t){Object.assign(window,t)}p({useHook:function(t){const r=n.traceOrigin((new Error).stack),o=window.components[r]?.componentId;if(!o)throw e("H100",o);const{name:s,setter:i,contextId:c}=window.hookCalls[o].shift(),a=new u(s,i,t);return window[s]=()=>a.read(),window[i]=t=>a.write(t),window[s].origin={contextId:c,componentId:o,name:s,setter:i},window[i].origin={contextId:c,componentId:o,name:s,setter:i},[window[s],window[i]]},useEffect:function(t,n){if("function"!=typeof t)throw e("H102");if(!n?.length)return document.addEventListener("traverseCompleted",t);n.map((n=>{const r=u.hooks.find((t=>t.name===n.origin?.name));if(!r)return console.error(e("H104",n));r.addEffect(t)}))},Hook:u,useGlobal:p});class d{static contexts=[];constructor(t,e,n,r){this.alias=t,this.params=e,this.contextId=n,this.componentName=r,d.contexts.push(this)}static createContext(t,e){const{componentId:n,contextId:r}=Object.values(e).find((t=>t.origin))?.origin;if(!n||!r)throw new Error("context creation failed: missing reference. "+(new Error).stack);const o=Object.keys(window.components).find((t=>window.components[t].componentId===n)),s=window.uses[r],i=d.mapVariableNames(e,s);new d(t,i,r,o);return h(t)}static mapVariableNames(t,e){return Object.fromEntries(Object.entries(t).map((([t,n])=>{const r=e.find((e=>[e.name,e.setter].includes(t)))||{};r.contextId||(Object.assign(r,this.createOriginFor(n).with(e)),t=r.name);const o=r.original[["name","setter"].find((e=>r[e]===t))];return n.link=e=>new Function(`return \`{${t}(${d.parseFunction(e)})}\``)(),n.call=e=>new Function(`return \`${t}(${d.parseFunction(e)})\``)(),[o,n]})))}static createOriginFor(t){return{with:e=>{const{contextId:n}=e.find((t=>t.contextId))||this.randomOrigin(),r=t.name,o=`${t.name}_${n}c`;return p({[o]:t}),{contextId:n,name:o,original:{name:r}}}}}static randomOrigin(){return{contextId:s("cr"),componentId:s("virtual_component")}}static parseFunction(t){if(!t)return"";try{const e=JSON.stringify(t).replace(/"([^"]+)"\s*:\s*"(\d+)"/g,'"$1": $2');return JSON.parse(e)}catch(t){return""}}static useContext(t){const e=d.contexts.findLast((e=>e.alias===t));if(!e)throw new Error(`context not found: ${t}`);return e.params}static findParentByTagName(t,e){e=e.toUpperCase()}}const f=d.createContext,h=d.useContext;p({createContext:f,useContext:h,Context:d});class w{static defaultsConfigs={fragment:!0,identifier:"HO"};static defaultParserConfig={parseFunctions:!0};constructor(t,n){if(window.controller)throw e("C100");if(!t)throw e("C102");if(this.target=document.getElementsByTagName(t)[0],!this.target)throw e("C104",t);this.config={...w.defaultsConfigs,...n},this.doc}async build(){!async function(t){const e=Array.from(document.getElementsByTagName(t));window.componentsSize=e.length;const r=e.map((async t=>{const e=t.getAttribute("src");if(e)try{const r=await n.Fetch(e,"text");t.innerHTML=r}catch(t){console.error(`Error importing component: ${e}`,t)}const r=document.createElement("script");r.type="module",r.async=!0,r.innerHTML=`\n      ${a.preseveSymbol(a.preserveHtml(t.innerHTML))}`,document.head.appendChild(r),t.innerHTML=""}));await Promise.all(r)}("component"),this.doc=await this.createFragment()||this.target;const t=this.doc.children;this.waitContentLoad().then((()=>this.traverseElements(t,{}).then((()=>{this.config.fragment&&this.target.replaceWith(this.doc.firstChild),console.timeEnd("TIME")}))))}async createFragment(){if(!this.config.fragment)return;const t=document.createRange().createContextualFragment(this.target.outerHTML);return this.target.innerHTML="",t}async traverseElements(t,e){await Promise.all(Array.from(t).map((async t=>{switch(!1!==e?.parseFunctions&&Array.from(t.querySelectorAll(":scope > *:not([funcoref])")).filter((t=>this.isFunctionComponent(t))).forEach((t=>{const e=s("funcoref");t.setAttribute("funcoref",e)})),t.tagName){case this.config.identifier:break;case this.isFunctionComponent(t):!1!==e?.parseFunctions&&this.parseFunctionComponent(t);default:this.parseExpressionsAndMapHooks(t)}this.CheckChildrenAlso(t,e)})))}isFunctionComponent(t){return"_"===n.strPop(t.tagName)&&t.tagName}parseFunctionComponent(t){const e=n.slicep(t.tagName,0,-1).toUpperCase(),r=window.components[e](),o={...l.mapAttributes(t.attributes),children:t.innerHTML};t.innerHTML=r(o),t.innerHTML=new l(t.innerHTML).render(),t.setAttribute("context",r.contextId),window.parsedComponents||(window.parsedComponents={}),window.parsedComponents[t.getAttribute("funcoref")]=t}CheckChildrenAlso(t,e){if(t.children.length)return g.traverseElements(t.children,e)}waitContentLoad(){return new Promise(((t,e)=>{!function e(){if(0===window.componentsSize)return t();setTimeout(e,5)}(),setTimeout((()=>{e("timeout")}),3e4)}))}parseExpressionsAndMapHooks(t){const e=t.outerHTML,n=this.config.fragment?this.doc:document,r=i(t.innerHTML),o=function(t){return Array.from(t.attributes).map((({name:t,value:e})=>({name:t,value:e})))}(t),{hooksInUse:c}=l.ProcessAttributes(t,{mapHookUse:!0}),u=t.outerHTML;m(c,[t,o,"attribute"]),r.map((r=>{const o=s("ho","cpa"),i=a.mapHookUse(r),c=!!i.length,l=new a(r).run();if(!c)return this.replaceElementInner(t,r,l);this.replaceElementInner(t,r,`<ho id=${o}></ho>`);const p=n.getElementById(o);p.innerHTML=l,p.originExp=u,p.originExpB=e,p.resultExp=t.outerHTML,m(i,[p,r,"component"])}))}replaceElementInner(t,e,n){t.innerHTML=t.innerHTML.replace(e,n)}}console.time("TIME");const g=new w("hook-dom",{fragment:!1});g.build(),p({controller:g})})();