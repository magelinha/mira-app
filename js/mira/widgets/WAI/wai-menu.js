"use strict";

define([
    'jquery',
    'underscore',
    'mira/helper'
], function ($, _, Helper) {

    var templateMenu =`
    <nav class="navbar<%=classMenu%>" role="navigation" id="<%=id%>">
    <a class="sr-only" href="<%=content%>">Skip to content</a>
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Skip to Content</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="<%=projectLink%>"><%=value%></a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav"></ul>
            </div>
        </div>
    </nav>
    `;

    var templateDropdown=`
    <li class="dropdown" id="<%=id%>">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><%=value%> <span class="caret"></span></a>
        <ul class="dropdown-menu">
          
        </ul>
    </li>

    `

    return {
        Main: function($parent, name, $context, options, callback){
            var optionsTemplate = 
            {
                id: name,
                value:options.value || '',
                classMenu: options.class ? options.class : ' navbar-default',
                projectLink: options.projectLink || '#',
                content: options.content || '#'
            };
            var element = _.template(templateMenu, optionsTemplate);
            $parent.append(element);
            if(callback){
                callback({
                    $children: $parent.find('.nav'),
                    html: $parent.html()
                })
            }
        },

        Dropdown: function($parent, name, $context, options, callback){
            var optionsTemplate = 
            {
                id: name,
                value:options.value || '',
                classMenu: options.class || ''
            };
            $parent.append(_.template(templateDropdown, optionsTemplate));
            if(callback){
                callback({
                    $children: $parent.find("#" + options.name + ' .dropdown'),
                    html: $parent.html
                })
            }
        },

        Item: function($parent, name, $context, options, callback){
            var element = document.createElement('li');
            var link = null;
            var value = _.isObject(options.value) ? options.value[appApi.currentLanguage] : options.value; 

            if(options.href) {
                link = document.createElement('a');;
                link.setAttribute('href', options.href || "#");
                link.innerHTML = value;
                element.appendChild(link);
            }
            else{
                element.innerHTML = value;
            }

            $parent.append(element);
            if(callback){
                callback({
                    $children: $(link || element),
                    html: element.innerHTML
                })
            }
        }
    };
});