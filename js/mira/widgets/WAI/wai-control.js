"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    var validTypes = ['select', 'textarea'];

    var templateGroup = '<div class="form-group">\
                                        <label class="col-sm-2 control-label"><%= _.isString(label) ? label : label[appApi.currentLanguage] %></label>\
                                        <div class="col-sm-10">\
                                        <% if(help && help.length > 0) {%>\
                                            <span class="help-block"><%=help%></span>\
                                        <% } %>\
                                        </div>\
                                    </div>';

    var templateInput = '<input type="<%=type%>" class="form-control" />';

    var templateRadio = '<div class="<%=type%>" tabindex="0">\
                            <label for="<%=id%>">\
                                <input id="<%=id%>" type="<%=type%>" name="<%=name%>" value="<%=value%>" />\
                                <%=label%>\
                            </label>\
                        </div>';

    var generateGeneralInput = function(tag, $parent, name, $context, options, callback, ignored_options){
        var tts = options.tts;
        var label = options.label;
        if(tag != "option" && !label || (_.isString(label) && !label.length)){
            throw "O widget "+ name + " não possui o atributo Label válido";
        }

        var id = Helper.get_valid_id(name, $parent);
        //Template dos grupo e input
        var $group = $(_.template(templateGroup, { 
                        id: id,
                        help: options.help, 
                        label: label
                    }));

        var $input = $('<' + tag + ' />');
        $input[0].validation = options.validation;
        $input[0].errorMessage = options.error;
        $input[0].helpMessage = options.help;
        
        //Id do input e o atributo for da label
        $input.prop('id', id);
        $group.children('label').prop('for', id);

        //Determina as propriedades básicas do elemento
        var atrs = Helper.omit_params(options,ignored_options);
        var context = Helper.build_context($context, options);
        Helper.build_attributes($input[0], atrs, context);
        $input.prop('tabindex', 0);
        $input.prop('aria-required', options.required || false);
        $input.attr('required', options.required || false);
        if(tag == "p"){
            $input.removeClass('form-control-static').addClass('form-control-static');
        }else{
            $input.removeClass('form-control').addClass('form-control');
        }

        //Configura a label do controle após a mudança de linguagem
        if(_.isObject(label)){
            $input.update = function(){
                $group.find('label').html(label[appApi.currentLanguage]);
            }

            appApi.widgets.push($input);
        }

        if(tts){
            Helper.tts_on_focus($input, tts, context);
        }

        if(options.events) {
            Helper.build_events($input, options.events, context);
        }

        $group.children('div').prepend($input);
        $parent.append($group);

        if(callback){
            callback({
                $children: $input,
                $element: $input,
                html: $parent.html()
            })
        }
    };

    var generateRadioOrCheckbox = function(tag, $parent, name, $context, options, callback, ignored_options){
        var tts = options.tts;

        if(!options.label || !options.label.length){
            throw "O widget "+ name + " não possui o atributo Label válido";
        }

        var id = Helper.get_valid_id(name, $parent);
        //Template dos grupo e input
        var atrs = Helper.omit_params(options,ignored_options);
        var context = Helper.build_context($context, options);
        
        var $group = $(_.template(templateRadio, { 
                        id: id,
                        type: tag,
                        name: name,
                        value: Helper.build_value(options.value, context) || '',
                        label: Helper.build_value(options.label, context)
                    }));

        var $input = $group.find('input');
        Helper.build_attributes($input[0], atrs, context);

        //Determina as propriedades básicas do elemento
        $input.prop('tabindex', 0);

        if(tts){
            Helper.tts_on_focus($group, tts, context);
        }

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
            var tts = options.tts;
            var label = options.label;
            if(!label || (_.isString(label) && !label.length)){
                throw "O widget "+ name + " não possui o atributo Label válido";
            }

            var id = Helper.get_valid_id(name);

            //Template dos grupo e input
            var $group = $(_.template(templateGroup, { 
                            id: id,
                            help: options.help, 
                            label: label
                        }));

            var $input = $(_.template(templateInput, {type: options.type || 'text'}));
            $input.prop('id', id);
            $group.children('label').prop('for', id);
            $input[0].validation = options.validation;
            $input[0].errorMessage = options.error;
            $input[0].helpMessage = options.help;

            //Determina as propriedades básicas do elemento
            var atrs = Helper.omit_params(options,ignored_options);

            var context = Helper.build_context($context, options);
            Helper.build_attributes($input[0], atrs, context);
            $input.prop('tabindex', 0);
            $input.prop('aria-required', options.required || false);


            //Configura a label do controle após a mudança de linguagem
            if(_.isObject(label)){
                $input.update = function(){
                    $group.find('label').html(label[appApi.currentLanguage]);
                }

                appApi.widgets.push($input);
            }

            if(tts){
                Helper.tts_on_focus($input, tts, context);
            }

            if(options.events) {
                Helper.build_events($input, options.events, context);
            }

            $group.children('div').prepend($input);
            $parent.append($group);

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
            var tts = options.tts;
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

            var value = _.isObject(options.value) ? options.value[appApi.currentLanguage] : options.value;
            $element.text(Helper.build_value(value, context));
            
            if(_.isObject(options.value)){
                $element.update = function(){
                    var valueToUpdate = _.isObject(options.value) ? options.value[appApi.currentLanguage] : options.value;
                    $element.text(Helper.build_value(valueToUpdate, context));
                }

                appApi.widgets.push($element);
            }

            if(tts){
                Helper.tts_on_focus($element, tts, context);
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
            var tts = options.tts;

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

            if(tts){
                Helper.tts_on_focus($element, tts, context);
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