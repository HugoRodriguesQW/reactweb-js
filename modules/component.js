import { Expression } from "./expression.js";
import { extractNestedElements, extractParentExpressions } from "./module.js";
import { Util } from "./utility.js";

export class Component {

  constructor (outerHTML) {
    this.outer = outerHTML
  }

  render() {
    const range = document.createRange();
    const fragment = range.createContextualFragment(`<wrap>${this.outer}</wrap>`);

    return fragment.firstChild.innerHTML;
  }

  static mapAttributes(attributes) {
    return Object.fromEntries(
      Object.values(attributes || []).map((attr) => [attr.name, attr.value])
    );
  }

  static removeAttributes(component) {
    Array.from(component.attributes).forEach((attr) => {
      component.removeAttribute(attr.name)
    })
    return component
  }

  static addAttributes(component, attributes) {
    attributes.forEach((attr) => {
      component.setAttribute(attr.name, attr.value)
    })
    return component
  }

  static replaceAttributes(component, attributes) {
    return this.addAttributes(this.removeAttributes(component), attributes)
  }

  static ProcessAttributes(target, config){
    const attributes = Array.from(target.attributes)
    const attr_values = attributes.map((a) => a.value)
    const hooksInUse = []


    attributes.filter((a)=> a.name === "_").map((att)=> {
      target.removeAttribute(att.name)
      
      const att_list = new Expression(att.value).run()

      if(typeof (att_list) === "object")  {
        Object.entries(att_list).forEach(([name, value])=> {
            target.setAttribute(name, value)
        })
      }
    })

    if(config.mapHookUse) {
      Expression.mapHookUse(attr_values.join(" ")).forEach((hook)=> {
        hooksInUse.push(hook)
      })
    }

    
    Array.from(target.attributes).map(({name, value}) => {
      const expressions = extractParentExpressions(value)
      expressions.map((exp) => {
        target.setAttribute(name, target.getAttribute(name).replace(exp, new Expression(exp).run()))
      })
    })

    return {attributes: Array.from(target.attributes), hooksInUse}
  }
}

/** Import all components declared inside html DOM.
 * 
 * @param {string} componentTagName 
 */
export async function importComponents(componentTagName) {
  const components = Array.from(document.getElementsByTagName(componentTagName));
  window.componentsSize = components.length ;

  const loadPromises = components.map(async (component) => {
    const src = component.getAttribute("src");

    if (src) {
      try {
        const jsxcode = await Util.Fetch(src, "text");
        component.innerHTML = jsxcode;
      } catch (err) {
        console.error(`Error importing component: ${src}`, err);
      }
    }

    const script = document.createElement("script");
    script.type = "module";
    script.async = true;

    script.innerHTML = `
      ${Expression.preseveSymbol(
          Expression.preserveHtml(component.innerHTML)
        )}`;

    document.head.appendChild(script);
    component.innerHTML = ""
  });


  await Promise.all(loadPromises);
}
