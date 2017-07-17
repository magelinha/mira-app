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
            var tts = abstract ? abstract.get("tts") : undefined;
            this.get('children').invoke('prepare', abstracts, itemWidget);
            if(this.abstract) {
                this.attributes = _.defaults(this.original, this.abstract.attributes);
                //this.set("tts", tts);
            } else {
                this.attributes = this.original
            }

            var title = abstract ? abstract.get('title') : undefined;
            var label = abstract ? abstract.get('label') : undefined;
            var entity = abstract ? abstract.get('entity') : undefined;
            var validation = abstract != null ? abstract.get('validation') : undefined;
            var error = abstract != null ? abstract.get('error') : undefined;
            var help = abstract ? abstract.get('help') : undefined;

            this.set("tts",tts);
            this.set('title', title);
            this.set('label', label);
            this.set('entity', entity);
            this.set('validation', validation);
            this.set('error', error);
            this.set('help', help);

            if(itemWidget)
                this.abstract = itemWidget;
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