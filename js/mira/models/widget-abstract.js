"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'mira/helper',
            'mira/base/init',
            'mira/base/view',
            'mira/models/api'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('underscore'),
            require('../helper.js'),
            require('../base/init.js'),
            require('../base/view.js'),
            require('./api.js')
        );
    }
}(this, function (_, Helper, Base, MiraView, Api) {

    var Model = Base.Model.extend({
        __name__ : 'Widget.Model',

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

        isVisible: function($data, $env, $bind){
            if(this.get('when')) {
                return Helper.evaluate(this.get('when'), $data.attributes || $data, $env, $data, $bind);
            }
            return true;
        },

        canHasMapChildren: function(map){
            if(!this.get('children').length){
                return map.hasChildren();
            }
        },

        getBind: function($data, $dataObj, $env){
            var bind = this.get('bind');
            if(bind){
                try{
                    return eval(bind);
                } catch (e){
                    console.log(e);
                    console.log('Error on bind attr of widget abstract', this, this.get('bind'));
                    return null;
                }
            }
            return null;
        },

        getRender: function(concrete, $data, $env, $bind){
            var maps = concrete.get('maps').where({'name': this.get('name')});
            var map_selected = null;
            _.each(maps, function(map){
                if(map.isVisible($data, $env, $bind)) {
                    map_selected = map;
                }
            }, this);
            return map_selected
        },

        updateStructure: function(concrete, $data, $env, $bind) {
            var _this = this;
            var structure = _this.constructor.name == "Structure_Model" ? _this : concrete.findStructure(_this.get('name'));

            if(!structure)
                return _this;

            structure.prepare(mira.interface.full_abstracts, _this);

            //Se for uma estrutura...verifica os abstracts. Caso algum seja válido, seta o datasource, caso necessário
            if(structure.abstracts && structure.abstracts.length){
                var abstract = structure.abstracts.find(function(x){
                    _this.set("when", x.get("when"));
                    return _this.isVisible($data, $env, $bind);
                });

                if(abstract)
                    structure.set("datasource", abstract.get("datasource"));
            }

            return structure;
        },

        buildWidget: function($parent, concrete, $data, $env, callback) {
            var $bindl = this.getBind($data.attributes, $data, $env);
            var esse = this.updateStructure(concrete, $data, $env, $bindl);
            
            var next = function ($bind) {
                var map = esse.getRender(concrete, $data, $env, $bind);
                if (map && esse.isVisible($data, $env, $bind)) {

                    var map_callback = callback;
                    if(esse.canHasMapChildren(map)){
                        map_callback = function(ret){
                            map.buildChildren(ret.$children, $data, $env, $bind, callback);
                        }
                    }

                    map.getHtml($parent, $data, $env, $bind, map_callback);
                }
            };

            if (this.get('select')) {
                $.ajax({
                    url: $env.request.uri.source,
                    select: this.get('select'),
                    success: function (data) {
                        next(data);
                    }
                });
            } else {
                next($bindl);
            }

            /*
            var $bind = this.getBind($data.attributes, $env);
            var map = this.getRender(concrete, $data, $env, $bind);
            if (map && this.isVisible($data, $env, $bind)) {
                map.getHtml($parent, $data, $env, $bind, callback);

            }*/
        },

        registerCollection: function($env, collection){
            if($env.collections[this.get('name')]){
                if(typeof $env.collections[this.get('name')] != Array){
                    $env.collections[this.get('name')] = [$env.collections[this.get('name')]];
                }
                $env.collections[this.get('name')].push(collection);

            } else {
                $env.collections[this.get('name')] = collection;
            }
        },

        requestSelect: function(){


        },

        buildChildren: function($parent, concrete, $data, $env, currentInterface){
            var esse = this;
            var $bind = this.getBind($data.attributes, $data, $env);

            if(this.get('datasource')){
                this.get('children').each(function (itemWidget) {
                    esse.requestData($data, $env, $bind, function(collection){
                        esse.registerCollection($env, collection);
    
                        var $bind1 = itemWidget.getBind($data.attributes !== {} ? $data.attributes : mappedValues, $data, $env);
    
                        itemWidget = itemWidget.updateStructure(concrete, $data, $env, $bind1);
    
                        var view = new MiraView.Collection({
                            collection: collection,
                            model: $data,
                            $el: $parent,
                            $env: $env, 
                            $bind: $bind1,
                            widget: this,
                            concrete: concrete,
                            itemWidget: itemWidget
                        });
    
                        view.render();
                    });
                });

                //var itemWidget = this.get('children').at(0);
            }  else {
                var title = this.get("title");
                if(appApi && title && currentInterface){
                    var $context = { $data: $data.attributes };
                    appApi.RegisterTitle(title, currentInterface, $context);
                }

                this.get('children').each(function (widget, i) {
                    widget.set("interface", currentInterface);
                    widget.getHtml($parent, concrete, $data, $env);
                }, this);
            }
        },

        getHtml: function($parent, concrete, $data, $env){
            var esse = this;

            var anchor = Helper.buildAnchor();
            var temp = Helper.buildAnchor();

            esse = this.updateStructure(concrete, $data, $env);

            this.buildWidget(temp, concrete, $data, $env, function(options){
                esse.buildChildren(options.$children, concrete, $data, $env);               
                $parent.append(temp.children());
            });
        },

        buildUrlDatasource: function(parentData, $env, $bind){
            var datasource = this.get('datasource');
            var endpoint_build = _.template(datasource.substring(4), Helper.buildObjectToValidate(parentData, $env, $bind));
            return endpoint_build;
        },

        buildParentDataDatasource: function($data, $dataObj, $bind){
            return eval(this.get('datasource'));
        },

        requestData: function(parentData, $env, $bind, callback){
            var esse = this;
            var datasource = this.get('datasource');
            var parse = Helper.buildFunction(this.get('parse'), this);

            if(datasource.indexOf('url:') == 0) {
                var endpoint = this.buildUrlDatasource(parentData, $env);
                var collection = new (Api.Collection.extend({
                    url: endpoint,
                    parse: parse || Api.Collection.prototype.parse
                }))();

                collection.fetch({
                    cache: this.get('cache') || true,
                    expires: this.get('expires') || 3600000, //1h
                    success: function (col) {
                        callback(col);
                    }
                });
            } else {
                var data = this.buildParentDataDatasource(parentData.attributes, parentData, $bind);
                if(data instanceof Backbone.Collection){
                    collection = data;
                } else {
                    var collection = new Api.Collection(data, {
                        parse: parse || Api.Collection.prototype.parse
                    });
                }
                callback(collection);
            }
        },

        prettyPrint: function(){
            var ret = _.pick(this.toJSON(), 'name', 'children', 'datasource');
            ret.children = ret.children.prettyPrint();

            if(_.isObject(ret.datasource)) {
                ret.datasource = 'obj'
            }
            if(_.isEmpty(ret.children)){
                delete ret.children;
            }
            return ret;
        }
    });

    var Collection =  Base.Collection.extend({
        __name__ : 'Widget.Collection',

        model:Model,

        prettyPrint: function(){
            var ret = [];
            this.each(function(abstract){
                ret.push(abstract.prettyPrint())
            });
            return ret;
        }
    });

    return {
        Model : Model,
        Collection: Collection
    }

}));