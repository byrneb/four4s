define([
    'backbone',
    'text!../../templates/buttons.html',
    'text!../../templates/buttons-post-21.html'

], function(Backbone, buttonsTemplate, buttonsPost21Template) {	

	ButtonsView = Backbone.View.extend({
		tagName: "div",
		id: "buttons",

		events : {
			"click .button": "onButtonClickPassKey"
		},
		
		rootIcon: '<span class="icon-drawing"></span>',

		initialize : function(options){
			_.bindAll(this, "render");
			var target = options.localstore.read('target');
			var model = options.localstore.read("levelManagementModel");
			if(target<22 || model == null || model.mode == 'tutorial')
				this.template = _.template(buttonsTemplate);
			else			
				this.showExtraButtons();
		},

		render : function(){
			$(this.el).html(this.template);
			this.delegateEvents();
			return this;
		},

		onButtonClickPassKey: function(event){
			var source = event.target.className;
			var keyPressed = this.getKeyPressed(source);
			this.trigger("clicked:button", keyPressed);
		},

		getKeyPressed : function(input){
			if(input.indexOf("four") != -1)
				return "4";
			else if(input.indexOf("plus") != -1)
				return "+";
			else if(input.indexOf("minus") != -1)
				return "-";
			else if(input.indexOf("dot") != -1)
				return ".";
			else if(input.indexOf("mutliply") != -1)
				return "×";
			else if(input.indexOf("divide") != -1)
				return "÷";
			else if(input.indexOf("left") != -1)
				return "(";
			else if(input.indexOf("right") != -1)
				return ")";		
			else if(input.indexOf("factorial") != -1)
				return "!";
			else if(input.indexOf("power") != -1)
				return "<sup>4</sup>";
			else if(input.indexOf("square") != -1)
				return this.rootIcon;
			else if(input.indexOf("back") != -1)
				return "<<";
		},

		showExtraButtons : function(){
			this.template = _.template(buttonsPost21Template);
			this.render();
		}
	});
	return ButtonsView;
});