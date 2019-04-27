"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'mira/base/init',
            'mira/models/api',
            'mira/helper'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('../base/init.js'),
            require('../models/api.js'),
            require('../helper.js')
        );
    }
}(this, function (Base, Api, Helper) {
    var Model = Base.Model.extend({
        __name__ : 'Selection.Model'
    });

    var Collection =  Base.Collection.extend({
        __name__ : 'Selection.Collection',
        model:Model,

        evaluate_abstract: function($env, callback){
            if($env.request.params){
                if($env.request.params.URI){
                    var esse = this;
                    $.get($env.request.params.URI, function(data){
                        var $data = new Api.Model(data);
                        var abstract = 'not_found';
                        var concrete = abstract;
                        esse.each(function(selection){
                            if(Helper.evaluate(selection.get('when'), $data.attributes, $env, $data)){
                                abstract = selection.get('abstract');
                                concrete = selection.get('concrete') || selection.get('abstract')
                            }
                        });
                        callback(abstract, concrete, $data, $env);
                    })
                }
            } else {
                //Como não tem dados a serem buscados, verifica usando dados vazios (caso tenha regras de seleção que não utiliza dados)
                var $data = new Api.Model();
                var abstract = 'landing';
                var concrete = 'landing';
                this.each(function(selection){
                    if(Helper.evaluate(selection.get('when'), $data.attributes, $env, $data)){
                        abstract = selection.get('abstract');
                        concrete = selection.get('concrete') || selection.get('abstract')
                    }
                });

                callback(abstract, concrete, $data, $env);
                //callback('landing', 'landing', new Api.Model(), $env)
            }
        }
    });

    return {
        Model : Model,
        Collection: Collection
    }

}));