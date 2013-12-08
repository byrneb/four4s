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
			this.set('isSolved', true);
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
		this.set('isSolved', false);
		$( ".icon-four-key" ).removeClass( "gray" );
	},

	endTutorial: function(){
		this.set('target',1);
		this.clearSolution();
		this.set('isTutorialMode', false);
		localStorage.setItem( 'isTutorialMode', JSON.stringify(false) );
	}

});

app.ModalData = Backbone.Model.extend();

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

	initialize: function(options){
		_.bindAll(this, 'render', 'keyClicked');
		this.solutionModel = options.solutionModel;
		this.symbol = options.symbol;
		var symbolRef = this.symbol;
		this.template = _.template($('#key-template').html());
	},

	render: function (){
		$(this.el).html(this.template);
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

	initialize: function() {
		_.bindAll(this, 'render');
		this.template = _.template($('#modal-template').html());
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents();

		if(this.model.get('isTutorialMsg'))
			this.$( "#modal-content" ).removeClass( "strikethrough" ).addClass( "info-message" );
		else
			this.$( "#modal-content" ).removeClass( "info-message" ).addClass( "strikethrough" );
		return this;
	}

});

app.PlayScreenView = Backbone.View.extend({
	tagName: 'div',
	id: 'play-screen',

	events : {
		'click .modal-backdrop, .modal': "modalClicked"
	},

	initialize: function(){
		_.bindAll(this, 'render', 'setModalActive');
		this.template = _.template($('#play-screen-template').html());
		this.headerView = new app.HeaderView({model:this.model});
		this.solutionView = new app.SolutionView({model:this.model});
		this.symbolsView = new app.SymbolsView({model:this.model});
		this.modalData = new app.ModalData();

		if(this.model.get('isTutorialMode')){
			this.modalData.set({
				'title'			: 'Tutorial #1',
				'content'		: 'Use <span class="icon-four-key"></span> x4 times',
				'isTutorialMsg'	: true
			});
		}

		this.model.on("change:isModalActive", this.render);
		this.model.on("change:isSolved", this.setModalActive);
		this.modalView = new app.ModalView({model: this.modalData});
		this.listenTo(this.modalView, 'modal:close', this.alerta);
	},

	modalClicked: function(){
		if(this.model.get('isTutorialMode') && (this.model.get('tutorialStage') === 1)){
			//set for modal after first click. msg = press the hint button
			this.modalData.set('title', 'Tutorial #1');
			this.modalData.set('content', 'message');
			
            this.model.set('tutorialStage', 2);
		}
		else if(this.model.get('isTutorialMode') && (this.model.get('tutorialStage') === 3)){
			//set for modal after first click. msg = don't forget about the hint button
			this.modalData.set('title', 'Tutorial #2');
			this.modalData.set('content', 'message');
			
			this.model.set('tutorialStage', 4);
		}
		//close modal
		else{
			if(this.model.get('isTutorialMode') && (this.model.get('tutorialStage') === 2)){
				//set for modal for next time puzzle solved ie you can combine numbers hint?
				this.modalData.set('title', 'Tutorial #2');
				this.modalData.set('content', 'message2');
				
				this.model.set('target', 16);
				this.model.set('tutorialStage', 3);
			}
			else if(this.model.get('isTutorialMode') && (this.model.get('tutorialStage') === 4)){

				this.modalData.set('title', 'Play');
				this.modalData.set('content', 'lets get crackin');

				this.model.set('target', 4444);
				this.model.clearSolution();
				this.model.set('tutorialStage', 5);
			}
			else if(this.model.get('isTutorialMode') && (this.model.get('tutorialStage') === 5)){
				this.model.endTutorial();

				this.modalData.set('isTutorialMsg', false);
				localStorage.setItem( 'isModalActive', JSON.stringify(false) );
				localStorage.setItem( 'target', JSON.stringify(1) );
			}
			else{
				this.model.nextTarget();
			}
			localStorage.setItem( 'isModalActive', JSON.stringify(false) );
			this.model.set('isModalActive', false);			
		}
		this.render();
	},

	render: function(){
		this.$el.empty();
		if(this.model.get('isModalActive')){
			if(!this.model.get('isTutorialMode')){
				this.modalData.set('title', "Success");
				this.modalData.set('content', this.model.get('target'));
			}
			this.$el.append(this.modalView.render().el);
		}
		this.$el.append(this.headerView.render().el, this.solutionView.render().el, this.symbolsView.render().el);
		this.delegateEvents();
		return this;
	},

	setModalActive: function(){
		localStorage.setItem( 'isModalActive', JSON.stringify(true) );
		this.model.set('isModalActive', true);
	}
});
app.HomeScreenView  = Backbone.View.extend({

	tagName: 'div',
	id: 'home-screen',
	events: {
		"click #exit": "exit",
		"click #option-play": "play"
	},

	initialize: function(){
		_.bindAll(this, 'render');
		this.template = _.template($('#home-screen-template').html());
	},

	render: function (){
		$(this.el).html(this.template);
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
		this.puzzle = new app.Puzzle({target		: 1,
									solution		: "",
									total			: 0,
									foursCount		: 0,
									isTutorialMode	: true,
									tutorialStage	: 1,
									isModalActive	: true
								});

		if(localStorage.getItem( 'target' ) !== null){
			var target =  JSON.parse( localStorage.getItem( 'target' ) );
			var isTutorialMode =  JSON.parse( localStorage.getItem( 'isTutorialMode' ) );
			var isModalActive =  JSON.parse( localStorage.getItem( 'isModalActive' ) );
			this.puzzle.set('target', target);
			this.puzzle.set('isTutorialMode', isTutorialMode);
			this.puzzle.set('isModalActive', isModalActive);
		}

		this.playScreenView = new app.PlayScreenView({model:this.puzzle});
		this.homeScreenView = new app.HomeScreenView();
	},

	home:function() {

		var content = $('#four4sApp');
		content.empty();

		this.homeScreenView.delegateEvents();

		content.append(this.homeScreenView.render().el);
	},

	play:function(){
		var content = $('#four4sApp');
		content.empty();
		content.append(this.playScreenView.render().el);
		this.playScreenView.delegateEvents();
	}
});

makeReadable = function(original){
	if(original === '')
		return 0;
	this.result = original.replace(/·/g,'.');
	this.result = this.result.replace(/÷/g,'/');
	this.result = this.result.replace(/×/g,'*');
	return this.result;
};

changecss = function (theClass,element,value) {
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
};

calculateStylesheetProperties = function(){
	var bodyHeight = $('body').height();
	var bodyWidth = $('body').width();

	/* Header */
	var homeOptionWidth = bodyHeight*0.14;
	var hintOptionWidth = bodyHeight*0.13;
	var headerFontSize = 0.35*bodyHeight*0.13;
	var headerTotalWidth = bodyWidth - (2*bodyHeight*0.14);
	var iconsmarginTop = bodyHeight*0.31*0.145;
	homeOptionWidth = Math.round(homeOptionWidth * 100) / 100;
	hintOptionWidth = Math.round(hintOptionWidth * 100) / 100;
	headerTotalWidth = Math.round(headerTotalWidth * 100) / 100;
	headerFontSize = Math.round(headerFontSize * 100) / 100;
	iconsmarginTop = Math.round(iconsmarginTop * 100) / 100;
	changecss('#hint','width',hintOptionWidth+'px');
	changecss('#home','width',homeOptionWidth+'px');
	changecss('#target','width',headerTotalWidth+'px');
	changecss('.fa, #target','margin-top',iconsmarginTop+'px');
	changecss('#home, #hint, #target','font-size',headerFontSize+'px');

	/* Home Screen */
	var menuOptionHeight = $('body').height()*0.08;
	var menuOptionFontSize = $('body').height()*0.033;
	menuOptionHeight = Math.round(menuOptionHeight * 100) / 100;
	menuOptionFontSize = Math.round(menuOptionFontSize * 100) / 100;
	changecss('.leftside-edge, .rightside-edge','width',menuOptionHeight+'px');
	changecss('.menu-option','margin-left',(-menuOptionHeight/2)+'px');
	changecss('.menu-option','margin-right',(-menuOptionHeight/2)+'px');
	changecss('.menu-option','font-size',menuOptionFontSize+'px');

	/* Solution */
	var marginTop = bodyHeight*0.1;
	var marginBottom = bodyHeight*0.025;
	var solutionFontSize = bodyHeight*0.055;
	var totalFontSize = bodyHeight*0.13;
	marginTop = Math.round(marginTop * 100) / 100;
	marginBottom = Math.round(marginBottom * 100) / 100;
	solutionFontSize = Math.round(solutionFontSize * 100) / 100;
	totalFontSize = Math.round(totalFontSize * 100) / 100;
	changecss('#sol-container','margin-top',marginTop+'px');
	changecss('#solution','margin-bottom',marginBottom+'px');
	changecss('#solution','font-size',solutionFontSize+'px');
	changecss('#total','font-size',totalFontSize+'px');

	/* Modal */        
	var modalFontSize = 0.07*bodyHeight;
	var modalMarginTop = 0.04 * bodyHeight;
	var strikeThroughMarginTop = 0.085 * bodyHeight;
	var strikeThroughFontSize = 0.27 * bodyHeight;
	modalFontSize = Math.round(modalFontSize * 100) / 100;
	modalMarginTop = Math.round(modalMarginTop * 100) / 100;
	strikeThroughMarginTop = Math.round(strikeThroughMarginTop * 100) / 100;
	strikeThroughFontSize = Math.round(strikeThroughFontSize * 100) / 100;

	changecss('.modal-header','font-size',modalFontSize+'px');
	changecss('.modal-header','margin-top',modalMarginTop+'px');
	changecss('.strikethrough','margin-top',strikeThroughMarginTop+'px');
	changecss('.strikethrough','font-size',strikeThroughFontSize+'px');

	/* Symbol */
	var diameter = 0.1 * bodyHeight;
	var marginTop = 0.04 * bodyHeight;
	diameter = Math.round(diameter * 100) / 100;
	marginTop = Math.round(marginTop * 100) / 100;
	changecss('.key','font-size',diameter+'px');
	changecss('.key','margin-top',marginTop+'px');

};

$(function() {
	Backbone.View = (function(View) {
		return View.extend({
			constructor: function(options) {
				this.options = options || {};
				View.apply(this, arguments);
			}
		});
	})(Backbone.View);

	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false);

	calculateStylesheetProperties();
	app.router = new Router();
	Backbone.history.start();
});