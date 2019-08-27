"use strict";

define([
    'jquery',
    'underscore',
    'mira/base/init',
    'mira/helper'
], function ($, _, Base, Helper) {

    var ViewData = Base.View.extend({
        __name__: 'View.Data',

        initialize: function(options){
            if(options.$el){
                this.setElement(options.$el);
            }

            if(this.model){
                this.setModel();
            }

            var plus = _.pick(options, 'concrete', 'widget', '$env', '$bind', '$parent', 'collectionView', 'lastAbstract');
            _.extend(this, plus);
            this.subviews = [];
        },

        setModel: function(model){
            if(model) {
                this.model = model;
            }
            if (this.model){
                this.listenTo(this.model, 'change', this.render, this);
                this.listenTo(this.model, 'destroy', this.remove, this);
            }
        },

        render: function(){
            var esse = this;
            
            var $data = esse.model.attributes;
            var old_$el = this.$el;
            var parent = Helper.buildAnchor();
            if(old_$el) {
                old_$el.hide();
            }


            var lastAbstract = this.lastAbstract;
            var widget = this.widget.updateStructure(this.concrete, $data, this.$env, lastAbstract, this.$bind);

            widget.buildWidget(esse.$parent, this.concrete, $data, this.$env, function(options){
                esse.setElement(options.$element || options.$children);
                var abstractParent = widget.getLastAbstract(lastAbstract);
                widget.buildChildren(esse.$el, esse.concrete, esse.model, esse.$env, abstractParent);

                // var children = parent.children();
                // if(!children.length)
                //     return;

                // if(old_$el.parent().length){
                //     old_$el.after(children);
                //     old_$el.remove();
                // } else {
                //     esse.$parent.append(children);
                // }
            });

            if(this.collectionView && this in this.collectionView.subviews){
                this.collectionView.subviews.push(this);
            }

            return this;
        }

    });

    var ViewCollection = Base.View.extend({
        __name__: 'View.Collection',

        initialize: function(options){

            this.setElement(options.$el);

            var plus = _.pick(options, 'concrete', 'widget', 'itemWidget', '$env', '$bind', 'lastAbstract');
            _.extend(this, plus);

            this.setCollection();

            this.subviews = [];
        },

        setCollection: function(collection){
            if(collection) {
                this.collection = collection;
            }
            this.listenTo(this.collection, 'reset', this.render, this);
        },

        render: function(){
            //this.$el.html('');
            this.collection.each(function(m, i){
                if(this.model) {
                    m.$parente_data = this.model;
                    m.set('$parent_data', this.model.attributes);
                }

                var subview = new ViewData({
                    model: m,
                    $parent: this.$el,
                    widget: this.itemWidget,
                    concrete: this.concrete,
                    $env: this.$env,
                    $bind: this.$bind,
                    collectionView: this,
                    lastAbstract: this.lastAbstract
                });
                subview.render();

                if(i + 1 == this.collection.length){
                    this.model.trigger('complete', {
                        $parent: this.$el,
                        $data: this.model,
                        $env: this.$end ,
                        $bind: this.$bind,
                        $children: this.$el,
                        view: this
                    });
                }
            }, this);
        }

    });

    return {
        Data: ViewData,
        Collection: ViewCollection
    }

});