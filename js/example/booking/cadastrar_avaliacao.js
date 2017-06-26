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
        
        { name: 'container-field', class:'col-sm-10' },
        
        //field email
        { name: 'field-hotel', class: 'form-group' },
        { name: 'label-hotel', tag: 'label', class: 'control-label col-sm-2', value: 'Hotel' },
        { name: 'hotel', class: 'form-control', tag:'select' },
        { name: 'option-hotel', tag:'option', value: '$data.id', text: '$data.name' },

        //Field password
        { 
            name: 'field-avaliacao', class: 'form-group', children: 
            [
                { name: 'label-avaliacao', tag: 'label', class: 'control-label col-sm-2', value: 'Avaliação' },
                {
                    name: 'container-field', class: 'col-sm-10', children:
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