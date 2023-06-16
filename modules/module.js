import { useGlobal } from "./hook.js";
import { Util } from "./utility.js";

const usedIds = [];

export function propagate(func) {
  if (!window.hookCalls) window.hookCalls = {};
  if (!window.components) window.components = {};
  if (!window.uses) window.uses = {};
 
  const componentId = createId("comp_");

  const contextedFunction = (data) => {
    return contextnize(func, componentId, data);
  };
  contextedFunction.componentId = componentId;

  Object.assign(window.components, { [func.name.toUpperCase()]: contextedFunction });
  window.componentsSize = window.componentsSize - 1;

  Util.groupMessage(func.name.toUpperCase(), "Propagating app function")
    .send([func, { origin, ready: contextedFunction }])
    .close();
}

export function contextnize(func, componentId, data) {
 
 

  const contextId = createId("c");
  const [contextedFunction, uses] = renameHookCalls(func, contextId);

  uses.map((use) => {
    window.hookCalls[componentId] = [
      ...(window.hookCalls[componentId] || []),
      use,
    ];
    window.uses[contextId] = uses;

    return use;
  });

  contextedFunction.contextId = contextId;
  return contextedFunction;
}

export function renameHookCalls(func, suffix) {
  const uses = getAllHookCallIn(func);

  let funcString = func.toString();

  if (uses.length) {
    uses.map((use) => {
      [use.name, use.setter].map((key) => {
        const replacer = new RegExp(`\\b${key}\\b`, "g");

        funcString = funcString.replace(replacer, (m) => {
         
          return `${key}_${suffix}c`;
        });
      });

      use.original = { name: use.name, setter: use.setter };
      use.name = `${use.name}_${suffix}c`;
      use.setter = `${use.setter}_${suffix}c`;
      use.contextId = suffix
    });
  }

  const renamedHooksFunction = new Function(`return ${funcString}`);

  return [renamedHooksFunction(), uses];
}

export function createId(prefix, sufix) {
  const id = `${prefix || ""}${new Date().getTime().toString(36)}${Math.random()
    .toString(36)
    .slice(2)}${sufix || ""}`;

    if(!usedIds.includes(id)) {
        usedIds.push(id)
        return id
    } 

    return createId(prefix, sufix)
}

export function getAllHookCallIn(func) {
  const functionSource = func.toString();
  const match = functionSource.matchAll(
    /const\s*\[([\w\d]+)\s*,\s*(\w+)\]\s*=\s*useHook\(/g
  );
  const hooks = [];

  for (const [call, name, setter] of match) {
   
    hooks.push({ name, setter, call });
  }

  
  return hooks;
}

export function extractNamedAttributes(element) {
  return Array.from(element.attributes).map(
    ({ name, value }) => ({ name, value })
  );
}

export function extractParentExpressions(input) {
  const parentExpressions = [];
  const stack = [];
  let currentExpression = "";
  let isInString = false;
  let isInJSXTag = false;
  let jsxElementDepth = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (char === '"' && input[i - 1] !== "\\") {
      isInString = !isInString;
    } else if (char === "<" && nextChar !== "/" && !isInString) {
      isInJSXTag = true;
      jsxElementDepth++;
    } else if (char === ">" && !isInString) {
      isInJSXTag = false;
    } else if (char === "{" && !isInString && !isInJSXTag) {
      if (jsxElementDepth === 0) {
        stack.push(i);
      }
    } else if (char === "}" && !isInString && !isInJSXTag) {
      if (jsxElementDepth === 0) {
        const openingBraceIndex = stack.pop();
        if (openingBraceIndex !== undefined && stack.length === 0) {
          const expressionStart = openingBraceIndex - 1;
          const expressionEnd = i + 1;
          currentExpression = input
            .substring(expressionStart, expressionEnd)
            .trim();
          parentExpressions.push({
            expression: currentExpression,
            start: expressionStart,
            end: expressionEnd,
          });
          currentExpression = "";
        }
      }
    }

    if (stack.length === 0 && !isInString && !isInJSXTag) {
      currentExpression += char;
    }

    if (char === "<" && nextChar === "/") {
      jsxElementDepth--;
    }
  }

  return parentExpressions.map((p) => p.expression);
}

export function extractNestedElements(input) {
  const elements = [];
  let index = 0;

  while (index < input.length) {
    const openingTagIndex = input.indexOf("<", index);
    if (openingTagIndex === -1) break;

    const closingTagIndex = input.indexOf(">", openingTagIndex);
    if (closingTagIndex === -1) break;

    const tagNameStartIndex = openingTagIndex + 1;
    const tagNameEndIndex = Math.min(
      input.indexOf(" ", tagNameStartIndex),
      closingTagIndex
    );
    const tagName = input.slice(tagNameStartIndex, tagNameEndIndex).trim();
    const openingTag = `<${tagName}`;
    const closingTag = `</${tagName}>`;

    let tagEndIndex = closingTagIndex;
    if (tagNameEndIndex !== closingTagIndex) {
      const nextSpaceIndex = input.indexOf(" ", tagNameStartIndex);
      if (nextSpaceIndex !== -1 && nextSpaceIndex < closingTagIndex) {
        tagEndIndex = nextSpaceIndex;
      }
    }

    let count = 1;
    let nestedIndex = closingTagIndex;

    while (count > 0) {
      const nextOpeningTagIndex = input.indexOf(openingTag, nestedIndex);
      const nextClosingTagIndex = input.indexOf(closingTag, nestedIndex);

      if (nextClosingTagIndex === -1) break;

      if (
        nextOpeningTagIndex !== -1 &&
        nextOpeningTagIndex < nextClosingTagIndex
      ) {
        count++;
        nestedIndex = nextOpeningTagIndex + openingTag.length;
      } else {
        count--;
        nestedIndex = nextClosingTagIndex + closingTag.length;
      }
    }

    if (count === 0) {
      const element = input.slice(openingTagIndex, nestedIndex + 1);
      elements.push(element);
      index = nestedIndex + 1;
    } else {
      break;
    }
  }

  // Verifica se há apenas um elemento e o adiciona ao array
  if (elements.length === 0 && input.trim().startsWith("<")) {
    elements.push(input.trim());
  }

  return elements;
}

export default {
  extractNestedElements,
  extractParentExpressions,
};

useGlobal({ propagate, extractParentExpressions, contextnize });
