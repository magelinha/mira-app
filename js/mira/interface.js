"use strict";

define([
    'underscore',
    'jquery',
    'mira/base/init',
    'mira/base/view',
    'mira/helper'
], function (_, $, Base, View, Helper) {

    var startObserver = function(targetNode){
        // Options for the observer (which mutations to observe)
        var config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        var $element = $(mutation.addedNodes[i]);
                        Helper.registerLog($element);
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    };

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
            this.full_abstracts = abstract.getAbstracts(abstract.get("widgets"));
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

            //Chama o observer para monitorar cada elemento que foi adicionado a view final
            console.log(this.$el[0]);
            startObserver(this.$el[0]);

            this.abstract.getHtml(this.$el, this.concrete, this.model, this.$env);
            
            this.concrete.buildScripts(this.$el, this.model, this.$env);
            return this;
        }

    });

});