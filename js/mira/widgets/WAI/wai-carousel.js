"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {
    var templateControl = `<li data-target="#<%=id%>" data-slide-to="<%=count%>"></li>`;

    var templateCarousel =`
    <div id="<%=id%>" class="carousel slide">
        <!-- Indicators -->
        <ol class="carousel-indicators">
            
        </ol>
  
        <!-- Wrapper for slides -->
        <div class="carousel-inner">
            <div class="item active">
                <img src="..." alt="...">
                <div class="carousel-caption"></div>
            </div>
        </div>
        <!-- Controls -->
        <a class="left carousel-control" href="#<%=id%>" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a class="right carousel-control" href="#<%=id%>" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right"></span>
        </a>
    </div>
    `;

    var templateItem = `<div class="item active"></div>`;

    var templateCaption = `<div class="carousel-caption"></div>`

    var templateDropdown=`
    <li class="dropdown" id="<%=id%>">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><%=value%> <span class="caret"></span></a>
        <ul class="dropdown-menu">
          
        </ul>
    </li>

    `

    return {
        Main: function($parent, name, $context, options, callback){
            var optionsTemplate = { id: name };
            var element = _.template(templateCarousel, optionsTemplate);
            $parent.append(element);

            //Atualiza o carousel com as bolinhas de acordo com a quantidade de itens
            if(callback){
                callback({
                    $children: $(element),
                    html: $parent.html()
                })
            }
        },

        Item: function($parent, name, $context, options, callback){
            var element = _.template(templateItem, {});
            $parent.append(element);

            //Atualiza o carousel com as bolinhas de acordo com a quantidade de itens
            var containerControl = $parent.find('carousel-indicators');
            var optionsCarousel = {
                id: $parent.prop('id'),
                count: containerControl.children().lenght
            }

            var control = _.template(templateControl, optionsCarousel);
            containerControl.append(control);

            if(callback){
                callback({
                    $children: $(element),
                    html: $parent.html()
                })
            }
        },

        Caption: function($parent, name, $context, options, callback){
            var element = _.template(templateCaption, {});
            $parent.append(element);

            if(callback){
                callback({
                    $children: $(element),
                    html: $parent.html()
                })
            }
        },
    };
});