 Router = Backbone.Router.extend({
	routes: {
        "" : "home"
		},
	initialize: function(){
		
	},
	home:function() {
		var content = $('#content');
		content.empty();
	}
});
 $(function() {
    app = new Router();
    Backbone.history.start();
});