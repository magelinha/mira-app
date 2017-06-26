"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {
    var messageEmptyList = {
        "pt-BR": "A lista não contém registros. ",
        "en-US": "The list contains no records. "
    };

    var messageBaseOne = {
        "pt-BR": "A lista tem um registro. ",
        "en-US": "The list has a record. "
    };

    var messageBaseMult = {
        "pt-BR": "A lista tem %d registros. ",
        "en-US": "The list has %d records. "
    };

    var hasEntity = function($env){
        return $env.entity && $env.$data && $env.data.length;
    };

    var buildEntities = function(entity, values){
        var entries = _.map(values, function(value){
            var item = new Object();
            item.value = value[entity.key];
            item.synonyms = [];
        });

        var element = new Object();
        element.name = entity.name;
        element.entries = entries;

        return element;
    }

    var defaultContent =  function(message, $parent, name, $context, options, callback, ignored_options){
        var tts = options.tts;
        var anchor = Helper.buildAnchor();

        var element = document.createElement(options.tag || 'div');

        // Determina o Id do elemento
        element.id = Helper.get_valid_id(name, $parent);

        //Determina as propriedades básicas do elemento
        var atrs = Helper.omit_params(options,ignored_options);
        var context = Helper.build_context($context, options);
        Helper.build_attributes(element, atrs, context);
        
        //Define o tabindex do elemento
        var $element = $(element);
        $element.prop('tabindex', options['tabindex'] || '0');
        anchor.append($element);

        if(options.title){
            //Adiciona o título na lista do AppAPI
            if(_.isString(options.title)){
                appApi.titleMessage[appApi.currentLanguage][name] = options.title;
            }
            else{
                appApi.titleMessage["pt-BR"][name] = options.title["pt-BR"];
                appApi.titleMessage["en-US"][name] = options.title["en-US"];
            }

            var title = document.createElement(options.header || 'h3');
            title.innerHTML = Helper.build_value(appApi.titleMessage[appApi.currentLanguage][name], context);
            $element.prepend(title);

            $element.update = function(){
                title.innerHTML = Helper.build_value(appApi.titleMessage[appApi.currentLanguage][name], context);
            }
            
            appApi.widgets.push($element);
        }

        if(tts){
            Helper.tts_on_focus($element, tts, context);
        }else{
            $element.focus(function(e){
                var children = $element.children('div:visible, blockquote:visible, a:visible, li:visible, section:visible, tr:visible')
                var lenChildren = children.length;
                var text = '';

                if(lenChildren == 0){
                    text = messageEmptyList[appApi.currentLanguage];
                }else if(lenChildren == 1){
                    text = messageBaseOne[appApi.currentLanguage];
                }
                else{
                    text = sprintf(messageBaseMult[appApi.currentLanguage] + message[appApi.currentLanguage], lenChildren);
                }
                
                appApi.tts(text);

                if(children.length)
                    children[0].focus();

            });
        }
        
        //Registra as entidades
        if(hasEntity($context.$env)){
            appApi.buildEntities($env.entity, $env.data);
        }

        //Faz o build dos eventos
        if(options.events) {
            Helper.build_events($element, options.events, context);
        }

        $parent.append(anchor.children());

        if(callback){
            callback({
                $children: $element,
                $element: $element,
                html: $parent.html()
            })
        }
    };

    return {
        //Lista com conteúdo genérico. A navegação é apenas com próximo ou anterior.
        Content: function($parent, name, $context, options, callback, ignored_options){
            var message = {
                "pt-BR": "Fale próximo ou anterior para navegar na lista.",
                "en-US": "Say next or previous to browse the list."
            };

            defaultContent(message, $parent, name, $context, options, callback, ignored_options);
        },

        //Lista com conteúdo que pode ser selecionado. A naveagação é festa através de próximo, anterior ou selecionar.
        Select: function($parent, name, $context, options, callback, ignored_options){
            var message = {
                "pt-BR": "Fale próximo ou anterior para navegar na lista e selecionar para selecionar o item desejado.",
                "en-US": "Say next or previous to browse the list and select to select the desired item."
            };

            defaultContent(message, $parent, name, $context, options, callback, ignored_options);    
        },

        //Lista com conteúdo que pode ser selecionado. A naveagação é festa através de próximo, anterior ou marcar.
        Check: function($parent, name, $context, options, callback, ignored_options){
            var message = {
                "pt-BR": "Fale próximo ou anterior para navegar na lista e marcar para marcar o item desejado.",
                "en-US": "Say next or previous to browse the list and mark to mark the desired item."
            };

            defaultContent(message, $parent, name, $context, options, callback, ignored_options);
        }
    }
});