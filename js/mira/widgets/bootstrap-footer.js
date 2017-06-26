"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    var template = '<div class="row"> \
        <div class="col-lg-12"> \
        <p>Copyright &copy; TecWeb 2014 </p> \
    </div> \
    </div>';

    return function($parent, name, $context, options, callback){
        var hr = document.createElement('hr');
        var element = document.createElement('footer');
        element.id = name;
        element.innerHTML = template;
        $parent.append(hr);
        $parent.append(element);

        if(callback){
            callback({
                $children: $parent,
                html: element.outerHTML
            })
        }
    };
});