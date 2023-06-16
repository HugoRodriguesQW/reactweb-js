# reactweb.js browser framework!

source.min: https://reactwebjs.netlify.app/dist/reactweb.js

### Uma maneira simples de criar layouts reativos diretamente no documento HTML.

Com sintaxe familiar ao ReactJS, com o ReactWeb é possível criar layouts reativos dentro do html. 
Este framework foi desenvolvido para aplicações leves em casos em que não é possível usar o ReactJS, rodando diretamente no browser do cliente.

![image](https://github.com/HugoRodriguesQW/reactweb-js/assets/71078903/2266efd0-b21d-46a4-aecb-f2a4a921713f)


```jsx
<html lang="pt-BR" >
    <head>
        <title>Coleta Espessura de Garrafa</title>
        <link rel="stylesheet" href="style.css"></link>
        <script src="/dist/reactweb.js"></script>
    </head>

    <body>
       
        <hook-dom>
            <h1>Teste de Elementos Reativos Web</h1>
            <Viewer_ > {
                [
                    "aprendizado contínuo",
                    "tentativa existe sim",
                    "tempo não tem preço",
                    "consistência",
                    "testar mais uma vez",
                    "jamais satisfeito"
                ]

                .map((content, i) => {
                    return (
                    <DemoInfoBlock_  index="${i}" content="${content}">
                        <DemoUseContext_  name="updater"></DemoUseContext_>
                    </DemoInfoBlock_>
                    )
                }).join(" ")
            }
            
        </Viewer_>

        <GithubLink_></GithubLink_>
        </hook-dom>

      <Component src="../components/DemoInfoBlock.js"></Component>
      <Component src="../components/DemoUseContext.js"></Component>
      <Component src="../components/Viewer.js"></Component>
      <Component src="../components/GithubLink.js"></Component>
    </body> 
</html>
```

## Instalação do Framework:
- Para usar o framework:

```html
      <script defer src="https://reactwebjs.netlify.app/dist/reactweb.js"></script>
      
      <hook-dom> [content-app-here] </hook-dom>
      <component> [component-declarion] </component>
```

    criar um elemento ```<hook-dom>...</hook-dom>``` para ser a raiz do app e os componentes declarados usando ```<component>```

- Para usar em desenvolvimento:
    clone o repositório, execute o ```npm install``` para instalar as dependências.  ```npm start``` para observar as alterações e gerar o arquivo minificado.
    o arquivo ```modules/main.js``` inicia o framework, importe-o em qualquer html para usar.

## Utilização do Framework:

### useHook(initial)
Cria um "gancho" que executa informa os ouvintes que ocorrer uma alteração usando callback.
```jsx
... fragment_component_example.js
const [variable, setVariable] = useHook(initial)

variable() // return value
setVariable(newValue) // return void

return (
  <div>{variable()}</div> 
)
...
```
### useEffect(callback, [observe])
Ele atua com um hook, e sempre que uma das variáveis informadas alterar seu estado, ele vai executar o callback.
Se nenhuma variável for informada, ele atua  como um ```document.onload```
```jsx
... effect_component_example.js
const [variable, setVariable] = useHook(initial)

useEffect(function () {
    // callback script here - variable onChange
}, [variable])

...
```
é importante usar function() ao invés de () => nesta versão devido a uma conversão incorreta dos caracteres <  e  > na importação do componente.

### createContext(name, variables)
Cria um contexto para que as variaveis ou funções sejam utilizadas pelos elementos filhos.
Um componente pode ter mais de um contexto, mas se o mesmo nome for utilizado, somente o último será usado. 
```jsx
... parent_component_example.js
const [variable, setVariable] = useHook(initial)

function example() {}

createContext("example_context",  {
  variable,
  example,
})

return (
  <div>{children}</div> 
)
...
```
depois, ele poderia ser usado pelos seu filhos através do useContext.

### useContext(name)
Importa as variáveis e funções declaradas no contexto do elemento pai. o método```.link()``` cria uma expressão { } 
e o método ```.call()``` chama a variável para ser usada dentro de expressões existentes ou onClicks, por exemplo.
```jsx
... child_component_example.js

const {variable, example} = useContext("example_context")

variable.link() // retorna o correspondente a "{variable()}" e permite chamar a função
variable.call() // retorna o correspondente a "variable()" e permite o uso em callback etc

return (
  <button onclick="${example.call()"}>${variable.link()}</button> 
  
  { 
    // <button onclick="example()">{variable()}</button>   -  resultado 
  }
)
...
```
Note que foi usado ${} ao invés de { }, isso é porque a execução ocorre em escopos diferentes.

### <component>
A declaração de um componente é simples. Ele pode ser local, declarado dentro do ```<component>``` ou externo através de um arquivo usando src.
Eles serão importados para o uso dentro do ```hook-dom```. veja como declarar um componente:
```jsx
... component_example.js
  <component>
    propagate(function EXAMPLE({children, ...attributes})  {
      ..... component code

      return (
         <div>Example! {children} </div>
      )
    })
  </component>
...
```
```children``` se refere a todo o conteúdo entre a tag de abertura e de fechamento ou innerHTML.

o ```propagate()``` é responsável por propagar o componente para a janela do navegador, criando uma componento "escopável", ou seja,
gera um contexto para cada chamado do componente dentro do html. 

Na versão atual, o nome do componente deve ser declarado em uppercase.

### Uso do componente no documento.
dentro do body, deve haver um elemento ```<hook-dom></hook-dom>```, será dentro dele que o ReactWeb atuará.
Para chamar um componente declarado basta escrever o nome dele (declarado na função) com ```_``` no final,
indicando que se trata de um componente do tipo função. Exemplo:
```jsx
... usage_component_example.html
  <Example_  attribute-demo="" _="{multiple-attributes: true, custom: 1234}" >
  ........ content
  </Example_>
...
```
Note que é possível passar múltiplos atributos usando ```_``` com conteúdo um objeto com os parametros a adicionar.


### Escopo de execução
Conforme visto, há uma diferença entre { } e ${ } dentro do componente.
Quando o componente está sendo renderizado, ele é executado dentro de ` `. Quando ${} é usado, ele não será interpretado como hook, ele será lido 
no ato de instanciamento do componente. Quando {} é usado, ele é interpretado como hook e é executado pelo interprete após a montagem do documento.

Em suma,  ${ } está em escopo local, e  { } em escopo global. Isso é util quantos aos métodos  ```.link()```  ```.call()```

```jsx
... scope_example.js
function Example () {
... script component

  return (
    <div attribute="${local}" attribute2="{global}" ></div>
  )
}

... scope_example.html
<div>
{
array.map((item, index) => {
  return <p outsideMap="{example}" insideMap="${index}" >${content}</p>
})
}
</div>

```
Note que é possível passar múltiplos atributos usando ```_``` com conteúdo um objeto com os parametros a adicionar.
