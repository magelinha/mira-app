"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {
    var templateMain = `
    <div class="modal fade" id="<%=id%>" tabindex="-1" role="dialog" aria-labelledby="<%=label%>" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                
                
                
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->`;

    var templateHeader = `
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="<%=idModal%>"><%=value%></h4>
    </div>
    `;

    var templateBody = `<div class="modal-body"></div>`;

    var templateFooter = `<div class="modal-footer"></div>`;

    return {
        Main: function($parent, name, $context, options, callback){
            var optionsTemplate = { id: name, label: options.label || (name + "Modal") };
            var $element = $(_.template(templateMain, optionsTemplate));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            Helper.build_events($element,options.events, context);
            
            if(callback){
                callback({
                    $children: $element.find('.modal-content'),
                    html: $element.html()
                })
            }
        },

        Header: function($parent, name, $context, options, callback){
            var context = Helper.build_context($context, options);

            var idParent = $parent.prop('id');
            var value = Helper.build_value(options.value, context);
            var optionsTemplate = { idModal: idParent, value: value };
            var $element = $(_.template(templateHeader, optionsTemplate));
            
            Helper.build_attributes($element, {}, context);
            $parent.append($element);

            if(callback){
                callback({
                    $children: $element.find('h4'),
                    html: $element.html()
                })
            }
        },

        Body: function($parent, name, $context, options, callback){
            var $element = $(_.template(templateBody, {}));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            if(callback){
                callback({
                    $children: $element,
                    html: $element.innerHTML
                })
            }
        },

        Footer: function($parent, name, $context, options, callback){
            var $element = $(_.template(templateFooter, {}));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            if(callback){
                callback({
                    $children: $element,
                    html: $element.innerHTML
                })
            }
        },
    };
});