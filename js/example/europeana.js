"use strict";

var rules = [{
      name: 'isResult',
      validate: '$data.action == "search.json"'
  },{
      name: 'isJsonLD',
      validate: '$data["@context"] != null'
  },{
      name: 'isResultFew',
      validate: '$env.$data.items.length <= 10'
  },{
      name: 'isResultMany',
      validate: '$env.$data.items.length > 10'
  },{
      name: 'hasDbpedia',
      validate: '$env.methods.get_datasource_dbpedia_uri($dataObj.rdf_prop("dc:contributor")) != null'
  },{
      name: 'isMobile',
      validate: '$env.device.mobile == true'
  },{
      name: 'isDesktop',
      validate: '$env.device.desktop == true'
  },{
      name: 'hasPreview',
      validate: '$dataObj.rdf_prop("edm:isShownBy").length > 0'
  },{
      name: 'isSound',
      validate: '$dataObj.rdf_prop("edm:type")[0] == "SOUND"'
  },{
      name: 'hasName',
      validate: '$data.name != ""'
  },{
      name: 'hasType',
      validate: '$data.notable != null && $data.notable.name != ""'
  },{
      name:'hasEN',
      validate: '$data.edmConceptPrefLabelLangAware != null && $data.edmConceptPrefLabelLangAware.en != null'
  },{
      name: 'hasImage',
      validate: '$data.edmPreview != null'
  },{
      name: 'hasIcon',
      validate: '$data.type != null && icons[$data.type] != undefined'
  }
];

var icons = {
    'IMAGE': 'picture',
    'TEXT': 'font',
    'SOUND': 'music',
    'VIDEO': 'film',
    '3D': 'asterisk'
};

var selection = [
    {
        when: 'isResult',
        abstract: 'results'
    }, {
        when: 'isJsonLD',
        abstract: 'topic'
    }
];

var interface_abstracts = [
    {
        name:'landing',
        widgets : [
            {'header': ['logo', {'search_form':{'search_group' : ['search_field', 'search_button']}}]},
            'footer'
        ]

    },{
    name: 'results',
    widgets : [
      {'header': ['logo', {'search_form':{'search_group' : ['search_field', 'search_button']}}]},
      {'content': [
        { name: "results", datasource: "$data.items",
          children: [
            {name: 'result_panel', children: {'result_item': {'result_link': ['result_icon', 'result_title', 'result_details', 'result_thumb']}}
            }]}
      ]},
      'footer'
    ]
  },{
    name: 'topic',
    widgets : [
      {name: 'header', children:[
        {name: 'logo'},
        {name: 'search_form', children:[
          {name: 'search_group', children:[
            {name: 'search_field'},
            {name:'search_button'}
          ]
          }]
        }]},
      {name:'content', children: [
        { name: "item", children: [
          {name: 'item_panel', children: [
            { name:"item-box", children:[
              { name: 'item-media-link',
                bind:'$dataObj.rdf_prop("edm:isShownAt")[0]["@id"]',
                children: [
                  {name: "item-media", bind:'$dataObj.rdf_prop("edm:object")[0]["@id"]'}]
              },
              { name:"item-title", bind:'$dataObj.rdf_prop("dc:title")[0]'},
              { name:"item-contributor"},
              { name:"item-contributor-value", bind:'$dataObj.rdf_prop("dc:contributor")'},
              { name:"item-date"},
              { name:"item-date-value", bind:'$dataObj.rdf_prop("dc:date")[0]'},
              { name:"item-format"},
              { name:"item-format-value", bind:'$dataObj.rdf_prop("dcterms:extent")[0]'},
              { name:'item-player', when:'isSound,hasPreview', bind:'$dataObj.rdf_prop("edm:isShownBy")[0]["@id"]'},
              { name:"item-extra-info", children:[
                { name:"item-subject"},
                { name:"item-subject-value", bind:'$dataObj.rdf_prop("dc:subject")[0]'},
                { name:"item-identifier"},
                { name:"item-identifier-value", bind:'$dataObj.rdf_prop("dc:identifier")[0]'},
                { name:"item-language"},
                { name:"item-language-value", bind:'$dataObj.rdf_prop("dc:language")[0]'},
                { name:"item-provider"},
                { name:"item-provider-value", bind:'$dataObj.rdf_prop("edm:dataProvider")[0]'},
                { name:"item-country" },
                { name:"item-country-value" , bind:'$dataObj.rdf_prop("edm:country")[0]'}
              ]}
            ]
            }
          ]
          },{
            name: 'sidebar-dbpedia',
            when: 'hasDbpedia',
            datasource:'url:<%= $env.methods.get_datasource_dbpedia_uri($dataObj.rdf_prop("dc:contributor")) %>',
            children:[
              {name: 'dbpedia-item', children:[
                {name: 'dbpedia-link', children: [
                  {name: 'dbpedia-logo'}
                ]},
                {name: 'dbpedia-title'},
                {name: 'dbpedia-thumbs', datasource:'$dataObj.dbpedia_rdf_resource("http://dbpedia.org/ontology/author")', children:[
                  {name: 'dppedia-img-deref', datasource:'url:<%= $env.methods.get_datasource_dbpedia_uri($data.obj) %>',
                    children:[
                      {name: 'dppedia-img', bind:'$dataObj.dbpedia_rdf_resource("http://dbpedia.org/ontology/thumbnail")[0].value[0].value'}
                    ]
                  }]
                }
              ]}
            ]
          }
        ]}
      ]},
      {name: 'footer'}
    ]
  }
];


var head = [
    {name: 'main_css', widget:'Head', href:'css/bootstrap.css', tag: 'style'},
    {name: 'secondary_css', widget:'Head', href:'css/europedia.css', tag: 'style'},
    {name: 'viewport', widget:'Meta', content:'width=device-width, initial-scale=1'},
    {name: 'title', widget:'Title', value: '"Europeana"'}
];

var concrete_interface = [
  {
    name: 'landing',
    head: head,
    maps: [

      { name: 'header', widget: 'SimpleHtml', tag:'div', class:'container-fluid text-center fundo' },
      { name: 'logo', widget: 'SimpleHtml', tag:'img', src:'"imgs/europedia.png"' },

      { name: 'search_form', widget: 'SimpleHtml', tag:'form', onsubmit:'do_search(event);' },
      { name: 'search_group', widget: 'SimpleHtml', tag:'div', class:'input-group form_center col-sm-8' },
      { name: 'search_field', widget: 'SimpleHtml', tag:'input', class:'form-control input-lg', placeholder:'"Please type search term"' },
      { name: 'search_button', widget: 'BootstrapFormGroupButton', class:'btn-warning', value:'"Search"', events:{'click': 'do_search'} },

      { name: 'footer', widget: 'TecWebRodape'}
    ]},{
    name: 'results',
    head:head,
    maps: [
      { name: 'header', widget: 'SimpleHtml', tag:'div', class:'container-fluid text-center fundo' },
      { name: 'logo', widget: 'SimpleHtml', tag:'img', src:'"imgs/europedia.png"' },

      { name: 'search_form', widget: 'SimpleHtml', tag:'form', onsubmit:'do_search(event);' },
      { name: 'search_group', widget: 'SimpleHtml', tag:'div', class:'input-group form_center col-sm-8' },
      { name: 'search_field', widget: 'SimpleHtml', tag:'input', class:'form-control input-lg', placeholder:'"Please type search term"' },
      { name: 'search_button', widget: 'BootstrapFormGroupButton', class:'btn-warning', value:'"Search"', events:{'click': 'do_search'} },

      { name: 'content',tag:'div', class:'container-fluid' },
      { name: 'results', tag:'div', class:'row' },
      { name: 'result_panel', tag:'div', class:'col-xs-12 col-sm-6 col-md-4 col-lg-3' },
      { name: 'result_item', tag:'div', class:'item well' },
      { name: 'result_link', tag:'a', href:'navigate(replace_for_ld($data.link))' },
      { name: 'result_icon', widget: 'BootstrapIcon', when:'hasIcon', class:'pull-left', icon:'icons[$data.type]' },
      { name: 'result_thumb', when:'hasImage', class:'col-md-11', tag:'img', src:'$data.edmPreview[0]' },
      { name: 'result_title', tag:'h4', value:'$data.title[0]' },
      { name: 'result_details', tag:'span', value:'$data.edmConceptPrefLabelLangAware.en.join(", ")', when:'hasEN' },

      { name: 'footer', widget: 'TecWebRodape'}
    ]},{
    name: 'topic',
    head:head,
    maps: [
      { name: 'header', widget: 'SimpleHtml', tag:'div', class:'container-fluid text-center fundo' },
      { name: 'logo', widget: 'SimpleHtml', tag:'img', src:'"imgs/europedia.png"' },

      { name: 'search_form', widget: 'SimpleHtml', tag:'form', onsubmit:'do_search(event);' },
      { name: 'search_group', widget: 'SimpleHtml', tag:'div', class:'input-group form_center col-sm-8' },
      { name: 'search_field', widget: 'SimpleHtml', tag:'input', class:'form-control input-lg', placeholder:'"Please type search term"' },
      { name: 'search_button', widget: 'BootstrapFormGroupButton', class:'btn-warning', value:'"Search"', events:{'click': 'do_search'} },

      { name: 'content', widget: 'SimpleHtml', tag:'div', class:'container' },
      { name: 'item', widget: 'SimpleHtml', tag:'div', class:'row' },
      { name: 'item_panel', tag:'div', md:'12' },
      { name: 'item_panel', when:'hasDbpedia,isDesktop', tag:'div', xs:'12', sm:12, md:8, lg:8 },
      { name: 'item-box', tag:'div', class:'well' },

      { name: 'item-extra-info' },
      { name: 'item-extra-info', when:'isMobile', widget:'Collapsed', title:{value:'Click for more info'} },

      { name:"item-title", tag:'h2', value:'$bind' },
      { name:"item-media-link", tag:'a', pull:'right', href:'$bind', xs:12, sm:12, md:4, lg:4},
      { name:"item-media", tag:'img', img:'thumbnail', src:'$bind' },
      { name:"item-contributor", tag:'h4', value: 'Contributor'},
      { name:"item-date", tag: 'h4', value:'@Date'},
      { name:"item-subject", tag: 'h4', value:'Subject'},
      { name:"item-identifier", tag: 'h4', value:'Identifier'},
      { name:"item-partof", tag: 'h4', value:'Part Of'},
      { name:"item-format", tag:'h4', value:'Format' },
      { name:"item-language", tag: 'h4', value: 'Language'},
      { name:"item-provider", tag: 'h4', value:'Provider'},
      { name:"item-country", tag: 'h4', value:'Country Provider'},
      { name:"item-contributor-value", value:'$bind[0]' },
      { name:"item-contributor-value", value:'$bind[1]', when:'$bind.length > 1' },
      { name:"item-date-value", value:'$bind' },
      { name:"item-type-value", value:'$bind' },
      { name:"item-format-value", value:'$bind' },
      { name:"item-subject-value", value:'$bind' },
      { name:"item-identifier-value", value:'$bind' },
      { name:"item-language-value", value:'$bind' },
      { name:"item-provider-value", value:'$bind' },
      { name:"item-country-value", value:'$bind'},
      { name:"item-player", widget:'AudioPlayer', source:'$dataObj.rdf_prop("edm:isShownBy")[0]["@id"]'},

      { name:"sidebar-dbpedia", xs:12, sm:12, md:4, lg:4},

      {name: 'dbpedia-item'},
      {name: 'dbpedia-logo', tag:'img', src:'"imgs/dbpedia_logo.png"', img:'responsive'},
      {name: 'dbpedia-link', tag:'a', md:6, href:'$dataObj.dbpedia_rdf_resource("http://dbpedia.org/ontology/author")[0].value[0].value'},
      //{name: 'dbpedia-title', value:'$dataObj.dbpedia_rdf_resource("http://dbpedia.org/ontology/author")'},
      {name: 'dbpedia-thumbs', md:12 },
      {name: 'dppedia-img-deref' },
      {name: 'dppedia-img', tag:'img', src:'$bind', md:4, img:'responsive,thumbnail', class:'altura-maxima' },

      { name: 'footer', widget: 'TecWebRodape'}
    ]}
];

var ajaxSetup = {
  qs : {
    'wskey': 'o5jbXH88a'
  }
};

var conf = {
  icons: icons,
  events: {
    do_search: function (options) {
      options.$event.preventDefault();
      var search = $('#search_field').val();
      window.location.href = navigate('http://www.europeana.eu/api/v2/search.json',
        {
          'query': search,
          'rows': 50
        }

      );
    }
  },
  methods: {
    get_datasource_dbpedia_uri: function (values) {
      var dbpedia = null;
      if(_.isString(values) && values.indexOf("http://dbpedia.org/resource") == 0){
        return values.replace('resource', 'data') + '.json';
      }
      _.each(values, function (value) {
        if (value['@id'] && value['@id'].indexOf("http://dbpedia.org/resource") == 0) {
          dbpedia = value['@id'].replace('resource', 'data') + '.json';

          /*
           dbpedia =  'http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=DESCRIBE+%3C' +
           value['@id'] +
           '%3E&output=application%2Fld%2Bjson';
           */
        }
      });
      return dbpedia
    }
  }
};

var replace_for_ld = function(uri){
    return uri.replace('.json', '.jsonld');
};

if(typeof define === 'function') {
  define([
    // Load our app module and pass it to our definition function
    "jquery",
    "bootstrap",
    'mira/init',
    'mira/widgets/bootstrap-base'
  ], function ($, $bootstrap, Mira, BootstrapBase) {

    return function Europeana() {
      var app = new Mira.Application(interface_abstracts, concrete_interface, rules, selection, conf);
      Mira.Widget.setDefault('BootstrapSimple');
      $.ajaxSetup(ajaxSetup);
      app.useServer();

      Mira.Api.Model.prototype.dbpedia_rdf_resource = function(){
        var dbpedia_rdf_arguments = arguments;
        var resources = [];

        for(var parent_key in this.attributes){
            var parent_value = this.attributes[parent_key];

          for(var children_key in parent_value){
            var children_value = parent_value[children_key];
            if(_.indexOf(dbpedia_rdf_arguments, children_key) != -1){
              resources.push({
                obj: parent_key,
                prop: children_key,
                value: children_value
              });
            }
          }
        }

        return resources;
      };

      Mira.Widget.register({
        Collapsed: function($parent, name, $context, options, callback) {
          var $content;

          options.title = _.defaults(options.title || {}, {
            tag:'h3',
            events: {}
          });

          options.content = _.defaults(options.content || {}, {
            tag:'div',
            class: 'collapse'
          });

          var title_events = {
            click: function(options){
              $content.collapse({toggle:true});
            }
          };

          options.title.events = _.defaults(options.title.events, title_events);

          BootstrapBase.Simple($parent, name, $context, options, function(ret){

            BootstrapBase.Simple(ret.$children, name + '-title', $context, options.title);

            BootstrapBase.Simple(ret.$children, name + '-content', $context, options.content, function(ret2){
              $content = ret2.$element;
              if(callback){
                callback(ret2);
              }
            });

          });
        }
      });
    };
  });
} else {

    exports.ajaxSetup = ajaxSetup;
    exports.abstracts = interface_abstracts;
    exports.mapping = concrete_interface;
    exports.selection = selection;
    exports.rules = rules;
}


