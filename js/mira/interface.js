"use strict";

define([
    'underscore',
    'jquery',
    'mira/base/init',
    'mira/base/view',
    'mira/helper'
], function (_, $, Base, View, Helper) {

    return View.Data.extend({

        __name__ : 'Interface',

        el: 'body',
        currentView: '',

        initialize: function(abstracts, concrets, rules, selection){
            this.abstracts = abstracts;
            this.concrets = concrets;
            this.rules = rules;
            this.selection = selection;
        },

        full_render: function(abstract, concrete, $data, $env){
            this.abstract = abstract;
            this.concrete = concrete;
            this.setModel($data);
            this.$env = $env;
            document.documentElement.lang = appApi ? appApi.currentLanguage : "pt-BR";
            this.render();

            if(appApi){
                appApi.InitialMessage(`welcome_${this.abstract.get('name')}`);
            }
        },

        render: function(){
            var _this = this;
            var text = null;
            this.$el.empty();

            var $head = $('head');
            this.concrete.buildHead($head, this.model, this.$env);
            this.abstract.getHtml(this.$el, this.concrete, this.model, this.$env);
            return this;
        }

    });

});