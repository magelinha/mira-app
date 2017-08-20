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
            this.render()
        },

        render: function(){
            var _this = this;
            var text = null;
            this.$el.empty();
            
            //Limpa os títulos definidos no AppApi para gerar uma nova mensagem de texto
            if(appApi){
                var abstractName = this.abstract.get("name");
                appApi.titles["pt-BR"][abstractName] = [];
                appApi.titles["en-US"][abstractName] = [];
            }

            console.log(appApi.titles);

            var $head = $('head');
            this.concrete.buildHead($head, this.model, this.$env);
            this.abstract.getHtml(this.$el, this.concrete, this.model, this.$env);

            //Ao passar de uma inteface para outra, verifica se o responsive voice já foi carregado

            if(responsiveVoice.OnVoiceReady == null && appApi && _this.currentView !== _this.abstract.get("name")){
                responsiveVoice.OnVoiceReady = function(){
                    appApi.SpeakInitialMessage(_this.abstract.get("title"), _this.abstract.get("name"));     
                }
            }
                

            return this;
        }

    });

});