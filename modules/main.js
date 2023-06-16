import "./context.js";
import {
  createId,
  extractNamedAttributes,
  extractParentExpressions,
} from "./module.js";
import { Expression } from "./expression.js";
import { Util } from "./utility.js";
import { Component, importComponents } from "./component.js";
import { ErrorMessage } from "./errors.js";
import { multipleAddListener, useGlobal } from "./hook.js";

/** Global definitions for main.js
 *
 * @typedef {typeof Controller.defaultsConfigs} ControllerConfiguration - The parameters that change the controller's operation.
 * @typedef {Element|DocumentFragment} ControllerDocument - HTML source used to parse JSX to Common Html
 */

/** JSX Parser Controller
 * @class Controller
 */
export class Controller {
  /** default ControllerConfiguration parameters
   * @static
   */
  static defaultsConfigs = {
    /** Uses a document fragment to build the page. It can be more efficient with many components. */
    fragment: true,
    /** The name given to components that use a hook. It will appear in the document like this. */
    identifier: "HO",
  };

  static defaultParserConfig = {
    parseFunctions: true,
  };

  /** Create a JSX Controller with a Constructor
   * @constructor
   * @param {string} targetName - TagName of the component where the controller will act
   * @param {ControllerConfiguration} [config]
   */
  constructor(targetName, config) {
    if (window.controller) throw ErrorMessage("C100");
    if (!targetName) throw ErrorMessage("C102");

    /** @type {Element} */
    this.target = document.getElementsByTagName(targetName)[0];
    if (!this.target) throw ErrorMessage("C104", targetName);
    /** @type {ControllerConfiguration} */
    this.config = { ...Controller.defaultsConfigs, ...config };
    /** @type {ControllerDocument} */
    this.doc;
  }

  /** build the HTML document from JSX document
   *
   */
  async build() {
    importComponents("component");

    this.doc = (await this.createFragment()) || this.target;
    const childrens = this.doc.children;
    this.waitContentLoad().then(() =>
      this.traverseElements(childrens, {}).then(() => {
        this.config.fragment && this.target.replaceWith(this.doc.firstChild);
        console.timeEnd("TIME");
      })
    );
  }
  /** create a fragment document to apply changes in build
   *
   * @returns {DocumentFragment|null}
   */
  async createFragment() {
    if (!this.config.fragment) return;
    const range = document.createRange();
    const fragment = range.createContextualFragment(this.target.outerHTML);
    this.target.innerHTML = "";
    return fragment;
  }
  /** traverse elements and children parsing JSX
   *
   * @param {HTMLCollection} elements
   * @returns
   */
  async traverseElements(elements, custom) {
    await Promise.all(
      Array.from(elements).map(async (element) => {

        if (custom?.parseFunctions !== false) {
          Array.from(element.querySelectorAll(":scope > *:not([funcoref])"))
            .filter((el) => {
              return this.isFunctionComponent(el);
            })
            .forEach((el) => {
              const refId = createId("funcoref");
              el.setAttribute("funcoref", refId);
     
            });
        }
        

        switch (element.tagName) {
          case this.config.identifier:
            break;
          case this.isFunctionComponent(element):
            if (custom?.parseFunctions !== false) {
              this.parseFunctionComponent(element);
            }
          default:
            this.parseExpressionsAndMapHooks(element);
        }
        this.CheckChildrenAlso(element, custom);
      })
    );
  }

  isFunctionComponent(element) {
    return Util.strPop(element.tagName) === "_" ? element.tagName : false;
  }

  parseFunctionComponent(element) {
    const componentName = Util.slicep(element.tagName, 0, -1).toUpperCase();

    const functionComponent = window.components[componentName]();
    const componentParams = {
      ...Component.mapAttributes(element.attributes),
      children: element.innerHTML,
    };

    element.innerHTML = functionComponent(componentParams);
    element.innerHTML = new Component(element.innerHTML).render();
    element.setAttribute("context", functionComponent.contextId);

    if (!window.parsedComponents) window.parsedComponents = {};
    window.parsedComponents[element.getAttribute("funcoref")] = element;
  }

  /** Check the children of the element and call traverse if you have
   *
   * @param {Element} element
   * @returns {traverseElements|void}
   */
  CheckChildrenAlso(element, custom) {
    if (element.children.length) {
      return controller.traverseElements(element.children, custom);
    }
  }

  waitContentLoad() {
    return new Promise((resolve, reject) => {
      (function check() {
        if (window.componentsSize === 0) {
          return resolve();
        }
        setTimeout(check, 5);
      })();

      setTimeout(() => {
        reject("timeout");
      }, 30 * 1000);
    });
  }

  parseExpressionsAndMapHooks(element) {
    const originExpB = element.outerHTML;

    const doc = this.config.fragment ? this.doc : document;
    const expressions = extractParentExpressions(element.innerHTML);
    const originalAttributes = extractNamedAttributes(element);

    const { hooksInUse } = Component.ProcessAttributes(element, {
      mapHookUse: true,
    });

    const originExp = element.outerHTML;

    multipleAddListener(hooksInUse, [element, originalAttributes, "attribute"]);

    expressions.map((exp) => {
      const hoid = createId("ho", "cpa");
      const uses = Expression.mapHookUse(exp);
      const hooksInExpression = uses;
      const hasHooks = !!hooksInExpression.length;

      const parsedInnerHtml = new Expression(exp).run();

      if (!hasHooks) {
        return this.replaceElementInner(element, exp, parsedInnerHtml);
      }

      this.replaceElementInner(element, exp, `<ho id=${hoid}></ho>`);

      const hookElement = doc.getElementById(hoid);
      hookElement.innerHTML = parsedInnerHtml;
      hookElement.originExp = originExp;
      hookElement.originExpB = originExpB;
      hookElement.resultExp = element.outerHTML;

      multipleAddListener(hooksInExpression, [hookElement, exp, "component"]);
    });
  }

  replaceElementInner(element, search, newInner) {
    element.innerHTML = element.innerHTML.replace(search, newInner);
  }
}

console.time("TIME");

const controller = new Controller("hook-dom", { fragment: false });
controller.build();

useGlobal({ controller });
