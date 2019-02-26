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

        prepare: function(abstracts, itemWidget){
            var name = this.get("name");

            var abstract = null;
            
            var findAbstract = function(items){
                //Caso a raiz da estrutura seja o próprio widget
                if(name == itemWidget.get('name')){
                    abstract = itemWidget;
                    return;
                }
                    
                items.each(function(item){
                    if(item.get('name') == name){
                        abstract = item;
                        return;
                    }

                    var children = item.get("children");
                    if(children)
                        findAbstract(children);
                });
            };

            if(!this.original){
                this.original = _.clone(this.attributes);
            }
            
            this.abstract = abstracts.findWhere({name: this.get('name')});

            findAbstract(abstracts);
            this.get('children').invoke('prepare', abstracts, itemWidget);
            if(this.abstract) {
                this.attributes = _.defaults(this.original, this.abstract.attributes);
            } else {
                this.attributes = this.original
            }

            if(abstract){
                this.set('datasource', abstract.get('datasource'));
                this.abstract = abstract;
                return;
            }

            if(itemWidget){
                itemWidget.set("when", abstract.get("when"));
                this.abstract = itemWidget;
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