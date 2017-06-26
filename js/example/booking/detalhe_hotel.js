var detalheHotelAbstrata = 
{
    name:'detalhe_hotel',
    tts: 'Nessa sessão você pode acessar as descrições das imagens do hotel, os detalhes do hotel e suas avalições. Alem disso pode fazer uma reserva.',
    widgets : [
        {'menu': {name:'menu-list', children:['menu-list-item'], datasource:'url:<%= "/api/booking/menu" %>'}},
        
        { 
            name: 'group-detalhes-hotel', children: 
            [
                { 
                    name: 'imagens', 
                    datasource: '$data.urls', 
                    tts: 'Para acessar a descrição da próxima imagem, diga "Próximo".',
                    children:['imagem'] 
                },
                { 
                    name: 'detalhes-hotel', 
                    //datasource:'$data.descricao',
                },
                { name: 'avaliacoes', datasource:'$data.avaliacoes', children:['item-avaliacao'] }, 
                { 
                    name: 'efetuar-reserva', 
                    datasource: '$data.quartos', 
                    tts: 'A seguir serão apresetados os tipos de quarto e o respectivo preço. Diga "próximo" para ouvir a próxima opção ou "selecionar esse" para escolher a opção desejada.',
                    children: 
                    [
                        {
                            name: 'item-quarto' , children:
                            [
                                { name: 'radio-quarto' },
                                { name: 'camas' },
                                { name: 'cafe-manha' },
                                { name: 'valor-quarto' },
                            ] 
                        }
                    ]
                }
            ]
        }
        
    ]
};

var detalheHotelConcreta = 
{
    name: 'detalhe_hotel',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: '"Detalhe do hotel"'}
    ]),
    structure:[

        {
            name: 'group-detalhes-hotel', children:
            [
                {
                    name: 'group', children: 
                    [
                        { 
                            name: 'heading', children: 
                            [
                                {
                                    name: 'content-title', children: 
                                    [
                                        { name: 'title-detalhes-hotel' }
                                    ]
                                }
                            ] 
                        },

                        {
                            name: 'collapse-detalhes-hotel', children:
                            [
                                { 
                                    name: 'body-collapse', children:
                                    [
                                        {
                                            name: 'imagens', children:
                                            [
                                                { 
                                                    name: 'content-image', children: 
                                                    [
                                                        { 
                                                            name: 'thumbnail', children:
                                                            [
                                                                { name: 'imagem' }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]

                                        },
                                        { name: 'detalhes-hotel' },
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    name: 'group', children: 
                    [
                        { 
                            name: 'heading', children: 
                            [
                                {
                                    name: 'content-title', children: 
                                    [
                                        { name: 'title-avaliacoes' }
                                    ]
                                }
                            ] 
                        },

                        {
                            name: 'collapse-avaliacoes', children:
                            [
                                { 
                                    name: 'body-collapse', children:
                                    [
                                        {
                                            name: 'avaliacoes', children: 
                                            [
                                                {
                                                    name: 'item-avaliacao', children:  
                                                    [
                                                        {
                                                            name: 'blockquote-avaliacao', children:
                                                            [
                                                                { name: 'avaliacao' },
                                                                { name: 'usuario' },
                                                            ]
                                                        },
                                                    ]
                                                },
                                            ]
                                        }
                                        
                                    ]
                                }
                            ]
                        }
                    ]
                },

                {
                    name: 'group', children: 
                    [
                        { 
                            name: 'heading', children: 
                            [
                                {
                                    name: 'content-title', children: 
                                    [
                                        { name: 'title-reserva' }
                                    ]
                                }
                            ] 
                        },

                        {
                            name: 'collapse-reserva', children:
                            [
                                { 
                                    name: 'body-collapse', children:
                                    [
                                        { name: 'title-quarto' },
                                        { name: 'title-camas' },
                                        { name: 'title-cafe-manha' },
                                        { name: 'title-preco' },

                                        { 
                                            name: 'efetuar-reserva', children:
                                            [
                                                { 
                                                    name: 'item-quarto', children:
                                                    [
                                                        { name: 'radio-quarto' },
                                                        { name: 'camas' },
                                                        { name: 'cafe-manha' },
                                                        { name: 'valor-quarto' },
                                                    ]
                                                },
                                            ] 
                                        },
                                        { name: 'confirmar-reserva' },
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    ],
    maps: [
        //Menu
        { name: 'menu', widget: 'BootstrapNavigation' },
        { name: 'menu-list', widget: 'BootstrapNavigationList' },
        { name: 'menu-list-item', widget: 'BootstrapNavigationListItem', value: '$data.value', href: 'navigate($data.link)' },

        //accordion
        { name: 'group-detalhes-hotel', class: 'panel panel-group', role: 'tablist' },
        { name: 'group', class: 'panel panel-primary' },
        { name: 'heading', class: 'panel-heading' },
        { name: 'content-title', class: 'panel-title' },
        { name: 'body-collapse', class: 'panel-body' },

        //---------detalhes hotel-----------
        { name: 'title-detalhes-hotel', tag: 'a', href: '#', 'data-parent': '#group-detalhes-hotel', href: '#collapse-detalhes-hotel', value: 'Detalhes do Hotel' },
        { name: 'collapse-detalhes-hotel', class: 'panel-collapse collpase in', role:'tabpanel' },

        //imagem
        { name: 'imagens', class: 'row' },
        { name: 'content-image', class: 'col-lg-3 col-sm-4 col-xs-6' },
        { name: 'thumbnail', tag: 'a', title: '$data.descricao', class:'thumbnail', href:"#", events: {click: "showImage"} },
        { name: 'imagem', tag: 'img', src: '$data.url', alt: '$data.descricao' },

        //detalhes hotel
        { name: 'detalhes-hotel', class:'row', value:'$data.descricao' },

        //--------- avaliacoes ---------
        { name: 'title-avaliacoes', tag: 'a', href: '#', 'data-parent': '#group-detalhes-hotel', href: '#collapse-avaliacoes', value: 'Avaliações' },
        { name: 'collapse-avaliacoes', class: 'panel-collapse collpase', role:'tabpanel' },
        
        { name: 'avaliacoes', class: 'row' }, 
        { name: 'item-avaliacao', class: 'row' }, 
        { name: 'blockquote-avaliacao', tag: 'blockquote', class: 'blockquote-reverse' },
        { name: 'avaliacao', tag: 'p', value: '$data.avaliacao' },
        { name: 'usuario', tag:'footer', value: '$data.autor' },
        
        //--------- reserva ---------
        { name: 'title-reserva', tag: 'a', href: '#', 'data-parent': '#group-detalhes-hotel', href: '#collapse-reserva', value: 'Efetuar Reserva' },
        { name: 'collapse-reserva', class: 'panel-collapse collpase in', role:'tabpanel' },

        { name: 'efetuar-reserva', tag: 'form' },
        { name: 'title-quarto', class:'col-md-5 text-center', value: 'Tipo do Quarto'},
        { name: 'title-camas', class:'col-md-3 text-center', value: 'Cama'},
        { name: 'title-cafe-manha', class:'col-md-2 text-center', value: 'Café incluso'},
        { name: 'title-preco', class:'col-md-2 text-center', value: 'Preço'},
        
        { name: 'item-quarto', class: 'row' },
        { 
            name: 'radio-quarto', class:'col-md-5', children:
            [
                { name: 'quarto-selecionado', tag: 'input', type: 'radio', value: '$data.tipo', text: '$data.tipo', style:'margin-right:5px;' }
            ] 
        },
        { name: 'camas', class: 'col-md-3', value: '$data.camas' },
        { name: 'cafe-manha', class: 'col-md-2', value: '$data.cafe_manha ? "Sim" : "Não"' },
        { name: 'valor-quarto', class: 'col-md-2', value: '$data.preco' },

        { name: 'confirmar-reserva', tag:'button', class:'btn btn-primary', value: "Reservar" },
    ]
};