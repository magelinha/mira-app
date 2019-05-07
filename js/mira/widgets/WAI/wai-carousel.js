"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {
    var templateControl = `<li data-target="#<%=id%>" data-slide-to="<%=count%>"></li>`;

    var templateCarousel =`
    <div id="<%=id%>" class="carousel slide">
        <ol class="carousel-indicators"></ol>
        <div class="carousel-inner"></div>
        <a class="left carousel-control" href="#<%=id%>" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a class="right carousel-control" href="#<%=id%>" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </a>
    </div>
    `;

    var templateItem = `<div class="item"></div>`;

    var templateCaption = `<div class="carousel-caption"></div>`;

    return {
        Main: function($parent, name, $context, options, callback){
            var optionsTemplate = { id: name };
            var $element = $(_.template(templateCarousel, optionsTemplate));
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            Helper.build_events($element,options.events, context);
            
            if(callback){
                callback({
                    $children: $element.find('.carousel-inner'),
                    html: $element.html()
                })
            }
        },

        Item: function($parent, name, $context, options, callback){
            console.log($parent);
            var $element = $(_.template(templateItem, {}));
            if(!$parent.children().length)
                $element.addClass('active');
            
            //Determina as propriedades básicas do elemento
            var context = Helper.build_context($context, options);
            Helper.build_attributes($element, {}, context);

            $parent.append($element);

            //Atualiza o carousel com as bolinhas de acordo com a quantidade de itens
            var $carousel = $parent.parents('.carousel');
            var $containerControl = $carousel.find('.carousel-indicators');
            var count = $containerControl.children().length;
            var optionsCarousel = {
                id: $carousel.prop('id'),
                count: count
            }

            var $control = $(_.template(templateControl, optionsCarousel));
            if(count == 0)
                $control.addClass('active');
            
            Helper.build_attributes($control, {}, context);
            $containerControl.append($control);
            console.log($containerControl.children().length);

            if(callback){
                callback({
                    $children: $element,
                    html: $element.html()
                })
            }
        },

        Caption: function($parent, name, $context, options, callback){
            var $element = $(_.template(templateCaption, {}));
            
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