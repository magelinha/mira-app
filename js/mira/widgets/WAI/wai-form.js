"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    var alertMessages = {
        "pt-BR": "Foram encontrados os seguintes erros: ",
        "en-US": "The following errors were found: "
    };

    var requiredFields = {
        "pt-BR": "Os campos desejados são: ",
        "en-US": "The required fields are: "    
    };

    var submitMessage = {
        "pt-BR": ". Diga %s para submeter o formulário.",
        "en-US": ". Say %s to submit form.",
    }

    var setAlertMessage = function(form, errors){
        var alert = form.find('.alert');
        var list = alert.find('ul');
        list.empty();

        var messageSpeak = alert.find('h5').text();

        _.each(errors, function(error){
            var item = $('<li />');
            
            var textError = _.isObject(error) ? error[appApi.currentLanguage] : error;
            item.text(textError);
            list.append(item);
            messageSpeak += textError + '.';
        });

        alert.removeClass('hidden');
        appApi.tts(messageSpeak);
    }

	return function($parent, name, $context, options, callback, ignored_options){
		var tts = $context.$env.tts;
		var element = document.createElement('form');
        // Determina o Id do elemento
        element.id = Helper.get_valid_id(name, $parent);

        var alert = document.createElement('div');
        alert.setAttribute('role', 'alert');
        alert.setAttribute('class', 'alert alert-danger hidden');
        alert.id = "alert-" + element.id;
        alert.innerHTML = '<h5>Foram encontrados os seguintes erros: </h5><ul></ul>';
        var $alert = $(alert);

        //Determina as propriedades básicas do elemento
        var atrs = Helper.omit_params(options,ignored_options);
		var context = Helper.build_context($context, options);
        Helper.build_attributes(element, atrs, context);
        
        //Define o tabindex do elemento
		var $element = $(element);
        $element.prop('tabindex', options['tabindex'] || '0');


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
            $parent.append(title);
            //$element.prepend(title);

            $element.updateTitle = function(){
                title.innerHTML = Helper.build_value(appApi.titleMessage[appApi.currentLanguage][name], context);
            }
        }

        $element.update = function(){
            if(_.isFunction($element.updateTitle))
                $element.updateTitle();

            $alert.children('h5').html(alertMessages[appApi.currentLanguage]);
            $alert.addClass('hidden');
        }

        appApi.widgets.push($element);

        $element.append(alert);
        $parent.append($element);

        //Ao focalizar o form, fala a mensagem passada na interface, ou usa a mensagem padrão.
        if(tts){
        	Helper.tts_on_focus($element, tts, context);
        }
        else{

            $element.focus(function(e){
                var labels = $element.find('label[for!=""]');
                var text = '';
                $.each(labels, function(index, label){
                    text += $(label).text() + '.';
                });

                var textButton = $element.find('button[type="submit"]').text();
                var messageButton = textButton && textButton.length ? sprintf(submitMessage[appApi.currentLanguage], textButton) : '';

                if(text && text.length > 0){
                    var finalMessage = requiredFields[appApi.currentLanguage] + text;
                    finalMessage += messageButton.length ? messageButton : '';
                    appApi.tts(finalMessage);
                }
            });
        }

        //Faz primeira a validação do campos para depois executar o submit cadastrado no evento do MIRA.
        $element.submit(function(e){
            e.preventDefault();

            var inputs = $element.find(':input:not(:radio, :checkbox, :button)');
            var errors = [];
            _.each(inputs, function(input){
                var $input = $(input);
                var action = input.validation($input.val());
                var message = '';
                if(!action.success){
                    message = typeof(input.errorMessage) == "string" ? input.errorMessage :
                                        _.find(input.errorMessage, function(error) { return error.name == action.error }).message || 
                                        input.errorMessage[0].message;

                    errors.push(message);
                }
            });

            if(errors.length){
                e.stopImmediatePropagation();
                setAlertMessage($element, errors); 
            }else{
                $element.find('.alert').addClass('hidden');
            }
        });

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