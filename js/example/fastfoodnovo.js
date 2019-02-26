"use strict";
//Define as regras para avaliação de widgets
var rules = [
];

//Define as regras para seleção de interface
var selection = [
    
    //landing

    //cardápio
    {
        when: "$data.categorias != null",
        abstract: "cardapio"
    }

    //promoções

    //pedido
     
];

var head = [
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

var landingConcreta = 
{
	name:"landing",
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
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"./cardapio", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", href:"./promocoes", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"./pedido", value:{"pt-BR": "Pedido"} },
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
                                { name: "item-preco", datasource: "$data.preco", children:[ { name: "preco" }]},
                            ]
                        },
                        { name: "item", when: "!_.isArray($data.preco)" },
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
                        { name: "categoria-cabecalho" },
                        {
                            name: "categoria-item",
                            children: 
                            [
                                { 
                                    name: "item", children:
                                    [
                                        { 
                                            name: "content-item",
                                            children:
                                            [
                                                //descrição do item
                                                { 
                                                    name: "item-descricao", children:
                                                    [
                                                        { name: "item-image" },
                                                        { name: "item-nome" },
                                                    ]
                                                },

                                                //Preço do item
                                                { name:"item-preco", children:[{ name: "preco" }] },
                                                
                                                //Quantidade
                                                { 
                                                    name: "item-quantidade",
                                                    children:
                                                    [
                                                        { 
                                                            name: 'form-group', 
                                                            children:
                                                            [
                                                                { name: 'label-quantidade' },
                                                                { 
                                                                    name: 'container-field',
                                                                    children: 
                                                                    [
                                                                        { name: 'quantidade'}
                                                                    ]
                                                                }
                                                            ]
                                                        },
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
            ]
        }
    ],
    maps:
    [
        { name: "menu", widget: "WaiMenu", value:"Fast Food UAI", content:"#promocoes" },
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"./cardapio", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", href:"./promocoes", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"./pedido", value:{"pt-BR": "Pedido"} },
        
        { name: "cardapio", widget:"WaiCollapse", value:{ "pt-BR":"Cardápio" } },
        { name: "categoria", widget: "WaiCollapseItem" },
        { name: "categoria-cabecalho", widget:"WaiCollapseItemHeader", value: "$data.nome" },
        { name: "categoria-item", widget: "WaiCollapseItemContent"},
        
        //descrição
        { name: "item", widget: "WaiCollapseItemContent" },
        { name: "item-descricao", widget: "WaiContent", class:"content-item" },
        { name: "item-image", tag:"img", src:"$data.imagem", alt:"$data.nome", class: "img-thumbnail img-responsive"},
        { name: "item-descricao", tag:"h5", value:"$data.nome"},

        //preço
        { name: "item-preco", widget: "WaiContent", class:"content-item" },
        { name: "preco", widget: "WaiContent", tag: "p", value:"$data.preco", when: "_.isNumber($data.preco)" },
        { 
            name: "preco", 
            widget: "WaiContent", when: "_.isObject($data)",
            children:
            [
                { name: "tamanho", widget: "WaiContent", tag:"span", value: { "pt-BR": "$data.tamanho"}},
                { name: "valor", widget: "WaiContent", tag:"span", value: { "pt-BR": "$data.valor"}},
            ]
        },

        //quantidade
        { name: "item-quantidade", widget: "WaiContent", class:"content-item" },
        { name: 'form-group', widget:'WaiContent', class: 'form-group' },
        { name: 'container-field', widget:'WaiContent', class:'col-sm-10' },
        { name: "label-quantidade", tag: 'label', for:"quantidade", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Quantidade" },
        { name: "quantidade", widget: "WaiInput" },

        //Adicionar item ao pedido
        { name: "item-adicionar", widget: "WaiContent", class:"content-item" },
        { 
            name: "adicionar", 
            widget: "WaiButton", 
            value: { "pt-BR":"Adicionar" }, 
            type:"submit", 
            class:"btn btn-primary"
        }

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
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"./cardapio", value:{"pt-BR": "Cardápio"}},
        { name: "menu-promocoes", widget:"WaiMenuItem", class:"active", href:"./promocoes", value:{"pt-BR": "Promoções"} },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"./pedido", value:{"pt-BR": "Pedido"} },
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

    ],
    maps:
    [

    ]
};


//Configuração do Api.ai
var interface_abstracts = [

    landingAbstrata,
    cardapioAbstrata,
    promocoesAbstrata,
    pedidoAbstrata
];

var concrete_interface = [
    landingConcreta,
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
        };
    });
};

