export class Util {
    static clone = (v) => {
      return JSON.parse(JSON.stringify(v))
    }
    
    static Sop = (s) => s.slice(1, s.length - 1)
    static rex = {
      html: /<([^<>]+)(?:>([^]*?)<\/\1>|\/>)/g
    }
    static traceOrigin = (str) => {
      return str.replaceAll("\n", " ").replaceAll("Object.", "").split(" ").find((s)=> {
        return Object.keys(window.components).includes(s)
      })
    }
    static strPop(str) {
      return str.split("").pop()
    }
    

    static Fetch(target, parseTo) {
      return new Promise((resolve, reject) => {
        fetch(target)
          .then((payload) => payload[parseTo]())
          .then((result) => resolve(result))
          .catch((err) => reject(err));
      });
    }

   static slicep =  (srt, start, end) => srt.slice(start, srt.length + end)

   static groupMessage  (groupName, title) {
    console.groupCollapsed(groupName,title)

    const close = () => console.groupEnd(groupName)

    const  send = (msgs, type)=> { 
      msgs.forEach((msg) => {
      console[type || "info"]?.(msg)
    })

    return {send, close};
    }

    return {send, close}
   }
  }

