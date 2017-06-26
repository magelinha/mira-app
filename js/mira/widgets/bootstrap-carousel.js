"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper',
    'mira/widgets/bootstrap-base'
], function ($, _, Helper, BootstrapBase) {

    var template_carousel =
        '<div class="carousel-inner js_child"></div>\
         <a class="left carousel-control" href="#<%= parent_name %>" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a> \
         <a class="right carousel-control" href="#<%= parent_name %>" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>';

    var ativo = false;

    return {

        Carousel: function($parent, name, $context, options, callback){
            ativo = false;
            var new_options = _.clone(options);
            new_options.class = 'carousel slide';
            new_options['data-interval'] = new_options['data-interval'] || "false";
            new_options['data-ride'] = new_options['data-ride'] || "carousel";
            BootstrapBase.Simple($parent, name, $context, new_options, function(element){

                if(_.isString(template_carousel)){
                    template_carousel = _.template(template_carousel);
                }

                element.$children.html(template_carousel({
                    parent_name:name
                }));

                element.$children.carousel();

                if(callback) {
                    callback({
                        $children: $(element.$children.find('.js_child')),
                        html: element.innerHTML
                    })
                }
            });
        },

        Item: function($parent, name, $context, options, callback){

            var new_options = _.clone(options);
            new_options.class = 'item ';

            if(!ativo){
                new_options.class += 'active';
                ativo = true;
            }

            BootstrapBase.Simple($parent, name + _.uniqueId(), $context, new_options, function(element){
                element.$children.html("");
                var context = Helper.build_context($context, options);
                var img = document.createElement('img');

                img.setAttribute('src', Helper.build_value(options.value, context));
                element.$children.append(img);

                if(callback){
                    callback(element);
                }
            });
        }

    };

});