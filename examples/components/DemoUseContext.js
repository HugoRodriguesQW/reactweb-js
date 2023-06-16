
propagate(function DEMOUSECONTEXT ({children, ...atributes})  {

    const {variable, updateParameter, parameter } = useContext("app_context") // retorna a funcao original?
    
    const [teste, setTeste] = useHook(parameter())
   
    
    useEffect(function() {
        setTeste(parameter())
        console.info("EFFECT UP:", teste())
    }, [parameter])

    return (
        <div demo="${atributes.demo}" teste="${variable.link()}">
            <h3>Possibilidades: ${variable.link()}</h3>
            ${children}

            <strong class="{teste().demo}">{teste().demo}</strong>
            <button class="sortear" type="button" onclick="${updateParameter.call()}">alterar parametro</button>
            
        </div>
        )
})

// This is a example of a Function Component - UniHooks