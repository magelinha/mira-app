"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'underscore',
            'jquery'
        ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('underscore'),
            require('jquery')
        );
    }
}(this, function (_, $) {

    var KEYWORD_REGEXP = /^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/;

    function legalKey(string) {
        return /^[a-z_$][0-9a-z_$]*$/gi.test(string) && !KEYWORD_REGEXP.test(string);
    }

    var esse = {
        buildFunction: function (value, context) {
            var func;
            if (_.isString(value)) {
                func = function ($data) {
                    try {
                        return eval(value);
                    } catch (ex) {
                        console.log('erro na funcao do parser da rota ', value);
                        return $data
                    }
                };
            } else if (_.isFunction(value)) {
                func = value
            }
            if (func && context) {
                func = _.bind(func, context);
            }
            return func
        },

        build_events: function ($element, events, context) {
            var _this = this;
            _.each(events, function(value, name){

                var m = function($event, target){
                    try {
                        var all_context = _.extend({}, context,{
                            $element: $element,
                            $event: $event
                        });

                        if(_.isFunction(value)){
                            //Se for uma função, apenas a executa
                            value(all_context);
                        } else if(_.isObject(value)){
                            $event.preventDefault();
                            
                            //Se for um Object, indica que é um evento do API.ai
                            $event.stopPropagation();

                            //processa os parâmetros
                            var params = {};
                            Object.keys(value.params || {}).forEach(key => {
                                params[key] = _this.eval_with_context(value.params[key], all_context);
                                console.log(key, params[key]);
                            });

                            //Chama a função implementada pelo controle
                            if(value.action)
                                window[value.action](all_context);

                            //Chama o evento cadastrado no dialogflow 
                            appApi.CallRequestEvent(value.event, params);
                        } else if(context.$env
                            && context.$env.events
                            && context.$env.events[value]) {
                                context.$env.events[value](all_context);
                        } else {
                            window[value](all_context);
                        }

                    } catch (ex){
                        console.error('error event', name, $element, context, ex);
                    }
                };

                $element.on(name, m);
            })

        },

        buildAnchor: function(){
            return $('<div/>');
        },

        buildObjectToValidate: function ($data, $env, $bind, options) {
            var $dataObj = $data;
            if ($data instanceof Backbone.Model) {
                $data = $data.attributes;
            }
            options || (options = {});
            return _.extend({}, {
                $dataObj: $dataObj,
                $data: $data,
                $env: $env,
                $bind: $bind
            }, options)
        },

        evaluate: function (when, $data, $env, $dataObj, $bind) {
            if ($data instanceof Backbone.Model) {
                $data = $data.attributes;
            }
            var array_when;
            if(_.isString(when)) {
                array_when = when.split(',');
            } else {
                array_when = [when];
            }
            var ret = true;
            _.each(array_when, function(w){
                var rule = mira.interface.rules.get_or_create(w);
                ret = ret && rule.evaluate($data, $env, $dataObj, $bind);
            });
            return ret
        },

        toQueryString: function(val, namePrefix) {
            /*jshint eqnull:true */
            var splitChar = encodeURIComponent(Backbone.Router.arrayValueSplit);
            function encodeSplit(val) { return String(val).replace(splitChar, encodeURIComponent(splitChar)); }

            if (!val) {
                return '';
            }

            namePrefix = namePrefix || '';
            var rtn = [];
            _.each(val, function(_val, name) {
                name = namePrefix + name;

                if (_.isString(_val) || _.isNumber(_val) || _.isBoolean(_val) || _.isDate(_val)) {
                    // primitive type
                    if (_val != null) {
                        rtn.push(name + '=' + encodeSplit(encodeURIComponent(_val)));
                    }
                } else if (_.isArray(_val)) {
                    // arrays use Backbone.Router.arrayValueSplit separator
                    var str = '';
                    for (var i = 0; i < _val.length; i++) {
                        var param = _val[i];
                        if (param != null) {
                            str += splitChar + encodeSplit(param);
                        }
                    }
                    if (str) {
                        rtn.push(name + '=' + str);
                    }
                } else {
                    // dig into hash
                    var result = toQueryString(_val, name + '.');
                    if (result) {
                        rtn.push(result);
                    }
                }
            });

            return rtn.join('&');
        },

        navigate: function (uri, params) {
            if(params) {
                return '#?URI=' + uri + '?' + esse.toQueryString(params);
            }
            return '#?URI=' + uri;
        },

        build_context: function($context, options, extra) {
            return _.extend({}, options, $context, extra);
        },

        build_object_with_context: function(attrs, context){
            var ret = {};
            _.each(attrs, function(value, attr){
                var template = '<%= ' + value + '%>';
                try {
                    var build = _.template(template, context);
                    ret[attr] = build;
                } catch (ex){
                    ret[attr] = value;
                }
            });
            return ret;
        },

        build_attributes: function(element, attrs, context){
            var obj = esse.build_object_with_context(attrs, context);
            _.each(obj, function(value, attr){
                element.setAttribute(attr,  value);
            });
        },

        build_value: function(value, context){
            if(value.indexOf('@') == 0){
                return value.substring(1);
            }

            var contextWithoutValue = _.omit(context, 'value');
            return this.eval_with_context(value, contextWithoutValue)
            
            /*
            var template = "<% " + processText + '%>';
            try {
                return _.template(template, context)
            } catch (ex){
                return value
            }*/
        },

        parseURL: function(url) {
            var a =  document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':',''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function(){
                    var ret = {},
                        seg = a.search.replace(/^\?/,'').split('&'),
                        len = seg.length, i = 0, s;
                    for (;i<len;i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
                hash: a.hash.replace('#',''),
                path: a.pathname.replace(/^([^\/])/,'/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
                segments: a.pathname.replace(/^\//,'').split('/')
            };
        },

        source: function (object, filter, indent, startingIndent) {
            var seen = [];
            return walk(object, filter, indent === undefined ? '  ' : (indent || ''), startingIndent || '');

            function walk(object, filter, indent, currentIndent) {
                var nextIndent = currentIndent + indent;
                object = filter ? filter(object) : object;
                switch (typeof object) {
                    case 'string':
                        return JSON.stringify(object);
                    case 'boolean':
                    case 'number':
                    case 'function':
                    case 'undefined':
                        return '' + object
                }

                if (object === null) return 'null';
                if (object instanceof RegExp) return object.toString();
                if (object instanceof Date) return 'new Date(' + object.getTime() + ')';

                if (seen.indexOf(object) >= 0) return '{$circularReference:1}';
                seen.push(object);

                function join(elements) {
                    return indent.slice(1) + elements.join(',' + (indent && '\n') + nextIndent) + (indent ? ' ' : '');
                }

                if (Array.isArray(object)) {
                    return '[' + join(object.map(function (element) {
                        return walk(element, filter, indent, nextIndent);
                    })) + ']'
                }
                var keys = Object.keys(object);
                return keys.length ? '{' + join(keys.map(function (key) {
                    return (legalKey(key) ? key : JSON.stringify(key)) + ':' + walk(object[key], filter, indent, nextIndent);
                })) + '}' : '{}'
            }
        },

        /*Funções para o WAI */
        tts_on_focus: function($element, tts, context){
            var _this = this;
            $element.focus(function(e){
                var text = _.isString(tts) ? _this.process_value(tts, context) : _this.process_value(tts[appApi.currentLanguage], context);
                appApi.tts(text.toString());
            });
        },

        get_valid_id: function(name, $parent){
            var tempName = name;
            var count = 1;

            //Verifica no documento
            while(document.getElementById(tempName) != null){
                tempName = name + count.toString();
                count++;
            }

            //verifica no parent
            if($parent){
                while($parent.find('#' + tempName).length){
                    tempName = name + count.toString();
                    count++;
                }
            }

            return tempName;
        },

        process_value: function(text, context){
            var _this = this;
            if(text && text.length){
                try {
                    //Seleciona todas as variáveis de ambiente do mira
                    //var reg = new RegExp('(\\$\\w+\\.\\w+)|(\\$\w+)', 'g');
                    var matches = text.match(/(\$\w+\.\w+)|(\$\w+)\w+/g);
                    if(matches == null)
                        return text;

                    _.each(matches, function(term){
                        var value = _this.eval_with_context(term, context);
                        
                        if(_.isUndefined(value)){
                            throw "O dado contido na variável "+ term +" informado no texto \""+ text + "\" é inválido."
                        }
                        var textReplace = _.isObject(value) ? value[appApi.currentLanguage] : value;
                        text = text.replaceAll(term, textReplace);
                        
                        
                    });

                    try {
                        //verirfica se é uma expressão javascript
                        text = eval(text);
                    }catch(e){

                    }
                }
                catch(ex){
                    throw ex;
                    //text = '';
                }

                return text;    
            }
        },

        eval_with_context: function(text, context){

            var $bind = context.$bind;
            var $data = context.$data;
            var $env = context.$env;
            var $bind = context.$bind;
            var $dataObj = context.$dataObj;

            //var reg = new RegExp('(\\$\\w+\\.\\w+)|(\\$\w+)', 'g');
            var matches = text.match(/(\$\w+\.\w+)|(\$\w+)\w+|(\$\(\")|(\$\(\')/g);

            if(matches == null)
                return text;

            try{
                var result = eval(text);
                return _.isObject(result) && result[appApi.currentLanguage] ? result[appApi.currentLanguage] : result;     
            }catch(ex){
                console.log('error ao processar texto ', text);
                throw ex;
            }
        },

        hasEntity: function(entity, data){
            //console.log(entity, data);
            return entity && data && data.length;
        },

        buildEntities: function(entity, values){
            var entities = {
                "pt-BR": { name: entity.name, entries: [] },
                "en-US": { name: entity.name, entries: [] }
            }

            _.each(values, function(item){
                var value = item.get(entity.key);
                for(var key in entities){
                    var valueToAdd = _.isString(value) ? 
                        { value: value, synonyms:[value] } : 
                        _.isString(value[key]) ? 
                            { value: value[key], synonyms: [] } :
                            { value: value[key].value, synonyms: value[key].synonyms };
                            
                    if(!_.contains(valueToAdd.synonyms, valueToAdd.value))
                        valueToAdd.synonyms.push(valueToAdd.value);
                    
                    entities[key].entries.push(valueToAdd);
                }            
            });

            return entities;
        },

        getTitles: function(abstracts){
            var titles = [];
            var findTitle = function(list){
                for(var key in list){

                    if((_.isString(list[key].attributes.title) && list[key].attributes.title.length) || _.isObject(list[key].attributes.title))
                        titles.push(list[key].attributes.title);

                    
                    if(typeof(list[key].attributes.children) != 'undefined')
                        findTitle(list[key].attributes.children.models);
                }
            };

            findTitle(abstracts);
            return titles;
        },

        omit_params: function(options, ignored_options) {
            return _.omit(options, ignored_options, 'tag', 'value', 'tts', 'validation', 'entity', 
                            'name', 'widget', 'events', 'title','label', 'error', 'help', 'text', 'interface');
        }
    };
    return esse;
}));