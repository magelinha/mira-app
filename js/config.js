"use strict";

requirejs.config({
    baseUrl: 'js',

    paths : {
        nools: 'libs/nools',
        backbone: 'libs/backbone',
        backbone_query: 'libs/backbone.queryparams',
        backbone_querystring_shim: 'libs/backbone.queryparams-1.1-shim',
        backbone_mira: 'libs/backbone.mira',
        underscore: 'libs/underscore',
        jquery: 'libs/jquery',
        bootstrap: 'libs/bootstrap',
        text: 'libs/text',
        async: 'libs/async',
        gmap3: 'libs/gmap3.min',
        'string-format': 'libs/string-format',
        'backbone_cache': 'libs/backbone.fetch-cache',
        'modernizr': 'libs/modernizr',
        'device': 'libs/device',
        'hello': 'libs/hello',
        'collagePlus': 'libs/jquery.collagePlus.min.js'
    },
    shim: {
        "underscore": {
            deps: [],
            exports: "_"
        },
        "backbone": {
            deps: ["jquery", "underscore"],
            exports: "Backbone"
        },
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

requirejs([
    'underscore',
    'backbone'
], function(_, Backbone) {
    window.app = {};
    var query = _.chain(window.location.search.substring(1).split('&'))
        .map(function(params) {
            var p = params.split('=');
            return [p[0], decodeURIComponent(p[1])];
        }).object().value();

    require([query.app || 'index'], function (App) {
        window.app.name = query.app;
        window.app[query.app] = new App();
        window.app.query = query;
        Backbone.history.start();
    })

});