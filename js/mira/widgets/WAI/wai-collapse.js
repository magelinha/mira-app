"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {
    var templateCollapse =`
    <div class="panel-group" id="<%=id%>"><div>
    `;

    var templateCollapseItem = `
    <div class="panel <%=panel%>">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a class="accordion-toggle" data-toggle="collapse" data-parent="#<%=idParent%>" href="#<%=id%>">
                    <%=value%>
                </a>
            </h4>
        </div>
        <div id="<%=id%>" class="panel-collapse collapse">
            <div class="panel-body"></div>
        </div>
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
            var optionsTemplate = 
            { 
                panel: options.class || "panel-default",
                idParent: $parent.prop("id"),
                id: Helper.get_valid_id(name, $context),
                value: Helper.process_value(options.value, $context)
            };

            var $element = $(_.template(templateCollapseItem, optionsTemplate));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            if(!$parent.children('.panel').length)
                $element.find(".panel-collapse").addClass("in");

            if(callback){
                callback({
                    $children: $element.find(".panel-collapse .panel-body"),
                    html: $element.html()
                })
            }
        },
    };
});