 var app = app || {};
  app.SolutionModel = Backbone.Model.extend({
	
  });
  
  app.TargetView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'target',
	className: 'unselectable',
	
	initialize: function(){
		_.bindAll(this, 'render');
		this.template = _.template($('#target-template').html());
		this.model = new Backbone.Model();
		this.model.set('target',1);
	},
	
	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	}
});

 app.SolutionView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'sol-container',
	className: 'unselectable',
	
	events: {'click #options' : 'clear'},
	initialize: function(){
		_.bindAll(this, 'render');
		this.model.on('change:solution', this.render);
		this.template = _.template($('#sol-template').html());
	},
	
	clear: function(){
		this.model.set('solution', '');
	},
	
	render: function (){
		sum = 0;
		try{
			sum = makeReadable(this.model.get('solution'));
			sum = eval(sum);
			sum = Number(sum.toFixed(2)).toString();
		}catch(e)
		{sum = 0;}
		this.model.set('total', ('=  '+sum)); 
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	}
});
 
  app.SymbolsView  = Backbone.View.extend({
 
	tagName: 'div',
	className: 'symbols unselectable',
	initialize: function(){
		_.bindAll(this, 'render');
		this.template = _.template($('#symbols-template').html());
		
		this.fourView = new app.SymbolView({model: new Backbone.Model({symbol: "4"}), 
											solutionModel:this.model});
		this.plusView = new app.SymbolView({model: new Backbone.Model({symbol: "+"}), 
											solutionModel:this.model});
		this.minusView = new app.SymbolView({model: new Backbone.Model({symbol: "-"}), 
											solutionModel:this.model});
		this.decimalView = new app.SymbolView({model: new Backbone.Model({symbol: "·"}), 
											solutionModel:this.model});
		this.multiplyView = new app.SymbolView({model: new Backbone.Model({symbol: "×"}), 
											solutionModel:this.model});
		this.divideView = new app.SymbolView({model: new Backbone.Model({symbol: "÷"}), 
											solutionModel:this.model});
		this.bracketlView = new app.SymbolView({model: new Backbone.Model({symbol: "("}),
												solutionModel:this.model, id:"bracket"});
		this.bracketrView = new app.SymbolView({model: new Backbone.Model({symbol: ")"}),
												solutionModel:this.model, id:"bracket"});
	},
	
	render: function (){
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		
		this.$el.append(this.fourView.render().el,this.plusView.render().el,this.minusView.render().el,
						this.decimalView.render().el,this.multiplyView.render().el,this.divideView.render().el,
						this.bracketlView.render().el,this.bracketrView.render().el);
		return this;
	}
});

 app.SymbolView  = Backbone.View.extend({
 
	tagName: 'div',
	className: 'key unselectable',
	
	events: {
		"click": "keyClicked"
    },
	
	initialize: function(){
		_.bindAll(this, 'render', 'keyClicked');
		this.solutionModel = this.options.solutionModel;
		this.template = _.template($('#key-template').html());
	},
	
	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	},
	
	keyClicked: function(){
		updatedSolution = this.solutionModel.get('solution') + this.model.get('symbol');
		this.solutionModel.set('solution', updatedSolution);
	}
});

 Router = Backbone.Router.extend({
	routes: {
        "" : "home"
		},
	initialize: function(){
		this.solutionModel = new app.SolutionModel({solution:"", total:""});
		this.targetView = new app.TargetView();
		this.solutionView = new app.SolutionView({model:this.solutionModel});
		this.symbolsView = new app.SymbolsView({model:this.solutionModel});
	},
	home:function() {
		var content = $('#four4sApp');
		content.empty();
		content.append(this.targetView.render().el);
		content.append(this.solutionView.render().el);
		content.append(this.symbolsView.render().el);
	}
});

makeReadable = function(original){
	if(original === '')
		return 0;
	result = original.replace(/·/g,'.');
	result = result.replace(/÷/g,'/');
	result = result.replace(/×/g,'*');
	return result;
};
 $(function() {
	 window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);
    app.router = new Router();
    Backbone.history.start();
});