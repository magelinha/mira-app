var selecionarHotelAbstrata = 
{
    name:'selecionar_hotel',
    tts: 'Serão listados is possíveis hoteis para seleção. Diga "Próximo" para ir pra o próximo hotel.',
    widgets : [
        {'menu': {name:'menu-list', children:['menu-list-item'], datasource:'url:<%= "/api/booking/menu" %>'}},
        //buscar hoteis
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
        //itens para seleção de hotel
        {
            name: 'selecionar-hotel', datasource: '$data.hoteis', children:
            [
                { name: 'item-hotel' }
            ]
        },

        { 
            name: 'filtros', children: 
            [
                { 
                    name: 'content-filtro', children: 
                    [
                        { name: 'title-filtro-bairro' },
                        {
                            name: 'filtro-bairro', datasource: '$data.bairros', children:
                            [
                                {name: 'item-filtro-bairro'}
                            ]
                        },
                    ]
                },

                { 
                    name: 'content-filtro', children: 
                    [
                        { name: 'title-filtro-valor' },
                        {
                            name: 'filtro-valor', children:
                            [
                                {name: 'item-filtro-valor'}
                            ]
                        },
                    ]
                },

                { 
                    name: 'content-filtro', children: 
                    [
                        { name: 'title-filtro-status' },
                        {
                            name: 'filtro-status', datasource: '$data.status', children:
                            [
                                {name: 'item-filtro-status'}
                            ]
                        },
                    ]
                }
            ]
        }
    ]
};

var selecionarHotelConcreta = 
{
    name: 'selecionar_hotel',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: '"Selecionar Hotel"'}
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

        //filtro bairro
        {
            name: 'item-filtro-bairro', children:
            [
                { 
                    name: 'span-checkbox', children: 
                    [
                        { name:'icon-checkbox' },
                        { name: 'bairro' }
                    ]
                }
            ]
        },

        //filtro valor


        //filtro status
        {
            name: 'item-filtro-status', children:
            [
                { 
                    name: 'span-checkbox', children: 
                    [
                        { name:'icon-checkbox' },
                        { name: 'status' }
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
        { name: 'content-buscar-hoteis', class: 'col-md-4'},

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

        // Itens para seleção
        { name: 'selecionar-hotel', class: 'col-sm-8 pull-right' },
        {
            name: 'item-hotel', class:'row', children:
            [
                { 
                    name: 'thumbnail-item', tag: 'a', href: 'navigate("api/hotel/" + $data.id)', class: 'thumbnail', children:
                    [
                        { name: 'img-hotel', tag: 'img', src: '$data.urls[0].url', alt: '$data.urls[0].descricao' },
                        { 
                            name: 'caption-thumbnail', class: 'caption', children: 
                            [
                                { 
                                    name: 'descricao-horizonal', tag:'dl', class: 'dl-horizontal', children: 
                                    [
                                        {name: 'label-nome', tag: 'dt', value: 'Nome: ' },
                                        {name: 'nome', tag: 'dd', value: '$data.nome' },

                                        {name: 'label-nota', tag: 'dt', value: 'Nota:' },
                                        {name: 'nota', tag: 'dd', value: '$data.nota' },

                                        {name: 'label-status', tag: 'dt', value: 'Status:' },
                                        {name: 'status', tag: 'dd', value: '$data.status' },

                                        {name: 'label-avaliacao', tag: 'dt', value: 'Avaliações:' },
                                        {name: 'status', tag: 'dd', value: '$data.avaliacoes.length' },
                                    ] 
                                }
                            ]
                        }
                    ] 
                },

            ]
        },

        //filtros
        { name: 'filtros', class:'col-sm-3', style: 'margin-left: 20px;'},
        { name: 'content-filtro', class: 'row' },

        { name: 'span-checkbox', tag:'span' },
        { name: 'icon-checkbox', tag: 'span', class: 'glyphicon glyphicon-unchecked', style: 'margin-right: 5px;'},

        { name: 'title-filtro-bairro', tag: 'h4', value: 'Bairros' },
        { name: 'filtro-bairro' },
        { name: 'item-filtro-bairro'},
        { name: 'bairro', value: '$data.name', tag:'span'},

        { name: 'title-filtro-valor', tag: 'h4', value: 'Valor' },
        { name: 'filtro-valor' },
        { name: 'item-filtro-valor', tag: 'input', type: 'range', min:'0', max: '100000', value: '0', style:'width: 300px;'},

        { name: 'title-filtro-status', tag: 'h4', value: 'Status' },
        { name: 'filtro-status' },
        { name: 'item-filtro-status'},
        { name: 'status', value: '$data.name', tag: 'span' },
    ]
};