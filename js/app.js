﻿var app = app || {};
var rootIcon = '<span class="icon-drawing"></span>';

app.LevelManagementModel = Backbone.Model.extend({
	
	isTutorialsLastModal : function(){
		return (this.get('level') === 2 && this.get('modal') === 2 && this.get('mode') === "tutorial") 
	},

	isAnotherModal : function(){
		if (this.get('mode') === "puzzle"){
			if(this.get('level') === 21 && this.get('modal') < 5)
				return true;
			return false;
		}			
		else if(this.get('level') === 0 && this.get('modal') === 1)
			return true;
		else if(this.get('level') === 0 && this.get('modal') === 2)
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
			if(this.get('level') === 0 && this.get('modal') === 1){
							return new app.ModalModel({
							'title'			: 'Rules',
							'content' 		: 	'<div class="modal-msg">Use the number</div>'+
												'<div class="modal-msg">4 four times</div>'+
												'<div class="modal-msg fours"><i class="icon-four-key"></i><i class="icon-four-key"></i><i class="icon-four-key"></i><i class="icon-four-key"></i></div>',
							'isTutorialMsg' : true 
						});
			}

			else if(this.get('level') === 0 && this.get('modal') === 2){
				return new app.ModalModel({
							'title'			: 'Tutorial 1',
							'content' 		: '<div>'+
											  '<div class="modal-msg">Create the above <br>target </div>'+
											  '<div class="modal-msg target-text">16</div>'+
											  '</div>',
							'isTutorialMsg' : true 
						});
			}
			else if(this.get('level') === 0 && this.get('modal') === 3){
				return new app.ModalModel({
							'title'			: 'Tutorial 1',
							'content' 		: '<div>'+
											  '<div class="modal-msg">Need a hint?</div>'+
											  '<div class="modal-msg">Click the icon</div>'+
											  '<div class="modal-msg"><i class="icon-lightbuilb"></i></div>'+
											  '</div>',
							'isTutorialMsg' : true 
						});
			}
			else if(this.get('level') === 1 && this.get('modal') === 1){
				return new app.ModalModel({
							'title'			: 'Tutorial 1',
							'content' 		: '<div class="modal-msg">You have completed </div>'+
											  '<div class="modal-msg">your first puzzle</div>'+
											  '<div class="modal-msg"><i class="icon-smile"></i></div>',
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
											  '<div class="modal-msg"><i class="icon-check"></i></div>',
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
		else if(this.get('level' ) === 21 && this.get('modal') === 1){
			return new app.ModalModel({
				'title'			: 'Success',
				'content' 		: 21,
				'isTutorialMsg' : false 
			});
		}
		else if(this.get('level' ) === 21 && this.get('modal') === 2){
			return new app.ModalModel({
				'title'			: 'New Operators',
				'content' 		: '<div class="modal-msg">You now have some <br> extra operators to <br> help you!!</div>' +
								  '<div class="modal-msg new-symbols"><i class="icon-factorial-key"></i><i class="icon-power-key"></i><i class="icon-square-key"></i></div>',
				'isTutorialMsg' : true 
			});
		}
		else if(this.get('level' ) === 21 && this.get('modal') === 3){
			return new app.ModalModel({
				'title'			: 'New Operator',
				'content' 		: 	'<div class="modal-msg new-symbol"><i class="icon-factorial-key"></i></div>'+
									'<div class="modal-msg symbol-explain extra-modal-msg">4! = 4×3×2×1 <br>4!! = 8×6×4×2</div>',
				'isTutorialMsg' : true 
			});
		}
		else if(this.get('level' ) === 21 && this.get('modal') === 4){
			return new app.ModalModel({
				'title'			: 'New Operator',
				'content' 		: 	'<div class="modal-msg new-symbol"><i class="icon-power-key"></i></div>'+
									'<div class="modal-msg symbol-explain">4<sup>4</sup> = 4×4×4×4</div>',
				'isTutorialMsg' : true 
			});
		}
		else if(this.get('level' ) === 21 && this.get('modal') === 5){
			return new app.ModalModel({
				'title'			: 'New Operator',
				'content' 		: 	'<div class="modal-msg new-symbol"><i class="icon-square-key"></i></div>'+
									'<div class="modal-msg symbol-explain">'+rootIcon+'4 = 2</div>',
				'isTutorialMsg' : true 
			});
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

app.LocalStorageModel = Backbone.Model.extend({

	read : function(key){
		var mode = this.get('mode');
		return JSON.parse( localStorage.getItem(mode +'-' + key));
	},

	write : function(key, model){
		var mode = this.get('mode');
		localStorage.setItem( mode +'-' + key, JSON.stringify(model));
	}
})

app.SolutionModel = Backbone.Model.extend({


	pow4: "<sup>4</sup>",
	pow44: "<sup>4<sup>4</sup></sup>",
	pow444: "<sup>4<sup>4<sup>4</sup></sup></sup>",
	pow4444: "<sup>4<sup>4<sup>4<sup>4</sup></sup></sup></sup>",

	addCharacter : function(newChar){
		var updatedSolution, supLength;
		var solution = this.get("solution");
		var solutionLength = solution.length;

		if(newChar === rootIcon){
			updatedSolution = this.addSqrt();
		}else if(newChar === this.pow4){
			if(solution.endsWith(this.pow444)){
				supLength = this.pow444.length;
				updatedSolution = solution.substring(0, solutionLength-supLength) + this.pow4444;
			}else if(solution.endsWith(this.pow44)){
				supLength = this.pow44.length;
				updatedSolution = solution.substring(0, solutionLength-supLength) + this.pow444;
			}else if(solution.endsWith(this.pow4)){
				supLength = this.pow4.length;
				updatedSolution = solution.substring(0, solutionLength-supLength) + this.pow44;
			}else{
				updatedSolution = solution + newChar;
			}
		}else{
			updatedSolution =  solution + newChar;
		}
		
		this.set("solution", updatedSolution);
		if(newChar === "4" || newChar === this.pow4)
			this.incrementFoursCount();		
	},

	removeLastCharacter : function(){
		var solution = this.get("solution");
		var solutionLength = solution.length;
		var lastChar = solution.charAt(solution.length-1);
		var removedChar = lastChar;
		var updatedSolution, supLength;

		if(solution.endsWith(this.pow4444)){
			supLength = this.pow4444.length;
			updatedSolution = solution.substring(0, solutionLength-supLength) + this.pow444;
		}else if(solution.endsWith(this.pow444)){
			supLength = this.pow444.length;
			updatedSolution = solution.substring(0, solutionLength-supLength) + this.pow44;
		}else if(solution.endsWith(this.pow44)){
			supLength = this.pow44.length;
			updatedSolution = solution.substring(0, solutionLength-supLength) + this.pow4;
		}else if(solution.endsWith(this.pow4)){
			supLength = this.pow4.length;
			updatedSolution = solution.substring(0, solutionLength-supLength);
		}else if(solution.endsWith(rootIcon)){
			updatedSolution = solution.slice(0,-rootIcon.length);
		}else{
			updatedSolution = solution.slice(0,-1);	
		}
		this.set("solution", updatedSolution);
		if(removedChar === "4" || solution.endsWith("</sup>"))
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
		this.set("total", (sum || 0));
	},

	makeReadable : function(original){
		if(original === "")
			return 0;
		var result = original.replace(/·/g,".");
		result = result.replace(/÷/g,"/");
		result = result.replace(/×/g,"*");
		result = result.replace(/<span class="icon-drawing"><\/span>/g,"Math.sqrt");
		result = result.replace(/(Math.sqrt\([4.]\))/ig,"($1)");
		result = result.replace(/(<sp([^>]+)>)/ig,"");
		result = this.replacePow(result);
		result = this.replaceFactorial(result);
		return result;
	},

	cleanUp : function(){
		this.set("solution", "");
		this.set("total", 0);
		this.set("foursCount", 0);
		$( ".icon-four-key" ).removeClass( "gray" );
	},

	addSqrt : function(){
		var curSolution = this.get("solution");
		var lastChar = curSolution.slice(-1);
		var lastCharPos = curSolution.length - 1;
		var insertAt;

		if(lastChar === ')'){
			var leftBracketIndex = this.findOpenParen(curSolution, lastCharPos);
			if(curSolution.substring(leftBracketIndex - rootIcon.length, leftBracketIndex) === rootIcon){
				curSolution = curSolution.substring(0, leftBracketIndex - rootIcon.length) + rootIcon + "(" + curSolution.substring(leftBracketIndex - rootIcon.length)+ ")";
			}
			else
				curSolution = curSolution.substring(0, leftBracketIndex) + rootIcon + curSolution.substring(leftBracketIndex);
		}else{	
			if(lastChar === '>'){
				var powOpenPos = this.findOpenTag(curSolution, lastCharPos - "</sup>".length);
				if(curSolution.charAt(powOpenPos-1) === ')')
					insertAt = this.findOpenParen(curSolution, powOpenPos-1);
				else
					insertAt = powOpenPos - this.findNumsBeforePos(curSolution, powOpenPos);
			}else{
				insertAt = lastCharPos - this.findNumsBeforePos(curSolution, lastCharPos);
			}
			curSolution = curSolution.substring(0, insertAt) + rootIcon + "(" + curSolution.substring(insertAt) + ")";
		}

		return curSolution; 
	},

	replacePow : function(expression){
		if(expression.indexOf("<") === -1)
			return expression;

		var exponentStartPos, power, exponentEndPos;
		if(expression.indexOf(this.pow444) !== -1){
			power = 64;
			exponentStartPos = expression.indexOf(this.pow444);
			exponentEndPos = exponentStartPos + this.pow444.length;
		}else if(expression.indexOf(this.pow44) !== -1){
			power = 16;
			exponentStartPos = expression.indexOf(this.pow44);
			exponentEndPos = exponentStartPos + this.pow44.length;
		}else{
			power = 4;
			exponentStartPos = expression.indexOf(this.pow4);
			exponentEndPos = exponentStartPos + this.pow4.length;
		}

		var baseEndChar = expression.charAt(exponentStartPos-1);

		var baseStartPos;
		if(baseEndChar === ')'){
			baseStartPos = this.findOpenParen(expression, exponentStartPos-1);
		}else{
			baseStartPos = exponentStartPos - this.findNumsBeforePos(expression, exponentStartPos);
		}
		var sum = expression.substring(baseStartPos, exponentStartPos);
		var result = "(Math.pow(" + sum + ", " + power + "))";
		//expression = expression.substring(0,startPos) + expression.substring(endPos);
		result = expression.substring(0, baseStartPos) + result + expression.substring(exponentEndPos);
		return this.replacePow(result);
	},

	replaceFactorial : function(expression){
		var factorial, factorialEndPos, isDoubleFactorial, result;
		var factorialStartPos = expression.indexOf("!");

		if( factorialStartPos === -1)
			return expression;

		if(expression.indexOf("!!") !== -1){
			factorialStartPos = expression.indexOf("!!");
			factorial = 2;
			factorialEndPos = factorialStartPos + 1;
			isDoubleFactorial = true;
		}else{
			factorial = 1;
			factorialEndPos = factorialStartPos;
			isDoubleFactorial = false;
		}

		var baseEndChar = expression.charAt(factorialStartPos-1);
		var baseStartPos;
		if(baseEndChar === ')'){
			baseStartPos = this.findOpenParen(expression, factorialStartPos-1);
		}else{
			baseStartPos = factorialStartPos - this.findNumsBeforePos(expression, factorialStartPos);
		}
		var sum = expression.substring(baseStartPos, factorialStartPos);
		if(isDoubleFactorial){
			result = "(doubleFactorial(" + sum + "))";
		}else{
			result = "(factorial(" + sum + "))";
		}
		result = expression.substring(0, baseStartPos) + result + expression.substring(factorialEndPos+1);
		return this.replaceFactorial(result);

	},


	findOpenParen : function(expression, closePos){
		var counter = 1;
		for(var i=closePos-1; i>=0; i--){
			var c = expression.charAt(i);
	        if (c === '(')
	            counter--;
	        else if (c === ')')
	            counter++;
	        if(counter === 0)
	        	return i;
		}

		return -1;
	},

	findOpenTag : function(expression, closePos){
		var counter = 1;
		var openTag = '<sup>';
		var closeTag = '</sup>';

		for(var i=closePos-1; i>=0; i--){
	        if (expression.substring(i, i+openTag.length) === openTag)
	            counter--;
	        else if (expression.substring(i, i+closeTag.length) === closeTag)
	            counter++;
	        if(counter === 0)
	        	return i;
		}

		return -1;
	},

	findNumsBeforePos : function(expression, pos){
		var count = 0;
		var c;
		for(var i=pos-1; i>=0; i--){
			c = expression.charAt(i);
			if(c !== '4' && c !== '.' && c !== '!'){
				return count;
			}
			count++;
		}
		return count;
	},

	createRootFormatedSolution : function(){
		var solution = this.get("solution");
		solution = this.addOverlineSpans(solution);
		solution = this.setOverlineFontSize(solution);

		var result = new app.SolutionModel({
			"solution" : solution,
			"foursCount" : 0,
			"total" : this.get("total")
		});

		return result;
	},


	addOverlineSpans : function(expression){
		var rootIndex = expression.indexOf(rootIcon + "(");
		var indexOfLeftBracket = rootIndex + rootIcon.length;
		var indexOfRightBracket = this.findCloseParen(expression, indexOfLeftBracket);
		if(rootIndex === -1 || indexOfRightBracket === -1)
			return expression;
		expression = this.addOverlineSpan(expression, indexOfLeftBracket, indexOfRightBracket);
		return this.addOverlineSpans(expression);
	},

	addOverlineSpan : function(expression, indexOfLeftBracket, indexOfRightBracket){
		var leftSpan = '<span class="overline">';
		var rightSpan = '</span>';
		expression = [expression.slice(0, indexOfRightBracket+1), rightSpan, expression.slice(indexOfRightBracket+1)].join('');
		return	[expression.slice(0, indexOfLeftBracket), leftSpan, expression.slice(indexOfLeftBracket)].join('');
	},

	findCloseParen : function(expression, openPos){
			var counter = 1;
			for(var i=openPos+1; i<expression.length; i++){
				var c = expression.charAt(i);
		        if (c === '(')
		            counter++;
		        else if (c === ')')
		            counter--;
		        if(counter === 0)
		        	return i;
			}

			return -1;
	},

	setOverlineFontSize : function(expression){
		var overlineClass = 'class="overline">';
		var spanIndex = expression.indexOf(overlineClass);
		if(spanIndex === -1)
			return expression;
		var leftBracketIndex = spanIndex + overlineClass.length;
		var depth = this.findRootDepth(expression, leftBracketIndex);
		var insertAt = leftBracketIndex - 2;
		expression = [expression.slice(0, insertAt), (' font-size-' +depth), expression.slice(insertAt)].join('');
		insertAt = spanIndex - 15;
		expression = [expression.slice(0, insertAt), (' font-size-' +depth), expression.slice(insertAt)].join('');
		return this.setOverlineFontSize(expression);
	},

	findRootDepth : function(eq, pos){
		var spanOpenTag = '<span class';
		var spanCloseTag = '</span>';

		var preRootString = eq.substring(0, pos);

		var openSpanTagCount = (preRootString.match(new RegExp(spanOpenTag, "g")) || []).length;
		var closeSpanTagCount = (preRootString.match(new RegExp(spanCloseTag, "g")) || []).length;

		return (openSpanTagCount - closeSpanTagCount);
	}
});

app.ModalModel = Backbone.Model.extend({

});

app.ModalView = Backbone.View.extend({

	events: {
		"click" : "triggerEventOnParentView"
	},

	initialize: function(options) {
		_.bindAll(this, "render");
		this.localStore = options.localstore;
		this.template = _.template($("#modal-template").html());
		var modal = this.localStore.read( 'modal' );
		if(modal !== null){
			this.model = new app.ModalModel({
				'title'			: modal.title,
				'content' 		: modal.content,
				'isTutorialMsg' : modal.isTutorialMsg 
			});
		}
		else{
			this.model = new app.ModalModel({
				'title'			: 'Rules',
				'content' 		: 	'<div class="modal-msg">Use the number</div>'+
									'<div class="modal-msg">4 four times</div>'+
									'<div class="modal-msg fours"><i class="icon-four-key"></i><i class="icon-four-key"></i><i class="icon-four-key"></i><i class="icon-four-key"></i></div>',
				'isTutorialMsg' : true 
			});
		}

	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.delegateEvents();

		if(this.model.get("isTutorialMsg")){
			this.$( "#modal-content" ).removeClass( "strikethrough" ).addClass( "info-message" );
		}
		else
			this.$( "#modal-content" ).removeClass( "info-message" ).addClass( "strikethrough" );
		return this;
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
		this.localStore.write('modal', this.model);
		this.render();
	}

});

app.HintView = Backbone.View.extend({
	tagName: "div",
	id: "hint-container",
	initialize: function(){
		_.bindAll(this, "render");
		this.template = _.template($("#hint-template").html());
		this.model.on("change", this.render);
	},

	render: function(){
		var hintIndex = this.model.get('level')-1;

		var mode = this.model.get('mode');
		if(mode === 'tutorial')
			this.model.set({hintText:tutHints[hintIndex]});
		else
			this.model.set({hintText:hints[hintIndex]});		
		
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

app.LevelChooserView = Backbone.View.extend({
	tagName: "div",
	id: "level-chooser-page",

	 events: {
        'mouseup .icon-arrow-up': 'upArrowOnmouseup',
        'mousedown .icon-arrow-up': 'upArrowOndblclick',
        'mouseup .icon-arrow-down': 'downArrowOnmouseup',
        'mousedown .icon-arrow-down': 'downArrowOndblclick',
        'touchend .icon-arrow-up': 'upArrowOnmouseup',
        'touchstart .icon-arrow-up': 'upArrowOndblclick',
        'touchend .icon-arrow-down': 'downArrowOnmouseup',
        'touchstart .icon-arrow-down': 'downArrowOndblclick',
        'touchend #choose-level': 'upChooselevel',
        'mouseup #choose-level': 'upChooselevel',
        "click .icon-home": "homeMenu"
    },

	initialize: function(options){
		_.bindAll(this, "render");
		this.model = new Backbone.Model({ level: 1 });
		this.template = _.template($("#level-manager-template").html());
	},

	upArrowOnmouseup: function() {
        clearTimeout(to);
        clearInterval(lint);
        this.model.set('level', temp);
    },    
    upArrowOndblclick: function() {
    	var that = this;
    	temp = this.model.get('level');
    	to = null;
    	lint = null;

    	temp++;
        $("#level-chooser").html(temp);
        to = setTimeout(function () {
            lint = setInterval(function () {
                temp+=2;
                $("#level-chooser").html(temp);
            }, 75);
        }, 500);
    },

    downArrowOnmouseup: function() {
        clearTimeout(to2);
        clearInterval(lint2);
        this.model.set('level', temp);
    },    
    downArrowOndblclick: function() {
    	var that = this;
    	temp = this.model.get('level');
    	to2 = null;
    	lint2 = null;

    	if( temp > 1 )
    		temp--;
        $("#level-chooser").html(temp);
        to2 = setTimeout(function () {
            lint2 = setInterval(function () {
            	if( temp > 2 )
                	temp-=2;
                $("#level-chooser").html(temp);
            }, 75);
        }, 500);
    },

    upChooselevel: function(){
    	app.router.navigate("single-play", true);
    },

	render: function (){
	    var model = this.model;
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	},

	homeMenu: function (){
		app.router.navigate("", true);
	}
})

app.PlayScreenView = Backbone.View.extend({
	tagName: "div",
	id: "play-screen",

	initialize: function(options){
		_.bindAll(this, "render");
		this.template = _.template($("#sol-template").html());		
		this.localStore = new app.LocalStorageModel({mode : options.mode});

		this.buttonsView = new app.ButtonsView({localstore : this.localStore});

		this.modalView = new app.ModalView({localstore : this.localStore});
		this.listenTo(this.modalView, "clicked:modal", this.onModalClickedSetNextState);

		this.solutionView = new app.SolutionView();
		this.solutionView.listenTo(this.buttonsView, "clicked:button", this.solutionView.onButtonClickUpdateSolution);

		this.headerView = new app.HeaderView({localstore : this.localStore});
		this.headerView.listenTo(this.solutionView, "change:total", this.headerView.onTotalChangeCheckSolved);

		this.listenTo(this.headerView, "solved:puzzle", this.onPuzzleSolvedSetNextState);

		var  levelManagementModel = this.localStore.read( 'levelManagementModel' );
		if(levelManagementModel !== null){
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
		this.hintView = new app.HintView({model: this.model});
	},

	render: function(){
		this.$el.empty();
		this.$el.append(this.modalView.render().el,
						this.headerView.render().el,
						this.hintView.render().el,
						this.solutionView.render().el,
						this.buttonsView.render().el);

		if( this.model.get('level') > 21  && this.model.get('mode') != "tutorial")
			this.buttonsView.showExtraButtons();

		return this;
	},

	onPuzzleSolvedSetNextState: function(){
		this.model.set('modal', 1);
		var modalModel = this.model.getNextModalModel();
		this.modalView.setModel(modalModel);
		this.localStore.write('levelManagementModel', this.model);
		this.modalView.open();
	},

	onModalClickedSetNextState: function(){
		if(this.localStore.get('mode') != 'play'){
			app.router.navigate("level-chooser", true);
		}
		else if(this.model.isTutorialsLastModal()){
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
			if(this.model.get('level') === 22){
				this.buttonsView.showExtraButtons();
			}
			if(this.model.get('mode') != "tutorial"){
				var targetNumber = this.model.getNextTarget()
				this.headerView.setTarget(targetNumber);
			}
			this.solutionView.clearView();
			this.modalView.close();
		}
		this.localStore.write('levelManagementModel', this.model);
	},

	setupSingleLevel: function(level){
		this.model = new app.LevelManagementModel({
				"level" : level,
				"modal" : 0,
				"mode"	: "single-play"
			});

		this.headerView.setTarget(level);
		this.modalView.close();
		this.hintView = new app.HintView({model: this.model});

		this.buttonsView = new app.ButtonsView({localstore : this.localStore});
		this.solutionView.listenTo(this.buttonsView, "clicked:button", this.solutionView.onButtonClickUpdateSolution);
		this.solutionView.model.cleanUp();

		if( level > 21 )
			this.buttonsView.showExtraButtons();
	}
});

app.HeaderView = Backbone.View.extend({

	tagName: "div",
	id: "header",

	events: {
		"click .icon-home": "homeMenu",
		"click .icon-lightbuilb": "hint"
	},

	initialize: function(options){
		_.bindAll(this, "render");
		this.localStore = options.localstore;
		var target = this.localStore.read('target');
		if( target !== null){
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
		this.localStore.write('target', newTarget);
	},

	hint : function(){
       	var heading = $(".hint-box");
       	if(heading.css('display') == 'block'){
          	heading.stop(true, true);
          	heading.css({ display: 'none'});
      	}
        heading.fadeIn(1500).delay(4500).fadeOut(1500);
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

app.ButtonsView = Backbone.View.extend({
	tagName: "div",
	id: "buttons",

	events : {
		"click .button": "onButtonClickPassKey"
	},

	initialize : function(options){
		_.bindAll(this, "render");
		var target = options.localstore.read('target');
		var model = options.localstore.read("levelManagementModel");
		if(target<22 || model == null || model.mode == 'tutorial')
			this.template = _.template($("#buttons-template").html());
		else			
			this.showExtraButtons();
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
		else if(input.indexOf("factorial") != -1)
			return "!";
		else if(input.indexOf("power") != -1)
			return "<sup>4</sup>";
		else if(input.indexOf("square") != -1)
			return rootIcon;
		else if(input.indexOf("back") != -1)
			return "<<";
	},

	showExtraButtons : function(){
		this.template = _.template($("#plus-21-buttons-template").html());
		this.render();
	}
});

app.HomeScreenView  = Backbone.View.extend({

	tagName: 'div',
	id: 'home-screen',
	events: {
		"click #exit": "exit",
		"click #option-play": "play",
		"click #option-play-level": "levelChooser"
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
	},

	levelChooser: function(){
		app.router.navigate("level-chooser", true);
	}
});

Router = Backbone.Router.extend({

	initialize: function(){
		this.playScreenView = new app.PlayScreenView({mode : 'play'});
		this.singlePlayView = new app.PlayScreenView({mode : 'single-play'});
		this.homeScreenView = new app.HomeScreenView();
		this.levelChooserView = new app.LevelChooserView({singlePlayView : this.singlePlayView});
	},

	routes: {
		"" : "home",
		"play" : "play",
		"single-play" : "singlePlay",
		"level-chooser" : "levelChooser"
	},

	home:function() {

		var content = $('#four4sApp');
		content.empty();

		content.append(this.homeScreenView.render().el);
		this.homeScreenView.delegateEvents();
	},

	play:function(){
		var content = $("#four4sApp");
		content.empty();
		content.append(this.playScreenView.render().el);
		this.playScreenView.delegateEvents();
	},

	singlePlay:function(){
		var	level = this.levelChooserView.model.get("level");
		this.singlePlayView.setupSingleLevel(level);

		var content = $("#four4sApp");
		content.empty();
		content.append(this.singlePlayView.render().el);
		this.singlePlayView.delegateEvents();
	},

	levelChooser:function(){
		var content = $("#four4sApp");
		content.empty();
		content.append(this.levelChooserView.render().el);
		this.levelChooserView.delegateEvents();
	}
});

gama = function(z) {

	var g = 7;
	var C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,771.32342877765313, 
	-176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    else {
        z -= 1;

        var x = C[0];
        for (var i = 1; i < g + 2; i++)
        x += C[i] / (z + i);

        var t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
    }
};

factorial = function(input){
	return gama(input+1);
},

doubleFactorial  = function(input){
	var a = Math.pow(2,(input/2));
	var b =  Math.pow(Math.PI/2,((1/4) * (Math.cos(Math.PI * input) - 1)));
	var g = gama(input/2 + 1);
	return (a * b * g);
},

backbuttonPressed = function(){
	var model = app.router.playScreenView.model;
	var modalNum = model.get('modal');
	var level = model.get('level');
	var mode = model.get('mode');
	var modal = app.router.playScreenView.model.get('modal');

	if( modalNum > 1){
		model.set('modal',modal-1);
		var nextmodal = model.getNextModalModel();
		app.router.playScreenView.modalView.setModel(nextmodal);
	}else if(modalNum === 0){
		if(mode === "tutorial" && level === 1){
			model.set('modal',3);
			model.set('level',0);
		}else if(mode === "tutorial" && level === 2){
			model.set('modal',2);
			model.set('level',1);
		}else if(mode === "puzzle" && level === 1){
			model.set('modal',2);
			model.set('level',2);
			model.set('mode',"tutorial");
		}else if(mode === "puzzle" && level === 22){
			model.set('modal',5);
			model.set('level',21);	
		}else
			return;
		var nextmodal = model.getNextModalModel();
		app.router.playScreenView.modalView.setModel(nextmodal);
		app.router.playScreenView.modalView.open();
	}
}

$(function() {
	Backbone.View = (function(View) {
		return View.extend({
			constructor: function(options) {
				this.options = options || {};
				View.apply(this, arguments);
			}
		});
	})(Backbone.View);

	if (!String.prototype.endsWith) {
  		Object.defineProperty(String.prototype, 'endsWith', {
    		enumerable: false,
    		configurable: false,
    		writable: false,
    		value: function (searchString, position) {
		      position = position || this.length;
		      position = position - searchString.length;
		      var lastIndex = this.lastIndexOf(searchString);
		      return lastIndex !== -1 && lastIndex === position;
    		}
  	});
}

	window.addEventListener("load", function() {
		FastClick.attach(document.body);
	}, false);

	app.router = new Router();
	Backbone.history.start();

	document.addEventListener("backbutton", backbuttonPressed, false);
});
