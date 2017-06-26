"use strict";

var rules = [
    {
        name: 'hasLabel',
        validate: '$data.label.length'
    },

    {
        name: 'hasImage',
        validate: '$data.img && $data.img.length'
    }
];

var selection = [
    {
        when: '$data.page == "login"',
        abstract: 'login'
    },

    {
        when: '$data.page == "cadastrarAvaliacao"',
        abstract: 'cadastrar_avaliacao'
    },


];

var GeralHead = [
    {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
    {name: 'booking_css', widget:'Head', href:'css/booking.css', tag: 'style'},
    {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'}
];

var generateNumber = function(value){
    var array = [];

    for(var i=0; i < value;i++){
        var obj = new Object();
        obj.number = i;
        array.push(obj);
    }

    return array;
}

//---------------------------------------------------------------------------------------- Landing ----------------------------------------------------------------------------------------
var landingAbstrata = 
{
    name:'landing',
    tts: 'Seja bem vindo ao sistema, o que deseja?',
    widgets : [
        {'menu': {name:'menu-list', children:['menu-list-item'], datasource:'url:<%= "/api/booking/menu" %>'}},
        {
            name: 'content-buscar-hoteis',
            children: 
            [
                {
                    name: 'buscar-hoteis',
                    tts: 'Informe o destino, data de entrada, data de saída, quantidade de quartos, quantidade de adultos e quantidade de crianças',
                    datasource: '',
                    children : 
                    [
                        { name: 'field-destino' },
                        { name: 'field-checkin' },
                        { name: 'field-checkout' },
                        { 'field-qtdQuartos': {name: 'qtdQuartos', children:['option-qtdQuartos'], datasource:'generateNumber(30)'}},
                        { 'field-qtdAdultos': {name: 'qtdAdultos', children:['option-qtdAdultos'], datasource:'generateNumber(30)'}},
                        { 'field-qtdCrincas': {name: 'qtdCriancas', children:['option-qtdCriacas'], datasource:'generateNumber(11)'}},
                        { name: 'button-buscar-hoteis' }
                    ]
                }
            ]
        },

        
        {
            name: 'principais-destinos',
            datasource: 'url:<%= "/api/booking/destinos" %>',
            tts: 'Esses são os principais destinos. Fale Próximo para ouvir a próxima opção ou "selecionar esse" para buscar hotel para esse destino.',        
            children: 
            [
                { name: 'item-destino' }
            ]      
        },

        
        {
            name: 'ultimas-avaliacoes',
            datasource: 'url:<%= "/api/booking/ultimasAvalicoes" %>',
            tts: "Essas são as últimas avaliações cadastradas.",
            children: 
            [
                { name: 'item-avaliacao' },   
            ]  
        }
    ]
};

var landingConcreta = 
{
    name: 'landing',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: '"PUC"'}
    ]),
    structure:[
        //qtdQuartos
        {
            name: 'field-qtdQuartos', children:
            [
                {name:'label-qtdQuartos'},
                {
                    name: 'container-field', children:
                    [
                        { name: 'qtdQuartos', children:['option-qtdQuartos'] }
                    ]
                }
            ]
        },

        //qtdAdultos
        {
            name: 'field-qtdAdultos', children:
            [
                {name:'label-qtdAdultos'},
                {
                    name: 'container-field', children:
                    [
                        { name: 'qtdAdultos', children:['option-qtdAdultos'] }
                    ]
                }
            ]
        },

        //qtdAdultos
        {
            name: 'field-qtdCrincas', children:
            [
                {name:'label-qtdCriancas'},
                {
                    name: 'container-field', children:
                    [
                        { name: 'qtdCriancas', children:['option-qtdCriancas'] }
                    ]
                }
            ]
        },
    ],
    maps: [
        //Menu
        { name: 'menu', widget: 'BootstrapNavigation' },
        { name: 'menu-list', widget: 'BootstrapNavigationList' },
        { name: 'menu-list-item', widget: 'BootstrapNavigationListItem', value: '$data.value', href: 'navigate($data.link)' },

        //Block 
        { name: 'content-buscar-hoteis', class: 'col-md-5'},

        //Form buscar-hoteis
        { name: 'buscar-hoteis', tag: 'form', class: 'form-horizontal'},
        { 
            name: 'field-destino', class: 'form-group', children: 
            [
                { name: 'label-destino', tag: 'label', class: 'control-label col-sm-2', value: 'Destino' },
                {
                    name: 'container-field-destino', class: 'col-sm-10', children:
                    [
                        { name: 'destino', class: 'form-control', tag:'input', type: 'text' }
                    ]
                }
            ]
        },

        //Field checkin
        { 
            name: 'field-checkin', class: 'form-group', children: 
            [
                { name: 'label-checkin', tag: 'label', class: 'control-label col-sm-2', value: 'Data de Entrada' },
                {
                    name: 'container-field-checkin', class: 'col-sm-10', children:
                    [
                        { name: 'checkin', class: 'form-control', tag:'input', type: 'text' }
                    ]
                }
            ]
        },

        //Field checkout
        { 
            name: 'field-checkout', class: 'form-group', children: 
            [
                { name: 'label-checkout', tag: 'label', class: 'control-label col-sm-2', value: 'Data de saída' },
                {
                    name: 'container-field-checkout', class: 'col-sm-10', children:
                    [
                        { name: 'checkout', class: 'form-control', tag:'input', type: 'text' }
                    ]
                }
            ]
        },

        { name: 'container-field', class:'col-sm-10' },

        //Field qtdQuartos
        { name: 'field-qtdQuartos', class: 'form-group' },
        { name: 'label-qtdQuartos', tag: 'label', class: 'control-label col-sm-2', value: 'Quartos' },
        { name: 'qtdQuartos', class: 'form-control', tag:'select' },
        { name: 'option-qtdQuartos', tag:'option', value: '$data.number + 1', text: '$data.number + 1' },

        //Field qtdAdultos
        { name: 'field-qtdAdultos', class: 'form-group' },
        { name: 'label-qtdAdultos', tag: 'label', class: 'control-label col-sm-2', value: 'Adultos' },
        { name: 'qtdAdultos', class: 'form-control', tag:'select' },
        { name: 'option-qtdAdultos', tag:'option', value: '$data.number + 1', text: '$data.number + 1' },

        //Field qtdCrianca
        { name: 'field-qtdCrincas', class: 'form-group' },
        { name: 'label-qtdCriancas', tag: 'label', class: 'control-label col-sm-2', value: 'Crianças' },
        { name: 'qtdCriancas', class: 'form-control', tag:'select' },
        { name: 'option-qtdCriancas', tag:'option', value: '$data.number', text: '$data.number' },

        //Submit
        {
            name: 'button-buscar-hoteis', class:'col-sm-10 col-sm-offset-2', children:
            [
                { name: 'action-button-buscar-hoteis', class:'btn btn-primary', value: "Buscar", type: 'submit', events: {submit: 'BuscarHoteis'} }
            ]
        },


        { name: 'principais-destinos', class: 'col-md-7 pull-right' },
        { name: 'title-principais-destinos', tag: 'h3', value: 'Principais destinos' },
        { 
            name: 'item-destino', class: 'row', children:  
            [
                { name: 'cidade-destino', tag: 'h3', value: '$data.name' },
                { 
                    name: 'thumbnail-destino', class:'thumbnail', when:'hasImage', children:
                    [
                        { name: 'imagem-destino', tag: 'img', src: '$data.img', alt: '$data.name' }
                    ]
                },
            ]
        },

        { name: 'ultimas-avaliacoes', class: 'col-md-5', style: 'padding-right: 36px;' },
        { name: 'title-ultimas-avaliacoes', tag: 'h3', value: 'Últimas Avaliações' },
        {
            name: 'item-avaliacao', class: 'row', children:  
            [
                {
                    name: 'blockquote-avaliacao', tag: 'blockquote', class: 'blockquote-reverse', children:
                    [
                        { name: 'avaliacao', tag: 'p', value: '$data.avaliacao' },
                        { name: 'usuario', tag:'footer', value: '$data.usuario + " sobre " + $data.hotel' },
                    ]
                },
            ]
        }
    ]
};

var events_login = {
    BuscarHoteis: function(options){
        //TODO: fazer buscar hoteis
    }
}

//---------------------------------------------------------------------------------------- Login ----------------------------------------------------------------------------------------
var loginAbstrata = 
{
    name:'login',
    tts: 'Informe o e-mail',
    widgets : [
        {'menu': {name:'menu-list', children:['menu-list-item'], datasource:'url:<%= "/api/booking/menu" %>'}},
        {
            name: 'efetuar-login', children:
            [
                { name: 'field-email' },
                { name: 'field-senha', tts: 'Digite sua senha.' },
                { name: 'button-efetuar-login' }
            ]
        },
    ]
};

var loginConcreta = 
{
    name: 'login',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: '"Login"'}
    ]),
    structure:[],
    maps: [
        //Menu
        { name: 'menu', widget: 'BootstrapNavigation' },
        { name: 'menu-list', widget: 'BootstrapNavigationList' },
        { name: 'menu-list-item', widget: 'BootstrapNavigationListItem', value: '$data.value', href: 'navigate($data.link)' },

        //Form efetuar login
        { name: 'efetuar-login', tag: 'form', class: 'form-horizontal col-md-5'},
        
        //field email
        { 
            name: 'field-email', class: 'form-group', children: 
            [
                { name: 'label-email', tag: 'label', class: 'control-label col-sm-2', value: 'E-mail' },
                {
                    name: 'container-field-email', class: 'col-sm-10', children:
                    [
                        { name: 'email', class: 'form-control', tag:'input', type: 'text' }
                    ]
                }
            ]
        },

        //Field password
        { 
            name: 'field-senha', class: 'form-group', children: 
            [
                { name: 'label-senha', tag: 'label', class: 'control-label col-sm-2', value: 'Senha' },
                {
                    name: 'container-field-senha', class: 'col-sm-10', children:
                    [
                        { name: 'senha', class: 'form-control', tag:'input', type: 'password' }
                    ]
                }
            ]
        },

        //Submit
        {
            name: 'button-efetuar-login', class:'col-sm-10 col-sm-offset-2', children:
            [
                { name: 'action-button-efetuar-login', class:'btn btn-primary', value: "Logar", type: 'submit', events: {submit: 'EfetuarLogin' } }
            ]
        },


        { name: 'principais-destinos', class: 'col-md-7 pull-right' },
        { name: 'title-principais-destinos', tag: 'h3', value: 'Principais destinos' },
        { 
            name: 'item-destino', class: 'row', children:  
            [
                { name: 'cidade-destino', tag: 'h3', value: '$data.name' },
                { 
                    name: 'thumbnail-destino', class:'thumbnail', when:'hasImage', children:
                    [
                        { name: 'imagem-destino', tag: 'img', src: '$data.img', alt: '$data.name' }
                    ]
                },
            ]
        },

        { name: 'ultimas-avaliacoes', class: 'col-md-5', style: 'padding-right: 36px;' },
        { name: 'title-ultimas-avaliacoes', tag: 'h3', value: 'Últimas Avaliações' },
        {
            name: 'item-avaliacao', class: 'row', children:  
            [
                {
                    name: 'blockquote-avaliacao', tag: 'blockquote', class: 'blockquote-reverse', children:
                    [
                        { name: 'avaliacao', tag: 'p', value: '$data.avaliacao' },
                        { name: 'usuario', tag:'footer', value: '$data.usuario + " sobre " + $data.hotel' },
                    ]
                },
            ]
        }

    ]
};

var events_login = {
    EfetuarLogin: function(options){
        //TODO: fazer efetuar login
    }
}

//---------------------------------------------------------------------------------------- Cadastrar Avaliação ----------------------------------------------------------------------------------------
var cadastrarAvalicaoAbstrata = 
{
    name:'cadastrar_avaliacao',
    tts: 'Informe o hotel para o qual deseja fazer a avaliacão',
    widgets : [
        {'menu': {name:'menu-list', children:['menu-list-item'], datasource:'url:<%= "/api/booking/menu" %>'}},
        {
            name: 'cadastrar-avaliacao', children:
            [
                { 'field-hotel': {name: 'hotel', children:['option-hotel'], datasource:'$data.hoteis'}},
                { name: 'field-avaliacao' },
                { name: 'button-cadastrar-avaliacao' }
            ]
        },
    ]
};

var cadastrarAvaliacaoConcreta = 
{
    name: 'cadastrar_avaliacao',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: '"Cadastrar avaliacão"'}
    ]),
    structure:[
        //qtdQuartos
        {
            name: 'field-hotel', children:
            [
                {name:'label-hotel'},
                {
                    name: 'container-field', children:
                    [
                        { name: 'hotel', children:['option-hotel'] }
                    ]
                }
            ]
        }
    ],
    maps: [
        //Menu
        { name: 'menu', widget: 'BootstrapNavigation' },
        { name: 'menu-list', widget: 'BootstrapNavigationList' },
        { name: 'menu-list-item', widget: 'BootstrapNavigationListItem', value: '$data.value', href: 'navigate($data.link)' },

        //Form efetuar login
        { name: 'cadastrar-avaliacao', tag: 'form', class: 'form-horizontal col-md-5'},
        
        //field email
        { name: 'field-hotel', class: 'form-group' },
        { name: 'label-hotel', tag: 'label', class: 'control-label col-sm-2', value: 'Hotel' },
        { name: 'hotel', class: 'form-control', tag:'select' },
        { name: 'option-hotel', tag:'option', value: '$data.id', text: '$data.name' },

        //Field password
        { 
            name: 'field-avaliacao', class: 'form-group', children: 
            [
                { name: 'label-avaliacao', tag: 'label', class: 'control-label col-sm-2', value: 'Avalição' },
                {
                    name: 'container-field-senha', class: 'col-sm-10', children:
                    [
                        { name: 'avaliacao', class: 'form-control', tag:'textarea' }
                    ]
                }
            ]
        },

        //Submit
        {
            name: 'button-cadastrar-avaliacao', class:'col-sm-10 col-sm-offset-2', children:
            [
                { name: 'action-button-cadastrar-avaliacao', class:'btn btn-primary', value: "Logar", type: 'submit', events: {submit: 'CadastrarAvaliacao' } }
            ]
        },

    ]
};

var events_login = {
    CadastrarAvaliacao: function(options){
        //TODO: fazer cadastrar avaliação
    }
}

//---------------------------------------------------------------------------------------- xxx ----------------------------------------------------------------------------------------


var interface_abstracts = [
    landingAbstrata, 
    loginAbstrata,
];

var concrete_interface = [
    landingConcreta,
    loginConcreta,
];

/* Functions geradas */
var getMenu = function(item){
    navigate(item);
}

var buscarHoteis = function(destino, checkin, checkout, qtdQuartos, qtdAdulto, qtdCrianca){
    if(checkout <= checkin){
        tts("A data de saída não pode ser menor ou igual a data de entrada");
        clearField("checkin");
        clearField("checkout");
    }else if(qtdQuartos > 30 || qtdQuartos < 1){
        tts("A quantidade de adultos não pode ser superior a 30");
        clearField("checkin");
        clearField("qtdQuartos");    
    }else if(qtdAdulto > 30 || qtdAdulto < 1){
        tts("A quantidade de adultos não pode ser superior a 30");
        clearField("qtdAdulto");
    }else if(qtdCrianca > 10){
        tts("A quantidade de adultos não pode ser superior a 30");
        clearField("qtdCrianca");
    }

    //GOTO: buscar hoteis
}

var verificarDisponibilidade = function(destino, checkin, checkout, qtdQuartos, qtdAdulto, qtdCrianca){
    
    if(checkout <= checkin){
        tts("A data de saída não pode ser menor ou igual a data de entrada");
        clearField("checkin");
        clearField("checkout");
    }else if(qtdQuartos > 30 || qtdQuartos < 1){
        tts("A quantidade de adultos não pode ser superior a 30");
        clearField("checkin");
        clearField("qtdQuartos");    
    }else if(qtdAdulto > 30 || qtdAdulto < 1){
        tts("A quantidade de adultos não pode ser superior a 30");
        clearField("qtdAdulto");
    }else if(qtdCrianca > 10){
        tts("A quantidade de adultos não pode ser superior a 30");
        clearField("qtdCrianca");
    }

    var disponibilidade = false; //TODO: fazer função que verifica disponibilidade
    if(disponibilidade){
        tts('Há disponibilidade para os dados informados');
        focus('content-grid-quartos');
    }else{
        tts('Não há disponibilidade para os dados informados');
    }
}

var reservarQuarto = function(tipoQquarto, qtdQuartos){
    if(qtdQuartos <= 0){
        tts('A quantidade de quartos deve ser mais que zero.');
        clearField("qtdQuartos");
    }else{
        //GOTO: efetuar reserva
    }
};

var getDadosCadastrais = function(){
    focus()
}

var setHospede = function(nome){
    if(!window.hospedes){
        window.hospedes = [];
    }

    window.hospedes.push(nome);
}

var ajaxSetup = {

};

if(typeof define === 'function') {
    define([
        "jquery",
        "bootstrap",
        'mira/init'
    ], function ($, $bootstrap, Mira) {

        return function BookingMira() {
            var app = new Mira.Application(interface_abstracts, concrete_interface, rules, selection);
            Mira.Widget.setDefault('BootstrapSimple');
        };
    });
} else {

    exports.ajaxSetup = ajaxSetup;
    exports.abstracts = interface_abstracts;
    exports.mapping = concrete_interface;
    exports.selection = selection;
    exports.rules = rules;
}