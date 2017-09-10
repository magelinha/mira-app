"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

	var validTags = ['div', 'section', 'header', 'footer', 'a', 'blockquote'];


	return function($parent, name, $context, options, callback, ignored_options){
        var tts = options.tts;
        var anchor = Helper.buildAnchor();
        
        //Define a tag do container;
		var tag = options.tag ? options.tag : 'div';
		var element = document.createElement(tag);

		// Determina o Id do elemento
		element.id = Helper.get_valid_id(name, $parent);

        //Determina as propriedades básicas do elemento
        var atrs = Helper.omit_params(options,ignored_options);
		var context = Helper.build_context($context, options);
        Helper.build_attributes(element, atrs, context);
        
        //Define o tabindex do elemento
		var $element = $(element);
        $element.prop('tabindex', options['tabindex'] || '0');

        $parent.append($element);

        if(options.title){
            //Adiciona o título na lista do AppAPI
            if(_.isString(options.title)){
                appApi.titleMessage["pt-BR"][name] = appApi.titleMessage["en-US"][name] = options.title;
            }
            else{
                appApi.titleMessage["pt-BR"][name] = options.title["pt-BR"];
                appApi.titleMessage["en-US"][name] = options.title["en-US"];
            }

            var title = document.createElement(options.header || 'h3');
            title.innerHTML = Helper.build_value(appApi.titleMessage[appApi.currentLanguage][name], context);
            $(title).insertBefore($element);

            $element.updateTitle = function(){
                title.innerHTML = Helper.build_value(appApi.titleMessage[appApi.currentLanguage][name], context);
            }
        }

        if(options.value){
            if(options.value === "$bind"){
                options.value = $context.$bind;
            }

            if(_.isNumber(options.value)){
                $element.html(options.value);
            }else if(!_.isObject(options.value))
                $element.html(Helper.build_value(options.value, context));
            else{
                $element.html(Helper.build_value(options.value[appApi.currentLanguage], context));
            }

            $element.updateValue = function(){
                if(_.isNumber(options.value)){
                    $element.html(options.value);
                }else if(!_.isObject(options.value))
                    $element.html(Helper.build_value(options.value, context))
                else
                    $element.html(Helper.build_value(options.value[appApi.currentLanguage], context));
            }
        }

        if(_.isFunction($element.updateTitle) || _.isFunction($element.updateValue)){
            $element.update = function(){
                if(_.isFunction($element.updateTitle))
                    $element.updateTitle();

                if(_.isFunction($element.updateValue))
                    $element.updateValue();       
            }

            appApi.widgets.push($element);
        }
        
        if(tts){
        	Helper.tts_on_focus($element, tts, context);
        }

        //Faz o build dos eventos
        if(options.events) {
            Helper.build_events($element, options.events, context);
        }

        if(callback){
            callback({
                $children: $element,
                $element: $element,
                html: $parent.html()
            })
        }
	}
});