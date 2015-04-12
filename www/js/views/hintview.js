define([
    'backbone',
    'hints',
    'text!../../templates/hint.html',


], function(Backbone, Hints, hintTemplate) {		

	HintView = Backbone.View.extend({
		tagName: "div",
		id: "hint-container",
		initialize: function(){
			_.bindAll(this, "render");
			this.template = _.template(hintTemplate);
			this.model.on("change", this.render);
		},

		render: function(){
			var hintIndex = this.model.get('level')-1;

			var mode = this.model.get('mode');
			if(mode === 'tutorial')
				this.model.set({hintText: Hints.tutHints[hintIndex]});
			else
				this.model.set({hintText: Hints.hints[hintIndex]});		
			
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	return HintView;
});