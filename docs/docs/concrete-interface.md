# Interface Concreta

É o mapeamento dos Widgets Concreto para [Interface Abstrata](abstract-interface.md)
selecionada durante a [Seleção de Interface](interface-selection.md)

    var concret = [
        {
            name: 'user',
            head: [ 
                ...
            ],
            structure:[
                ...
            ]
            maps: [
                ...
            ]
        }
    ]
    
Cada interface abstrata é composta por 4 parâmetros:

## Parâmetros

### name

Nome da interface concreta, este nome será utilizado pelo parâmetro `concrete` de elementos da 
[Seleção de Interface](interface-selection.md).

Se na seleção de interface nenhum parâmetro `concrete` for informado, a seleção de interface assumirá que o nome
da interface concreta será o mesmo que da interface abstrata.

### head

Uma lista de widgets concretos que não compõem a estrutura da interface, mas sim, suas configurações,
dependências como `css`, `favicon` e até mesmo, no caso de uma página HTML, o `title` da página.

### structure

Uma lista de widgets abstratos que terão a organização de seus filhos redefinida.

    /** interface abstrata **/
    
    {name:'pai', children: [
        {name:'filho1'},
        {name:'filho2'},
        {name:'filho3'}
    ]}
    
    /** interface concreta **/
    
    structure:[
        {name:'pai', children: [
            {name:'filho1'},
            {name:'agrupador', children: [
                {name:'filho2'},
                {name:'filho3'}
            ]}
        ]}
    ]

### maps

Uma lista de widgets concretos utilizados para mapear os widgets abstratos. Gerando a interface para o usuário que
acessa a aplicação.

# Widget Concreto

Os widget concretos podem ser criados e customizados pelo designer da aplicação, mas eles possuem uma interface de
parâmetros que deverá ser seguido por todos os widgets concretos criados.
 
## Parâmetros
 
### name

*Obrigatório*

Nome do widget abstrato que será mapeado. Este nome pode se repetir, pois um mesmo widget abstrato pode ser mapeado
por vários widgets concreto, mas somente o último que for válido será utilizado para exibir o widget abstrato.

### type

*Obrigatório*

Tipo do widget concreto

[Veja os tipos de widgets concretos disponíveis](widgets.md)

### when

*Opcional*

Informar a condição que deve ser avaliada para que este widget concreto seja mapeado com o widget abstrato na interface.

Você pode utilizar uma condição geral ou escrever uma expressão que deverá ser avaliada.

De preferência a escrever as condição na estrutura de condição do framework.

[Mais informações sobre condições](conditions.md)

### value

*Opcional*

Será o valor a ser exibido pelo widget concreto.

    value:"$data.name"

# Exemplos

Interface concreta mapeando widgets concretos para uma interface de busca na estrutura do
[Freebase](http://www.freebase.org)

    var concrete = [{
        name: 'search',
        head: [
            {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
            {name: 'secondary_css', widget:'Head', href:'css/freebase.css', tag: 'style'},
            {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'},
            {name: 'title', widget:'Title', value: '"FreeBase"'}
        ],
        maps: [
            { name: 'header', widget: 'BootstrapSimple', text:'center', class:'container-fluid fundo' },
            { name: 'logo', widget: 'SimpleHtml', tag:'img', src:'"imgs/freebase_logo.png"' },
    
            { name: 'search_form', widget: 'SimpleHtml', tag:'form', onsubmit:'do_search(event);' },
            { name: 'search_group', widget: 'BootstrapSimple', input:'group', sm:'8', class:'form_center' },
            { name: 'search_field', widget: 'BootstrapSimple', tag:'input', input:'lg', form:'control', placeholder:'"Escreve o que deseja buscar"' },
            { name: 'search_button', widget: 'BootstrapFormGroupButton', class:'btn-warning', value:'"Buscar"' },
    
            { name: 'footer', widget: 'SimpleHtml', tag:'div', class:'container' },
            { name: 'footer-content', widget: 'BootstrapFooter' }
    ]}];

Mapeamento widgets de acordo com condições

    ...
    maps: [
        { name: 'element', widget: 'SimpleHtml', tag: 'h1', value:'$bind', class: 'big', when:'isDesktop' },
        { name: 'element', widget: 'SimpleHtml', tag: 'h1', value:'$bind', class: 'medium', when:'isTablet' },
        { name: 'element', widget: 'SimpleHtml', tag: 'h1', value:'$bind', class: 'small', when:'isMobile' }
    ]
    
Alterando titulo da página com informações vindas do modelo
    
    ...
    head: [
        {name: 'title', widget:'Title', value: '"Exibidor de Artigos | " + $data.title'}
    ]
    
Criando eventos em widgets

    ...
    maps: [
        ...
        { name: 'element', widget: 'SimpleHtml', tag: 'button', value:'"Clique"', onclick: 'minha_funcao(event)' },
        
    ]

*`function minha_funcao(e)` deve ser definida em um contexto global, de preferência, atribuída ao objeto `window` do javascript*

[Veja como criar funções em Dicas](tips.md#criando-funcoes)
   
    
