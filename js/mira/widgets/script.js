"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    return function($body, name, $context, options){
        var element = document.createElement('script');
        element.src = options.src;

        var attrs = _.omit(options, 'name', 'tag', 'type', 'rel', 'widget');
        var context = Helper.build_context($context, options);
        Helper.build_attributes(element, attrs, context);

        $body.append(element);
        return {
            $children: $(element),
            html: element.innerHTML
        }
    };
});