define([
    'backbone',
    'text!../../templates/level-manager.html'

], function(Backbone, levelManagerTemplate) {

    LevelChooserView = Backbone.View.extend({
    	tagName: "div",
    	id: "level-chooser-page",

    	 events: {
            'mouseup .icon-arrow-up': 'upArrowOnmouseup',
            'mousedown .icon-arrow-up': 'upArrowOndblclick',
            'mouseup .icon-arrow-down': 'downArrowOnmouseup',
            'mousedown .icon-arrow-down': 'downArrowOndblclick',
            'touchend .icon-arrow-up': 'upArrowOnmouseup',
            'touchstart .icon-arrow-up': 'upArrowOndblclick',
            'touchend .icon-arrow-down': 'downArrowOnmouseup',
            'touchstart .icon-arrow-down': 'downArrowOndblclick',
            'touchend #choose-level': 'upChooselevel',
            'mouseup #choose-level': 'upChooselevel',
            "click .icon-home": "homeMenu"
        },

    	initialize: function(options){
    		_.bindAll(this, "render");
    		this.model = new Backbone.Model({ level: 1 });
    		this.template = _.template(levelManagerTemplate);
    	},

    	upArrowOnmouseup: function() {
            clearTimeout(to);
            clearInterval(lint);
            this.model.set('level', temp);
        },    
        upArrowOndblclick: function() {
        	var that = this;
        	temp = this.model.get('level');
        	to = null;
        	lint = null;

        	temp++;
            $("#level-chooser").html(temp);
            to = setTimeout(function () {
                lint = setInterval(function () {
                    temp+=2;
                    $("#level-chooser").html(temp);
                }, 75);
            }, 500);
        },

        downArrowOnmouseup: function() {
            clearTimeout(to2);
            clearInterval(lint2);
            this.model.set('level', temp);
        },    
        downArrowOndblclick: function() {
        	var that = this;
        	temp = this.model.get('level');
        	to2 = null;
        	lint2 = null;

        	if( temp > 1 )
        		temp--;
            $("#level-chooser").html(temp);
            to2 = setTimeout(function () {
                lint2 = setInterval(function () {
                	if( temp > 2 )
                    	temp-=2;
                    $("#level-chooser").html(temp);
                }, 75);
            }, 500);
        },

        upChooselevel: function(){
        	Backbone.history.navigate("single-play", true);
        },

    	render: function (){
    	    var model = this.model;
    		var renderedContent = this.template(this.model.toJSON());
    		$(this.el).html(renderedContent);
    		return this;
    	},

    	homeMenu: function (){
    		Backbone.history.navigate("", true);
    	}
    });
    
    return LevelChooserView;

});