 var app = app || {};
 
   app.Puzzle = Backbone.Model.extend({
   
		update: function(input){			
			this.updateTotal();	
			this.checkTargetReached();
			
			if(this.foursCountReached())
				$( "#four-key" ).addClass( "gray" );			
			else
				$( "#four-key" ).removeClass( "gray" );
		},
		
		addToSolution: function(input){			
			var updatedSolution = this.get('solution') + input;			
			this.set('solution', updatedSolution);
			
			if(input == 4)
				this.incrementFoursCount();
			this.update();
		},
		
		removeFromSolution: function(){
			var solution = this.get('solution');
			this.set('solution', solution.slice(0,-1));
			
			var removedChar = solution.charAt(solution.length-1);
			if(removedChar === '4')
				this.decrementFoursCount();
			this.update();
		},
		
		incrementFoursCount: function(){			
			var foursCount = this.get('foursCount');
			this.set('foursCount', foursCount+1);
		},
		
		decrementFoursCount: function(){			
			var foursCount = this.get('foursCount');
			this.set('foursCount', foursCount-1);
		},
		
		foursCountReached: function(){
			return this.get('foursCount') === 4;
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
			if((this.get('total') === target) && (this.foursCountReached())){
				this.set('target', target+1);
				this.clearSolution();
				localStorage.setItem( 'target', JSON.stringify(target+1) );
			}
		},
		
		clearSolution: function(){
			this.set('solution', '');
			this.set('total', 0);
			this.set('foursCount', 0);
			$( "#four-key" ).removeClass( "gray" );
		}
		
  });
  
  app.HeaderView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'header',
	className: '',
	
	initialize: function(){
		_.bindAll(this, 'render');
		this.model.on('change:target', this.render);
		this.template = _.template($('#header-template').html());
	},
	
	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		
		var bodyHeight = $('body').height(); 
		var bodyWidth = $('body').width();		  
		 
		var homeOptionWidth = bodyHeight*.14;
		var hintOptionWidth = bodyHeight*.13;
		this.$( "#home" ).css( "width", homeOptionWidth); 
		this.$( "#hint" ).css( "width", hintOptionWidth); 
		  
		var headerTotalWidth = bodyWidth - (2*bodyHeight*.14); 
		this.$( "#target" ).css( "width", headerTotalWidth);
		
		var marginTop = bodyHeight*.31*.14; 
		this.$( ".fa, #target").css( "margin-top", marginTop);
		  
		  
		var headerFontSize = .4*bodyHeight*.13;
		this.$( "#home, #hint, #target" ).css( "fontSize", headerFontSize ); 
		return this;
	}
});

 app.SolutionView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'sol-container',
	className: '',
	
	initialize: function(){
		_.bindAll(this, 'render');
		this.model.on('change:solution change:total', this.render);
		this.template = _.template($('#sol-template').html());
	},
		
	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		
		var bodyHeight = $('body').height();	  
		var marginTop = bodyHeight*.1; 	  
		var marginBottom = bodyHeight*.015; 		
		
		this.$el.css( "margin-top", marginTop ); 
		this.$( "#solution" ).css( "margin-bottom", .025*bodyHeight ); 
		this.$( "#solution" ).css( "font-size", .055*bodyHeight ); 
		this.$( "#total" ).css( "font-size", .13*bodyHeight ); 
		return this;
	}
});
 
  app.SymbolsView  = Backbone.View.extend({
 
	tagName: 'div',
	className: 'symbols ',
	initialize: function(){			
		this.symbolViewArray = new Array();
		var symbolsArray = ['4', '+', '-', '·', '×', '÷', '(', ')', '«'];
		var classArray = ['four-key', 'plus-key', 'minus-key', 'dot-key', 'mutliply-key', 'divide-key', 'left-bracket-key', 'right-bracket-key', 'back-key'];
		_.bindAll(this, 'render');
		this.template = _.template($('#symbols-template').html());	
		for (var i = 0; i < symbolsArray.length; i++) 
			this.symbolViewArray[i] = new app.SymbolView( { className : 'key icon-'+classArray[i], symbol : symbolsArray[i], solutionModel:this.model});
		
	},
	
	render: function (){
		$(this.el).html(this.template);
		
		for (var i = 0; i < this.symbolViewArray.length; i++) 
			this.$el.append(this.symbolViewArray[i].render().el);
			
		return this;
	}
});

 app.SymbolView  = Backbone.View.extend({
 
	tagName: 'span',
	
	events: {
		"click": "keyClicked"
    },
	
	initialize: function(){
		_.bindAll(this, 'render', 'keyClicked');
		this.solutionModel = this.options.solutionModel;
		this.symbol = this.options.symbol;
		var symbolRef = this.symbol;
		this.template = _.template($('#key-template').html());
	},
	
	render: function (){
		$(this.el).html(this.template);
		 
		var bodyHeight = $('body').height(); 
		  
		var diameter = .1 * bodyHeight;
		var marginTop = .04 * bodyHeight;
		this.$el.css( "fontSize", diameter ); 
		this.$el.css( "margin-top", marginTop ); 
		return this;
	},
	
	keyClicked: function(){
		if (this.symbol === '«')
			this.solutionModel.removeFromSolution();	
		else if( !((this.symbol === '4') && this.solutionModel.foursCountReached()) )
			this.solutionModel.addToSolution(this.symbol);
			
	}
});

 Router = Backbone.Router.extend({
	routes: {
        "" : "home"
		},
	initialize: function(){
		this.puzzle = new app.Puzzle({target:1,solution:"", total:0, foursCount:0});
		
		if(localStorage.getItem( 'target' ) !== null){
			var target =  JSON.parse( localStorage.getItem( 'target' ) );
			this.puzzle.set('target', target);
		}
			
		this.HeaderView = new app.HeaderView({model:this.puzzle});
		this.solutionView = new app.SolutionView({model:this.puzzle});
		this.symbolsView = new app.SymbolsView({model:this.puzzle});
		
	},
	home:function() {
		var content = $('#four4sApp');
		content.empty();
		content.append(this.HeaderView.render().el);
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