define([
    'backbone',
    'text!../../templates/home-screen.html'

], function(Backbone, homeScreenTemplate) {

	HomeScreenView  = Backbone.View.extend({

		tagName: 'div',
		id: 'home-screen',
		events: {
			"click #exit": "exit",
			"click #option-play": "play",
			"click #option-play-level": "levelChooser"
		},

		initialize: function(){
			_.bindAll(this, 'render');
			this.template = _.template(homeScreenTemplate);
		},

		render: function (){
			$(this.el).html(this.template);
			return this;
		},

		exit: function (){
			navigator.app.exitApp();
		},

		play: function (){
			Backbone.history.navigate("play", true);
		},

		levelChooser: function(){
			Backbone.history.navigate("level-chooser", true);
		}
	});

	return HomeScreenView;
});