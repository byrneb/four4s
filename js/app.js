var app = app || {};

app.LevelManagementModel = Backbone.Model.extend({
	
	isTutorialsLastModal : function(){
		return (this.get('level') === 2 && this.get('modal') === 2 && this.get('mode') === "tutorial") 
	},

	isAnotherModal : function(){
		if (this.get('mode') === "puzzle")
			return false;
		else if(this.get('level') === 0 && this.get('modal') === 1)
			return true;
		else if(this.get('level') === 1 && this.get('modal') === 1)
			return true;
		else if(this.get('level') === 2 && this.get('modal') === 1)
			return true;
		
	},

	finishTutorial : function(){
		this.set("mode", "puzzle");
		this.set('modal', 0);
		this.set('level', 1);
	},

	incrementLevel : function(){
		var currentLevel = this.get("level");
		currentLevel++;
		this.set("level", currentLevel);
	},

	incrementModal : function(){
		var currentModal = this.get("modal");
		currentModal++;
		this.set("modal", currentModal);
	},

	getNextModalModel : function(){
		if(this.get("mode") === "tutorial" ){
			if(this.get('level') === 0 && this.get('modal') === 2){
				return new app.ModalModel({
							'title'			: 'Tutorial 1',
							'content' 		: '<div class="long-msg">'+
											  '<div class="top modal-msg">Create the above target 16</div>'+
											  '<div class="modal-msg">If you run into trouble <div>click '+
											  'the hint button </div><i class="fa fa-lightbulb-o"></i></div>'+
											  '</div>',
							'isTutorialMsg' : true 
						});
			}
			else if(this.get('level') === 1 && this.get('modal') === 1){
				return new app.ModalModel({
							'title'			: 'Tutorial 1',
							'content' 		: '<div class="modal-msg">You have completed </div>'+
											  '<div class="modal-msg">your first puzzle</div>'+
											  '<div class="modal-msg"><i class="fa fa-smile-o"></i></div>',
							'isTutorialMsg' : true 
						});
			}
			else if(this.get('level') === 1 && this.get('modal') === 2){
				return new app.ModalModel({
							'title'			: 'Tutorial 2',
							'content' 		: '<div class="modal-msg">Operators like <i class="icon-plus-key"></i>'+
											  '<br>are great</div>'+
											  '<div class="modal-msg">But not always'+
											  '<br>needed!</div>',
							'isTutorialMsg' : true 
						});
			}
			else if(this.get('level') === 2 && this.get('modal') === 1){
				return new app.ModalModel({
							'title'			: 'Tutorial End',
							'content' 		: '<div class="modal-msg">You have completed</div>'+
											  '<div class="modal-msg">the tutorial</div>'+
											  '<div class="modal-msg"><i class="fa fa-check-square-o"></i></div>',
							'isTutorialMsg' : true 
						});
			}
			else if(this.get('level') === 2 && this.get('modal') === 2){
				return new app.ModalModel({
							'title'			: 'Game On',
							'content' 		: '<div class="modal-msg">For each puzzle</div>'+
											  '<div class="modal-msg">solved the target</div>'+ 
											  '<div class="modal-msg">will increase by 1</div>',
							'isTutorialMsg' : true 
						});
			}
		}
		else {
			return new app.ModalModel({
							'title'			: 'Success',
							'content' 		: this.get("level"),
							'isTutorialMsg' : false 
						});
		}
	},

	getNextTarget: function(){
		if(this.get("mode") === "tutorial" ){
			if(this.get('level') === 0){
				return 16;
			}
			else if(this.get('level') === 1){
				return 4444;
			}
			else if(this.get('level') === 2){
				return 1;
			}

		}
		else {
			return this.get('level');
		}
	}
});

app.HeaderModel = Backbone.Model.extend({

	isPuzzleSolved : function(currentTotal){
		return currentTotal === this.get("target");
	}

});

app.SolutionModel = Backbone.Model.extend({

	addCharacter : function(newChar){
		var updatedSolution = this.get("solution") + newChar;
		this.set("solution", updatedSolution);

		if(newChar === "4")
			this.incrementFoursCount();
	},

	removeLastCharacter : function(){
		var solution = this.get("solution");
		this.set("solution", solution.slice(0,-1));

		var removedChar = solution.charAt(solution.length-1);
		if(removedChar === "4")
			this.decrementFoursCount();
	},

	isFour4sUsed : function(){
		return this.get("foursCount") === 4;
	},

	incrementFoursCount : function(){
		var foursCount = this.get("foursCount");
		this.set("foursCount", foursCount+1);
	},

	decrementFoursCount : function(){
		var foursCount = this.get("foursCount");
		this.set("foursCount", foursCount-1);
	},

	updateTotal : function(){
		var sum = 0;
		try{
			sum = this.makeReadable(this.get("solution"));
			sum = eval(sum);
			sum = Number(sum.toFixed(2));
		}
		catch(e){
			sum = 0;
		}
		this.set("total", (sum));
	},

	makeReadable : function(original){
		if(original === "")
			return 0;
		this.result = original.replace(/·/g,".");
		this.result = this.result.replace(/÷/g,"/");
		this.result = this.result.replace(/×/g,"*");
		return this.result;
	},

	cleanUp : function(){
		this.set("solution", "");
		this.set("total", 0);
		this.set("foursCount", 0);
		$( ".icon-four-key" ).removeClass( "gray" );
	}
});

app.ModalModel = Backbone.Model.extend({

});

app.ModalView = Backbone.View.extend({

	events: {
		"click" : "triggerEventOnParentView"
	},

	initialize: function() {
		_.bindAll(this, "render");
		this.template = _.template($("#modal-template").html());

		if(localStorage.getItem( 'modal' ) !== null){
			var modal = JSON.parse( localStorage.getItem( 'modal' ));
			this.model = new app.ModalModel({
				'title'			: modal.title,
				'content' 		: modal.content,
				'isTutorialMsg' : modal.isTutorialMsg 
			});
		}
		else{
			this.model = new app.ModalModel({
				'title'			: 'Welcome',
				'content' 		: 	'<div class="tutorial-top">Rules:</div>'+
									'<div class="rule modal-msg">1. Use the number <br><i class="icon-four-key"></i><br>four times!</div>'+
									'<div class="rule modal-msg">2. Use the number <br><i class="icon-four-key"></i><br>four times!!</div>'+
									'<div class="rule modal-msg">3. Use the number <br><i class="icon-four-key"></i><br>four times!!!</div>'+
									'<div class="rule modal-msg">Simples.... right?</div>',
				'isTutorialMsg' : true 
			});
		}

	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents();

		if(this.model.get("isTutorialMsg")){
			this.$( "#modal-content" ).removeClass( "strikethrough" ).addClass( "info-message" );			
			this.startMessageRelay();
		}
		else
			this.$( "#modal-content" ).removeClass( "info-message" ).addClass( "strikethrough" );
		return this;
	},

	startMessageRelay: function() {
		var rules = this.$(".rule");
		var heading = this.$(".tutorial-top");
	    var ruleIndex = -1;
	    
	    function showNextRule() {
	    	++ruleIndex;
	        if(ruleIndex < rules.length-2)
		        rules.eq(ruleIndex % rules.length)
		    		.fadeIn(1500)
		            .delay(1000)
		            .fadeOut(1500, showNextRule);
		    else if (ruleIndex === 2) {
		    	rules.eq(ruleIndex % rules.length)
		    		.fadeIn(1500)
		            .delay(1000)
		            .fadeOut(1500);
		    	heading	
		    		.delay(2500)	    		
		            .fadeOut(1500, showNextRule);
		        }
	        else{
	        	heading.css( "color", "white" );
	        	heading.css( "display", "block" );
		        rules.eq(ruleIndex % rules.length)
	            	.fadeIn(2000);
	        }
    	}
    
    setTimeout(showNextRule, 1000);
	},

	close: function() {
		this.$el.hide();
	},

	open: function() {
		this.$el.show();
	},

	triggerEventOnParentView: function(){
		this.trigger("clicked:modal");
	},

	setModel: function(model){
		this.model = model;
		localStorage.setItem( 'modal', JSON.stringify(this.model));
		this.render();
	}

});

app.PlayScreenView = Backbone.View.extend({
	tagName: "div",
	id: "play-screen",

	initialize: function(){
		_.bindAll(this, "render");
		this.template = _.template($("#sol-template").html());

		this.buttonsView = new app.ButtonsView();

		this.modalView = new app.ModalView();
		this.listenTo(this.modalView, "clicked:modal", this.onModalClickedSetNextState);

		this.solutionView = new app.SolutionView();
		this.solutionView.listenTo(this.buttonsView, "clicked:button", this.solutionView.onButtonClickUpdateSolution);

		this.headerView = new app.HeaderView();
		this.headerView.listenTo(this.solutionView, "change:total", this.headerView.onTotalChangeCheckSolved);

		this.listenTo(this.headerView, "solved:puzzle", this.onPuzzleSolvedSetNextState);

		if(localStorage.getItem( 'levelManagementModel' ) !== null){
			var levelManagementModel = JSON.parse( localStorage.getItem( 'levelManagementModel' ));
			this.model = new app.LevelManagementModel({
				"level" : levelManagementModel.level,
				"modal" : levelManagementModel.modal,
				"mode"	: levelManagementModel.mode
			});

			if(this.model.get("modal") === 0 )
				this.modalView.$el.css( "display", "none");
		}
		else{
			this.model = new app.LevelManagementModel({
				"level" : 0,
				"modal" : 1,
				"mode"	: "tutorial"
			});
		}
	},

	render: function(){
		this.$el.empty();
		this.$el.append(this.modalView.render().el,
						this.headerView.render().el,
						this.solutionView.render().el,
						this.buttonsView.render().el);
		return this;
	},

	onPuzzleSolvedSetNextState: function(){
		this.model.set('modal', 1);
		var modalModel = this.model.getNextModalModel();
		this.modalView.setModel(modalModel);
		localStorage.setItem( 'levelManagementModel', JSON.stringify(this.model));
		this.modalView.open();
	},

	onModalClickedSetNextState: function(){
		if(this.model.isTutorialsLastModal()){
			this.model.finishTutorial();

			this.headerView.setTarget(1);
			this.solutionView.clearView();
			this.modalView.close();
		}
		else if(this.model.isAnotherModal()){
			this.model.incrementModal();
			var modalModel = this.model.getNextModalModel();
			this.modalView.setModel(modalModel);
			var targetNumber = this.model.getNextTarget()
			this.headerView.setTarget(targetNumber);
		}
		else{
			//setup next modal
			this.model.set('modal', 0);
			this.model.incrementLevel();
			if(this.model.get('mode') != "tutorial"){
				var targetNumber = this.model.getNextTarget()
				this.headerView.setTarget(targetNumber);
			}
			this.solutionView.clearView();
			this.modalView.close();
		}
		localStorage.setItem( 'levelManagementModel', JSON.stringify(this.model));
	}
});

app.HeaderView = Backbone.View.extend({

	tagName: "div",
	id: "header",

	events: {
		"click #home": "homeMenu"
	},

	initialize: function(){
		_.bindAll(this, "render");
		if(localStorage.getItem( 'target' ) !== null){
			var target = JSON.parse( localStorage.getItem( 'target' ));
			this.model = new app.HeaderModel({"target": target});
		}
		else
			this.model = new app.HeaderModel({"target": 16});
		this.model.on("change:target", this.render);
		this.template = _.template($("#header-template").html());
	},

	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);

		this.delegateEvents();
		return this;
	},

	homeMenu: function (){
		app.router.navigate("", true);
	},

	onTotalChangeCheckSolved : function(currentTotal){
		if(this.model.isPuzzleSolved(currentTotal))
			this.trigger("solved:puzzle");
	},

	setTarget : function(newTarget){
		this.model.set("target", newTarget);
		localStorage.setItem( 'target', JSON.stringify(newTarget));
	}
});

app.SolutionView = Backbone.View.extend({

	tagName: "div",
	id: "sol-container",

	initialize: function(){
		_.bindAll(this, "render", "onButtonClickUpdateSolution");
		this.model = new app.SolutionModel({
			"solution" : "",
			"foursCount" : 0,
			"total" : 0
		});
		this.model.on("change", this.render);
		this.template = _.template($("#sol-template").html());
	},

	render: function (){
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	},

	onButtonClickUpdateSolution: function(keyPressed){
		if(keyPressed === "<<")
			this.model.removeLastCharacter();
		else if(keyPressed === "4" && this.model.isFour4sUsed())
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

app.ButtonsView = Backbone.View.extend({
	tagName: "div",
	id: "buttons",

	events : {
		"click .button": "onButtonClickPassKey"
	},

	initialize : function(){
		_.bindAll(this, "render");
		this.template = _.template($("#buttons-template").html());
	},

	render : function(){
		$(this.el).html(this.template);
		this.delegateEvents();
		return this;
	},

	onButtonClickPassKey: function(event){
		var source = event.target.className;
		var keyPressed = this.getKeyPressed(source);
		this.trigger("clicked:button", keyPressed);
	},

	getKeyPressed : function(input){
		if(input.indexOf("four") != -1)
			return "4";
		else if(input.indexOf("plus") != -1)
			return "+";
		else if(input.indexOf("minus") != -1)
			return "-";
		else if(input.indexOf("dot") != -1)
			return ".";
		else if(input.indexOf("mutliply") != -1)
			return "×";
		else if(input.indexOf("divide") != -1)
			return "÷";
		else if(input.indexOf("left") != -1)
			return "(";
		else if(input.indexOf("right") != -1)
			return ")";
		else if(input.indexOf("back") != -1)
			return "<<";
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

	initialize: function(){
		this.playScreenView = new app.PlayScreenView();
		this.homeScreenView = new app.HomeScreenView();
	},

	routes: {
		"" : "home",
		"play" : "play"
	},

	home:function() {

		var content = $('#four4sApp');
		content.empty();

		content.append(this.homeScreenView.render().el);
		this.playScreenView.delegateEvents();
	},

	play:function(){
		var content = $("#four4sApp");
		content.empty();
		content.append(this.playScreenView.render().el);
		this.homeScreenView.delegateEvents();
	}
});

changecss = function (theClass,element,value) {
    //http://www.shawnolson.net/a/503/altering-css-class-attributes-with-javascript.html
    var cssRules;


    for (var S = 0; S < document.styleSheets.length; S++){


    	try{
    		document.styleSheets[S].insertRule(theClass+" { "+element+": "+value+"; }",document.styleSheets[S][cssRules].length);

    	} catch(err){
    		try{document.styleSheets[S].addRule(theClass,element+": "+value+";");

	    	}catch(err){

	    		try{
	    			if (document.styleSheets[S]["rules"]) {
	    				cssRules = "rules";
	    			} else if (document.styleSheets[S]["cssRules"]) {
	    				cssRules = "cssRules";
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
	var bodyHeight = $("body").height();
	var bodyWidth = $("body").width();

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
	changecss("#hint","width",hintOptionWidth+"px");
	changecss("#home","width",homeOptionWidth+"px");
	changecss("#target","width",headerTotalWidth+"px");
	changecss(".fa, #target","margin-top",iconsmarginTop+"px");
	changecss("#home, #hint, #target","font-size",headerFontSize+"px");

	/* Home Screen */
	var menuOptionHeight = $("body").height()*0.08;
	var menuOptionFontSize = $("body").height()*0.033;
	menuOptionHeight = Math.round(menuOptionHeight * 100) / 100;
	menuOptionFontSize = Math.round(menuOptionFontSize * 100) / 100;
	changecss(".leftside-edge, .rightside-edge","width",menuOptionHeight+"px");
	changecss(".menu-option","margin-left",(-menuOptionHeight/2)+"px");
	changecss(".menu-option","margin-right",(-menuOptionHeight/2)+"px");
	changecss(".menu-option","font-size",menuOptionFontSize+"px");

	/* Solution */
	var marginTop = bodyHeight*0.1;
	var marginBottom = bodyHeight*0.025;
	var solutionFontSize = bodyHeight*0.055;
	var totalFontSize = bodyHeight*0.13;
	marginTop = Math.round(marginTop * 100) / 100;
	marginBottom = Math.round(marginBottom * 100) / 100;
	solutionFontSize = Math.round(solutionFontSize * 100) / 100;
	totalFontSize = Math.round(totalFontSize * 100) / 100;
	changecss("#sol-container","margin-top",marginTop+"px");
	changecss("#solution","margin-bottom",marginBottom+"px");
	changecss("#solution","font-size",solutionFontSize+"px");
	changecss("#total","font-size",totalFontSize+"px");


	/* Modal */        
	var modalFontSize = 0.07*bodyHeight;
	var modalMarginTop = 0.04 * bodyHeight;
	var strikeThroughMarginTop = 0.085 * bodyHeight;
	var strikeThroughFontSize = 0.27 * bodyHeight;
	var tutorialTextMarginTop = 0.035 * bodyHeight;
	var tutorialFontSize =  0.05*bodyHeight;
	var longTutorialTextMarginTop1 = 0.066 * bodyHeight;
	var longTutorialTextMarginTop2 = 0.026 * bodyHeight;
	var longTutorialFontSize =  0.0375*bodyHeight;
	var longBulbFont =  0.05*bodyHeight;
	var longBulbMarginTop =  0.0166*bodyHeight;
	var smileyFontSize =  0.09 * bodyHeight;
	var completeFontSize =  0.11 * bodyHeight;
	var plusFontSize =  0.05 * bodyHeight;
	modalFontSize = Math.round(modalFontSize * 100) / 100;
	modalMarginTop = Math.round(modalMarginTop * 100) / 100;
	strikeThroughMarginTop = Math.round(strikeThroughMarginTop * 100) / 100;
	strikeThroughFontSize = Math.round(strikeThroughFontSize * 100) / 100;

	changecss(".modal-header","font-size",modalFontSize+"px");
	changecss(".modal-header","margin-top",modalMarginTop+"px");
	changecss(".strikethrough","margin-top",strikeThroughMarginTop+"px");
	changecss(".strikethrough","font-size",strikeThroughFontSize+"px");
	changecss(".modal-msg, .tutorial-top","margin-top",tutorialTextMarginTop+"px");
	changecss(".long-msg .modal-msg ","margin-top",longTutorialTextMarginTop2+"px");
	changecss(".long-msg .top ","margin-top",longTutorialTextMarginTop1+"px");
	changecss(".modal-msg, .tutorial-top","font-size",tutorialFontSize+"px");
	changecss(".long-msg .modal-msg","font-size",longTutorialFontSize+"px");
	changecss(".modal-msg i","font-size", (tutorialFontSize+2)+"px");
	changecss(".long-msg .modal-msg i","font-size", longBulbFont+"px");
	changecss(".modal-msg i","line-height", "1.3");
	changecss(".modal-msg i","margin-top", "0px");
	changecss(".long-msg .modal-msg i","margin-top", longBulbMarginTop+"px");
	changecss(".modal-msg .fa-smile-o", "font-size", smileyFontSize+"px");
	changecss(".modal-msg .fa-check-square-o", "font-size", completeFontSize+"px");
	changecss(".modal-msg .fa-check-square-o", "margin-top", -(tutorialTextMarginTop/2)+"px");
	changecss(".modal-msg .icon-plus-key", "font-size", plusFontSize+"px");

	/* Symbol */
	var diameter = 0.1 * bodyHeight;
	var marginTop = 0.04 * bodyHeight;
	diameter = Math.round(diameter * 100) / 100;
	marginTop = Math.round(marginTop * 100) / 100;
	changecss(".button","font-size",diameter+"px");
	changecss(".button","margin-top",marginTop+"px");

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

	window.addEventListener("load", function() {
		FastClick.attach(document.body);
	}, false);

	calculateStylesheetProperties();
	app.router = new Router();
	Backbone.history.start();
});

