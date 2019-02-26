"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'mira/base/init'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('underscore'),
            require('../base/init.js')
        );
    }
}(this, function (_, Base) {
    var Model = Base.Model.extend({
        __name__ : 'Rule.Model',

        idAttribute: 'name',

        evaluate: function($data, $env, $dataObj, $bind){
            console.log(this.get('name'));
            console.log($data);
            console.log($env);
            console.log($dataObj);
            console.log($bind);
            try {
                return eval(this.get('validate')) == true;
            } catch (e){
                console.log("Error on rule " + this.get('name'), e.message, this, $data, $env, $dataObj, $bind);
                return false;
            }
        }
    });

    var Collection =  Base.Collection.extend({
        __name__ : 'Rule.Collection',

        model: Model,

        get_or_create: function(obj){
            var r = this.get(obj);
            if(r == undefined){
                r = new Model({name: obj, validate:obj});
                this.add(r);
            }
            return r
        }
    });

    return {
        Model: Model,
        Collection: Collection
    }
}));
