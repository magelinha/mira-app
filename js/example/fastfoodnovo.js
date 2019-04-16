"use strict";
//Define as regras para avaliação de widgets
var rules = [
];

//Define as regras para seleção de interface
var selection = [
    
    //landing
    
    //home
    {
        when: "IsTesteEmAndamento() && IsPage('home')",
        abstract: "home"
    },

    //cardápio
    {
        when: "IsPage('cardapio')",
        abstract: "cardapio"
    },

    //promoções
    {
        when: "IsPage('promocoes')",
        abstract: "cardapio"
    },

    //pedido
    {
        when: "IsPage('pedido')",
        abstract: "pedido"
    }
     
];

var head = [
    {name: 'font_google', widget:"Head", tag:'style', href:"https://fonts.googleapis.com/css?family=PT+Sans"},
    {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
    {name: 'bootstrap_accessibility_css', widget:'Head', href:'css/bootstrap-accessibility.css', tag: 'style'},
    {name: 'fontawesone_css', widget:'Head', href:'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', tag: 'style'},
    {name: 'fastfood_css', widget:'Head', href:'css/fastFood.css', tag: 'style'},
    
    {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'}
];

var landingAbstrata = 
{
    name: "landing",
    widgets:
    [
        {
            name: "form-inicial", children:
            [
                { name: "nome" },
                { name: "email" },
                { name: "iniciar" }
            ]
        }
    ]
};

var landingConcreta = 
{

    name:"landing",
	head: head.concat([
        {name: 'title', widget:'Title', value: 'fastFood Uai - Dados Iniciais'}
    ]),
    structure: 
    [
        { 
            name: "form-inicial", children: 
            [
                { 
                    name: "content-field", children:
                    [
                        { name: "label-nome"},
                        { name: "content-control", children: [{ name: "nome" }] },
                    ]
                },
                { 
                    name: "content-field", children:
                    [
                        { name: "label-email"},
                        { name: "content-control", children: [{ name: "email" }] },
                    ]
                },
                { 
                    name: "content-field", children:
                    [
                        { name: "iniciar"}
                    ]
                }
            ]
        }
    ],
    maps:
    [
        { name: "form-incial", widget: "WaiForm", class: "form-dados" },
        { name: "content-field", class: "form-group" },
        { name: "content-control", class: "col-sm-10" },

        { name: "label-nome", class: "col-sm-2", for:"#nome" },
        { name: "nome", widget:"WaiInput", type: "text", placeholder:"Nome" },
        { name: "label-email", class: "col-sm-2", for:"#email" },
        { name: "email", widget:"WaiInput", type: "email", placeholder:"E-mail" },
        { name: "inicial", widget:"WaiButton", placeholder:"E-mail", events:{ submit: "OnStart"} },
    ]
};

var homeAbstrata = 
{
	name: "home",
	widgets:
	[
        //Menu
        { 
            name: "menu", children:
            [
                { name: "menu-cardapio" },
                { name: "menu-promocoes" },
                { name: "menu-pedido" }
            ]
        },

        //Area de promoções
        {
            name:"promocoes", datasource:'url:<%= "/api/fastfoodnovo/promocoes" %>', children:
            [
                { name : "promocao" }
            ]
        }
	]
};

var homeConcreta = 
{
	name:"home",
	head: head.concat([
        {name: 'title', widget:'Title', value: 'fastFood Uai - Página Inicial'}
    ]),
    structure: 
    [
        { 
            name: "promocoes", children: 
            [
                { 
                    name: "promocao", children:
                    [
                        { name: "promocao-image" },
                        { 
                            name: "promocao-caption", children: 
                            [
                                { name: "promacao-caption-titulo" },
                                { name: "promacao-caption-descricao" }
                            ] 
                        },
                    ]
                }

            ]
        }
    ],
    maps:
    [
        { name: "menu", widget: "WaiMenu", value:"Fast Food UAI", content:"#promocoes" },
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/cardapio/", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/promocoes/", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/", value:{"pt-BR": "Pedido"} },
        { name: "promocoes", widget:"WaiCarousel" },
        { name: "promocao", widget:"WaiCarouselItem" },
        { name: "promocao-image", tag:"img", alt:"$data.descricao", src:"$data.img" },
        { name: "promocao-caption", widget:"WaiCarouselCaption" },
        { name: "promacao-caption-titulo", tag:"h3", value:"$data.nome" },
        { name: "promacao-caption-descricao", tag:"p", value:"$data.descricao" }
    ]
};

var cardapioAbstrata = 
{
	name: "cardapio",
	widgets:
	[
        //Menu
        { 
            name: "menu", children:
            [
                { name: "menu-cardapio" },
                { name: "menu-promocoes" },
                { name: "menu-pedido" }
            ]
        },

        {
            name: "cardapio", datasource:"$data.categorias", children:
            [
                { 
                    name: "categoria", datasource:"$data.itens", children:
                    [
                        { 
                            name: "item", when: "_.isArray($data.preco)", children:
                            [
                                { name: "imagem" },
                                { name: "descricao" },
                                { name: "item-preco", datasource: "$data.preco", children:[ { name: "preco" }]},
                                { name: "adicionar"}
                            ]
                        },
                        { 
                            name: "item", 
                            when: "_.isNumber($data.preco)",
                            children: 
                            [
                                { name: "imagem" },
                                { name: "descricao" },
                                { name: "preco" },
                                { name: "adicionar"}
                            ]
                        },
                    ]
                }
            ] 
        }
	]
};

var cardapioConcreta = 
{
	name:"cardapio",
	head: head.concat([
        {name: 'title', widget:'Title', value: 'Cardápio'}
    ]),
    structure: 
    [
        {
            name: "cardapio", children:
            [
                { 
                    name: "categoria", children:
                    [
                        
                        { 
                            name: "item", children:
                            [
                                //Imagem
                                { 
                                    name: "content-imagem",
                                    children:
                                    [
                                        { name: "imagem" }
                                    ]
                                },

                                {
                                    name: "content-details", children:
                                    [
                                        //Descricao
                                        { name: "descricao" },
                                        
                                        //Preço do item
                                        { 
                                            name:"item-preco", children:
                                            [
                                                { name: "preco"}
                                            ] 
                                        },

                                        //Botão de adicionar item ao pedido
                                        { name: "item-adicionar", children:[{ name: "adicionar" }] }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    maps:
    [
        { name: "menu", widget: "WaiMenu", value:"Fast Food UAI", content:"#promocoes" },
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/cardapio/", class:"active", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/promocoes/", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/", value:{"pt-BR": "Pedido"} },
        
        { name: "cardapio", widget:"WaiCollapse", value:{ "pt-BR":"Cardápio" } },
        { name: "categoria", widget: "WaiCollapseItem", value: "$data.nome" },
        
        { name: "item", widget: "WaiContent", class:"col-md-3 card border-rounded" },
        
        //Imagem
        { name: "content-imagem", widget: "WaiContent", class:"col-md-6 content-imagem" },
        { name: "imagem", tag:"img", src:"$data.imagem", alt:"$data.nome", class: "img-responsive img-item"},

        //Descrição
        { name: "content-details", widget:"WaiContent", class:"col-md-6" },

        //--- nome
        { name: "descricao", tag:"h4", class:"nome-produto row", value:"$data.nome"},        
                
        //--- preço
        { name: "item-preco", widget: "WaiContent", class:"row item-preco" },
        { name: "preco", widget: "WaiContent", tag: "p", value:"FormatValue($data.preco)", when: "_.isNumber($data.preco)" },
        { 
            name: "preco", 
            widget: "WaiContent", 
            when: "$data.valor != undefined",
            children:
            [
                { name: "tamanho", widget: "WaiContent", tag:"span", class:"title-tamanho", value: { "pt-BR": "`${$data.tamanho}: `"}},
                { name: "valor", widget: "WaiContent", tag:"span", class:"value-tamanho", value: { "pt-BR": "FormatValue($data.valor)"}},
            ]
        },
        
        //--- adicionar
        { name: "item-adicionar", widget: "WaiContent", class:"row" },
        { 
            name: "adicionar", 
            widget: "WaiButton", 
            value: { "pt-BR":"Adicionar" }, 
            type:"submit", 
            class:"btn-adicionar btn btn-primary"
        },

        //preço
        // { name: "item-preco", widget: "WaiContent", class:"content-item" },
        // { name: "preco", widget: "WaiContent", tag: "p", value:"$dataObj.preco", when: "_.isNumber($dataObj.preco)" }
    ]
};

var promocoesAbstrata = 
{
	name: "promocoes",
	widgets:
	[
        //Menu
        { 
            name: "menu", children:
            [
                { name: "menu-cardapio" },
                { name: "menu-promocoes" },
                { name: "menu-pedido" }
            ]
        },

        //Area de promoções
        {
            name:"promocoes", datasource:'$data.promocoes', children:
            [
                { name : "promocao" }
            ]
        }

	]
};

var promocoesConcreta = 
{
	name:"promocoes",
	head: head.concat([
        {name: 'title', widget:'Title', value: 'Promoções'}
    ]),
    structure: 
    [
        { 
            name: "promocoes", children: 
            [
                { 
                    name: "promocao", children:
                    [
                        { name: "promocao-image" },
                        { 
                            name: "promocao-caption", children: 
                            [
                                { name: "promacao-caption-titulo" },
                                { name: "promacao-caption-descricao" }
                            ] 
                        },
                    ]
                }

            ]
        }
    ],
    maps:
    [
        { name: "menu", widget: "WaiMenu", value:"Fast Food UAI", content:"#promocoes" },
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/cardapio/", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", class:"active", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/promocoes/", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/", value:{"pt-BR": "Pedido"} },
        { name: "promocoes", widget:"WaiCarousel" },
        { name: "promocao", widget:"WaiCarouselItem" },
        { name: "promocao-image", tag:"img", alt:"$data.descricao", src:"$data.img" },
        { name: "promocao-caption", widget:"WaiCarouselCaption" },
        { name: "promacao-caption-titulo", tag:"h3", value:"$data.nome" },
        { name: "promacao-caption-descricao", tag:"p", value:"$data.descricao" }
    ]
};

var pedidoAbstrata = 
{
	name: "pedido",
	widgets:
	[
        //Menu
        { 
            name: "menu", children:
            [
                { name: "menu-cardapio" },
                { name: "menu-promocoes" },
                { name: "menu-pedido" }
            ]
        },

        //cardápio
        {
            name: "cardapio", datasource:'$data.categorias', children:
            [
                { 
                    name: "categoria", datasource:"$data.itens", children:
                    [
                        { 
                            name: "item", when: "_.isArray($data.preco)", children:
                            [
                                { name: "imagem" },
                                { name: "descricao" },
                                { name: "item-preco", datasource: "$data.preco", children:[ { name: "preco" }]},
                                { name: "adicionar"}
                            ]
                        },
                        { 
                            name: "item", 
                            when: "_.isNumber($data.preco)",
                            children: 
                            [
                                { name: "imagem" },
                                { name: "descricao" },
                                { name: "preco" },
                                { name: "adicionar"}
                            ]
                        },
                    ]
                }
            ] 
        },

        //Pedido
        {
            name: "pedido", children:
            [
                {
                    name: "itens-pedido",  datasource:"$data.pedido.itens", children:
                    [
                        { 
                            name: "item-pedido", children:
                            [
                                { name: "nome" },
                                { name: "quantidade" },
                                { name: "total-item"},
                                { name: "remover" }
                            ]
                        }
                    ]
                },

                { name: "total"},
                { name: "finalizar-pedido" }
            ]
        }

	]
};

var pedidoConcreta = 
{
	name:"pedido",
	head: head.concat([
        {name: 'title', widget:'Title', value: 'Pedido'}
    ]),
    structure: 
    [
        {
            name: "cardapio", children:
            [
                { 
                    name: "categoria", children:
                    [
                        
                        { 
                            name: "item", children:
                            [
                                //Imagem
                                { 
                                    name: "content-imagem",
                                    children:
                                    [
                                        { name: "imagem" }
                                    ]
                                },

                                {
                                    name: "content-details", children:
                                    [
                                        //Descricao
                                        { name: "descricao" },
                                        
                                        //Preço do item
                                        { 
                                            name:"item-preco", children:
                                            [
                                                { name: "preco"}
                                            ] 
                                        },

                                        //Botão de adicionar item ao pedido
                                        { name: "item-adicionar", children:[{ name: "adicionar" }] }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        {
            name: "item-pedido", children:
            [
                { name: "nome" },
                { 
                    name: "content-total", children:
                    [
                        { name: "label-quantidade" },
                        { name: "quantidade" },
                        { name: "total-item" },
                        { name: "remover" }
                    ]
                },

            ]
        }
    ],
    maps:
    [
        { name: "menu", widget: "WaiMenu", value:"Fast Food UAI", content:"#promocoes" },
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/cardapio/", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/promocoes/", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/", class:"active", value:{"pt-BR": "Pedido"} },
        
        { name: "cardapio", widget:"WaiCollapse", class:"col-sm-8", value:{ "pt-BR":"Cardápio" } },
        { name: "categoria", widget: "WaiCollapseItem", value: "$data.nome" },
        
        { name: "item", widget: "WaiContent", class:"col-md-5 card border-rounded" },
        
        //Imagem
        { name: "content-imagem", widget: "WaiContent", class:"col-md-6 content-imagem" },
        { name: "imagem", tag:"img", src:"$data.imagem", alt:"$data.nome", class: "img-responsive img-item"},

        //Descrição
        { name: "content-details", widget:"WaiContent", class:"col-md-6" },

        //--- nome
        { name: "descricao", tag:"h4", class:"nome-produto row", value:"$data.nome"},        
                
        //--- preço
        { name: "item-preco", widget: "WaiContent", class:"row item-preco" },
        { name: "preco", widget: "WaiContent", tag: "p", value:"FormatValue($data.preco)", when: "_.isNumber($data.preco)" },
        { 
            name: "preco", 
            widget: "WaiContent", 
            when: "$data.valor != undefined",
            children:
            [
                { name: "tamanho", widget: "WaiContent", tag:"span", class:"title-tamanho", value: { "pt-BR": "`${$data.tamanho}: `"}},
                { name: "valor", widget: "WaiContent", tag:"span", class:"value-tamanho", value: { "pt-BR": "FormatValue($data.valor)"}},
            ]
        },
        
        //--- adicionar
        { name: "item-adicionar", widget: "WaiContent", class:"row" },
        { 
            name: "adicionar", 
            widget: "WaiButton", 
            value: { "pt-BR":"Adicionar" }, 
            type:"submit", 
            class:"btn-adicionar btn btn-primary"
        },

        //Pedido
        { name: "pedido", widget:"WaiContent", title:"Pedido", class: "col-md-3 content-pedido" },
        { name: "itens-pedido", widget:"WaiContent" },
        { name: "item-pedido", widget: "WaiContent", class:"row border-rounded", style: "padding: 1em" },
        { name: "nome", tag: "p", value:"$data.nome", style:"font-weight: bold"},
        { name: "content-total", class:"content-total", widget:"WaiContent" },
        { name: "label-quantidade", widget:"WaiContent", style:"margin-right:1em", tag: "span", value: {"pt-BR": "Quantidade"}},
        { name: "quantidade", widget:"WaiInput", type:"text", style:"margin-right:5em; text-align:center", value:"$data.quantidade", class:"input-quantidade" },
        { name: "total-item", widget:"WaiContent", tag: "span", style:"margin-right:1em", value:{"pt-BR": "FormatValue($data.total)"}},
        { 
            name: "remover", 
            widget: "WaiButton", 
            class:"btn-remover btn btn-danger",
            children: 
            [
                { name: "icon-remover", tag:"i", class:"fa fa-trash", "aria-hidden":"true"}
            ]
        },

        { name: "total", widget:"WaiContent", tag: "h3", value: {"pt-BR" : "FormatValue($data.pedido.total)"} },

        { 
            name: "finalizar-pedido", 
            widget: "WaiButton", 
            class:"btn-adicionar btn btn-success",
            value:"Finalizar"
        },
    ]
};


//Configuração do Api.ai
var interface_abstracts = [
    landingAbstrata,
    homeAbstrata,
    cardapioAbstrata,
    promocoesAbstrata,
    pedidoAbstrata
];

var concrete_interface = [
    landingConcreta,
    homeConcreta,
    cardapioConcreta,
    promocoesConcreta, 
    pedidoConcreta
];

var ajaxSetup = {
};

var configAPIAi = {
    defaultLanguage: 'pt-BR',
    projectId: 'newagent-596a4',
    tokens: {
        "pt-BR": "14e4103ed77f4ce28f3c8ace6176f8eb",
        "en-US": "31674df025dd4d14843970fbfc38f524"
    }
};

if(typeof define === 'function') {
    define([
        "jquery",
        "bootstrap",
        'mira/init'
    ], function ($, $bootstrap, Mira) {

        return function BookingMira() {
            var app = new Mira.Application(interface_abstracts, concrete_interface, rules, selection, configAPIAi);
            Mira.Widget.setDefault('BootstrapSimple');

            //Eventos Registrados pela aplicação
            window.OnStart = function() {
                var nome = $("#nome").val();
                var email = $("#email").val();

                if(!nome){
                    alert("Informe o seu nome para iniciar o teste");
                    return;
                }

                if(!email){
                    alert("Informe o seu e-mail para iniciar o teste");
                    return;
                }

                //Cria o novo teste e salva no banco de dados
                $.ajax({
                    url: "",
                    type: "POST",
                    data: { nome: nome, email: email },
                    success: function(data){
                        //Busca os dados iniciais
                        var testes = JSON.parse(localStorage.getItem("testes") || "[]");
                        testes.push(data);
                        localStorage.setItem("testes", JSON.stringify(testes));
                    },
                    error: function(error){
                        console.log(error);
                    }
                })
            }
        };
    });
};

//Funções auxiliares
var FormatValue = function(value){
    var format = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' };

    return value.toLocaleString("pt-BR", format);
}

window.IsTestEmAndamento = function(){
    var testes = JSON.parse(localStorage.getItem("testes") || "[]");
    var testeEmAndamento = testes.find(function(teste){
        return !teste.encerrado;
    });

    if(!testeEmAndamento)
        return false;

    window.idTeste = testeEmAndamento._id;
    return true;
};

window.pages = {
    home: "",
    cardapio: "#?URI=/api/fastfoodnovo/cardapio/",
    promocoes: "#?URI=/api/fastfoodnovo/promocoes/",
    pedido: "#?URI=/api/fastfoodnovo/pedido/"
},

window.IsPage = function(page){
    if(!IsTestEmAndamento())
        return false;

    var url = new URL(window.location);
    return window.pages[page] == url.hash;
}

