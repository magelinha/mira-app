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