/** Global definitions for errors.js
 * @typedef {keyof typeof errors} ErrorCode
 */


const errors = {
    C100: "Multiple controllers not supported",
    C102: "required: targetName to create controller",
    C104: "required: target to create controller not found:",
    
    H100: "fail: not found component using id:",
    H102: "callback need be a function",
    H104: "variable can't sensible to effect:",
}

/** Create a Error message in console using error map
 * @param {ErrorCode} code 
 * @param {string} additional
 */
export function ErrorMessage(code, additional) {
   const message  = errors[code]

   return new Error(`${code}: ${message} (${additional}) > ${new Error().stack}`)
}