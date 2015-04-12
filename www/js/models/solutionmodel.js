define([
    'backbone'

], function(Backbone) {	

	SolutionModel = Backbone.Model.extend({


		pow4: "<sup>4</sup>",
		pow44: "<sup>4<sup>4</sup></sup>",
		pow444: "<sup>4<sup>4<sup>4</sup></sup></sup>",
		pow4444: "<sup>4<sup>4<sup>4<sup>4</sup></sup></sup></sup>",
		rootIcon: '<span class="icon-drawing"></span>',

		addCharacter : function(newChar){
			var updatedSolution, supLength;
			var solution = this.get("solution");
			var solutionLength = solution.length;

			if(newChar === this.rootIcon){
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
			}else if(solution.endsWith(this.rootIcon)){
				updatedSolution = solution.slice(0,-this.rootIcon.length);
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
				if(curSolution.substring(leftBracketIndex - this.rootIcon.length, leftBracketIndex) === this.rootIcon){
					curSolution = curSolution.substring(0, leftBracketIndex - this.rootIcon.length) + this.rootIcon + "(" + curSolution.substring(leftBracketIndex - this.rootIcon.length)+ ")";
				}
				else
					curSolution = curSolution.substring(0, leftBracketIndex) + this.rootIcon + curSolution.substring(leftBracketIndex);
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
				curSolution = curSolution.substring(0, insertAt) + this.rootIcon + "(" + curSolution.substring(insertAt) + ")";
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
				result = "(this.doubleFactorial(" + sum + "))";
			}else{
				result = "(this.factorial(" + sum + "))";
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

			var result = new SolutionModel({
				"solution" : solution,
				"foursCount" : 0,
				"total" : this.get("total")
			});

			return result;
		},


		addOverlineSpans : function(expression){
			var rootIndex = expression.indexOf(this.rootIcon + "(");
			var indexOfLeftBracket = rootIndex + this.rootIcon.length;
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
		},

		gama : function(z) {

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
		},

		factorial : function(input){
			return this.gama(input+1);
		},

		doubleFactorial  : function(input){
			var a = Math.pow(2,(input/2));
			var b =  Math.pow(Math.PI/2,((1/4) * (Math.cos(Math.PI * input) - 1)));
			var g = this.gama(input/2 + 1);
			return (a * b * g);
		}
	});

	return SolutionModel;
});