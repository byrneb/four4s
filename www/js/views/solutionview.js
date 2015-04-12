define([
    'backbone',
    'models/solutionmodel',
    'text!../../templates/solution.html',


], function(Backbone, SolutionModel, solutionTemplate) {
	SolutionView = Backbone.View.extend({

		tagName: "div",
		id: "sol-container",

		initialize: function(){
			_.bindAll(this, "render", "onButtonClickUpdateSolution");
			this.model = new SolutionModel({
				"solution" : "",
				"foursCount" : 0,
				"total" : 0
			});
			this.model.on("change", this.render);
			this.template = _.template(solutionTemplate);
		},

		render: function (){

			var renderedContent = this.template(this.model.createRootFormatedSolution().toJSON());
			$(this.el).html(renderedContent);
			return this;
		},

		onButtonClickUpdateSolution: function(keyPressed){
			if(keyPressed === "<<")
				this.model.removeLastCharacter();
			else if(keyPressed === "4" && this.model.isFour4sUsed())
				return;
			else if(keyPressed === "<sup>4</sup>" && this.model.isFour4sUsed())
				return;
			else
				this.model.addCharacter(keyPressed);

			this.model.updateTotal();
			if(this.model.isFour4sUsed()){
				$( ".icon-four-key" ).addClass( "gray" );
				this.trigger("change:total", this.model.get("total"));
			}
			else
				$( ".icon-four-key" ).removeClass( "gray" );
		},

		clearView: function(){
			this.model.cleanUp();
		}
	});

	return SolutionView;
});