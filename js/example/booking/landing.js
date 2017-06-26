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