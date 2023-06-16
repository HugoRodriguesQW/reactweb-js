
propagate(function VIEWER ({children, ...atributes})  {

    const [show, setShow] = useHook(true)
   

    createContext("hide-context", {
        show, setShow
    })



    return (
        <wrap>
             <button class="change {show()}" type="button" onclick="setShow(!show())"></button>
            <wrap style="{!show() && 'display: none'}">
             ${children}
            </wrap>

            <wrap style="{show() && 'display: none'}">
            { "${children}"}
            </wrap>
        </wrap>
        )
})

// This is a example of a Function Component - UniHooks