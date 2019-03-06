"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'mira/helper',
            'mira/base/init',
            'mira/base/view',
            'mira/models/api',
            'mira/models/widget-abstract'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
          require('underscore'),
          require('../helper.js'),
          require('../base/init.js'),
          require('../base/view.js'),
          require('./api.js'),
          require('./widget-abstract.js')
        );
    }
}(this, function (_, Helper, Base, MiraView, Api, Abstract) {

    var Model = Abstract.Model.extend({
        __name__ : 'Structure.Model',

        parse: function(data){
            if(_.isString(data)){
                data = {'name': data}
            }
            if(!data.name){
                data.name = _.keys(data)[0];
                data.children = _.values(data)[0];
            }
            if(_.isString(data.children)){
                data.children = [data.children];
            }
            data.children = new Collection(data.children || [], {parse:true});
            return data;
        },

        findAbstracts: function(abstracts, itemWidget, $data, $env) {
            //converte a lista de widgets abstratos aninhados num lista única
            

            //retorna todos os widgtes abstratos que correspondem ao item desejado



            var abstract = null;
            var name = this.get("name");

            //Caso a raiz da estrutura seja o próprio widget
            if(name == itemWidget.get('name')/* && itemWidget.isVisible($data, $env, null)*/){
                abstract = itemWidget;
                return;
            }
                
            abstracts.find(function(item){
                if(item.get('name') == name /*&&  item.isVisible($data, $env, null)*/)
                    return item;

                var children = item.get("children");
                if(children)
                    return findAbstract(children, itemWidget, $data, $env);
            });

            return abstract;
        },

        isVisible: function($data, $env, $bind){
            if(this.get('when')) {
                return Helper.evaluate(this.get('when'), $data.attributes, $env, $data, $bind);
            }
            return true;
        },

        prepare: function(abstracts, itemWidget){
            var name = this.get("name");
            if(!this.original){
                this.original = _.clone(this.attributes);
            }
            
            this.abstracts = abstracts.filter(function(abstract){
                return abstract.get("name") == name;
            });

            this.get('children').invoke('prepare', abstracts, itemWidget);

            if(this.abstract) {
                this.attributes = _.defaults(this.original, this.abstract.attributes);
            } else {
                this.attributes = this.original
            }
        }


    });

    var Collection =  Abstract.Collection.extend({
        __name__ : 'Structure.Collection',
        model:Model
    });

    return {
        Model : Model,
        Collection: Collection
    }

}));