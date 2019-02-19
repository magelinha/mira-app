"use strict";
//Define as regras para avaliação de widgets
var rules = [
    
];

//Define as regras para seleção de interface
var selection = [
    
    //landing

    //cardápio

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

var script = 
[
	{name: 'bootstrap_accessibility', widget:'Script', src:'bootstrap-accessibility.min.js'},
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
            name:"promocoes", children:
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

    ],
    maps:
    [
        { name: "menu", widget: "WaiMenu", value:"Fast Food UAI", content:"#promocoes" },
        { name: "menu-cardapio", widget:"WaiMenuItem", href:"./cardapio" },
        { name: "menu-promocoes", widget:"WaiMenuItem", href:"./promocoes" },
        { name: "menu-pedido", widget:"WaiMenuItem", href:"./pedido" },
        { name: "promocoes", widget:"WaiContent" },
        { name: "promocao", widget:"WaiContent" },
    ],
    script: script
};

var cardapioAbstrata = 
{
	name: "cardapio",
	widgets:
	[
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

    ],
    maps:
    [

    ],
    script: script
};

var promocoesAbstrata = 
{
	name: "promocoes",
	widgets:
	[

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

    ],
    maps:
    [

    ],
    script: script
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

    ],
    script: script
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

