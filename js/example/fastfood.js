"use strict";
//Define as regras para avaliação de widgets
var rules = [
    
];

//Define as regras para seleção de interface
var selection = [
    
    {
        when: "!_.isUndefined($data.numero) && $data.numero > 0",
        abstract: 'pedido'
    },

    {
        when: "_.isUndefined($data.numero)",
        abstract: 'landing'
    },
     
];

var GeralHead = [
    {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
    {name: 'fontawesone_css', widget:'Head', href:'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', tag: 'style'},
    {name: 'fastfood_css', widget:'Head', href:'css/fastFood.css', tag: 'style'},
    {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'}
];

window.ChangeCurrentValue = function(){
    //De 20 em 20 Segundos, atualiza o número do pedido
    setInterval(function(){

        var $atual = $("#value-numero-atual");
        var $pedido = $("#value-numero-pedido");

        if(!$atual.length || !$pedido.length)
            return;

        var valueAtual = parseInt($atual.text());
        var valuePedido = parseInt($pedido.text());

        var params = {numeroAtual: valueAtual, numeroPedido: valuePedido};
        appApi.CallRequestEvent("proximo_item", params).done(function(){
            $atual.text(valueAtual + 1);
        });

    }, 20000)
}

//---------------------------------------------------------------------------------------- landing ----------------------------------------------------------------------------------------
var landingAbstrata = {
    name: "landing",
    widgets: [
        { 
            name: "container-center" , children:
            [
                {
                    name: "section-add-item",
                    children: [
                        { name: 'titulo-formulario' },
                        {
                            name: "adicionar-item",
                            children: [
                                { 
                                    name: 'cardapio',
                                    children:
                                    [
                                        { 
                                            name: 'sanduiches', 
                                            datasource:'url:<%= "/api/fastfood/sanduiches" %>',
                                            children:
                                            [   
                                                {name: 'sanduiche' }
                                            ]
                                        },
                                        { 
                                            name: 'bebidas',
                                            datasource:'url:<%= "/api/fastfood/bebidas" %>',
                                            children:
                                            [   
                                                {name: 'bebida' }
                                            ]
                                        },
                                        { 
                                            name: 'combos',
                                            datasource:'url:<%= "/api/fastfood/combos" %>' ,
                                            children:
                                            [   
                                                {name: 'combo' }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: 'quantidade'
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
                    children: [
                        { name: 'titulo-pedido'},
                        {
                            name: 'pedido',
                            children: 
                            [
                                {
                                    name: 'itens', datasource:'url:<%= "/pedido" %>',
                                    children: 
                                    [
                                        { name: 'item' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'section-acoes',
                    datasource:'url:<%= "/total-pedido" %>',
                    children:
                    [
                        { name: "confirmar-pedido", bind: { "pt-BR": "Comprar", "en-US": "Purchase" }},
                        { name: "cancelar-pedido", bind: { "pt-BR": "Cancelar", "en-US": "Cancelar" }},
                        
                        { 
                            name:"valor-total", 
                            bind: '$data.total',
                        }
                    ]

                },

                {
                    name: "content-edit-item",
                    children:[
                        {
                            name: "form-edit-item",
                            children:[
                                { name: "item-to-edit", label: "Item" },
                                { name: "nova-quantidade" }
                            ]
                        },
                        { name: "confirmar-edicao", bind: { "pt-BR": "Confirmar", "en-US": "Confirm" }},
                        { name: "cancelar-edicao", bind: { "pt-BR": "Cancelar", "en-US": "Cancel" }}
                    ]
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
        //Estrutura para o formulário
        {
            name: 'adicionar-item', 
            children: 
            [
                { 
                    name: 'form-group', 
                    children:
                    [
                        { name: 'label-item' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                {
                                    name: 'cardapio',
                                    children: 
                                    [
                                        {name: 'empty_value'},
                                        { 
                                            name: 'sanduiches', 
                                            children:
                                            [
                                                { name: 'sanduiche' }
                                            ]
                                        },
                                        { 
                                            name: 'bebidas', 
                                            children:
                                            [
                                                { name: 'bebida' }
                                            ]
                                        },
                                        { 
                                            name: 'combos', 
                                            children:
                                            [
                                                { name: 'combo' }
                                            ]
                                        }
                                    ] 
                                }
                            ]
                        }
                    ]
                },
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
                { 
                    name: 'form-group', 
                    children:
                    [
                        { name: 'confirmar'}
                    ]
                },
            ]
        },


        //Estrututa para a lista de itens do pedido
        {
            name: 'pedido',
            children:
            [
                { name: 'cabecalho' },
                { 
                    name: 'itens',
                    children: 
                    [
                        { name: 'item' },
                    ]
                }
            ]
        },

        //estrutura para os botões
        {
            name: 'section-acoes', 
            children:
            [
                {
                    name: 'container-botoes',
                    children:
                    [
                        {name: 'confirmar-pedido' },
                        {name: 'cancelar-pedido' },
                        { name: 'valor-total' }
                    ]
                }
            ]
        },

        //Estrutura para o modal
        {
            name: "content-edit-item", children:
            [
                {
                    name: "modal-dialog", children:
                    [
                        {
                            name:"modal-content", children:
                            [
                                {
                                    name: "modal-title", children:[ { name: "modal-title-value" }]
                                },
                                {
                                    name:"modal-body", children:
                                    [
                                        { 
                                            name: "form-edit-item", children:
                                            [
                                                { name: "item-to-edit" },
                                                { name: "nova-quantidade" }
                                            ] 
                                        }
                                    ]
                                },
                                {
                                    name: "modal-footer", children:
                                    [
                                        { name: "confirmar-edicao" },
                                        { name: "cancelar-edicao" }
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
        { name: "container-center", widget:"WaiContent", class:"container"},
        
        //Sessões    
        { name: "section-add-item", widget: "WaiContent", tag: "section", class:"row" },
        { name: "section-itens", widget: "WaiContent", tag: "section", class:"col-sm-8" },
        { name: "section-acoes", widget: "WaiContent", tag: "section", class:"col-sm-4" },

        //modal
        { name: "content-edit-item", widget: "WaiContent", tabindex: "-1", role:"dialog", class: "modal fade" },
        { name: "modal-dialog", widget: "WaiContent", class: "modal-dialog", role: "document"},
        { name: "modal-content", widget: "WaiContent", class:"modal-content" },
        { name: "modal-title", widget: "WaiContent", class:"modal-header" },
        { name: "modal-title-value", widget: "WaiContent", tag:"h4", class:"modal-title", value: { "pt-BR": "Editar Item", "en-US": "Edit Item"}},
        { name: "modal-body", widget: "WaiContent", class:"modal-body" },
        { name: "modal-footer", widget: "WaiContent", class: "modal-footer" },

        //Formulário edição
        { name: "form-edit-item", widget: "WaiContent", tag:'form', class: "form-horizontal", events: { submit: "EvtSubmitEdit"}},
        { name: "item-to-edit", widget: "WaiStatic" },
        { name: "nova-quantidade", widget: "WaiInput" },
        { name: "confirmar-edicao", widget: "WaiButton", class:"btn btn-primary", value: "$bind", events: { click: "EvtConfirmEdit" } },
        { name: "cancelar-edicao", widget: "WaiButton", class:"btn btn-default", value: "$bind", events: { click: "EvtCancelEdit" } },


        //Formulário
        { name: "titulo-formulario", tag:'h2', widget: 'WaiContent', value: "Adicionar Item ao Pedido" },
        { 
            name: "adicionar-item", 
            widget: "WaiContent", 
            tag: 'form', 
            class: "form-horizontal", 
            events:{ 
                submit: {
                    action: 'EvtSubmitForm',
                    event: 'item_adicionado', 
                    params: { 
                        item: '$("#cardapio option:selected").text()', 
                        quantidade: '$("#quantidade").val()'
                    }
                } 
            } 
        },
        { name: 'form-group', widget:'WaiContent', class: 'form-group' },
        { name: 'container-field', widget:'WaiContent', class:'col-sm-10' },
        
        //Cardápio
        { name: "label-item", tag: 'label', for:"cardapio", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Item" },
        { name: "cardapio", widget: "WaiSelect", class:'form-control' },
        { name: "empty_value", widget: "WaiOption", tag: "option", value: "0", text: ""},
        { name: "sanduiches", tag:"optgroup", label:"Sanduíches" },
        { name: "sanduiche", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.nome" },
        { name: "bebidas", tag:"optgroup", label:"Bebidas" },
        { name: "bebida", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.nome" },
        { name: "combos", tag:"optgroup", label:"Combos" },
        { name: "combo", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.nome" },

        { name: "label-quantidade", tag: 'label', for:"quantidade", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Quantidade" },
        { name: "quantidade", widget: "WaiInput" },
        { 
            name: "confirmar", 
            widget: "WaiButton", 
            value:"$bind", 
            type:"submit", 
            class:"btn btn-success pull-right"
        },
        
        //Pedido
        { name: "titulo-pedido", tag:'h2', widget: 'WaiContent', value: "Pedido" },
        { name: 'pedido', tag: 'div', class:'panel panel-primary'},

        //Cabeçalho
        { name: 'cabecalho', tag: 'div', class: 'panel-heading', value: "Itens do Pedido"},

        //Corpo
        { name: 'itens', tag: 'div', class:'panel-body', widget: 'WaiListContent' },
        { 
            name: 'item', 
            tag: 'div', 
            class:'item_pedido',
            widget: 'WaiContent',
            events: {
                focus: {
                    event: 'item_selecionado',
                    params: {
                        nome: 'GetSelectItem(context.$element).nome',
                        quantidade: 'GetSelectItem(context.$element).quantidade',
                        total: 'GetSelectItem(context.$element).total',
                        view: 'landing'
                    }
                }
            },
            children:
            [
                //nome do item
                { name: "item-name", tag:"div", class:"col-sm-5 container-dado-item border-container label-bold", widget: "WaiContent", value: "$data.nome"},
                
                //controles para aumentar a diminuir quantidade
                { 
                    name: "item-quantidade", 
                    tag:"div", 
                    class:"col-sm-4 container-dado-item border-container",
                    widget: "WaiContent", 
                    children:
                    [
                        {
                            name: "container-minus", tag:"div", widget: "WaiContent", class:"col-sm-2 btn-quantidade",
                            children:[
                                { 
                                    name: "btn-minus", 
                                    widget: "WaiButton",
                                    class: "btn btn-primary btn-xs bnt-minus", 
                                    events:{
                                        click: {
                                            action: "EvtMinus",
                                            event: "reduzir_quantidade",
                                            params:{
                                                nome: "GetSelectItem(context.$element.closest('.item_pedido')).nome"
                                            }
                                        }
                                    },
                                    children:[
                                        { name: "icon-minus", tag:"i", class:"fa fa-minus"}
                                    ]
                                }
                            ]
                        },
                        {
                            name: "container-field", tag:"div", widget:"WaiContent", class:"col-sm-6",
                            children:[
                                {
                                    name: "qtd-field", 
                                    widget:"WaiInput", 
                                    value: "$data.quantidade", 
                                    class:"input-qtd",
                                    events: {
                                        change: {
                                            action: "EvtChangeAmount",
                                            event: "editar_item",
                                            params: {
                                                nome: "GetSelectItem(context.$element.closest('.item_pedido')).nome",
                                                quantidade: "GetSelectItem(context.$element.closest('.item_pedido')).quantidade",
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            name:"container-plus", tag:"div", widget:"WaiContent", class:"col-sm-2 btn-quantidade",
                            children:[
                                { 
                                    name: "btn-plus", 
                                    widget: "WaiButton",
                                    class: "btn btn-primary btn-xs btn-plus", 
                                    events:{
                                        click: {
                                            action: "EvtPlus",
                                            event: "aumentar_quantidade",
                                            params:{
                                                nome: "GetSelectItem(context.$element.closest('.item_pedido')).nome"
                                            }
                                        }
                                    },
                                    children:[
                                        { name: "icon-plus", tag:"i", class:"fa fa-plus"}
                                    ]
                                }
                            ]
                        }
                    ]
                },
                //valor total
                { name: "item-preco", tag:"div", widget: "WaiContent", value: "$data.total.formatMoney()", class:"col-sm-2 container-dado-item border-container label-total-item label-bold"},
                
                //controle para remover o item
                { 
                    name:"container-remove", tag:"div", widget:"WaiContent", class:"col-sm-1 container-dado-item",
                    children:[
                        { 
                            name: "btn-remove", 
                            widget:"WaiButton", 
                            tag:"button", 
                            class: "btn btn-xs btn-danger btn-remover",
                            events:{ 
                                click: {
                                    action: "EvtRemoveItem",
                                    event: "item_removido",
                                    params:{
                                        item: "GetSelectItem(context.$element.closest('.item_pedido')).nome"
                                    }
                                }
                            },
                            children:
                            [
                                { name: 'icon-remove', "aria-hidden": true, "aria-labelledby":"header-item-remove", widget: "WaiContent", tag:"i", class:"fa fa-trash fa-lg btn-action" }
                            ]
                        }
                    ]
                }
            ]
        },
        { 
            name: "valor-total", class:"row text-center", children:
            [
                { name: "label-total", widget: "WaiContent", tag:"strong", value: "Total: " },
                { name: "total-value", widget: "WaiContent", tag:"span", value: "$bind.formatMoney()" },
            ]
        },

        //Operações da view
        { name: 'container-botoes', widget: 'WaiContent', class: 'row text-center', style: 'margin: 10% 0 5% 0;'},
        { 
            name: "confirmar-pedido", 
            tag:"a", 
            widget:"WaiButton", 
            class: "btn btn-success btn-lg", 
            value: "$bind", 
            href:"navigate('fastfood/gerarPedido')", 
            style: "margin-right: 10px;",
            events:{ 
                click: {
                    action: "EvtCadastrarPedido",
                    event: "cadastrar_pedido"
                }

            },  
        },
        { 
            name: "cancelar-pedido", 
            widget: "WaiButton", 
            class: "btn btn-danger btn-lg", 
            value: "$bind", 
            events: 
            { 
                click: {
                    action: "EvtCancelarPedido",
                    event: "cancelar_pedido"
                }
            }
        },
    ]
};
//---------------------------------------------------------------------------------------- Fim: landing ----------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------- pedido ----------------------------------------------------------------------------------------
var pedidoAbstrata = {
    name: "pedido",
    title: { "pt-BR": "Fast Food UAI - Número do pedido", "en-US": "Fast Food UAI - Number of Order"},
    widgets: [
        { 
            name: "container-center", children:
            [
                {
                    name: "section-numero-pedido",
                    children: [
                        {
                            name: "numero-atual",
                            bind: "$data.atual",
                            title: {
                                "pt-BR": "Número Atual",
                                "en-US": "Current Number"
                            }
                        },
                        {
                            name: "numero-pedido",
                            bind: "$data.numero",
                            title: {
                                "pt-BR": "Número do pedido",
                                "en-US": "Number of Order"
                            }
                        },
                        { 
                            name: "novo-pedido",
                            bind: {
                                "pt-BR": "Novo Pedido",
                                "en-US": "New Order"
                            }
                        }
                    ]
                },
                {
                    name: "section-itens",
                    children: [
                        { name: 'titulo-pedido'},
                        {
                            name: 'pedido',
                            children: 
                            [
                                {
                                    name: 'itens', datasource:'url:<%= "/pedido" %>',
                                    children: 
                                    [
                                        { name: 'item' }
                                    ]
                                },
                                {
                                    name: "section-total",
                                    datasource:'url:<%= "/total-pedido" %>',
                                    children:
                                    [
                                        { 
                                            name:"valor-total", 
                                            bind:"$data.total",
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
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
        //Estrututa para a lista de itens do pedido
        {
            name: 'pedido',
            children:
            [
                { name: 'cabecalho' },
                { 
                    name: 'itens',
                    children: 
                    [
                        { name: 'item' },
                    ]
                },
                {
                    name: "section-total",
                    children:
                    [
                        { name:"valor-total"}
                    ]
                }
            ]
        }
    ],
    maps: 
    [   
        { name: "container-center", widget:"WaiContent", class:"container"},
        { name: "section-numero-pedido", widget: "WaiContent", class:"text-center row" },
        { name: "section-itens", widget: "WaiContent", tag: "section", class:"row" },
        { 
            name: "numero-atual", widget: "WaiContent", 
            children:[
                { name: "label-numero-atual", widget: "WaiContent", value:"Úlitmo pedido chamado:", tag:"p", class:"label-bold title-numero" },
                { name: "value-numero-atual", widget: "WaiContent", value:"$bind", class:"label-bold numero-atual", tag:"p" },
            ]
        },
        { 
            name: "numero-pedido", widget: "WaiContent", 
            children:[
                { name: "label-numero-pedido", widget: "WaiContent", value:"Seu pedido:", tag:"p", class:"label-bold title-numero" },
                { name: "value-numero-pedido", widget: "WaiContent", value:"$bind", tag:"p", class:"label-bold numero-pedido" },
            ]
        },

        { name: "section-total", widget: "WaiContent" },

        //Pedido
        { name: "titulo-pedido", tag:'h2', widget: 'WaiContent', value: "Pedido" },
        { name: 'pedido', tag: 'div', class:'panel panel-primary'},

        //Cabeçalho
        { name: 'cabecalho', tag: 'div', class: 'panel-heading', value: "Itens do Pedido"},

        //Corpo
        { name: 'itens', tag: 'div', class:'panel-body', widget: 'WaiListContent' },
        { 
            name: 'item', 
            tag: 'div', 
            class:'item_pedido',
            widget: 'WaiContent',
            events: {
                focus: {
                    event: 'item_selecionado',
                    params: {
                        nome: 'GetSelectItem(context.$element).nome',
                        quantidade: 'GetSelectItem(context.$element).quantidade',
                        total: 'GetSelectItem(context.$element).total',
                        view: 'pedido'
                    }
                }
            },
            children:
            [
                //nome do item
                { name: "item-name", tag:"div", class:"col-sm-5 container-dado-item border-container label-bold", widget: "WaiContent", value: "$data.nome"},
                
                //controles para aumentar a diminuir quantidade
                { 
                    name: "item-quantidade", 
                    tag:"div", 
                    class:"col-sm-4 container-dado-item border-container",
                    widget: "WaiContent", 
                    children:
                    [
                        {
                            name: "container-field", tag:"div", widget:"WaiContent", class:"col-sm-6",
                            children:[
                                {
                                    name: "qtd-field", 
                                    widget:"WaiInput", 
                                    value: "$data.quantidade", 
                                    class:"input-qtd"
                                }
                            ]
                        }
                    ]
                },

                //valor total
                { name: "item-preco", tag:"div", widget: "WaiContent", value: "$data.total.formatMoney()", class:"col-sm-2 container-dado-item label-total-item label-bold"},
                
            ]
        },

        { 
            name: "valor-total", widget: "WaiContent", class:"row text-center", children:
            [
                { name: "label-total", widget: "WaiContent", tag:"strong", value: "Total: " },
                { name: "label-total", widget: "WaiContent", tag:"span", value: "$data.total.formatMoney()" },
            ]
        },
        { 
            name: "novo-pedido", 
            tag:"a", 
            widget:"WaiButton", 
            class: "btn btn-success btn-lg", 
            value: "$bind", 
            href:"navigate('fastfood/')",
            events: { click: "EvtNovoPedido"}  
        },
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
            ChangeCurrentValue();

            //#region Funções cadastradas no DialogFlow
            
            window.LimparLista = function(options){
                app.$env.$dataObj.trigger("change");
            };

            window.SetValueItem = function(options){
                var value = "";
                for(var key in options){
                    if(options[key] && options[key].length){
                        value = options[key];
                        break;
                    }
                }

                var params = {
                    cardapio: value
                };

                SetValue(params);
            };

            window.SetValueItemQuantidade = function(options){
                var value = "";
                console.log(options);
                for(var key in options.item){
                    if(key == "quantidade")
                        continue;

                    if(options.item[key] && options.item[key].length){
                        value = options.item[key];
                        break;
                    }
                }

                var params = {
                    cardapio: value,
                    quantidade: options.quantidade
                };

                SetValue(params);
                var incomplete = (_.isString(params.cardapio) && !params.cardapio.length) ||
                                (_.isString(params.quantidade) && !params.quantidade.length);

                if(!incomplete)
                    app.$env.$dataObj.trigger("change");
            };

            window.EditarItem = function(options){
                var quantidade = parseInt(options.quantidade);
                
                var item = "";
                Object.keys(options.item).forEach(key => {
                    if(options.item[key])
                        item = options.item[key];
                });

                //Busca o .item_pedido relacionado ao item
                $(".item_pedido").each((index, element) => {
                    var $element = $(element);

                    if($(element).children().eq(0).text() != item)
                        return true;

                    //Caso seja o item, informa o valor correto no campo de quantidade e atualizar o total
                    $element.find(".input-qtd").val(quantidade);
                    var params = {item: item, quantidade: quantidade}; 
                    RefreshTotalItem($element, params);
                    
                    return false;
                    
                });
            }

            window.AumentarQuantidade = function(){
                ChangeAmount('.btn-plus');
            }

            window.ReduzirQuaantidade = function(){
                ChangeAmount('.btn-minus');
            }

            window.RemoverItemEspecifico = function(){
                app.$env.$dataObj.trigger("change");
            }

            //#endregion

            //#region Eventos dos controles

            window.EvtRemoveItem = function(options){
                //remove o item do pedido
                var $itemPedido = options.$element.closest(".item_pedido");
                $itemPedido.remove();

                //recalcula o total
                RefreshTotalPedido();
            };

            window.EvtChangeAmount = function(options){
                var $itemPedido = options.$element.closest('.item_pedido');
                var selectedItem = GetSelectItem($itemPedido);
                
                var item = selectedItem.nome;
                var quantidade = selectedItem.quantidade;

                var params = {item: item, quantidade: quantidade};

                //recalcula o total do item
                RefreshTotalItem($itemPedido, params);
            }

            //Diminui a quantidade de um determinado item
            window.EvtMinus = function(options){
                var $fieldQtd = GetFieldQtd(options);
                var $itemPedido = options.$element.closest('.item_pedido');
                var selectedItem = GetSelectItem($itemPedido);

                var item = selectedItem.nome;
                var quantidade = parseInt(selectedItem.quantidade);

                if(quantidade <= 1)
                    return;

                quantidade--;
                $fieldQtd.val(quantidade);

                var params = {item: item, quantidade: quantidade};

                //recalcula o total do item
                RefreshTotalItem($itemPedido, params);
            };

            window.EvtPlus = function(options){
                var $fieldQtd = GetFieldQtd(options);
                var $itemPedido = options.$element.closest('.item_pedido');
                var selectedItem = GetSelectItem($itemPedido);

                var quantidade = parseInt(selectedItem.quantidade) + 1;
                var item = selectedItem.nome;

                //Atualiza o campo de texto
                $fieldQtd.val(quantidade);

                var params = {item: item, quantidade: quantidade};

                //recalcula o total do item
                RefreshTotalItem($itemPedido, params);
            };

            window.EvtCadastrarPedido = function(options){
                options.$event.preventDefault();

                //Se o pedido estiver vazio, não registra o mesmo
                if($('.item_pedido').length <= 0)
                    return;

                window.location.href = options.$element.prop('href');
            }

            window.EvtSubmitForm = function(options){
                app.$env.$dataObj.trigger("change");
            }

            window.EvtCancelarPedido = function(options){
                app.$env.$dataObj.trigger("change");
            }

            window.EvtNovoPedido = function(options){
                window.location.href = options.$element.prop('href');
            }

            //#endregion

            //#region Funções auxiliares

            window.GetSelectItem = function($element){
                var result = {};
                var values = $element.children();
                result.nome = values.eq(0).text();
                result.quantidade = values.eq(1).find('.input-qtd').val();
                result.total = values.eq(2).text();

                console.log(result);
                return result;
            }

            window.GetFieldQtd = function(options){
                return options.$element.closest('.item_pedido').find('.input-qtd');
            }

            window.ChangeAmount = function(classItem){
                var $currentElement = $(document.activeElement);
                
                //Se não tem a classe item_pedido, tenta pegar o parent que tenha a classe
                if(!$currentElement.hasClass("item_pedido")){
                    $currentElement = $currentElement.closest(".item_pedido");
                }

                if(!$currentElement.length)
                    return;

                var $button = $currentElement.find(classItem);

                if($button.length)
                    $button.click();
            }

            window.RefreshTotalItem = function($itemPedido, params){
                //recalcula o total do item
                appApi.AjaxRequest('POST', '/total-item', params, null, function(data){
                    $itemPedido.find('.label-total-item').text(data.total.formatMoney());
                    RefreshTotalPedido();
                });
            }

            window.RefreshTotalPedido = function(){
                //Calcula o total do pedido
                var total = 0;
                $('.label-total-item').each((index, element) => {
                    var $element = $(element);
                    total += parseFloat($element.text().replace("R$", "").replace(",", "."));
                });

                //informa o valor total do item
                $("#total-value").text(total.formatMoney());
            }

            //#endregion
            
        };
    });
} else {
    exports.ajaxSetup = ajaxSetup;
    exports.abstracts = interface_abstracts;
    exports.mapping = concrete_interface;
    exports.selection = selection;
    exports.rules = rules;
}