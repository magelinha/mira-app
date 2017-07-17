"use strict";
//Define as regras para avaliação de widgets
var rules = [
    
];

//Define as regras para seleção de interface
var selection = [
     
];

var GeralHead = [
    {name: "bootstrap", widget:"Head", href:"css/bootstrap.css", tag: "style"},
    {name: "fontawesone_css", widget:"Head", href:"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css", tag: "style"},
    {name: "font_montsrrat", href:"https://fonts.googleapis.com/css?family=Montserrat:400,700", rel:"stylesheet", type:"text/css"},
    {name: "font_kaushan", href:"https://fonts.googleapis.com/css?family=Kaushan+Script", rel:"stylesheet", type:"text/css"},
    {name: "font_droid", href:"https://fonts.googleapis.com/css?family=Droid+Serif:400,700,400italic,700italic", rel:"stylesheet", type:"text/css"},
    {name: "font_roboto", href:"https://fonts.googleapis.com/css?family=Roboto+Slab:400,100,300,700", rel:"stylesheet", type:"text/css"},
    {name: "agency", widget:"Head", href:"css/agency.min.css", tag: "style"},
    {name: "viewport", widget:"Meta", content:"width=device-width, initial-scale=1"}
];

var valores = {
    menu: [ { item: "Projeto"}, { item: "Desenvolvedor"}, { item: "Orientador"}, { item: "Vídeos"} ],
    projeto:
    {
        "pt-BR": "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica.",
        "en-US": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop."
    }
    desenvolvedor:
    {
        imagem: "",
        biografia: 
        {
            "pt-BR": "Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica.",
            "en-US": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop."
        }
    },
    colaboradores:
    [
        { nome: "Daniel Schwabe", img: "img/membros/daniel.jpg", cargo: "Orientador" },
        { nome: "Laufer", img: "img/membros/laufer.jpg", cargo: "Professor" },
        { nome: "Walace Ugulino", img: "img/membros/ugulino.jpg", cargo: "Professor" },
    ],
    videos:
    [
        { 
            titulo: 
            {
                "pt-BR": "Demonstração Reserva de Hoteis",
                "en-US": "Demo Hotel Reservation"
            }, 
            url: "https://www.youtube.com/watch?v=oTAIIpIcUwI&t=8s"
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
            name: "menu-container",
            children:
            [
                {
                    name: "menu",
                    datasource: "valores.menu",
                    entity: { name: "menu", key: "item" },
                    children: [
                        {
                            name: "menu-item",
                            bind: "valores.item"
                        }
                    ]
                }
            ]
        },
        {
            name: "projeto",
            bind: "valores.projeto",
            tts: "$bind"
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
            name: "colaboradores",
            datasource: "valores.colaboradores",
            children: [
                {
                    name: "colaborador",
                    children: [
                        {
                            name: "colaborador-image"
                        },
                        {
                            name: "colaborador-cargo"
                        }
                    ]
                }
            ]
        },
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
};
var landingConcreta = 
{
    name: "landing",
    head: GeralHead.concat([
        {name: "title", widget:"Title", value: "Title Page"}
    ]),
    structure: [
        //Estrutura do menu
        {
            name: "mainNav", children:
            [
                {
                    name: "container", children: 
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
                        { name: "container-items" },
                        { 
                            name: "menu", children:
                            [
                                { name: "menu-item" }
                            ]
                        }
                    ]
                }
            ]
        },

        //Projeto
        {
            name: "projeto", children:
            [
                {
                    name: "container", children: 
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
                                { name: "text-project" },
                            ]
                        }
                    ]
                }
            ]
        }

        //Desenvolvedor
        {
            name: "desenvolvedor", children:
            [
                {
                    name: "container", children: 
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
                    name: "container", children: 
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
                    name: "container", children: 
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
        { name: "container", widget: "WaiContent", class:"container" },
        { name: "row", widget: "WaiContent", class:"row" },
        { name: "block-title", widget: "WaiContent", class:"col-lg-12 text-center" },
        { name: "container", widget: "WaiContent", class:"container" },
        
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
            name: "item-subtitle-desenvolvedor", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Aqui estão as pessoas que ajudaram o projeto a ser tornar realidade", "en-US":"Here are the people who helped the project become reality" }
        },

        { name: "item-title-video", widget: "WaiContent", class: "section-heading", tag:"h2", value: {"pt-BR": "Membros", "en-US":"Members"} },
        { 
            name: "item-subtitle-video", widget: "WaiContent", class: "section-subheading text-muted", tag:"h3", 
            value: {"pt-BR": "Veja alguns vídeos de demonstração", "en-US":"See some demo videos" }
        },


        { name: "mainNav", widget: "WaiContent", tag:"nav", class: "navbar navbar-default navbar-custom navbar-fixed-top" },
        
        { name: "title-menu", class: "navbar-header page-scroll" },
        
        //Menu mobile
        { name: "button-mobile", class: "navbar-toggle", "data-toggle": "collapse", "data-target": "#container-items" },
        { name: "span-readonly", class: "sr-only", value: "Toggle navigation", tag: "span" },
        { name: "menu-value", value: "Menu" },
        { name: "icon-menu", tag: "i", class:"fa fa-bars" },

        { name: "menu-item-home", class: "navbar-brand page-scroll", widget: "WaiContent", href: "#page-top", value: "Início" },

        //Itens do menu
        { name: "container-items", widget: "WaiContent", class:"collapse navbar-collapse" },
        { name: "menu", widget: "WaiListContent", tag: "ul", class: "nav navbar-nav navbar-right" },
        { 
            name: "menu-item", widget: "WaiContent", when: "isHome", tag:"li", class:"hidden", children:
            [
                { name: "link-item", href:"$bind", widget:"WaiContent", tag:"a" },
            ] 
        },

        { 
            name: "menu-item", widget: "WaiContent", tag:"li", children:
            [
                { name: "link-item", href:"$bind", widget:"WaiContent", tag:"a" },
            ] 
        },

        //Projeto
        { name: "projeto", widget: "WaiContent", tag:"section"},
        { name: "text-project", widget: "WaiContent", value:"$bind"},

        //desenvolvedor
        { name: "desenvolvedor", widget: "WaiContent", tag:"section" },
        { name: "desenvolvedor-imagem", widget: "WaiContent", tag:"img", src:"$bind" },
        { name: "desenvolvedor-biografia", widget: "WaiContent", value: "$bind" },

        //Equipe
        { name: "content-colaboradores", widget: "WaiContent", tag:"section" },
        { name: "colaboradores", widget: "WaiContent", class:"col-sm-4" },
        { name: "colaborador", widget: "WaiContent", class:"team-member" },
        { name: "colaborador-image", widget: "WaiContent", tag: "img", src: "$bind" },
        { name: "colaborador-cargo", widget: "WaiContent", tag: "h4", value:"$bind" }

        //Vídeos
        { name: "content-videos", widget: "WaiContent", tag:"section" },
        { name: "videos", widget: "WaiListSelect" },
        { 
            name: "video", widget: "WaiContent", class:"col-sm-4", children: 
            [
                { name: "iframe-video", tag: "iframe", class:"embed-responsive embed-responsive-16by9", src:"$data.url"},
                { name: "title-video", tag: "h3", src:"$data.titulo"},
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
    tokens: [
        { "pt-BR": "c9139162143c4836b87c21dbce326362" }    
        { "en-US": "17dde376a370484b89a00c8c71cb8d78" }
    ];
    
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