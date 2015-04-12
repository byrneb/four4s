define([
    'backbone'

], function(Backbone) {	

	HeaderModel = Backbone.Model.extend({
		isPuzzleSolved : function(currentTotal){
			return currentTotal === this.get("target");
		}
	});

	return HeaderModel;
});