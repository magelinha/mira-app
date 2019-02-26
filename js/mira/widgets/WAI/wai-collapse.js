"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {
    var templateCollapse =`
    <div class="panel-group" id="<%=id%>"><div>
    `;

    var templateCollapseItem = `<div class="panel <%=class%>"></div>`;

    var templateHeader = `
    <div class="panel-heading">
        <h4 class="panel-title">
            <a class="accordion-toggle" data-toggle="collapse" data-parent="#<%=id%>" href="#">
                <%=value%>
            </a>
        </h4>
    </div>`;

    var templateContent = `
    <div id="<%=id%>" class="panel-collapse collapse">
        <div class="panel-body"></div>
    </div>`;

    return {
        Main: function($parent, name, $context, options, callback){
            var optionsTemplate = { id: name };
            var $element = $(_.template(templateCollapse, optionsTemplate));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);
            
            if(callback){
                callback({
                    $children: $element,
                    html: $element.html()
                })
            }
        },

        Item: function($parent, name, $context, options, callback){

            var $element = $(_.template(templateCollapseItem, {class: options.class || "panel-default"}));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            if(callback){
                callback({
                    $children: $element,
                    html: $element.html()
                })
            }
        },

        ItemHeader: function($parent, name, $context, options, callback){
            var idParent = $parent.parents(".panel-group").prop("id");
            var optionsTemplate = { id: idParent, value: options.value };
            var $element = $(_.template(templateHeader, optionsTemplate));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            if(callback){
                callback({
                    $children: $element.find(".accordion-toggle"),
                    html: $element.innerHTML
                })
            }
        },

        ItemContent: function($parent, name, $context, options, callback){
            var id = Helper.get_valid_id(name, $parent);
            var optionsTemplate = { id: id };
            var $element = $(_.template(templateContent, optionsTemplate));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            //Configura o header com o id informado
            var $header = $element.prev().find('.accordion-toggle');
            $header.prop("href", `#${id}`);

            if(!$parent.children('.panel-collapse').length)
                $element.addClass("in");

            if(callback){
                callback({
                    $children: $element.find(".accordion-toggle"),
                    html: $element.innerHTML
                })
            }
        },
    };
});