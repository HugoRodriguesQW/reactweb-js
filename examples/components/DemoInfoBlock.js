
propagate(function DEMOINFOBLOCK ({children, index, content, ...attributes})  {
    

    const [variable, setVariable] = useHook(100)
    const [parameter, setParameter] = useHook({demo: randonize()})
    const [showApp, setShowApp] = useHook(true)

    function updateParameter() {
        setParameter({demo: change()})
    }

    function randonize() {
        return  Math.random() < 0.5 ? "singularidade" : "dualidade" 
    }

    function change() {
       return  ["dualidade", "singularidade"].find((e)=> e !== parameter().demo)

    }

    createContext("app_context", {
        variable,
        parameter,
        updateParameter
    })

    
    return (
        <div  class="container {parameter().demo}" demo="${attributes.demo}" teste="{variable()}">
            <strong>${index}</strong>${content}

  
        { showApp() ? (
            <wrap id="opened">
            <button class="close" onClick="setShowApp(false)">X</button>
                <div>
                    <div class="updateVariable">
                        <button onClick="setVariable(variable() / 2)" >metade / 2</button>
                        <button onClick="setVariable(variable() * 2)" >dobro x 2</button>
                    </div>
                    <button class="sortear" _="{parameter()}" onClick="${updateParameter.call()}" >dualidade x singularidade</button>
                </div>

                        <p style="color: {variable() > 2000? 'green': 'red'}"> {variable()} possibilidades de melhorar todos os dias</p>
                        ${children}
            </wrap>
            ):(

            <wrap id="open_on_closed" >
                <button class="openButton" onClick="setShowApp(true)">Abrir componente</button>
            </wrap>
    )
        }
     
        </div>
        )
})

// This is a example of a Function Component - UniHooks