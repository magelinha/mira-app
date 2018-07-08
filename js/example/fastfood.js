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
    {name: 'fastfood_css', widget:'Head', href:'css/fastFood.css', tag: 'style'},
    {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'}
];

window.ChangeCurrentValue = function(){
    //De 5 em 5 Segundos, atualiza o número do pedido
    setInterval(function(){
        var $element = $("#numero-atual");
        if(!$element.length)
            return;


        var currentValue = parseInt($element.html());
        if(_.isNaN(currentValue))
            return;

        var nextValue = (currentValue + 1);
        $element.html(nextValue.toString());

        var numeroPedido = parseInt($("numero-pedido").html());
        if(numeroPedido != nextValue){
            appApi.tts("Pedido de número" + nextValue + " está pronto.");
        }
        else{
            appApi.tts("Seu pedido está pronto.");
        }

    }, 30000)
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
            class:'item-pedido',
            widget: 'WaiContent',
            events: {
                focus: {
                    event: 'item_selecionado',
                    params: {
                        nome: 'GetSelectItem(context.$element).nome',
                        quantidade: 'GetSelectItem(context.$element).quantidade',
                        total: 'GetSelectItem(context.$element).total'
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
                                                nome: "GetSelectItem(context.$element.closest('.item-pedido')).nome"
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
                                            action: "SetTotal",
                                            event: "editar_item",
                                            params: {
                                                nome: "GetSelectItem(context.$element.closest('.item-pedido')).nome",
                                                quantidade: "GetSelectItem(context.$element.closest('.item-pedido')).quantidade",
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
                                                nome: "GetSelectItem(context.$element.closest('.item-pedido')).nome"
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
                                        item: "GetSelectItem(context.$element.closest('.item-pedido')).nome"
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
                            bind: "$data.numero - 10",
                            tts: "$bind",
                            title: {
                                "pt-BR": "Número Atual",
                                "en-US": "Current Number"
                            }
                        },
                        {
                            name: "numero-pedido",
                            bind: "$data.numero",
                            tts: "$bind",
                            title: {
                                "pt-BR": "Número do pedido",
                                "en-US": "Number of Order"
                            }
                        }
                    ]
                },
                {
                    name: "section-itens",
                    title:
                    {
                        "pt-BR": "Itens do Pedido",
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
                                        "pt-BR": "sprintf('Item: %s. Quantidade: %d. Preço: %s', '$data.item', $data.quantidade, textCurrency($data.total))",
                                        "en-US": "sprintf('Item: %s. Quantity: %d. Price: %s', '$data.item', $data.quantidade, textCurrency($data.total))"
                                    }
                                }
                            ]
                        },
                        { name: "novo-pedido", bind: { "pt-BR": "Novo Pedido", "en-US": "New Order" }, title: { "pt-BR":"Novo pedido", "en-US":"New order" } },
                        { 
                            name:"valor-total", 
                            bind: "_.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0)",
                            tts: "$bind"
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
        {
            name: "section-numero-pedido", children:
            [
                {
                    name: "container-numero", children:
                    [
                        { name: "numero-pedido" }
                    ]
                },
                {
                    name: "container-numero", children:
                    [
                        { name: "numero-atual" }
                    ]
                }
            ]
        },
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
                    name: "block-total",  children:
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
        { name: "container-center", widget:"WaiContent", class:"container"},
        { name: "section-numero-pedido", widget: "WaiContent", class:"text-center row" },
        { name: "section-itens", widget: "WaiContent" },
        { name: "section-itens", widget: "WaiContent", tag: "section", class:"row" },
        { name: "block-table", widget: "WaiContent", class:"col-sm-8"},
        { name: "block-total", widget: "WaiContent", class:"col-sm-4"},
        { name: "block-buttons", widget: "WaiContent", class:"row text-center"},
        { name: "container-numero", widget: "WaiContent", class: "col-sm-4" },
        { 
            name: "numero-atual", widget: "WaiContent", class:"alert alert-info", value:"$bind"
        },
        { 
            name: "numero-pedido", widget: "WaiContent", class:"alert alert-success", value:"$bind"
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

            window.NovoPedido = function(options){
                options.$event.preventDefault();
                window.location.href = "/?app=example/fastfood";
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
                if(_.isNaN(quantidade))
                    return;
                
                var $currentElement = $(document.activeElement);
                var $fieldQtd = $currentElement.find('.input-qtd');
                $fieldQtd.val(quantidade);
                $fieldQtd.change();
            }

            window.AumentarQuantidade = function(){
                ChangeAmount('.btn-minus');
            }

            window.ReduzirQuaantidade = function(){
                ChangeAmount('.btn-plus');
            }

            window.RemoverItemEspecifico = function(){
                app.$env.$dataObj.trigger("change");
            }

            //#endregion

            //#region Eventos dos controles

            window.EvtRemoveItem = function(options){
                //remove o item do pedido
                var $itemPedido = options.$element.closest(".item-pedido");
                $itemPedido.remove();

                //recalcula o total
                RefreshTotalPedido();
            };

            //Diminui a quantidade de um determinado item
            window.EvtMinus = function(options){
                var $fieldQtd = GetFieldQtd(options);
                var $itemPedido = options.$element.closest('.item-pedido');
                var selectedItem = GetSelectItem($itemPedido);

                var item = selectedItem.nome;
                var quantidade = parseInt(selectedItem.quantidade);

                if(quantidade <= 1)
                    return;

                quantidade--;
                $fieldQtd.val(quantidade);

                //recalcula o total do item
                $.get('/total-item', {item: item, quantidade: quantidade}, function(data){
                    //altera o texto com o total do item e calcula o total do pedido
                    $itemPedido.find('.label-total-item').text(data.formatMoney());

                    RefreshTotalPedido();
                }).fail(function(error){
                    console.log(error);
                });
            };

            window.EvtPlus = function(options){
                var $fieldQtd = GetFieldQtd(options);
                var $itemPedido = options.$element.closest('.item-pedido');
                var selectedItem = GetSelectItem($itemPedido);

                var quantidade = parseInt(selectedItem.quantidade) + 1;
                var item = selectedItem.nome;

                //Atualiza o campo de texto
                $fieldQtd.val(quantidade);

                //recalcula o total do item
                $.get('/total-item', {item: item, quantidade: quantidade}, function(data){
                    //altera o texto com o total do item e calcula o total do pedido
                    $itemPedido.find('.label-total-item').text(data.formatMoney());

                    //Calcula o total do pedido
                    RefreshTotalPedido();
                }).fail(function(error){
                    console.log(error);
                });
            };

            window.EvtCadastrarPedido = function(options){
                options.$event.preventDefault();

                //Se o pedido estiver vazio, não registra o mesmo
                if($('.item-pedido').length <= 0)
                    return;

                window.location.href = options.$element.prop('href');
            }

            window.EvtSubmitForm = function(options){
                app.$env.$dataObj.trigger("change");
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
                return options.$element.closest('.item-pedido').find('.input-qtd');
            }

            window.ChangeAmount = function(classItem){
                var $currentElement = $(document.activeElement);
                var $button = $currentElement.find(classItem);
                $button.click();
            }

            window.RefreshTotalPedido = function(){
                //Calcula o total do pedido
                var total = 0;
                $('.label-total-item').each(() => {
                    var $element = $(this);
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