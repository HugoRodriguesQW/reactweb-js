import { useGlobal } from "./hook.js";
import { createId } from "./module.js";

export default class Context {

    static contexts = []

    constructor(alias, params, contextId, componentName) {
        this.alias = alias
        this.params = params
        this.contextId = contextId
        this.componentName = componentName

        Context.contexts.push(this)
    }

    static createContext(alias, params) {
        const {componentId, contextId} = Object.values(params).find((param) => param.origin)?.origin
        if(!componentId || !contextId)  throw new Error("context creation failed: missing reference. " + new Error().stack)
        
        const parentComponent = Object.keys(window.components).find((name)=> window.components[name].componentId === componentId)
        const referenceParams = window.uses[contextId]

        const mappedParams = Context.mapVariableNames(params, referenceParams)
        const context = new Context(alias, mappedParams, contextId, parentComponent)

        return useContext(alias)
    
    }

    static mapVariableNames(params, referenceParams) {
        return  Object.fromEntries(Object.entries(params).map(([key, param]) => {
            const reference = referenceParams.find(ref => [ref.name, ref.setter].includes(key)) || {}
            if(!reference.contextId) {
                Object.assign(reference, this.createOriginFor(param).with(referenceParams))
                key = reference.name
            }
            const originalName = reference.original[["name", "setter"].find((type)=> reference[type] === key)]
            param.link =  (data) => new Function(`return \`{${key}(${Context.parseFunction(data)})}\``)()
            param.call = (data) => new Function(`return \`${key}(${Context.parseFunction(data)})\``)()
            // criar uma referencia se jano existir
            return [originalName , param] 
        }))
    }

    static createOriginFor(param) {
        return {
            with: (references) => {
                const {contextId} = references.find((r)=> r.contextId) || this.randomOrigin()
                const originalName = param.name
                const contextedName  = `${param.name}_${contextId}c`
                
                useGlobal({[contextedName]: param})

                return {
                    contextId,
                    name: contextedName,
                    original: {name: originalName}
                }

            }
        }
    }

    static randomOrigin() {
        return {
            contextId: createId("cr"),
            componentId: createId("virtual_component")
        }
    }

    static parseFunction(data) {
        if(!data) return ""
     try {
        const jsonString = JSON.stringify(data)
        const convertedString = jsonString.replace(/"([^"]+)"\s*:\s*"(\d+)"/g, '"$1": $2');
        const convertedData = JSON.parse(convertedString);

        return convertedData
    } catch (err) {
        // console.error(`Error parsing function: ${err}`)
        return ""
    }
    }

    static useContext(contextName) {
        const currentContext = Context.contexts.findLast((ctx) => ctx.alias === contextName)

        if(!currentContext)  throw new Error(`context not found: ${contextName}`)

        return currentContext.params
    }


    static  findParentByTagName(element, tagName) {
        tagName = tagName.toUpperCase();
    }

   
}


export const createContext = Context.createContext;
export const useContext = Context.useContext;

useGlobal({createContext, useContext, Context})
