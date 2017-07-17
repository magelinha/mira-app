"use strict";

define([
    'underscore',
    'jquery',
    'mira/base/init',
    'mira/base/view',
    'mira/helper'
], function (_, $, Base, View, Helper) {

    var getInitialMessage = function(abstracts, title){
        var message = {
            "pt-BR": sprintf("Você está em %s. ", title["pt-BR"] ? title["pt-BR"] : title),
            "en-US": sprintf("You are in %s.", title["en-US"] ? title["en-US"] : title)
        };

        var messageOptions = {
            "pt-BR": "",
            "en-US": ""
        };

        var titles = Helper.getTitles(abstracts);
        _.each(titles, function(item){
            if(_.isString(item) && item.length){
                messageOptions["pt-BR"] += item + ', ';
                messageOptions["en-US"] += item + ', ';
            }
            else if(_.isObject(item)){
                messageOptions["pt-BR"] += item["pt-BR"] + ', ';
                messageOptions["en-US"] += item["en-US"] + ', ';
            }
        });

        if(messageOptions["pt-BR"].length || messageOptions["en-US"].length){
            message["pt-BR"] += "As opções são: " + messageOptions["pt-BR"];
            message["en-US"] += "The options are: " + messageOptions["en-US"];
        }

        message["pt-BR"] += "O que deseja?";
        message["en-US"] += "What do you want?";

        return message;
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
            this.concrete = concrete;
            this.setModel($data);
            this.$env = $env;
            document.documentElement.lang = appApi ? appApi.currentLanguage : "pt-BR";
            this.render()
        },

        render: function(){
            var _this = this;
            this.$el.empty();
            
            //Manter centralizado
            /*
            var $container = $('<div />');
            $container.addClass('container');
            this.$el.append($container);
            */
            var text = appApi ? (
                        _this.abstract.get('tts') || 
                        getInitialMessage(_this.abstract.get('widgets').models, _this.abstract.get('title'), _this.abstract.get('options')))
                        : '';

            //Ao passar de uma inteface para outra, verifica se o responsive voice já foi carregado
            if(responsiveVoice.OnVoiceReady != null && appApi && _this.currentView !== _this.abstract.get('name')){
                if(text){
                    appApi.messagesInterface[_this.abstract.get("name")] = text;
                    appApi.tts(text[appApi.currentLanguage]);
                    _this.currentView = _this.abstract.get('name');
                }
            }

            responsiveVoice.OnVoiceReady = function(){
                if(text && appApi && _this.currentView !== _this.abstract.get('name')){
                    appApi.messagesInterface[_this.abstract.get("name")] = text;
                    appApi.tts(text[appApi.currentLanguage]);
                    appApi.currentInterface = _this.currentView = _this.abstract.get('name');
                }
            };

            var $head = $('head');
            this.concrete.buildHead($head, this.model, this.$env);
            this.abstract.getHtml(this.$el, this.concrete, this.model, this.$env);
            //this.abstract.getHtml($container, this.concrete, this.model, this.$env);
            return this;
        }

    });

});