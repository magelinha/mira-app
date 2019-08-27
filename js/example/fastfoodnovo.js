"use strict";

window.GetIdPedido = function(){
    //Busca o último ativo
    var testes = JSON.parse(localStorage.getItem("testes"));
    if(!testes || !testes.length)
        return '';

    var currentTeste = testes.find(teste => !teste.encerrado);

    return currentTeste.pedido;
}


//Define as regras para avaliação de widgets
var rules = [
];

//Define as regras para seleção de interface
var selection = [
    
    //landing
    
    //home
    {
        when: "IsTestEmAndamento() && IsPage('home')",
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
    },

    //pedido
    {
        when: "IsPage('pedido-finalizado')",
        abstract: "pedido-finalizado"
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
        { name: "form-inicial", widget: "WaiForm", class: "form-horizontal form-dados col-md-4", events:{ submit: "OnStart"} },
        { name: "content-field", class: "form-group" },
        { name: "content-control", class: "col-sm-10" },

        { name: "label-nome", widget: "WaiContent", tag: "label", class: "col-sm-2", for:"#nome", value: { "pt-BR": "Nome: "} },
        { name: "nome", widget:"WaiInput", type: "text", placeholder:"Nome" },
        { name: "label-email", class: "col-sm-2", for:"#email", widget: "WaiContent", tag: "label", value: { "pt-BR": "E-mail: "} },
        { name: "email", widget:"WaiInput", type: "email", placeholder:"E-mail" },
        { name: "iniciar", value: "Iniciar", widget:"WaiButton", class:"btn btn-primary pull-right", style:"margin-right: 15px" },
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
                //{ name: "menu-promocoes" },
                { name: "menu-pedido" }
            ]
        },

        //Area de promoções
        {
            name:"promocoes", datasource:'url:<%= "/api/fastfoodnovo/promocoes" %>', children:
            [
                { name : "promocao" }
            ]
        },
        {
            name: "modal-mensagem", children:
            [
                { name: "titulo" },
                { name: "mensagem" },
                { name: "confirmar" }
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
                                { name: "promacao-caption-descricao" },
                                { name: "selecionar-promocao"}

                            ] 
                        },
                    ]
                }
            ]
        },
        {
            name: "modal-mensagem", children:
            [
                { name: "titulo" },
                { 
                    name: "modal-body", children: 
                    [
                        { name: 'mensagem' }
                    ]
                },
                {
                    name: 'modal-footer', children:
                    [
                        { name: "fechar" }
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
        { name: "menu-pedido", widget:"WaiMenuItem", href:`?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/${GetIdPedido()}`, value:{"pt-BR": "Pedido"} },
        { 
            name: "promocoes", widget:"WaiCarousel", "data-interval":false, events:
            {
                'slid.bs.carousel': 
                {
                    action: 'EvtSlidePromocao',
                    event: 'promocao_selecionada',
                    params: 
                    {
                        nome: 'GetNomePromocao()',
                        descricao: 'GetDescricaoPromocao()'
                    }
                },
                // focus: {
                //     action: 'EvtSlidePromocao',
                //     event: 'promocao_selecionada',
                //     params: 
                //     {
                //         nome: 'GetNomePromocao()',
                //         descricao: 'GetDescricaoPromocao()'
                //     }
                // }

            }
        },
        { name: "promocao", widget:"WaiCarouselItem" },
        { name: "promocao-image", tag:"img", alt:"$data.descricao", src:"$data.imagem" },
        { name: "promocao-caption", widget:"WaiCarouselCaption" },
        { name: "promacao-caption-titulo", tag:"h3", class:'titulo', value:"$data.nome", "data-id":"$data._id" },
        { name: "promacao-caption-descricao", tag:"p", value:"$data.descricao",},
        { name: "selecionar-promocao", widget: "WaiButton", value:"Quero", class: "btn btn-primary", "data-id":"$data._id", events: { click: "EvtClickItem"}},

        //modal para a mensagem
        { name: "modal-mensagem", widget:"WaiModal" },
        { name: "titulo", widget: "WaiModalHeader", value: "Alerta"},
        { name: "modal-body", widget: "WaiModalBody" },
        { name: "mensagem", widget: "WaiContent", tag: "h1"},
        { name: "modal-footer", widget:"WaiModalFooter" },
        { 
            name: "fechar", widget: "WaiButton", "data-dismiss":"modal",  class:"btn btn-primary", value: {"pt-BR": "Confirmar"}
        }
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
                //{ name: "menu-promocoes" },
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
        },
        {
            name: "modal-mensagem", children:
            [
                { name: "titulo" },
                { name: "mensagem" },
                { name: "confirmar" }
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
        },
        {
            name: "modal-mensagem", children:
            [
                { name: "titulo" },
                { 
                    name: "modal-body", children: 
                    [
                        { name: 'mensagem' }
                    ]
                },
                {
                    name: 'modal-footer', children:
                    [
                        { name: "fechar" }
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
        { name: "menu-pedido", widget:"WaiMenuItem", href:`?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/${GetIdPedido()}`, value:{"pt-BR": "Pedido"} },
        
        { name: "cardapio", widget:"WaiCollapse", value:{ "pt-BR":"Cardápio" } },
        { name: "categoria", widget: "WaiCollapseItem", value: "$data.nome" },
        
        { 
            name: "item", widget: "WaiContent", class:"col-md-3 card border-rounded", 'data-id': "$data._id", events: {
                focus: {
                    action: 'EvtItem',
                    event: 'falar_produto',
                    params: {
                        id: 'GetIdProduto()'
                    }
                }
            }
        },
        
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
            "data-id": "$data._id",
            value: { "pt-BR":"Adicionar" },
            class:"btn-adicionar btn btn-primary",
            events : { click: 'EvtClickItem'}
        },

        //preço
        // { name: "item-preco", widget: "WaiContent", class:"content-item" },
        // { name: "preco", widget: "WaiContent", tag: "p", value:"$dataObj.preco", when: "_.isNumber($dataObj.preco)" }

        //modal para a mensagem
        { name: "modal-mensagem", widget:"WaiModal" },
        { name: "titulo", widget: "WaiModalHeader", value: "Alerta"},
        { name: "modal-body", widget: "WaiModalBody" },
        { name: "mensagem", widget: "WaiContent", tag: "h1"},
        { name: "modal-footer", widget:"WaiModalFooter" },
        { 
            name: "fechar", widget: "WaiButton", "data-dismiss":"modal",  class:"btn btn-primary", value: {"pt-BR": "Fechar"}
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
                //{ name: "menu-promocoes" },
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
        { name: "menu-pedido", widget:"WaiMenuItem", href:`?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/${GetIdPedido()}`, value:{"pt-BR": "Pedido"} },
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
                //{ name: "menu-promocoes" },
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
                    name: "itens-pedido",  datasource:"$data.itens", children:
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
        },
        {
            name: "modal-mensagem", children:
            [
                { name: "titulo" },
                { name: "mensagem" },
                { name: "confirmar" }
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
        },
        {
            name: "modal-mensagem", children:
            [
                { name: "titulo" },
                { 
                    name: "modal-body", children: 
                    [
                        { name: 'mensagem' }
                    ]
                },
                {
                    name: 'modal-footer', children:
                    [
                        { name: "fechar" }
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
        { name: "menu-pedido", widget:"WaiMenuItem", href:`?app=example/fastfoodnovo#?URI=/api/fastfoodnovo/pedido/${GetIdPedido()}`, class:"active", value:{"pt-BR": "Pedido"} },
        
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
            "data-id": "$data._id",
            value: { "pt-BR":"Adicionar" },
            class:"btn-adicionar btn btn-primary",
            events : { click: 'EvtClickItem' }
        },

        //Pedido
        { name: "pedido", widget:"WaiContent", title:"Pedido", class: "col-md-3 content-pedido" },
        {
            name: "itens-pedido", widget:"WaiContent",
            events:
            {
                focus: {
                    action: 'EvtListarPedido',
                    event:'listar_pedido',
                    params:{
                        pedido: 'GetIdPedido()'
                    }
                }
            }
        },
        { 
            name: "item-pedido", 
            "data-id": "$data.id",
            widget: "WaiContent", 
            class:"row border-rounded", 
            style: "padding: 1em" ,
            events: { focus: 'EvtItemPedido' }
        },
        { name: "nome", tag: "p", value:"$data.nome", style:"font-weight: bold"},
        { name: "content-total", class:"content-total", widget:"WaiContent" },
        { name: "label-quantidade", widget:"WaiContent", style:"margin-right:1em", tag: "span", value: {"pt-BR": "Quantidade"}},
        { 
            name: "quantidade", 
            widget:"WaiInput", 
            type:"text", 
            "data-id": "$data.id",
            style:"margin-right:5em; text-align:center", 
            value:"$data.quantidade", 
            class:"input-quantidade",
            events: { change: 'EvtChangeQuantidade'}
        },
        { name: "total-item", widget:"WaiContent", tag: "span", class: "total_item", "data-total":"$data.total", style:"margin-right:1em", value:{"pt-BR": "FormatValue($data.total)"}},
        { 
            name: "remover", 
            widget: "WaiButton", 
            "data-id": "$data.id",
            class:"btn-remover btn btn-danger",
            children: 
            [
                { name: "icon-remover", tag:"i", class:"fa fa-trash", "aria-hidden":"true"}
            ],
            events : { click: 'EvtRemoverItem' }
        },

        { name: "total", widget:"WaiContent", tag: "h3", value: {"pt-BR" : "FormatValue($data.totalPedido)"} },

        { 
            name: "finalizar-pedido", 
            widget: "WaiButton", 
            class:"btn-adicionar btn btn-success",
            value:"Finalizar",
            events : {
                click: 
                {
                    event: 'finalizar_pedido',
                    action: 'EvtFinalizarPedido',
                    params: {
                        pedido: 'GetIdPedido()'
                    }
                }
            }
        },

        //modal para a mensagem
        { name: "modal-mensagem", widget:"WaiModal" },
        { name: "titulo", widget: "WaiModalHeader", value: "Alerta"},
        { name: "modal-body", widget: "WaiModalBody" },
        { name: "mensagem", widget: "WaiContent", tag: "h1"},
        { name: "modal-footer", widget:"WaiModalFooter" },
        { 
            name: "fechar", widget: "WaiButton", "data-dismiss":"modal",  class:"btn btn-primary", value: {"pt-BR": "Confirmar"}
        }
    ]
};

var pedidoFinalizadoAbstrata = 
{
	name: "pedido-finalizado",
	widgets:
	[
        { 
            name: "content-mensagem", 
            children: 
            [
                { name: "mensagem"}
            ]
        }
        
	]
};

var pedidoFinalizadoConcreta = 
{
	name:"pedido-finalizado",
	head: head.concat([
        {name: 'title', widget:'Title', value: 'fastFood Uai - Pedido Finalizado'}
    ]),
    maps:
    [
        { name: "content-mensagem", widget: "WaiContent", class:"bg-success", style:"height: 100vh" },
        { name: "mensagem", tag:"h3", value:"Obrigado por comprar na FastFoodUai", style:"margin: 0 auto"}
    ]
};


//Configuração do Api.ai
var interface_abstracts = [
    landingAbstrata,
    homeAbstrata,
    cardapioAbstrata,
    promocoesAbstrata,
    pedidoAbstrata,
    pedidoFinalizadoAbstrata
];

var concrete_interface = [
    landingConcreta,
    homeConcreta,
    cardapioConcreta,
    promocoesConcreta, 
    pedidoConcreta,
    pedidoFinalizadoConcreta
];

var ajaxSetup = {
};

var configAPIAi = {
    defaultLanguage: 'pt-BR',
    projectId: 'api-project-281112630384',
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
            window.OnStart = function(options) {
                options.$event.preventDefault();

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
                    url: "/api/fastfoodnovo/teste/criar",
                    type: "POST",
                    data: { nome: nome, email: email },
                    success: function(data){
                        //Busca os dados iniciais
                        let testes = JSON.parse(localStorage.getItem("testes") || "[]");
                        let value = _.extend(data.teste, { pedido: data.pedido._id});
                        testes.push(value);
                        localStorage.setItem("testes", JSON.stringify(testes));
                        location.reload();

                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            };

            window.EvtSlidePromocao = function(options){
                console.log('EvtSlidePromocao');
            }

            window.EvtClickItem = function(options){
                var params = {
                    quantidade: 1
                };

                IncluirItem(options.$element, params);
            }

            window.EvtConfirmarQuantidade = function(options){
                $("#modal-quantidade").modal('hide');
                Refresh();
            }

            window.EvtItem = function(options){
                console.log('EvtItem');
            }

            window.EvtItemPedido = function(options){
                var nome = options.$element.find('p').text();
                var quantidade = options.$element.find('input').val();
                var total = options.$element.find('span').data('total');

                var params = {
                    nome: nome,
                    quantidade: quantidade,
                    total: total
                }

                appApi.CallRequestEvent('item_pedido', params);
            }

            window.EvtRemoverItem = function(options){
                RemoverItem(options.$element);
            }

            window.EvtChangeQuantidade = function(options){
                ConfirmarAlteracaoQuantidade(options.$element);
            }

            window.EvtFinalizarPedido = function(options){
                //Caso tenha itens no pedido, salva o log
                appApi.SaveLog();
            }

            window.RemoverItemPedido = async function(options){
                console.log(options);
                var params = {
                    id: options.item ? null : appApi.$currentElement.data('id'),
                    item: options.item,
                    pedido: GetIdPedido()
                }

                await appApi.CallRequestEvent('remover_item', params);

                Refresh();
            }

            window.AlterarQuantidade = async function(options){

                var params = {
                    id: options.item ? null : appApi.$currentElement.data('id'),
                    item: options.item,
                    pedido: GetIdPedido(),
                    quantidade: options.quantidade
                }

                await appApi.CallRequestEvent('alterar_quantidade', params);

                Refresh();
            }

            window.TotalPedido = function(){
                var params = {
                    pedido: GetIdPedido()
                }
                
                appApi.CallRequestEvent('total_pedido', params);
            }

            var Refresh = function(){
                location.reload();

                // var collection = app.$env.collections["itens-pedido"];
                // //Busca os dados dos itens
                
                // collection.fetch({
                //     success: (collection, response, options) => {
                //         console.log("fez o fetch com sucesso");
                //         app.$env.$dataObj.trigger('change');
                //     },

                //     error: (collection, response, options) => {
                //         console.log("erro ao fazer o fetch");
                //     }
                // });
            }

            var RemoverItem = async function($element){
                //Busca  o id
                var id = $element.data('id');

                //busca o pedido
                var pedido = GetIdPedido();

                var params = {
                    id: id,
                    pedido: pedido
                }

                await appApi.CallRequestEvent('remover_item', params);
                Refresh();
            }

            var ConfirmarAlteracaoQuantidade = async function($element){
                //Busca  o id
                var id = $element.data('id');

                //busca o pedido
                var pedido = GetIdPedido();

                var quantidade = $element.val();

                var params = {
                    id: id,
                    pedido: pedido,
                    quantidade: quantidade
                };

                await appApi.CallRequestEvent('alterar_quantidade', params);
                Refresh();
            }

            window.GetNomePromocao = function(){
                console.log('GetNomePromocao');
                var $current =  $("#promocoes");
                return $current.find('.item.active h3').text();
            };

            window.GetDescricaoPromocao = function(){
                console.log('GetDescricaoPromocao');
                var $current =  $("#promocoes");
                return $current.find('.item.active p').text();
            };

            window.GetIdProduto = function(){
                return appApi.$currentElement.data('id');
            }

            window.SelectCategoria = function(params){
                var categoria = params.categoria;
                //Verifica qual categoria selecionada
                var $element = $(`a.accordion-toggle:contains(${categoria})`);
                if(!$element.length)
                    return;
                $element[0].click();

                //expande a categoria e focaliza no primeiro elemento disponível
                var id = $element.closest('.panel').find('.panel-body').children(':first').prop('id');
                var paramRequest = {
                    container: id
                };

                window.RequestFocus(paramRequest);
            }

            window.AdicionarItem = function(params){
                var $container = params.produto ? GetContainer(params.produto) : appApi.$currentElement;
                IncluirItem($container, params);
            }

            window.AdicionarItemEspecifico = async function(params){
                //busca o pedido
                var pedido = GetIdPedido();

                var options = {
                    item: params.item,
                    pedido: pedido,
                    quantidade: params.quantidade
                };

                await appApi.CallRequestEvent('adicionar_item', options);
            }

            window.AdicionarPromocao = function(params){
                //busca o item ativo
                var $container = appApi.$currentElement.find(".item.active .titulo");
                if($container.length)  
                    IncluirItem($container, params);
            }

            window.EvtListarPedido = function(params){
                var options = {
                    container: 'item-pedido'
                }
                RequestFocus(options);
            }

            var GetContainer = function(text){
                var item = $(`.nome-produto:contains(${text})`);
                return item.length ? item.parents('.card') : null;
            }

            var IncluirItem = async function($element, options){
                //Busca  o id
                var id = options.item ? null : $element.data('id');

                //busca o pedido
                var pedido = GetIdPedido();

                var params = {
                    id: id,
                    pedido: pedido,
                    item: options.item,
                    quantidade: options.quantidade,
                    tamanho: options.tamanho
                }

                await appApi.CallRequestEvent('adicionar_item', params);
                OpenModal('Item adicionado com sucesso!');
            }

            var OpenModal = function(mensagem){
                var $modal = $("#modal-mensagem");
                $modal.find('h1').text(mensagem);
                $modal.modal();

                //Fecha o modal depois de 3 segundos
                setTimeout(() => {
                    $modal.modal('hide');
                }, 3000);
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
    if(page != "pedido-finalizado" && !IsTestEmAndamento())
        return false;

    var url = new URL(window.location);

    //Se for a home, o hash tem que ser igual a home
    if(page == "home")
        return url.hash == window.pages[page];    
    
    return url.hash.includes(window.pages[page]);
}

window.GetCurrentPedido = function(){
    
    var testes = JSON.parse(localStorage.getItem("testes"));
    var currentTeste = testes.find(teste => !teste.encerrado);
    return currentTeste ? currentTeste.pedido.itens : [];
}

window.GetTotalPedido = function(){
    let $itens = $('.total_item');
    if(!$itens.length)
        return 0;

    let total = $itens.reduce((current, element) => {
        let $element = $(element);
        let totalItem = parseFloat($element.data("total"));
        return current + totalItem;
    });

    return total;
}

