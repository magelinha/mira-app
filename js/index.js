"use strict";
//Define as regras para avaliação de widgets
var rules = [
    {
        name: "isHome",
        validate: '$dataObj.item == ""'

    }
];

//Define as regras para seleção de interface
var selection = [
     
];

var GeralHead = [
    {name: "bootstrap", widget:"Head", href:"css/bootstrap.css", tag: "style"},
    {name: "fontawesone_css", widget:"Head", href:"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css", tag: "style"},
    {name: "font_montsrrat", widget:"Head", href:"https://fonts.googleapis.com/css?family=Montserrat:400,700", rel:"stylesheet", type:"text/css"},
    {name: "font_kaushan", widget:"Head", href:"https://fonts.googleapis.com/css?family=Kaushan+Script", rel:"stylesheet", type:"text/css"},
    {name: "font_droid", widget:"Head", href:"https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic", rel:"stylesheet", type:"text/css"},
    {name: "font_roboto", widget:"Head", href:"https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700", rel:"stylesheet", type:"text/css"},
    {name: "agency", widget:"Head", widget:"Head", href:"css/agency.min.css", tag: "style"},
    {name: "apresentacao", widget:"Head", widget:"Head", href:"css/apresentacao.css", tag: "style"},
    {name: "viewport", widget:"Meta", content:"width=device-width, initial-scale=1"}
];

var valores = {
    menu: [ 
        { item: "", url:"#page-top" }, 
        { item: { "pt-BR": "Projeto", "en-US": "Project"}, url:"#projeto"}, 
        { item: { "pt-BR": "Desenvolvedor", "en-US": "Developer"}, url:"#desenvolvedor"}, 
        { item: { "pt-BR": "Equipe", "en-US": "Team"}, url:"#content-colaboradores"}, 
        { item: { "pt-BR": "Exemplos", "en-US": "Examples"}, url:"#content-exemplos"}, 
        { item: { "pt-BR": "Vídeos", "en-US": "Videos"}, url:"#content-videos"}
    ],
    projeto:
    {
        "pt-BR": "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica.",
        "en-US": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop."
    },
    desenvolvedor:
    {
        imagem: "imgs/membros/magela.jpg",
        biografia: 
        {
            "pt-BR": "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica.",
            "en-US": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop."
        }
    },
    colaboradores:
    [
        { nome: "Daniel Schwabe", img: "imgs/membros/daniel.jpg", cargo: "Orientador" },
        { nome: "Laufer", img: "imgs/membros/laufer.jpg", cargo: "Professor" },
        { nome: "Wallace Ugulino", img: "imgs/membros/ugulino.jpg", cargo: "Professor" },
        { nome: "Ezequiel Bertti", img: "imgs/membros/ezequiel.jpg", cargo: "Desenvolvedor do Mira" }
    ],
    exemplos: [
        {name: "FastFood", href:"/?app=example/fastfood", source:'js/example/fastfood.js', img: "imgs/exemplos/fastfood.PNG"},
        {name: "Imobiliária", href:"/?app=example/imovel", source:'https://github.com/TecWebLab/mira/blob/master/js/example/imovel.js', img: "imgs/exemplos/imobiliaria.PNG"},
        {name: "Futebol", href:"/?app=example/futebol", source:'https://github.com/TecWebLab/mira/blob/master/js/example/futebol.js', img: "imgs/exemplos/futebol.PNG"},
        {name: "Todo", href:"/?app=example/todo", source:'https://github.com/TecWebLab/mira/blob/master/js/example/todo.js', img: "imgs/exemplos/todo.PNG"},
        {name: "Europeana", href:"/?app=example/europeana", source:'https://github.com/TecWebLab/mira/blob/master/js/example/europeana.js', img: "imgs/exemplos/europeana.PNG"},
        {name: "Reserva de Hotéis", href:"/?app=example/booking", source:'js/example/booking.js', img: "imgs/exemplos/reserva_hotel.PNG"},
    ],
    videos:
    [
        { 
            titulo: 
            {
                "pt-BR": "Demonstração Reserva de Hoteis",
                "en-US": "Demo Hotel Reservation"
            }, 
            url: "https://www.youtube.com/embed/oTAIIpIcUwI"
        },
        /*
        { 
            titulo: 
            {
                "pt-BR": "Demonstração Fast Food UAI",
                "en-US": "Demo Fast Food UAI"
            }, 
            url: "img/membros/daniel.jpg"
        }*/
    ]
}


//---------------------------------------------------------------------------------------- landing ----------------------------------------------------------------------------------------
var landingAbstrata = {
    name: "landing",
    title: {
        "pt-BR": "Projeto de Mestrado",
        "en-US": "Master's Project"
    },
    widgets: [
        {
            name: "mainNav",
            children:
            [
                {
                    name: "menu",
                    datasource: "valores.menu",
                    entity: { name: "menu", key: "item" },
                    children: [
                        {
                            name: "menu-item",
                            title: "$data.item"
                        }
                    ]
                }
            ]
        },
        {
            name: "projeto", children:
            [
                { name: "descricao-projeto", bind: "valores.projeto", tts: "$bind"}
            ]
        },
        {
            name: "desenvolvedor",
            children: [
                {
                    name: "desenvolvedor-imagem",
                    bind: "valores.desenvolvedor.imagem"
                },
                {
                    name: "desenvolvedor-biografia",
                    bind: "valores.desenvolvedor.biografia",
                    tts: "$bind"
                }
            ]
        },
        {
            name: "content-colaboradores", children:
            [
                {
                    name: "colaboradores",
                    datasource: "valores.colaboradores",
                    children: [
                        {
                            name: "colaborador",
                            tts: "sprintf(\"%s - %s \", \"$data.nome\", \"$data.cargo\")",
                            children: [
                                { name: "colaborador-image", bind: "$data.img" },
                                { name: "colaborador-nome", bind: "$data.nome" },
                                { name: "colaborador-cargo", bind:"$data.cargo" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "content-exemplos", children:
            [
                {
                    name: "container-exemplos", children:
                    [
                        {
                            name: "container-titulo-exemplo", children:
                            [
                                { name: "item-title-exemplos" },
                                { name: "item-subtitle-exemplos" }
                            ]
                        },
                        {
                            name: "exemplos",
                            datasource: "valores.exemplos",
                            children: [
                                {
                                    name: "exemplo",
                                    children: [
                                        { name: "exemplo-image" },
                                        { name: "exemplo-link" },
                                        { name: "exemplo-codigo-fonte" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "content-videos", children:
            [
                {
                    name: "videos",
                    datasource: "valores.videos",
                    children: [
                        {
                            name: "video",
                            bind:"$data",
                            tts: "$data.titulo"
                        }
                    ]
                }
            ]
        }
    ]
};

var landingConcreta = 
{
    name: "landing",
    head: GeralHead.concat([
        {name: "title", widget:"Title", value: "Projeto de Mestrado - PUC-Rio"}
    ]),
    structure: [
        //Estrutura do menu
        {
            name: "mainNav", children:
            [
                {
                    name: "container-center", children: 
                    [
                        { 
                            name: "title-menu", children:
                            [
                                { 
                                    name: "button-mobile", children:
                                    [
                                        { name: "span-readonly" },
                                        { name: "menu-value" },
                                        { name: "icon-menu" }
                                    ]
                                },
                                { name: "menu-item-home"}
                            ]
                        },
                        { 
                            name: "container-items", children:
                            [
                                { 
                                    name: "menu", children:
                                    [
                                        { 
                                            name: "menu-li", children:
                                            [
                                                { name: "menu-item" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }
            ]
        },

        //Projeto
        {
            name: "projeto", children:
            [
                {
                    name: "container-center", children: 
                    [
                        { 
                            name: "row", children:
                            [
                                { 
                                    name: "block-title", children:
                                    [
                                        { name: "item-title-projeto" },
                                        { name: "item-subtitle-projeto" },
                                    ]
                                },
                            ]
                        },
                        { 
                            name: "row", children:
                            [
                                { name: "descricao-projeto" },
                            ]
                        }
                    ]
                }
            ]
        },

        //Desenvolvedor
        {
            name: "desenvolvedor", children:
            [
                {
                    name: "container-center", children: 
                    [
                        { 
                            name: "row", children:
                            [
                                { 
                                    name: "block-title", children:
                                    [
                                        { name: "item-title-desenvolvedor" },
                                        { name: "item-subtitle-desenvolvedor" },
                                    ]
                                },
                            ]
                        },
                        { 
                            name: "row", children:
                            [
                                { name: "desenvolvedor-imagem" },
                                { name: "desenvolvedor-biografia" },
                            ]
                        }
                    ]
                }
            ]
        },

        //Colaboradores
        {
            name: "content-colaboradores", children:
            [
                {
                    name: "container-center", children: 
                    [
                        { 
                            name: "row", children:
                            [
                                { 
                                    name: "block-title", children:
                                    [
                                        { name: "item-title-colaboradores" },
                                        { name: "item-subtitle-colaboradores" },
                                    ]
                                },
                            ]
                        },
                        { 
                            name: "row", children:
                            [
                                {
                                    name: "colaboradores", children:
                                    [
                                        { 
                                            name: "colaborador", children:
                                            [
                                                { name: "colaborador-image" },
                                                { name: "colaborador-nome" },
                                                { name: "colaborador-cargo" },
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        //Vídeos
        {
            name: "content-videos", children:
            [
                {
                    name: "container-center", children: 
                    [
                        { 
                            name: "row", children:
                            [
                                { 
                                    name: "block-title", children:
                                    [
                                        { name: "item-title-video" },
                                        { name: "item-subtitle-video" },
                                    ]
                                },
                            ]
                        },
                        { 
                            name: "row", children:
                            [
                                { 
                                    name: "videos", children:
                                    [
                                        { name: "video" }
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
        //Auxiliares
        { name: "container-center", widget: "WaiContent", class:"container" },
        { name: "row", widget: "WaiContent", class:"row" },
        { name: "block-title", widget: "WaiContent", class:"col-lg-12 text-center" },
        
        //títulos
        { name: "item-title-projeto", widget: "WaiContent", class: "section-heading", tag:"h2", value: {"pt-BR": "Projeto", "en-US":"Project"} },
        { 
            name: "item-subtitle-projeto", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Informações sobre o objetivo do projeto", "en-US":"Information about goal of project" }
        },

        { name: "item-title-desenvolvedor", widget: "WaiContent", class: "section-heading", tag:"h2", value: {"pt-BR": "Desenvolvedor", "en-US":"Developer"} },
        { 
            name: "item-subtitle-desenvolvedor", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Conheça um pouco mais sobre o desenvolvedor do projeto", "en-US":"Learn more about the project developer" }
        },

        { name: "item-title-colaboradores", widget: "WaiContent", class: "section-heading", tag:"h2", value: {"pt-BR": "Equipe", "en-US":"Team"} },
        { 
            name: "item-subtitle-colaboradores", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Aqui estão as pessoas que ajudaram o projeto a ser tornar realidade", "en-US":"Here are the people who helped the project become reality" }
        },

        { name: "item-title-exemplos", widget: "WaiContent", class: "section-heading", tag:"h2", value: {"pt-BR": "Exemplos", "en-US":"Examples"} },
        { 
            name: "item-subtitle-exemplos", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Veja alguns projetos implementados com o Mira", "en-US":"See some projects implemented with Mira" }
        },

        { name: "item-title-video", widget: "WaiContent", class: "section-heading", tag:"h2", value: {"pt-BR": "Vídeos", "en-US":"Videos"} },
        { 
            name: "item-subtitle-video", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Veja alguns vídeos de demonstração", "en-US":"See some demo videos" }
        },


        { name: "mainNav", widget: "WaiContent", tag:"nav", class: "navbar navbar-default navbar-custom navbar-fixed-top" },
        
        { name: "title-menu", class: "navbar-header page-scroll" },
        
        //Menu mobile
        { name: "button-mobile", class: "navbar-toggle", "data-toggle": "collapse", "data-target": "#container-items", tag:"button" },
        { name: "span-readonly", class: "sr-only", value: "Toggle navigation", tag: "span" },
        { name: "menu-value", value: "Menu" },
        { name: "icon-menu", tag: "i", class:"fa fa-bars" },

        { name: "menu-item-home", class: "navbar-brand page-scroll", widget: "WaiContent", tag:"a", href: "#page-top", value: "Início" },

        //Itens do menu
        { name: "container-items", widget: "WaiContent", class:"collapse navbar-collapse" },
        { name: "menu", widget: "WaiListContent", tag: "ul", class: "nav navbar-nav navbar-right" },
        { name: "menu-li", widget: "WaiContent", when: "isHome", tag:"li", class:"hidden"},
        { name: "menu-li", widget: "WaiContent", tag:"li" },
        { name: "menu-item", href:"$data.url", widget:"WaiButton", tag:"a", value:"$data.item" },

        //Projeto
        { name: "projeto", widget: "WaiContent", tag:"section"},
        { name: "descricao-projeto", widget: "WaiContent", value:"$bind"},

        //desenvolvedor
        { name: "desenvolvedor", widget: "WaiContent", tag:"section" },
        { 
            name: "desenvolvedor-imagem", widget: "WaiContent", class:"col-sm-3", children:
            [
                { name: "image-dev", tag:"img", src:"$bind", class:"img-responsive img-rounded" }
            ]  
        },
        { name: "desenvolvedor-biografia", widget: "WaiContent", value: "$bind" },

        //Equipe
        { name: "content-colaboradores", widget: "WaiContent", tag:"section", class:"bg-light-gray" },
        { name: "colaboradores", widget: "WaiListContent" },
        { name: "colaborador", widget: "WaiContent", class:"col-sm-3 text-center" },
        { name: "colaborador-image", widget: "WaiContent", tag: "img", class:"img-responsive img-circle exemplo-image img-equipe", src: "$data.img" },
        { name: "colaborador-nome", widget: "WaiContent", tag: "h4", value: "$data.nome" },
        { name: "colaborador-cargo", widget: "WaiContent", tag: "p", class:"text-muted", value:"$data.cargo" },

        //Exemplos
        { name: "container-titulo-exemplo", widget:"WaiContent", class:"row text-center" },
        { name: "container-exemplos", widget: "WaiContent", class:"container" },
        { name: "content-exemplos", widget: "WaiContent", tag:"section" },
        { name: "exemplos", widget: "WaiContent" },
        { name: "exemplo", widget: "WaiContent", class:"col-sm-4 team-member group-exemplos" },
        { name: "exemplo-image", widget: "WaiContent", tag: "img", class:"img-responsive exemplo-image", src: "$data.img" },
        { name: "exemplo-link", widget: "WaiContent", tag: "a", class:"btn btn-primary col-sm-12", value: "$data.name", href:"$data.href", style:"margin-top:10px;" },
        { name: "exemplo-codigo-fonte", widget: "WaiContent", tag: "a", class:"btn btn-info col-sm-12", value:"Código Fonte", href:"$data.source", style:"margin-top:10px;" },

        //Vídeos
        { name: "content-videos", widget: "WaiContent", tag:"section" },
        { name: "videos", widget: "WaiListSelect"},
        { 
            name: "video", widget: "WaiContent", class:"col-sm-6 text-center", children: 
            [
                {
                    name: "embed-video", widget:"WaiContent", class: "embed-responsive embed-responsive-16by9", children:
                    [
                        { name: "iframe-video", tag: "iframe", src:"$data.url", allowfullscreen:true },
                    ]
                },
                { name: "title-video", tag: "h5", value:"$data.titulo"},
            ]
        },
    ]
};
//---------------------------------------------------------------------------------------- Fim: landing ----------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------- Fim das Interfaces  ----------------------------------------------------------------------------------------
var interface_abstracts = [
    landingAbstrata, 
];

var concrete_interface = [
    landingConcreta, 
];

var ajaxSetup = {

};

var configAPIAi = {
    defaultLanguage: "pt-BR",
    tokens: 
    {
        "pt-BR": "c9139162143c4836b87c21dbce326362",
        "en-US": "17dde376a370484b89a00c8c71cb8d78"
    }
};

if(typeof define === 'function') {
    define([
        "jquery",
        "bootstrap",
        "mira/init"
    ], function ($, $bootstrap, Mira) {

        return function BookingMira() {
            var app = new Mira.Application(interface_abstracts, concrete_interface, rules, selection, configAPIAi);
            Mira.Widget.setDefault("BootstrapSimple");

            //Eventos que serão chamados a partir de uma intenção
            var body = $("body");
            body.prop("id", "page-top");
            body.addClass("index");
        };
    });
} else {
    exports.ajaxSetup = ajaxSetup;
    exports.abstracts = interface_abstracts;
    exports.mapping = concrete_interface;
    exports.selection = selection;
    exports.rules = rules;
}