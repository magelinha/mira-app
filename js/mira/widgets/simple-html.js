"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    return function($parent, name, $context, options, callback, ignored_options) {
        
        var element = document.createElement(options.tag || 'div');
        
        var tempName = name;
        var count = 1;
        
        while(document.getElementById(tempName) != null){
            tempName = name + count.toString();
            count++;
        }

        element.id = tempName;

        var atrs = _.omit(options, 'tag', 'value', 'name', 'widget', 'events', ignored_options);

        var context = Helper.build_context($context, options);
        Helper.build_attributes(element, atrs, context);


        if(options.value) {
            if (options.tag == 'input' || options.tag == 'select') {
                element.setAttribute('value', Helper.build_value(options.value, context));
            } else if (options.tag == 'option' ){
                element.setAttribute('value', Helper.build_value(options.value, context));
                element.innerHTML = Helper.build_value(options.text, context);
            }else {
                element.innerHTML = Helper.build_value(options.value, context);
            }
        }

        var label = null;
        if(options.tag == 'input' && (options.type == 'radio' || options.type == 'radio')){
            label = document.createElement('label');
            label.innerHTML = options.text;
            label.setAttribute('for', tempName);
        }

        $parent.append(element);
        if(label != null)
            $parent.append(label);

        var $element = $(element);

        //informa o tab-index 0 se necessário para que seja acessado o focus via javascript
        if($element.is('div') || $element.is('form') || $element.is('label')){
            $element.attr('tabindex', '0');
        }

        /*
        if($element.is('form')){
            $element.focus(function(e){
                var labels = $element.find('label');
                var texts = '';
                $.each(labels, function(index, item){
                    texts += $(item).text() + '.';
                });

                console.log(texts);
                
                appApi.tts("Os campos desejados são: " + texts);    
            });
        }*/

        /*

        if($element.is(':radio') || $element.is(':checkbox')){
            options.text = options.text != null ? options.text : "";
            $parent.append(Helper.build_value(options.text, context));
        }*/


        if(options.events) {
            Helper.build_events($element, options.events, context);
        }

        if(callback){
            callback({
                $children: $element,
                $element: $element,
                html: element.innerHTML
            })
        }
    };
});