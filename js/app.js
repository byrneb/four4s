 var app = app || {};
 
   app.Puzzle = Backbone.Model.extend({
   
		updateSolution: function(input){
			var updatedSolution = this.get('solution') + input;
			
			if(input == 4)
				this.incrementFoursCount();
			this.set('solution', updatedSolution);
			this.updateTotal();	
			this.checkTargetReached();
		},
		
		incrementFoursCount: function(){			
			var foursCount = this.get('foursCount');
			this.set('foursCount', foursCount+1);
		},
		
		updateTotal: function(){			
			var sum = 0;
			try{
				sum = makeReadable(this.get('solution'));
				sum = eval(sum);
				sum = Number(sum.toFixed(2));
			}
			catch(e){
				sum = 0;
			}
			this.set('total', (sum)); 
		},
		
		checkTargetReached: function(){
			var target = this.get('target');
			if((this.get('total') === target) && (this.get('foursCount') === 4)){
				this.set('target', target+1);
				this.clearSolution();
			}
		},
		
		clearSolution: function(){
			this.set('solution', '');
			this.set('total', 0);
			this.set('foursCount', 0);
		}
		
  });
  
  app.TargetView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'target',
	className: 'unselectable',
	
	initialize: function(){
		_.bindAll(this, 'render');
		this.model.on('change:target', this.render);
		this.template = _.template($('#target-template').html());
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
		this.model.on('change:solution change:total', this.render);
		this.template = _.template($('#sol-template').html());
	},
	
	clear: function(){
		this.model.clearSolution();
	},
	
	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	}
});
 
  app.SymbolsView  = Backbone.View.extend({
 
	tagName: 'div',
	className: 'symbols unselectable',
	initialize: function(){			
		this.symbolViewArray = new Array();
		var symbolsArray = ['4', '+', '-', '·', '×', '÷', '(', ')'];
		_.bindAll(this, 'render');
		this.template = _.template($('#symbols-template').html());	
		for (var i = 0; i < symbolsArray.length; i++) {
			if( (symbolsArray[i] === '(' ) | ( symbolsArray[i] === ')') )
				this.symbolViewArray[i] = new app.SymbolView( { symbol : symbolsArray[i], solutionModel:this.model, className:'key unselectable bracket'});
			else
				this.symbolViewArray[i] = new app.SymbolView( { symbol : symbolsArray[i], solutionModel:this.model});
		}
	},
	
	render: function (){
		$(this.el).html(this.template);
		
		for (var i = 0; i < this.symbolViewArray.length; i++) {
			this.$el.append(this.symbolViewArray[i].render().el);
		}
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
		this.symbol = this.options.symbol;
		var symbolRef = this.symbol;
		this.template = _.template($('#key-template').html(), { symbol :  symbolRef});
	},
	
	render: function (){
		$(this.el).html(this.template);
		return this;
	},
	
	keyClicked: function(){
		this.solutionModel.updateSolution(this.symbol);
	}
});

 Router = Backbone.Router.extend({
	routes: {
        "" : "home"
		},
	initialize: function(){
		this.puzzle = new app.Puzzle({target:1,solution:"", total:0, foursCount:0});
		this.targetView = new app.TargetView({model:this.puzzle});
		this.solutionView = new app.SolutionView({model:this.puzzle});
		this.symbolsView = new app.SymbolsView({model:this.puzzle});
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