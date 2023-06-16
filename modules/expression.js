import { Util } from "./utility.js";
import {extractNestedElements} from "./module.js";
import  Hook from "./hook.js";

export class Expression {
    constructor(source) {
      this._source = source;
    }
  
    run() {
      const parsed = this.preserveChars(Expression.preserveHtml(Util.Sop(this._source)))
      const executor =  new Function(`return ${parsed}`)
      return executor();
    }

    static preserveHtml(source) {
      extractNestedElements(source).forEach((match)=> {
        source = source.replace(match, `Expression.restoreHtml(\`${match}\`)`)
      })
      return source
    }


    static mapHookUse(source) {
      source = Expression.removeHtml(source)
      return Hook.hooks.filter((ho)=> source.includes(`${ho.name}(`))
    }

    static removeHtml(source) {
      extractNestedElements(Util.Sop(source)).forEach((match) => {
        source = source.replace(match, "")
      })
      return source
    }
    
    preserveChars(source) { 
      return source.replaceAll('&gt;', ">").replaceAll("&lt;", "<").replace(/\s+/g, " ");
    }

    static preseveSymbol(source) {
      return source.replaceAll('&gt;', ">").replaceAll("&lt;", "<")
    }
  
    static restoreHtml(outer) {
      return outer
    }
  }

 Object.assign(window, {Expression})