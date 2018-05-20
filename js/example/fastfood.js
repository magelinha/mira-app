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
    {name: 'booking_css', widget:'Head', href:'css/fastFood.css', tag: 'style'},
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

                                /*

                                {
                                    name: "alimento",
                                    label: "Alimento",
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
                                },*/

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

                        /*
                        {
                            name: "lista-itens",      
                            tts: 
                            {
                                "pt-BR": "Você pode Mudar Pedido ou Remover Pedido.",
                                "en-US": "You can Edit Item or Delete Item."
                            },
                            datasource: "selecionados",
                            children: 
                            [
                                {
                                    name: "item-informado",
                                    bind: "$data",
                                    tts: 
                                    {
                                        "pt-BR": "sprintf('Item: %s. Quantidade: %d. Preço: %s. ', '$data.item', $data.quantidade, textCurrency($data.total))",
                                        "en-US": "sprintf('Item: %s. Quantity: %d. Price: %s. ', '$data.item', $data.quantidade, textCurrency($data.total))"
                                    }
                                }
                            ]
                        },*/
                        
                    ]
                },
                {
                    name: 'section-acoes',
                    children:
                    [
                        { name: "confirmar-pedido", bind: { "pt-BR": "Comprar", "en-US": "Purchase" }},
                        { name: "cancelar-pedido", bind: { "pt-BR": "Cancelar", "en-US": "Cancelar" }},
                        
                        { 
                            name:"valor-total", 
                            bind: "_.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0)",
                            tts: "textCurrency($bind)"
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
                                    /*
                                    label: "Nova Quantidade",
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
                                    ]*/
                                
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
                    ]
                },
                { name: 'valor-total' }
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
        { name: "adicionar-item", widget: "WaiContent", tag: 'form', class: "form-horizontal", events:{ submit: {event: 'item_adicionado', params: { item: '$("#cardapio option:selected").text()', quantidade: '$("#quantidade").val()'}} } },
        { name: 'form-group', widget:'WaiContent', class: 'form-group' },
        { name: 'container-field', widget:'WaiContent', class:'col-sm-10' },
        
        //Cardápio
        { name: "label-item", tag: 'label', for:"cardapio", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Item" },
        { name: "cardapio", widget: "WaiSelect", class:'form-control', events: { change: "AlterarValor" } },
        { name: "empty_value", widget: "WaiOption", tag: "option", value: "0", text: ""},
        { name: "sanduiches", tag:"optgroup", label:"Sanduíches" },
        { name: "sanduiche", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.nome" },
        { name: "bebidas", tag:"optgroup", label:"Bebidas" },
        { name: "bebida", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.nome" },
        { name: "combos", tag:"optgroup", label:"Combos" },
        { name: "combo", tag:"option", widget:"WaiOption", value:"$data.id", text:"$data.nome" },

        { name: "label-quantidade", tag: 'label', for:"quantidade", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Quantidade" },
        { name: "quantidade", widget: "WaiInput", events:{ change: "AlterarValor"} },
        { name: "confirmar", widget: "WaiButton", value:"$bind", type:"submit", class:"btn btn-success pull-right" },
        
        //Pedido
        { name: "titulo-pedido", tag:'h2', widget: 'WaiContent', value: "Pedido" },
        { name: 'pedido', tag: 'table', class:'table table-bordered'},

        //Cabeçalho
        { 
            name: 'cabecalho', tag: 'thead',
            children: 
            [
                { 
                    name: 'cabecalho-row', tag: 'tr', 
                    children: 
                    [
                        { name: 'cabecalho-item-text', tag:'th', value: 'Item' },
                        { name: 'cabecalho-quantidade-text', tag:'th', value: 'Quantidade' },
                        { name: 'cabecalho-total-text', tag:'th', value: 'Total' },
                        { name: 'cabecalho-editar-text', tag:'th', value: 'Editar' },
                        { name: 'cabecalho-remover-text', tag:'th', value: 'Remover' },
                    ]
                },
            ] 
        },

        //Corpo
        { name: 'itens', tag: 'tbody', widget: 'WaiContent' },
        { 
            name: 'item', tag: 'tr', 
            children:
            [
                { name: "item-name", tag:"td", widget: "WaiContent", value: "$data.nome"},
                { name: "item-quantidade", tag:"td", widget: "WaiContent", value: "$data.quantidade"},
                { name: "item-preco", tag:"td", widget: "WaiContent", value: "$data.total.formatMoney()"},
                { 
                    name: "item-edit", tag:"td", 
                    widget: "WaiContent", class: "text-center",
                    children:
                    [
                        { 
                            name: "btn-edit", 
                            widget:"WaiButton", 
                            tag:"button", 
                            class: "btn btn-xs btn-primary",
                            events:{ click: "EvtEditItem"},
                            children: 
                            [
                                { name: 'icon-edit', "aria-hidden": true, "aria-labelledby":"header-item-edit", tag:"i", class:"fa fa-pencil fa-lg btn-action" }
                            ]
                        }
                    ]
                },
                { 
                    name: "item-remove", tag:"td", 
                    widget: "WaiContent", class: "text-center",
                    children:
                    [
                        { 
                            name: "btn-remove", 
                            widget:"WaiButton", 
                            tag:"button", 
                            class: "btn btn-xs btn-danger",
                            events:{ click: "EvtRemoveItem"},
                            children:
                            [
                                { name: 'icon-edit', "aria-hidden": true, "aria-labelledby":"header-item-remove", widget: "WaiContent", tag:"i", class:"fa fa-trash fa-lg btn-action" }
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
        { name: "confirmar-pedido", tag:"a", widget:"WaiButton", class: "btn btn-success btn-lg", value: "$bind", events:{ click: "EvtCadastrarPedido" }, href:"navigate('fastfood/gerarPedido')", style: "margin-right: 10px;" },
        { name: "cancelar-pedido", widget: "WaiButton", class: "btn btn-danger btn-lg", value: "$bind", events: { click: "LimparLista"} },
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

            window.selecionados = new Mira.Api.Collection([]);

            

            window.LimparLista = function(options){
                window.selecionados = new Mira.Api.Collection([]);
                
                appApi.tts(
                    _.find(messages[appApi.currentLanguage], function(x){ return x.name == "clear"}).message
                );   

                app.$env.$dataObj.trigger("change");
            };

            window.NovoPedido = function(options){
                options.$event.preventDefault();
                window.location.href = "/?app=example/fastfood";
            };

            
            //Operações modal
            window.EvtEditItem = function(options){
                var $button =  options.$element;
                var values = $button.parents("tr").children();
                var item = values.eq(0).text();
                var oldQuantity = values.eq(1).text();
                
                $("#item-to-edit").text(item);
                $("#nova-quantidade").val(oldQuantity);

                var $modal = $("#content-edit-item").modal({ show: false });
                $modal.on('shown.bs.modal', function () {
                    $('#form-edit-item').focus();
                });
                
                $modal.modal('show');
            };

            window.EvtRemoveItem = function(options){
                var selected = options.$element.parents("tr").children().eq(0).text();
                var idItem = $("option").filter(function(){
                    return $(this).text() === selected;
                }).val();
                
                var selecionado = window.selecionados.find(function(x){ return x.get("idItem") == idItem });
                window.selecionados.remove(selecionado);

                //Mensagem indicando que salvou com sucesso
                appApi.tts(
                    sprintf(
                        _.find(messages[appApi.currentLanguage], function(x){ return x.name == "remove"}).message, 
                        textCurrency(
                            _.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0)
                        )
                    )
                );

                app.$env.$dataObj.trigger("change");
            };

            window.EvtConfirmEdit = function(options){
                $("#form-edit-item").submit();
            };

            window.EvtSubmitEdit = function(options){
                var newQuantity = parseInt($("#nova-quantidade").val());
                var selected = $("#item-to-edit").text();
                var idItem = $("option").filter(function(){
                    return $(this).text() === selected;
                }).val();
                
                var itemSelecionado = GetItemSelecionado(idItem, newQuantity, options);

                var selecionado = window.selecionados.find(function(x){ return x.get("idItem") == itemSelecionado.idItem });
                
                if(selecionado){
                    selecionado.set("quantidade", itemSelecionado.quantidade);
                    selecionado.set("total", itemSelecionado.total);
                }

                var total = _.reduce(selecionados.models, function(memory, selecionado){ return memory + selecionado.get('total'); }, 0);
                var currentAmount = textCurrency(total);
                appApi.tts(
                    sprintf(
                        _.find(messages[appApi.currentLanguage], function(x){ return x.name == "edit"}).message, 
                        currentAmount
                    )
                );

                options.$dataObj.trigger("change");
            };

            window.EvtCadastrarPedido = function(options){
                var size = window.selecionados.size();

                if(size <= 0){
                    options.$event.preventDefault();
                    appApi.tts("Você não escolheu os itens para o pedido.");
                    return;
                }
            };

            window.EvtCancelEdit = function(options){
                $("#content-edit-item").modal('hide');
                appApi.tts(_.find(messages[appApi.currentLanguage], function(x){ return x.name == "cancelEdit"}).message);
            }

            //Vai no servidor para informar quais campos devem ser preenchidos
            window.AlterarValor = function(options){
                var fieldItem = $("#cardapio").val().length;
                var fieldQuantidade = $("#quantidade").val().length;

                var params = {
                    "item": fieldItem,
                    "quantidade": fieldQuantidade
                };

                //window.appApi.CallRequestEvent("valor_alterado", params);
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
        };
    });
} else {
    exports.ajaxSetup = ajaxSetup;
    exports.abstracts = interface_abstracts;
    exports.mapping = concrete_interface;
    exports.selection = selection;
    exports.rules = rules;
}