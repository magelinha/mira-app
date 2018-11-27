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
        when: '$data.page == "selecionarHotel"',
        abstract: 'hoteis'
    },

    {
        when: '$data.nome && $data.nome.length > 0',
        abstract: 'hotel'
    },
];

var GeralHead = [
    {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
    {name: 'fontawesone_css', widget:'Head', href:'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', tag: 'style'},//
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
    title: { "pt-BR": "Busca de hotéis", "en-US": "Search Hotels" },
    widgets : [
        { 
            name: "container-center", children:
            [
                {
                    name: 'section-buscar-hoteis',
                    children:
                    [
                        { name: 'titulo-formulario' },
                        {
                            name: 'buscar-hoteis',
                            children : 
                            [
                                { 
                                    name: 'destino',
                                    datasource: 'url:<%= "/api/booking/destinos" %>',
                                    children:['option-destino']
                                },

                                { 
                                    name: 'checkin',
                                },
                                { 
                                    name: 'checkout',
                                },
                                { 
                                    name: 'quartos',
                                    children: ['option-quartos'], 
                                    datasource: 'generateNumber(30)'
                                },
                                { 
                                    name: 'adultos',
                                    children: ['option-adultos'], 
                                    datasource: 'generateNumber(30)'
                                },
                                { 
                                    name: 'criancas',
                                    children:['option-criancas'], 
                                    datasource:'generateNumber(11)'
                                },

                                { name: 'confirmar', bind: {"pt-BR": "Buscar", "en-US": "Search"}}
                            ]
                        }
                    ]
                },
                {
                    name: 'section-principais-destinos',
                    children:
                    [
                        {
                            name: 'principais-destinos',
                            datasource: 'url:<%= "/api/booking/principaisDestinos" %>',
                            children: ['item-destino']   
                        }
                    ]
                },
                {
                    name: 'section-ultimas-avaliacoes',
                    children:
                    [
                        {
                            name: 'ultimas-avaliacoes',
                            datasource: 'url:<%= "/api/booking/ultimasAvalicoes" %>',
                            children: ['avaliacao']
                        }
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
        {name: 'title', widget:'Title', value: 'Página Inicial'}
    ]),
    structure: 
    [
        //Estrutura para o formulário
        {
            name: 'buscar-hoteis', 
            children: 
            [
                { 
                    name: 'form-group', 
                    children:
                    [
                        { name: 'label-destino' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                {
                                    name: 'destino',
                                    children: 
                                    [
                                        { 
                                            name: 'option-destino', 
                                            
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
                        { name: 'label-checkin' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                { name: 'checkin'}
                            ]
                        }
                    ]
                },
                { 
                    name: 'form-group', 
                    children:
                    [
                        { name: 'label-checkout' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                { name: 'checkout'}
                            ]
                        }
                    ]
                },
                { 
                    name: 'form-group', 
                    children:
                    [
                        { name: 'label-quartos' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                {
                                    name: 'quartos',
                                    children: 
                                    [
                                        { 
                                            name: 'option-quartos', 
                                            
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
                        { name: 'label-adultos' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                {
                                    name: 'adultos',
                                    children: 
                                    [
                                        { 
                                            name: 'option-adultos', 
                                            
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
                        { name: 'label-criancas' },
                        { 
                            name: 'container-field',
                            children: 
                            [
                                {
                                    name: 'criancas',
                                    children: 
                                    [
                                        { 
                                            name: 'option-criancas', 
                                            
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
                        { name: 'confirmar'}
                    ]
                },
            ]
        }
    ],
    maps: [
        { name: "container-center", window: "WaiContent", class:"container" },
        { name: 'section-buscar-hoteis', class: 'row', tag:'section', widget: 'WaiContent' },
        { name: 'section-principais-destinos', class: 'row', tag:'section', widget: 'WaiContent' },
        { name: 'section-ultimas-avaliacoes', class: 'row', tag:'section', widget: 'WaiContent' },

        //Form buscar hoteis
        { name: "titulo-formulario", tag:'h2', widget: 'WaiContent', value: "Buscar Hotéis" },

        { name: 'form-group', widget:'WaiContent', class: 'form-group' },
        { name: 'container-field', widget:'WaiContent', class:'col-sm-10' },

        { name: 'buscar-hoteis', widget: "WaiForm", class:'form-horizontal', events: { submit: 'BuscarHoteis'} },
        
        { name: "label-destino", tag: 'label', for:"destino", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Destino" },
        { name: 'destino', widget: "WaiSelect", class:"form-control" },
        { name: 'option-destino', tag: 'option', value: '$data.name', text:'$data.name' },

        { name: "label-checkin", tag: 'label', for:"checkin", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Check-In" },
        { name: 'checkin', widget: "WaiInput", type:'date'},

        { name: "label-checkout", tag: 'label', for:"checkout", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Check-Out" },
        { name: 'checkout', widget: "WaiInput", type:'date' },

        { name: "label-quartos", tag: 'label', for:"quartos", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Nº Quartos" },
        { name: 'quartos', widget: "WaiSelect", class:"form-control"},
        { name: 'option-quartos', tag:'option', value: 'parseInt($data.number) + 1', text: '$data.number + 1' },

        { name: "label-adultos", tag: 'label', for:"adultos", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Nº Adultos" },
        { name: 'adultos', widget: "WaiSelect", class:"form-control"},
        { name: 'option-adultos', tag:'option', value: 'parseInt($data.number) + 1', text: '$data.number + 1' },

        { name: "label-criancas", tag: 'label', for:"criancas", class: 'control-label col-sm-2', widget: 'WaiContent', value:"Nº Crianças" },
        { name: 'criancas', widget: "WaiSelect", class:"form-control" },
        { name: 'option-criancas', tag:'option', value: 'parseInt($data.number)', text: '$data.number' },

        { name: 'confirmar', widget: 'WaiButton', value: '$bind',  type:'submit', class: 'btn btn-primary pull-right' },


        //Principais destinos
        { name: 'principais-destinos', widget: 'WaiListSelect' },
        { 
            name: 'item-destino', widget: 'WaiContent', class:'col-sm-4', events: {click: 'SelectDestino' }, children:  
            [
                { name: 'cidade-destino', widget: 'WaiContent', tag: 'h3', value: '$data.name' },
                { 
                    name: 'thumbnail-destino', class:'thumbnail', widget: 'WaiContent', when:'hasImage', children:
                    [
                        { name: 'imagem-destino', tag: 'img', src: '$data.img', alt: '$data.name', widget: 'WaiContent' }
                    ]
                },
            ]
        },

        //Últimas avaliações
        { name: 'ultimas-avaliacoes', widget: 'WaiListContent', class: 'col-md-6' },
        {
            name: 'avaliacao', widget: 'WaiContent', children:  
            [
                {
                    name: 'blockquote-avaliacao', widget: 'WaiContent', tag: 'blockquote', class: 'blockquote-reverse', children:
                    [
                        { name: 'avaliacao', tag: 'p', widget: 'WaiContent', value: '$data.avaliacao' },
                        { 
                            name: 'usuario', 
                            tag:'footer', 
                            widget: 'WaiContent', 
                            value: 
                            {
                                "pt-BR": '$data.usuario + " sobre " + $data.hotel',
                                "en-US": '$data.usuario + " about " + $data.hotel'
                            }
                        },
                    ]
                },
            ]
        }
    ]
};

//---------------------------------------------------------------------------------------- Selecionar Hotel  ----------------------------------------------------------------------------------------
var hoteisAbstrata = 
{
    name:'hoteis',
    title: { "pt-BR": "Listagem de hotéis", "en-US": "Hotels List" },
    options: ['hoteis', 'filtro-bairro', 'filtro-status', 'buscar-hoteis'],
    widgets : [
        {
            name:"container-center", children:
            [
                {
                    name: 'section-buscar-hoteis',
                    children:
                    [
                        {
                            name: 'buscar-hoteis',
                            children : 
                            [
                                { 
                                    name: 'destino',
                                    entity: {name: 'destino', key: 'name' },
                                    datasource: 'url:<%= "/api/booking/destinos" %>',
                                    children:['option-destino']
                                },

                                { 
                                    name: 'checkin',
                                },
                                { 
                                    name: 'checkout', 
                                },
                                { 
                                    name: 'quartos',
                                    children: ['option-quartos'], 
                                    datasource: generateNumber(30)
                                },
                                { 
                                    name: 'adultos',
                                    children:['option-adultos'], 
                                    datasource:generateNumber(30)
                                },
                                { 
                                    name: 'criancas',
                                    children:['option-criancas'], 
                                    datasource:'generateNumber(11)'
                                },

                                { name: 'confirmar', bind: {"pt-BR": "Buscar", "en-US": "Search"}}
                            ]
                        }
                    ]
                },
                {
                    name: 'section-hoteis',
                    children:
                    [
                        {
                            name: 'hoteis',
                            datasource: 'getHoteis($data.hoteis)', 
                            children:
                            [
                                { 
                                    name: 'item-hotel',
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'section-filtros',
                    children:
                    [
                        {
                            name: 'filtro-bairro', 
                            title: 
                            {
                                "pt-BR":"Filtrar por Bairro",
                                "en-US": "Filter by Neighborhood"
                            },
                            datasource: 'getBairros(getHoteis($data.hoteis))', 
                            entity: 
                            {
                                name: 'bairro',
                                key: 'name',
                            },
                            children:
                            [
                                {
                                    name: 'item-filtro-bairro',
                                    label: '$data.name',
                                    tts: '$data.name'
                                }
                            ]
                        },

                        {
                            name: 'filtro-status', 
                            title: 
                            {
                                "pt-BR":"Filtrar por Status",
                                "en-US": "Filter by Status"
                            },
                            datasource: '$data.status', 
                            entity: 
                            {
                                name: 'status',
                                key: 'name',
                            },
                            children:
                            [
                                {
                                    name: 'item-filtro-status',
                                    label: '$data.name',
                                    tts: '$data.name'
                                }
                            ],
                        }
                    ]
                }
            ]
        }
    ]
};

var hoteisConcreta = 
{
    name: 'hoteis',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: "Hotéis"}
    ]),
    maps: [
        { name: "container-center", window: "WaiContent", class:"container" },
        { name: 'section-buscar-hoteis', class: 'col-sm-4', tag:'section', widget: 'WaiContent' },
        { name: 'section-hoteis', class: 'col-sm-8 pull-right', tag:'section', widget: 'WaiContent' },
        { name: 'section-filtros', class: 'col-sm-4', tag:'section', widget: 'WaiContent' },

        //Form buscar hoteis
        { name: 'buscar-hoteis', widget: "WaiForm", class:'form-horizontal', title: 'Buscar Hotéis', events: { submit: 'BuscarHoteis'} },
        
        { name: 'destino', widget: "WaiSelect", label: 'Destino' },
        { name: 'option-destino', tag: 'option', value: '$data.name', text:'$data.name' },

        { name: 'checkin', widget: "WaiInput", type:'date', label: 'Data de Entrada' },
        { name: 'checkout', widget: "WaiInput", type:'date', label: 'Data de Saída' },

        { name: 'quartos', widget: "WaiSelect", label: 'Quantidade de Quartos' },
        { name: 'option-quartos', tag:'option', value: 'parseInt($data.number) + 1', text: '$data.number + 1' },

        { name: 'adultos', widget: "WaiSelect", label: 'Quantidade de Adultos' },
        { name: 'option-adultos', tag:'option', value: 'parseInt($data.number) + 1', text: '$data.number + 1' },

        { name: 'criancas', widget: "WaiSelect", label: 'Quantidade de Crianças' },
        { name: 'option-criancas', tag:'option', value: 'parseInt($data.number)', text: '$data.number' },
        { name: 'confirmar', widget: 'WaiButton', value: 'Buscar',  type:'submit', class: 'btn btn-primary pull-right' },

        // Itens para seleção
        { name: 'hoteis', widget:'WaiListSelect', style: 'min-height: 800px;' },
        {
            name: 'item-hotel', widget:'WaiContent', class:'row', events: {click: 'selectHotel'}, children:
            [
                { 
                    name: 'thumbnail-item', tag: 'a', widget:'WaiContent', href: 'navigate("api/booking/hoteis/" + $data.id)', class: 'thumbnail', children:
                    [
                        { name: 'img-hotel', widget:'WaiContent', tag: 'img', src: '$data.urls[0].url', alt: '$data.urls[0].descricao' },
                        { 
                            name: 'caption-thumbnail', widget:'WaiContent', class: 'caption', children: 
                            [
                                { 
                                    name: 'descricao-horizonal', widget:'WaiContent', tag:'dl', class: 'dl-horizontal', children: 
                                    [
                                        {name: 'label-nome', widget:'WaiContent',  tag: 'dt', value: 'Nome: ' },
                                        {name: 'nome', tag: 'dd', widget:'WaiContent', value: '$data.nome' },

                                        {name: 'label-bairro', tag: 'dt', widget:'WaiContent', value: 'Bairro: ' },
                                        {name: 'bairro', tag: 'dd', widget:'WaiContent', value: '$data.bairro' },

                                        {name: 'label-nota', tag: 'dt', widget:'WaiContent', value: 'Nota:' },
                                        {name: 'nota', tag: 'dd', widget:'WaiContent', value: '$data.nota' },

                                        {name: 'label-status', tag: 'dt', widget:'WaiContent', value: 'Status:' },
                                        {name: 'status', tag: 'dd', widget:'WaiContent', value: '$data.status' },

                                        {name: 'label-avaliacao', tag: 'dt', widget:'WaiContent', value: 'Avaliações:' },
                                        {name: 'avaliacao', tag: 'dd', widget:'WaiContent', value: '$data.avaliacoes.length' },
                                    ] 
                                }
                            ]
                        }
                    ] 
                },
            ]
        },

        //filtros
        { name: 'filtros', widget:'WaiContent', class:'col-sm-4', style: 'margin-left: 20px;' },

        { name: 'filtro-bairro', widget: 'WaiListCheck', title: 'Bairros' },
        { name: 'item-filtro-bairro', widget:'WaiCheckbox', value: '$data.name', events: { change:'clickCheckbox' }},
        { name: 'filtro-status', widget: 'WaiListCheck', title: 'Status' },
        { name: 'item-filtro-status', widget:'WaiCheckbox', value: '$data.name', events: { change:'clickCheckbox' }},
    ]
};


var getParamsURL = function(){
    var urlParams = [];

    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

    var split = window.location.href.split('?');
    var query = split[split.length - 1];

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);

   return urlParams;

};

var filterHoteis = function(message){
    var bairros = new Array(), 
        status = new Array(),
        $bairros = $("#filtro-bairro").children(),
        $status = $("#filtro-status").children(); 

    console.log($bairros);

    $.each($bairros, function(index, el){
        var $el = $(el);
        var checkbox = $el.find('input');
        if(checkbox.is(':checked')){
            var text = $el.find('label').text().trim();
            if(text && text.length)
                bairros.push(text);
        }
    });

    $.each($status, function(index, el){
        var $el = $(el);
        var checkbox = $el.find('input');
        if(checkbox.is(':checked')){
            var text = $el.find('label').text().trim();
            if(text && text.length)
                status.push(text);
        }
    });

    var $currentHoteis = $("#hoteis").children();
    $.each($currentHoteis, function(index, el){
        var $el = $(el);
        var bairro = $el.find("#bairro").text().trim();
        var currentStatus = $el.find("#status").text().trim();

        if(
            (!bairros.length ||_.contains(bairros, bairro)) && 
            (!status.length || _.contains(status, currentStatus))
        ){
            $el.show();
        }else{
            $el.hide();
        }
    });

    if(_.isUndefined(message))
        appApi.tts("O filtro foi aplicado.");
    else if(_.isString(message))
        appApi.tts(message);

}

window.getHoteis = function(hoteis){
    var params = getParamsURL();
    return _.filter(hoteis, function(hotel){ return hotel.cidade == params.cidade});
}

window.getBairros = function(hoteis) {
    var params = getParamsURL();

    var values = _.uniq(_.pluck(hoteis, 'bairro'), function(item, key, args){
        return item;
    });

    var bairros = [];

    for (var i = 0; i < values.length; i++) 
        bairros.push({name: values[i]}); 

    return bairros;
    
}

//---------------------------------------------------------------------------------------- Detalhe hotel  ----------------------------------------------------------------------------------------
var detalheHotelAbstrata = 
{
    name:'hotel',
    title: { "pt-BR": "Detalhes do hotel", "en-US": "Details of Hotel" },
    options: ['detalhes-hotel', 'quartos', 'imagens', 'avaliacoes'],
    widgets : [
        {
            name:"container-center", children:
            [
                {
                    name: 'section-descricao',
                    children:
                    [
                        { 
                            name: 'imagens', 
                            title: 
                            {
                                "pt-BR":"Imagens",
                                "en-US": "Images"
                            },
                            datasource: '$data.urls',
                            children:[
                                { name: 'imagem', tts: '$data.descricao' }
                            ] 
                        },
                        { 
                            name: 'detalhes-hotel',
                            title: 
                            {
                                "pt-BR":"Descrição",
                                "en-US": "Description"
                            },
                            tts: '$data.get("descricao")',
                        },
                        { 
                            name: 'quartos', 
                            title: 
                            {
                                "pt-BR":"Tipo de Quartos",
                                "en-US": "Types of Rooms"
                            },
                            datasource: '$data.quartos', 
                            children: 
                            [
                                { 
                                    name: 'item-quarto',
                                    tts: "sprintf('%s. Quantidade de camas: %s. Café da manhã: %s, Preço:%s. ', '$data.tipo', '$data.camas', textBoolean($data.cafe_da_manha), $data.preco)", 
                                }
                            ]
                        }
                    ]
                },
                { 
                    name: 'avaliacoes', 
                    title: 
                    {
                        "pt-BR":"Avaliações",
                        "en-US": "Reviews"
                    },
                    datasource:'$data.avaliacoes',
                    children:
                    [ 
                        {
                            name: 'item-avaliacao',
                            tts: "sprintf('%s. Autor: %s', '$data.avaliacao', '$data.autor')"
                        }
                    ] 
                }
            ]
        }
    ]
};

var detalheHotelConcreta = 
{
    name: 'hotel',
    head: GeralHead.concat([
        {name: 'title', widget:'Title', value: 'Detalhe do hotel'}
    ]),
    maps: [
        { name: "container-center", window: "WaiContent", class:"container" },
        { name: 'section-descricao', class: 'row', tag:'section', widget: 'WaiContent' },
        
        //---------imagens do hotel-----------
        { name: 'imagens', widget: 'WaiListContent', class: 'row' },
        { 
            name: 'imagem', class: 'col-lg-3 col-sm-4 col-xs-6', children: 
            [
                {
                    name: 'thumbnail', class: 'thumbnail', title: '$data.descricao', tag: 'a', href: '#', events: {click: 'showImage'}, children:
                    [
                        { name: 'image-link', tag: 'img', alt: '$data.descricao', src: '$data.url' }
                    ]
                }
            ]
        },

        //--------- Detalhes do hotel -----------
        { name: 'detalhes-hotel', widget: 'WaiContent', tag:'section', value:'$data.descricao', class: 'col-md-6' },
        

        //--------- avaliacoes ---------
        
        { name: 'avaliacoes', widget: 'WaiListContent', tag:'section' }, 
        {
            name: 'item-avaliacao', widget:'WaiContent', children:  
            [
                {
                    name: 'blockquote-avaliacao', tag: 'blockquote', children:
                    [
                        { name: 'avaliacao', tag: 'p', value: '$data.avaliacao' },
                        { name: 'usuario', tag:'footer', value: '$data.autor' },
                    ]
                },
            ]
        },

        //--------- reserva ---------
        { name: 'quartos', widget: 'WaiListContent', tag:'section', class: 'col-md-6' }, 
        { 
            name: 'item-quarto', widget:'WaiContent', children: 
            [
                { 
                    name: 'dl-quarto', tag:'dl', class:'dl-horizontal', style:'margin-bottom: 10px;', children:
                    [
                        //tipo
                        { name:'dt-tipo', tag:'dt', value:"Quarto:" },
                        { name:'dd-tipo', tag:'dd', value: '$data.tipo' },

                        //camas
                        { name:'dt-camas', tag:'dt', value:"Quantidade de camas:" },
                        { name:'dd-camas', tag:'dd', value: '$data.camas' },

                        //café da manhã
                        { name:'dt-cafe', tag:'dt', value:"Café da manhã:" },
                        { name:'dd-cafe', tag:'dd', value: '$data.cafe_da_manha ? "Sim" : "Não"' },

                        //preço
                        { name:'dt-preco', tag:'dt', value:"Preço:" },
                        { name:'dd-preco', tag:'dd', value: '$data.preco' },
                    ] 
                }
            ] 
        },
    ]
};
//---------------------------------------------------------------------------------------- xxx  ----------------------------------------------------------------------------------------


var interface_abstracts = [
    landingAbstrata, 
    hoteisAbstrata,
    detalheHotelAbstrata,
];

var concrete_interface = [
    landingConcreta,
    hoteisConcreta,
    detalheHotelConcreta,
];

var ajaxSetup = {

};

var configAPIAi = 
{
    defaultLanguage: 'pt-BR',
    projectId: 'booking-cf175',
    tokens: {
        'pt-BR': '1351a6de0c914e3fbf3a2e9d5522f680',
        'en-US': '2e7915d5dd8549e18836562f590ef130'
    }
}

if(typeof define === 'function') {
    define([
        "jquery",
        "bootstrap",
        'mira/init'
    ], function ($, $bootstrap, Mira) {

        return function BookingMira() {
            var app = new Mira.Application(interface_abstracts, concrete_interface, rules, selection, configAPIAi);
            Mira.Widget.setDefault('BootstrapSimple');

            window.BuscarHoteis = function(options){
                options.$event.preventDefault();
                var url = 'api/booking/hoteis';

                var destino = options.$element.find("#destino").val();
                var checkin = new Date(options.$element.find("#checkin").val());
                var checkout = new Date(options.$element.find("#checkin").val());
                var qtdQuartos = parseInt(options.$element.find("#qtdQuartos").val());
                var qtdAdultos = parseInt(options.$element.find("#qtdAdultos").val());
                var qtdCriancas = parseInt(options.$element.find("#qtdCriancas").val());

                window.location.href = window.navigate(url, {
                    cidade: destino,
                    checkin: checkin,
                    checkout: checkout,
                    qtdQuartos: qtdQuartos,
                    qtdAdultos: qtdAdultos,
                    qtdCriancas: qtdCriancas
                });
            };

            window.SelectDestino = function(options){
                options.$event.preventDefault();
                var url = 'api/booking/hoteis';

                var now = new Date(Date.now());

                var destino = options.$element.find("#cidade-destino").text();
                var checkin = now;
                var checkout = now.setDate(now.getDate() + 1);

                var qtdQuartos = 1;
                var qtdAdultos = 2;
                var qtdCriancas = 0;

                window.location.href = window.navigate(url, {
                    cidade: destino,
                    checkin: checkin,
                    checkout: checkout,
                    qtdQuartos: qtdQuartos,
                    qtdAdultos: qtdAdultos,
                    qtdCriancas: qtdCriancas
                });
            };

            window.clickCheckbox = function(options){
                /*
                var el = options.$element;
                var checkbox = el.parent().find('input');
                if(checkbox.length)
                    checkbox.prop('checked', !checkbox.prop('checked'));*/

                filterHoteis();
            }

            window.selectHotel = function(options){
                window.location.href = window.navigate("api/booking/hoteis/" + options.$data.id);
            }

            var CheckItens = function($container, item){
                _.each($container, function(el){
                    var $el = $(el);
                    var text = $el.find('label').text().trim();
                    var checkbox = $el.find('input');
                    console.log(text, item);

                    checkbox.prop('checked', item == text);
                });

                filterHoteis();
            }

            var UncheckAllItens = function($container){
                _.each($container, function(el){
                    var $el = $(el);
                    var checkbox = $el.find('input');

                    checkbox.prop('checked', false);
                });    
            }

            window.MarcarBairro = function(params){
                var $bairros = $("#filtro-bairro").children();
                CheckItens($bairros, params['bairro']);
                filterHoteis(false);
            }

            window.MarcarStatus = function(params){
                var $status = $("#filtro-status").children();
                CheckItens($status, params['status']);  
                filterHoteis(false);
            }

            window.CleanFilterStatus = function(){
                var $status = $("#filtro-status").children();
                UncheckAllItens($status);

                filterHoteis("Os filtros por status foram desconsiderados.");
            }

            window.CleanFilterBairro = function(){
                var $bairros = $("#filtro-bairro").children();
                UncheckAllItens($bairros);
                filterHoteis("Os filtros por bairro foram desconsiderados.");
            }

            window.CleanFilters = function(params){
                var $bairros = $("#filtro-bairro").children();
                UncheckAllItens($bairros);

                var $status = $("#filtro-status").children();
                UncheckAllItens($status);

                filterHoteis("Todos os filtros foram desconsiderados.");
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