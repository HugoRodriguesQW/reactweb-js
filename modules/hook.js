import { ErrorMessage } from "./errors.js";
import { Component } from "./component.js";
import { Expression } from "./expression.js";
import { Util } from "./utility.js";
import { Controller } from "./main.js";
import { extractParentExpressions } from "./module.js";

/** Global definitions for hook.js
 * @typedef {Element} ListenerElement - The listener of onchange caller
 * @typedef {Array} Attributes - Array with original hook attributes
 * @typedef {string} Expression - Original JS Expression of listener
 * @typedef {Attributes|Expression} Properties - Properties to listen changes
 * @typedef {"attribute"|"component"} Type - Type of the listener element
 * @typedef {[ListenerElement, Properties, Type]} Listener - The complete listener object
 * @typedef {*} Value - Current value of the hook instance
 * @typedef {Array} Effect - inside script component useEffect effect list
 */

export default class Hook {
  /** List of all hooks in use
   * @type {Array<Hook>}
   * @static
   */
  static hooks = [];

  /** create a new Hook instance
   *
   * @param {string} name
   * @param {string} setter
   * @param {*} initial
   */
  constructor(name, setter, initial) {
    /** @type {Value}  */
    this._value = Util.clone(initial);
    /** @type {Listener[]} */
    this._listeners = [];
    /** @type {Effect[]} */
    this._effects = [];

    /** @type {string} */
    this.name = name;
    /** @type {string} */
    this.setterName = setter;

    Hook.hooks.push(this);
  }

  /**
   * Escreve o valor fornecido no estado do hook.
   * @param {*} value - O valor a ser atribuído ao estado do hook.
   */
  write(value) {
    this._value = Util.clone(value);
    this.onchange();
  }

  /**
   * Lê e retorna o estado atual do hook.
   * @returns {*} - O estado atual do hook.
   */
  read() {
    return Util.clone(this._value);
  }

  onchange() {
    this.updateAsAttribute(
      this._listeners.filter(([_, __, type]) => type === "attribute")
    );

    this.updateAsComponent(
      this._listeners.filter(([_, __, type]) => type === "component")
    );

    this._effects.map((effect) => {
      effect();
    });
  }

  updateAsComponent(listeners) {
    listeners
      .map((listenerObject) => {
        let [listener, exp] = listenerObject;

        if (!document.body.contains(listener)) {
          console.warn("listener not found:", {listener, id: listener.id})
          listener = document.getElementById(listener.id);
          if (!listener) return
          console.log("listener retrieved from document!");
          listenerObject[0] = listener;
        }

        const childrenHooks = Array.from(listener.querySelectorAll("ho"));

          childrenHooks.map((ho) => {
            exp = exp.replace(ho.originExpB, ho.resultExp);
            listenerObject[1] = exp;

            return {
              origin: ho.originExp,
              originB: ho.originExpB,
              result: ho.resultExp,
              exp,
            };
          })
    

        listener.innerHTML = new Expression(exp).run();
        window.controller.traverseElements(listener.children, {
          parseFunctions: false,
        });

        const postFunctions = Array.from(listener.querySelectorAll(`*`)).filter(
          (l) => window.controller.isFunctionComponent(l)
        );

       postFunctions
          .filter((pf) => pf.hasAttribute("funcoref"))
          .map((pf) => pf.replaceWith(window.parsedComponents[pf.getAttribute("funcoref")]));

           return listener;
      })
      .filter((l) => l);

      
  }

  updateAsAttribute(listeners) {
    listeners.map(([listener, attributes]) => {
      Component.replaceAttributes(listener, attributes);
      Component.ProcessAttributes(listener, { mapHookUse: false });
    });
  }

  /**
   *
   * @param {Listener} listener
   */
  addListener(listener) {
    this._listeners.push(listener);
  }

  addEffect(callback) {
    this._effects.push(callback);
  }
}

/**
 *
 * @param {Hook[]} hookList - an array with hooks in use
 * @param {Listener} listener - the target to listen the changes
 */
export function multipleAddListener(hookList, listener) {
  hookList
    .filter((element, index) => hookList.indexOf(element) === index)
    .forEach((hook) => {
      hook.addListener(listener);
    });
}

export function useEffect(callback, observe) {
  if (typeof callback !== "function") throw ErrorMessage("H102");
  if (!observe?.length)
    return document.addEventListener("traverseCompleted", callback);

  observe.map((variable) => {
    const hook = Hook.hooks.find((v) => v.name === variable.origin?.name);
    if (!hook) return console.error(ErrorMessage("H104", variable));
    hook.addEffect(callback);
  });
}

/**
 * @typedef {Hook['read']} Read
 * @typedef {Hook['write']} Write - escreve um novo valor e emite aos listeners
 *
 * @param {*} initial - parametro inicial que será definido na criação do hook.
 * @typedef {typeof Hook} Hook
 * @returns {[Read, Write]} - Uma matriz com as funções de leitura e escrita.
 */
export function useHook(initial) {
  const origin = Util.traceOrigin(new Error().stack);
  const componentId = window.components[origin]?.componentId;

  if (!componentId) throw ErrorMessage("H100", componentId);

  const { name, setter, contextId } = window.hookCalls[componentId].shift();
  const hook = new Hook(name, setter, initial);

  window[name] = () => hook.read();
  window[setter] = (v) => hook.write(v);

  window[name].origin = { contextId, componentId, name, setter };
  window[setter].origin = { contextId, componentId, name, setter };

  return [window[name], window[setter]];
}

export function useGlobal(data) {
  Object.assign(window, data);
}

useGlobal({ useHook, useEffect, Hook, useGlobal });
