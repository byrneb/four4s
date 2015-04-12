define([
    'backbone',
    'models/headermodel',
    'text!../../templates/header.html',


], function(Backbone, HeaderModel, headerTemplate) {

	HeaderView = Backbone.View.extend({

		tagName: "div",
		id: "header",

		events: {
			"click .icon-home": "homeMenu",
			"click .icon-lightbuilb": "hint"
		},

		initialize: function(options){
			_.bindAll(this, "render");
			this.localStore = options.localstore;
			var target = this.localStore.read('target');
			if( target !== null){
				this.model = new HeaderModel({"target": target});
			}
			else
				this.model = new HeaderModel({"target": 16});
			this.model.on("change:target", this.render);
			this.template = _.template(headerTemplate);
		},

		render: function (){
			var renderedContent = this.template(this.model.toJSON());
			$(this.el).html(renderedContent);

			this.delegateEvents();
			return this;
		},

		homeMenu: function (){
			Backbone.history.navigate("", true);
		},

		onTotalChangeCheckSolved : function(currentTotal){
			if(this.model.isPuzzleSolved(currentTotal))
				this.trigger("solved:puzzle");
		},

		setTarget : function(newTarget){
			this.model.set("target", newTarget);
			this.localStore.write('target', newTarget);
		},

		hint : function(){
	       	var heading = $(".hint-box");
	       	if(heading.css('display') == 'block'){
	          	heading.stop(true, true);
	          	heading.css({ display: 'none'});
	      	}
	        heading.fadeIn(1500).delay(4500).fadeOut(1500);
	  	}
	});
		return HeaderView;
});