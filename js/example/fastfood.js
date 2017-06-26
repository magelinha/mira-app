"use strict";
//Define as regras para avaliação de widgets
var rules = [
    
];

//Define as regras para seleção de interface
var selection = [
    
    {
        when: "!_.isUndefined($data.numero) && $data.numero > 0 && window.selecionados.length > 0",
        abstract: 'pedido'
    },

    {
        when: "window.selecionados.length <= 0",
        abstract: 'landing'
    },
     
];

var GeralHead = [
    {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
    {name: 'fontawesone_css', widget:'Head', href:'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', tag: 'style'},
    {name: 'booking_css', widget:'Head', href:'css/FastFood.css', tag: 'style'},
    {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'}
];


//---------------------------------------------------------------------------------------- landing ----------------------------------------------------------------------------------------
var landingAbstrata = {
    name: "landing",
    title: { "pt-BR": "Fast Food UAI - Área de pedidos", "en-US": "Fast Food UAI - Order area" },
    widgets: [
        { name: "tutorial", title: "Tutorial", bind: "tutorial"},
        {
            name: "section-add-item",
            children: [
                {
                    name: "adicionar-item",
                    title:
                    {
                        "pt-BR": "Selecionar Itens",
                        "en-US": "Select Items"
                    },
                    children: [
                        {
                            name: "alimento",
                            label: "Item",
                            entity: { name: "alimento", key: "name" },
                            validation: function(value){
                                return { success: value != undefined && value.length > 0 };
                            },
                            datasource: "url:<%= \"/api/FastFood/itens\" %>",
                            children: [
                                {
                                    name: "option-item",
                                    error: 
                                    {
                                        name: "default",
                                        message: {
                                            "pt-BR": "O item não foi informado",
                                            "en-US": "The item didn't informed"
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name: "quantidade",
                            label: {
                                "pt-BR": "Quantidade",
                                "en-US": "Quantity"
                            },
                            validation: function(value){
                                
                                //empty
                                if(value == "")
                                    return { success: false, error: 'empty'};
                                
                                //Invalid
                                if(_.isNaN(value) || !Number.isInteger(parseInt(value)))
                                    return { success: false, error: 'invalid'};

                                if(parseInt(value) > 3)
                                    return { success: false, error: 'maxValue'};

                                if(parseInt(value) < 1)
                                    return { success: false, error: 'minValue'};

                                return { success: true };

                            },
                            error: [
                                {
                                    name: "empty",
                                    message: {
                                        "pt-BR": "A quantidade não foi informada",
                                        "en-US": "The quantity didn't informed"
                                    }
                                },
                                {
                                    name: "maxValue",
                                    message: {
                                        "pt-BR": "A quantidade não pode ser maior que três.",
                                        "en-US": "The quantity can not be greater than three."
                                    }
                                },
                                {
                                    name: "minValue",
                                    message: {
                                        "pt-BR": "A quantidade não pode ser menor que um.",
                                        "en-US": "The amount can not be less than one."
                                    }
                                },
                                {
                                    name: "invalid",
                                    message: {
                                        "pt-BR": "O valor informado não é um número",
                                        "en-US": "The value informed is not a number."
                                    }
                                }
                            ]
                        },
                        {
                            name: "confirmar",
                            bind: {
                                "pt-BR": "Adicionar",
                                "en-US": "Add"
                            }
                        }
                    ]
                }
            ]
        },
        {
            name: "section-itens",
            title:
            {
                "pt-BR": "Lista de Itens",
                "en-US": "List of Items"
            },
            children: [
                {
                    name: "lista-itens",
                    
                    datasource: "selecionados",
                    children: 
                    [
                        {
                            name: "item-informado",
                            bind: "$data",
                            tts: 
                            {
                                "pt-BR": "sprintf('Item: %s. Quantidade: %d. Preço: %0.2f', '$data.item', $data.quantidade, $data.total)",
                                "en-US": "sprintf('Item: %s. Quantity: %d. Price: %0.2f', '$data.item', $data.quantidade, $data.total)"
                            }
                        }
                    ]
                },
                { name: "limpar-lista", bind: { "pt-BR": "Limpar", "en-US": "Clear" }, title: { "pt-BR":"Limpar lista de pedidos", "en-US":"Clear list of order" } },
                { name: "cadastrar-pedido", bind: { "pt-BR": "Cadastrar", "en-US": "Register" }, title: { "pt-BR":"Registrar o pedido", "en-US":"Register order" } },
                { 
                    name:"valor-total", 
                    bind: "_.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0)",
                    tts: "$bind"
                }
            ]
        }
    ]
};
var landingConcreta = 
{
    name: 'landing',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: 'Registro de Pedido'}
    ]),
    structure: 
    [
        {
            name: "section-itens", children:
            [
                {
                    name: "block-table", children:
                    [
                        {
                            name:"table-itens", children:
                            [
                                { name:"table-header" },
                                { name: "lista-itens", children:
                                    [
                                        { name: "item-informado" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "block-total", children:
                    [
                        { name:"valor-total" },
                        { 
                            name:"block-buttons", children:
                            [
                                { name:"limpar-lista" },
                                { name:"cadastrar-pedido" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    maps: 
    [
        
        //Sessões    
        { name: "section-add-item", widget: "WaiContent", tag: "section", class:"row" },
        { name: "section-itens", widget: "WaiContent", tag: "section", class:"row" },
        { name: "block-table", widget: "WaiContent", class:"col-sm-8"},
        { name: "block-total", widget: "WaiContent", class:"col-sm-4"},
        { name: "block-buttons", widget: "WaiContent", class:"row text-center"},

        //tutorial 
        { name: "tutorial", widget: "WaiContent", value: "$bind", class:"alert alert-info" },

        //Formulário
        { name: "adicionar-item", widget: "WaiForm", class: "form-horizontal", events:{ submit: "AdicionarItem" } },
        { name: "alimento", widget: "WaiSelect" },
        { name: "option-item", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.name" },
        { name: "quantidade", widget: "WaiInput" },
        { name: "confirmar", widget: "WaiButton", value:"$bind", class:"btn btn-primary pull-right" },
        
        /* Lista de itens */
        { name: "table-itens", tag: "table", widget:"WaiContent", class:"table table-bordered table-hover" },
        { 
            //Cabeçalho
            name: "table-header", tag: "thead", widget: "WaiContent", children:
            [
                { 
                    name: "tr-head", tag:"tr", widget: "WaiContent", children:
                    [
                        { name: "header-item", tag:"th", widget: "WaiContent", value: "Item" },
                        { name: "header-item", tag:"th", widget: "WaiContent", value: { "pt-BR":"Quantidade", "en-US":"Quantity" } },
                        { name: "header-item", tag:"th", widget: "WaiContent", value: { "pt-BR": "Total (R$)", "en-US": "Total (US$)"} }
                    ]
                }
            ]
        },

        { name: "lista-itens", tag:"tbody", widget: "WaiListContent" },
        { 
            name: "item-informado", tag:"tr", widget: "WaiContent", children:
            [
                { name: "item-name", tag:"td", widget: "WaiContent", value: "$data.item"},
                { name: "item-quantidade", tag:"td", widget: "WaiContent", value: "$data.quantidade"},
                { name: "item-preco", tag:"td", widget: "WaiContent", value: "$data.total.formatMoney()"}
            ]
        },

        { 
            name: "valor-total", widget: "", class:"row text-center", children:
            [
                { name: "label-total", widget: "WaiContent", tag:"strong", value: "Total: " },
                { name: "label-total", widget: "WaiContent", tag:"span", value: "$bind.formatMoney()" },
            ]
        },

        //Operações da view
        { name: "limpar-lista", widget: "WaiButton", class: "btn btn-danger btn-lg", value: "$bind", events: { click: "LimparLista"}},
        { name: "cadastrar-pedido", tag:"a", widget:"WaiButton", class: "btn btn-success btn-lg", value: "$bind", href:"navigate('fastfood/gerarPedido')" },
         
    ]
};
//---------------------------------------------------------------------------------------- Fim: landing ----------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------- pedido ----------------------------------------------------------------------------------------
var pedidoAbstrata = {
    name: "pedido",
    title: { "pt-BR": "Fast Food UAI - Número do pedido", "en-US": "Fast Food UAI - Number of Order"},
    widgets: [
        {
            name: "section-numero-pedido",
            title: {
                "pt-BR": "Número do pedido",
                "en-US": "Number of Order"
            },
            children: [
                {
                    name: "numero",
                    bind: "$data.numero",
                    tts: "$bind"
                }
            ]
        },
        {
            name: "section-itens",
            title:
            {
                "pt-BR": "Lista de Itens",
                "en-US": "List of Items"
            },
            children: [
                {
                    name: "lista-itens",
                    
                    datasource: "selecionados",
                    children: 
                    [
                        {
                            name: "item-informado",
                            bind: "$data",
                            tts: 
                            {
                                "pt-BR": "sprintf('Item: %s. Quantidade: %d. Preço: %f', '$data.item', $data.quantidade, $data.total)",
                                "en-US": "sprintf('Item: %s. Quantity: %d. Price: %f', '$data.item', $data.quantidade, $data.total)"
                            }
                        }
                    ]
                },
                { name: "novo-pedido", bind: { "pt-BR": "Novo Pedido", "en-US": "New Order" }, title: { "pt-BR":"Cadastrar novo pedido", "en-US":"Register new order" } },
                { 
                    name:"valor-total", 
                    bind: "_.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0)",
                    tts: "$bind"
                }
            ]
        }
    ]
};
var pedidoConcreta = 
{
    name: 'pedido',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: 'Número do Pedido'}
    ]),
    structure: 
    [
        {
            name: "section-itens", children:
            [
                {
                    name: "block-table", children:
                    [
                        {
                            name:"table-itens", children:
                            [
                                { name:"table-header" },
                                { 
                                    name: "lista-itens", children:
                                    [
                                        { name: "item-informado" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "block-total", children:
                    [
                        { name:"valor-total" },
                        { 
                            name:"block-buttons", children:
                            [
                                { name:"novo-pedido" }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    maps: 
    [
        { name: "section-numero-pedido", widget: "WaiContent", class:"text-center" },
        { name: "section-itens", widget: "WaiContent" },
        { name: "section-itens", widget: "WaiContent", tag: "section", class:"row" },
        { name: "block-table", widget: "WaiContent", class:"col-sm-8"},
        { name: "block-total", widget: "WaiContent", class:"col-sm-4"},
        { name: "block-buttons", widget: "WaiContent", class:"row text-center"},

        { 
            name: "numero", widget: "WaiContent", class:"alert alert-success", children:
            [
                { name: "content-numero", widget:"WaiContent", tag:"strong", value:"$data.numero" }
            ]
        },

        /* Lista de itens */
        { name: "table-itens", tag: "table", widget:"WaiContent", class:"table table-bordered table-hover" },
        { 
            //Cabeçalho
            name: "table-header", tag: "thead", widget: "WaiContent", children:
            [
                { 
                    name: "tr-head", tag:"tr", widget: "WaiContent", children:
                    [
                        { name: "header-item", tag:"th", widget: "WaiContent", value: "Item" },
                        { name: "header-item", tag:"th", widget: "WaiContent", value: { "pt-BR":"Quantidade", "en-US":"Quantity" } },
                        { name: "header-item", tag:"th", widget: "WaiContent", value: { "pt-BR": "Total (R$)", "en-US": "Total (US$)"} }
                    ]
                }
            ]
        },

        { name: "lista-itens", tag:"tbody", widget: "WaiListContent" },
        { 
            name: "item-informado", tag:"tr", widget: "WaiContent", children:
            [
                { name: "item-name", tag:"td", widget: "WaiContent", value: "$data.item"},
                { name: "item-quantidade", tag:"td", widget: "WaiContent", value: "$data.quantidade"},
                { name: "item-preco", tag:"td", widget: "WaiContent", value: "$data.total.formatMoney()"}
            ]
        },

        { 
            name: "valor-total", widget: "WaiContent", class:"row text-center", children:
            [
                { name: "label-total", widget: "WaiContent", tag:"strong", value: "Total: " },
                { name: "label-total", widget: "WaiContent", tag:"span", value: "$bind.formatMoney()" },
            ]
        },

        //Operações da view
        { name: "limpar-lista", widget: "WaiButton", class: "btn btn-danger btn-lg", value: "$bind", events: { click: "LimparLista"}},
        { name: "novo-pedido", widget:"WaiButton", class: "btn btn-success btn-lg", value: "$bind", events: {click:"NovoPedido" } },
         
    ]
};
//---------------------------------------------------------------------------------------- Fim: pedido ----------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------- Fim das Interfaces  ----------------------------------------------------------------------------------------
var interface_abstracts = [

    landingAbstrata, 
    pedidoAbstrata
];

var concrete_interface = [
    landingConcreta, 
    pedidoConcreta
];

var ajaxSetup = {
};

var configAPIAi = {
    defaultLanguage: 'pt-BR',
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

            window.selecionados = new Mira.Api.Collection([]);
            window.numero = 0;
            window.tutorial = {
                "pt-BR": `Bem vindo ao Fast Food UAI, onde você poderá fazer o pedido do alimento desejado sem enfrentar filas.
                Para fazer o pedido siga os seguintes passos. Informe o item desejado e quantidade. Depois clique em "Adicionar".
                Você poderá limpar a lista de pedidos clicando em "Limpar".
                Para finalizar o pedido, clique em "Registrar". Com isso o número do pedido será gerado, então é so aguardar. Bom apetite.`,

                "en-US": `Welcome to Fast Food UAI, You'll can do order of food desired without queues. To order follow the steps. 
                Select food desired and the quantity. After click in "Add". You'll can clean the list of order clicking in "Clean".
                To finish order click in "Register". The number of order will be generated. Enjoy.`
            };

            var messages = {
                "pt-BR": 
                [
                    {
                        name: "add",
                        message: "Item adicionado com sucesso. O valor total até o momento é %.2f reais"
                    },
                    {
                        name: "clear",
                        message: "Lista limpada com sucesso."
                    }
                ],
                "en-US": 
                [
                    {
                        name: "add",
                        message:"Item added successfully. The total amount so far is %.2f dollars."
                    },
                    {
                        name: "clear",
                        message:"List successfully cleaned."
                    }
                ]
                
            }

            window.AdicionarItem = function(options){
                
                var values = {
                    idItem: options.$element.find("#alimento").val(),
                    quantidade: parseInt(options.$element.find("#quantidade").val())
                }

                //Busca o item
                var alimentos = !_.isArray(options.$env.collections.alimento) ? options.$env.collections.alimento.models : 
                                    options.$env.collections.alimento[1].models;
                
                var alimento = _.find(alimentos, function(x){ return x.get("id") == values.idItem });
                var valueAlimento = alimento.get("name");
                var itemValue = {};
                for(var key in valueAlimento)
                    itemValue[key] = valueAlimento[key].value;

                //Gera o item selecioando
                var itemSelecionado = {
                    idItem: values.idItem,
                    item: itemValue,
                    quantidade: values.quantidade,
                    total: values.quantidade * alimento.get("price")
                };

                var selecionado = window.selecionados.find(function(x){ return x.get("idItem") == itemSelecionado.idItem });
                
                if(selecionado){
                    selecionado.set("quantidade", selecionado.get("quantidade") + itemSelecionado.quantidade);
                    selecionado.set("total", selecionado.get("total") + itemSelecionado.total);
                }else{
                    window.selecionados.add(itemSelecionado);
                }


                //Mensagem indicando que salvou com sucesso
                appApi.tts(
                    sprintf(
                        _.find(messages[appApi.currentLanguage], function(x){ return x.name == "add"}).message, 
                        _.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0)
                    )
                );

                options.$dataObj.trigger("change");
            };

            window.LimparLista = function(options){
                window.selecionados.each(function(element){
                    element.destroy();
                });
                
                appApi.tts(_.find(messages[appApi.currentLanguage], function(x){ return x.name == "clear"}).message);
                app.$env.$dataObj.trigger("change");
            };

            window.CadastrarPedido = function(options){
                $("#cadastrar-pedido").click();
            };

            window.NovoPedido = function(options){
                options.$event.preventDefault();
                window.location.href = "/?app=example/fastfood";
            }
        };
    });
} else {
    exports.ajaxSetup = ajaxSetup;
    exports.abstracts = interface_abstracts;
    exports.mapping = concrete_interface;
    exports.selection = selection;
    exports.rules = rules;
}