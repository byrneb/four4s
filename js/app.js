var app = app || {};

app.Puzzle = Backbone.Model.extend({
   
	update: function(input) {
		this.updateTotal();
		this.checkTargetReached();

		if(this.foursCountReached())
			$( ".icon-four-key" ).addClass( "gray" );
		else
			$( ".icon-four-key" ).removeClass( "gray" );
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
			modal = new app.ModalView({model: this});
			modal.show();
		}
	},
	
	nextTarget: function(){
		var target = this.get('target');
		this.set('target', target+1);
		this.clearSolution();
		localStorage.setItem( 'target', JSON.stringify(target+1) );
	},
	
	clearSolution: function(){
		this.set('solution', '');
		this.set('total', 0);
		this.set('foursCount', 0);
		$( ".icon-four-key" ).removeClass( "gray" );
	}
		
});
  
app.HeaderView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'header',
	className: '',
	events: {
		"click #home": "homeMenu"
    },
	
	initialize: function(){
		_.bindAll(this, 'render');
		this.model.on('change:target', this.render);
		this.template = _.template($('#header-template').html());
	},
	
	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		
		this.delegateEvents();
		return this;
	},
	
	homeMenu: function (){
		app.router.navigate("", true);
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
		var marginTop = bodyHeight*0.1;
		var marginBottom = bodyHeight*0.015;

		this.$el.css( "margin-top", marginTop );
		this.$( "#solution" ).css( "margin-bottom", 0.025*bodyHeight );
		this.$( "#solution" ).css( "font-size", 0.055*bodyHeight );
		this.$( "#total" ).css( "font-size", 0.13*bodyHeight );
		this.delegateEvents();
		return this;
	}
});
 
  app.SymbolsView  = Backbone.View.extend({
 
	tagName: 'div',
	className: 'symbols ',
	initialize: function(){
		this.symbolViewArray = [];
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
		this.delegateEvents();
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

		var diameter = 0.1 * bodyHeight;
		var marginTop = 0.04 * bodyHeight;
		this.$el.css( "fontSize", diameter);
		this.$el.css( "margin-top", marginTop);
		this.delegateEvents();
		return this;
	},
	
	keyClicked: function(){
		if (this.symbol === '«')
			this.solutionModel.removeFromSolution();
		else if( !((this.symbol === '4') && this.solutionModel.foursCountReached()) )
			this.solutionModel.addToSolution(this.symbol);
			
	}
});

app.ModalView = Backbone.View.extend({

        events: {
            'click ': 'close'
        },

        initialize: function() {
			_.bindAll(this, 'render');
            this.template = _.template($('#modal-template').html());
        },

        render: function() {
			this.model.set('title', "Success");
            this.$el.html(this.template(this.model.toJSON()));
			var bodyHeight = $('body').height();
		
			this.$( ".modal-header" ).css( "font-size", 0.07*bodyHeight);
			this.$( ".modal-header" ).css( "margin-top", 0.04*bodyHeight);
			this.$( ".strikethrough" ).css( "margin-top", 0.085*bodyHeight);
			this.$( ".strikethrough" ).css( "font-size", 0.27*bodyHeight);
            return this;
        },

        show: function() {
            $(document.body).append(this.render().el);
        },

        close: function() {
            this.remove();
			this.model.nextTarget();
        }
           
    });
	
	 
  app.HomeView  = Backbone.View.extend({
 
	tagName: 'div',
	id: 'home-screen',
	events: {
		"click #exit": "exit",
		"click #option-play": "play"
    },

    initialize: function(){
		_.bindAll(this, 'render');
		this.template = _.template($('#home-template').html());
	},
	
	render: function (){
		$(this.el).html(this.template);
		var height = $('body').height()*0.08;
		var fontSize = $('body').height()*0.033;
		this.$( ".leftside-edge" ).css( "width", height);
		this.$( ".rightside-edge" ).css( "width", height);
		this.$( ".menu-option" ).css( "margin-left", -height/2);
		this.$( ".menu-option" ).css( "margin-right", -height/2);
		this.$( ".menu-option" ).css( "font-size", fontSize);
		
		return this;
	},
	
	exit: function (){
		navigator.app.exitApp();
	},
	
	play: function (){
		app.router.navigate("play", true);
	}
});
 Router = Backbone.Router.extend({
	routes: {
        "" : "home",
		"play" : "play"
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
		this.homeView = new app.HomeView();
	},

	home:function() {

		var content = $('#four4sApp');
		content.empty();
		
		this.homeView.delegateEvents();
		
		content.append(this.homeView.render().el);
	},
	
	play:function(){
		var content = $('#four4sApp');
		content.empty();
		
		this.HeaderView.delegateEvents();
		this.solutionView.delegateEvents();
		this.symbolsView.delegateEvents();
		
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

		function changecss(theClass,element,value) {
		//Last Updated on July 4, 2011
		//documentation for this script at
		//http://www.shawnolson.net/a/503/altering-css-class-attributes-with-javascript.html
		 var cssRules;


		 for (var S = 0; S < document.styleSheets.length; S++){


			  try{
			  	document.styleSheets[S].insertRule(theClass+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);

			  } catch(err){
			  		try{document.styleSheets[S].addRule(theClass,element+': '+value+';');

					}catch(err){

					 	try{
						    if (document.styleSheets[S]['rules']) {
							  cssRules = 'rules';
							 } else if (document.styleSheets[S]['cssRules']) {
							  cssRules = 'cssRules';
							 } else {
							  //no rules found... browser unknown
							 }

							  for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
							   if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
							    if(document.styleSheets[S][cssRules][R].style[element]){
							    document.styleSheets[S][cssRules][R].style[element] = value;
								break;
							    }
							   }
							  }
						  } catch (err){}



					}

			  }


		}
	}

 $(function() {
	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);

		var bodyHeight = $('body').height();
	var bodyWidth = $('body').width();
	 
	var homeOptionWidth = bodyHeight*0.14;
	var hintOptionWidth = bodyHeight*0.13;
	changecss('#hint','width',hintOptionWidth+'px');
	changecss('#home','width',homeOptionWidth+'px');

	var headerTotalWidth = bodyWidth - (2*bodyHeight*0.14);
	changecss('#target','width',headerTotalWidth+'px');
	
	var marginTop = bodyHeight*0.31*0.145;
	changecss('.fa, #target','margin-top',marginTop+'px');

	var headerFontSize = 0.4*bodyHeight*0.13;
	changecss('#home, #hint, #target','font-size',headerFontSize+'px');
    app.router = new Router();
    Backbone.history.start();
});