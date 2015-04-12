define([
    'backbone'

], function(Backbone) {

	LocalStorageModel = Backbone.Model.extend({

		read : function(key){
			var mode = this.get('mode');
			return JSON.parse( localStorage.getItem(mode +'-' + key));
		},

		write : function(key, model){
			var mode = this.get('mode');
			localStorage.setItem( mode +'-' + key, JSON.stringify(model));
		}
	})

	return LocalStorageModel;
});