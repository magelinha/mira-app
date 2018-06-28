"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    var validTypes = ['select', 'textarea'];
    var messages = {
        zeroItem: {
            "pt-BR":"Caixa de seleção sem itens",
            "en-US": "Combobox without items"
        },

        oneItem: {
            "pt-BR":"Caixa de seleção com 1 item",
            "en-US": "Combobox with 1 item"
        },

        manyItems: {
            "pt-BR":"Caixa de seleção com %d itens",
            "en-US": "Combobox with %d items"
        },

    }

    var templateInput = '<input type="<%=type%>" class="form-control" />';

    var templateRadio = '<div class="<%=type%>" tabindex="0">\
                            <label for="<%=id%>">\
                                <input id="<%=id%>" type="<%=type%>" name="<%=name%>" value="<%=value%>" />\
                                <%=label%>\
                            </label>\
                        </div>';
    
    var configureElementByTag = function(tag, $input){
        switch(tag){
            case "select":
                configureSelect($input);
                break;
            case "p":
                configureP($input);
                break;
            default:
                $input.removeClass('form-control').addClass('form-control');
                break;
        }
    };

    var configureSelect = function($input){
        $input.removeClass('form-control').addClass('form-control');
        
        // Quando ganhar o foco, fala quantas opções tem
        $input.focus(function(e){
            var children = $input.find("option");
            if(children.length == 0)
                appApi.tts(messages.zeroItem[appApi.currentLanguage]);
            else if(children.length == 1)
                appApi.tts(messages.oneItem[appApi.currentLanguage]);
            else
                appApi.tts(sprintf(messages.manyItems[appApi.currentLanguage], children.length));
        });

        //quando alterar a valor do objeto via teclado, informa o valor
        $input.keyup(function(e){
            if(e.which != 38 && e.which != 40)
                return;

            appApi.tts($(this[this.selectedIndex]).text());
        });
    }

    var configureP = function($input){
        $input.removeClass('form-control-static').addClass('form-control-static');
    }


    var generateGeneralInput = function(tag, $parent, name, $context, options, callback, ignored_options){
        var id = Helper.get_valid_id(name, $parent);
        
        var $input = $('<' + tag + ' />');
        
        //Id do input e o atributo for da label
        $input.prop('id', id);

        //Determina as propriedades básicas do elemento
        var atrs = Helper.omit_params(options,ignored_options);
        var context = Helper.build_context($context, options);
        Helper.build_attributes($input[0], atrs, context);
        $input.prop('tabindex', 0);
        $input.prop('aria-required', options.required || false);
        $input.attr('required', options.required || false);
        //configureElementByTag(tag, $input);

        if(options.events) {
            Helper.build_events($input, options.events, context);
        }

        $parent.append($input);

        if(callback){
            callback({
                $children: $input,
                $element: $input,
                html: $parent.html()
            })
        }
    };

    var generateRadioOrCheckbox = function(tag, $parent, name, $context, options, callback, ignored_options){
        var id = Helper.get_valid_id(name, $parent);
        //Template dos grupo e input
        var atrs = Helper.omit_params(options,ignored_options);
        var context = Helper.build_context($context, options);
        
        var $group = $(_.template(templateRadio, { 
                        id: id,
                        type: tag,
                        name: name,
                        value: Helper.build_value(options.value, context) || '',
                        label: Helper.build_value(options.text, context)
                    }));

        var $input = $group.find('input');
        Helper.build_attributes($input[0], atrs, context);

        //Determina as propriedades básicas do elemento
        $input.prop('tabindex', 0);

        if(options.events) {
            Helper.build_events($input, options.events, context);
        }

        $parent.append($group);

        if(callback){
            callback({
                $children: $input,
                $element: $input,
                html: $parent.html()
            })
        }
    };

    return {
        Input: function($parent, name, $context, options, callback, ignored_options){
            var id = Helper.get_valid_id(name);

            var $input = $(_.template(templateInput, {type: options.type || 'text'}));
            $input.prop('id', id);
            //Determina as propriedades básicas do elemento
            var atrs = Helper.omit_params(options,ignored_options);

            var context = Helper.build_context($context, options);
            Helper.build_attributes($input[0], atrs, context);
            $input.prop('tabindex', 0);
            $input.prop('aria-required', options.required || false);
            
            if(options.events) {
                Helper.build_events($input, options.events, context);
            }

            //Insere o valor no campo
            if(options.value){
                if(options.value === "$bind"){
                    options.value = $context.$bind;
                }
    
                if(_.isObject(options.value)){
                    var value = Helper.build_value(options.value[appApi.currentLanguage], context);
                    $element.prop('value', value);
                } else{
                    $element.prop('value', options.value);
                }
    
                $element.updateValue = function(){
                    if(_.isObject(options.value)){
                        var value = Helper.build_value(options.value[appApi.currentLanguage], context);
                        $element.prop('value', value);
                    } else{
                        $element.prop('value', options.value);
                    }
                }
            }

            $parent.append($input);

            if(callback){
                callback({
                    $children: $input,
                    $element: $input,
                    html: $parent.html()
                })
            }
        },

        Select: function($parent, name, $context, options, callback, ignored_options){
            generateGeneralInput('select', $parent, name, $context, options, callback, ignored_options);
        },

        Static: function($parent, name, $context, options, callback, ignored_options){
            generateGeneralInput('p', $parent, name, $context, options, callback, ignored_options);
        },

        TextArea: function($parent, name, $context, options, callback, ignored_options){
            generateGeneralInput('textarea', $parent, name, $context, options, callback, ignored_options);  
        },

        RadioButton: function($parent, name, $context, options, callback, ignored_options){
            generateRadioOrCheckbox('radio', $parent, name, $context, options, callback, ignored_options);
        },

        Checkbox: function($parent, name, $context, options, callback, ignored_options){
            generateRadioOrCheckbox('checkbox', $parent, name, $context, options, callback, ignored_options);
        },

        Button: function($parent, name, $context, options, callback, ignored_options){
            if(options.value === "$bind")
                options.value = $context.$bind;

            
            var $element = options.tag ? $('<'+ options.tag +' />') : $('<button />');
            
            //Id do input e o atributo for da label
            var id = Helper.get_valid_id(name, $parent);
            $element.prop('id', id);


            //Determina as propriedades básicas do elemento
            var atrs = Helper.omit_params(options,ignored_options);
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element[0], atrs, context);
            $element.prop('tabindex', 0);

            if(options.value){
                var value = _.isObject(options.value) ? options.value[appApi.currentLanguage] : options.value;
                $element.text(Helper.build_value(value, context));
                
                if(_.isObject(options.value)){
                    $element.update = function(){
                        var valueToUpdate = _.isObject(options.value) ? options.value[appApi.currentLanguage] : options.value;
                        $element.text(Helper.build_value(valueToUpdate, context));
                    }

                    appApi.widgets.push($element);
                }
            }

            if(options.events) {
                Helper.build_events($element, options.events, context);
            }


            $parent.append($element);

            if(callback){
                callback({
                    $children: $element,
                    $element: $element,
                    html: $parent.html()
                })
            }
        },

        Option: function($parent, name, $context, options, callback, ignored_options){
            var $element = $('<option />');
            
            //Id do input e o atributo for da label
            var id = Helper.get_valid_id(name, $parent);
            $element.prop('id', id);
            $element.value = options.value;

            //Determina as propriedades básicas do elemento
            var atrs = Helper.omit_params(options,ignored_options);
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element[0], atrs, context);
            $element.prop('tabindex', 0);
            $element.prop('value', Helper.build_value(options.value, context));

            var text = Helper.build_value(options.text, context);
            $element.text(_.isObject(text) ? text.value || text[appApi.currentLanguage] : text);
            
            if(_.isObject(text)){
                $element.update = function(){
                    text = Helper.build_value(options.text, context);
                    $element.text(_.isObject(text) ? text.value || text[appApi.currentLanguage] : text);
                }

                appApi.widgets.push($element);
            }

            $parent.append($element);

            if(callback){
                callback({
                    $children: $element,
                    $element: $element,
                    html: $parent.html()
                })
            }
        },
    };
});