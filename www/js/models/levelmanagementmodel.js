define([
    'backbone',
    'models/modalmodel'

], function(Backbone, ModalModel) {

	LevelManagementModel = Backbone.Model.extend({
		
		rootIcon: '<span class="icon-drawing"></span>',

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
								return new ModalModel({
								'title'			: 'Rules',
								'content' 		: 	'<div class="modal-msg">Use the number</div>'+
													'<div class="modal-msg">4 four times</div>'+
													'<div class="modal-msg fours"><i class="icon-four-key"></i><i class="icon-four-key"></i><i class="icon-four-key"></i><i class="icon-four-key"></i></div>',
								'isTutorialMsg' : true 
							});
				}

				else if(this.get('level') === 0 && this.get('modal') === 2){
					return new ModalModel({
								'title'			: 'Tutorial 1',
								'content' 		: '<div>'+
												  '<div class="modal-msg">Create the above <br>target </div>'+
												  '<div class="modal-msg target-text">16</div>'+
												  '</div>',
								'isTutorialMsg' : true 
							});
				}
				else if(this.get('level') === 0 && this.get('modal') === 3){
					return new ModalModel({
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
					return new ModalModel({
								'title'			: 'Tutorial 1',
								'content' 		: '<div class="modal-msg">You have completed </div>'+
												  '<div class="modal-msg">your first puzzle</div>'+
												  '<div class="modal-msg"><i class="icon-smile"></i></div>',
								'isTutorialMsg' : true 
							});
				}
				else if(this.get('level') === 1 && this.get('modal') === 2){
					return new ModalModel({
								'title'			: 'Tutorial 2',
								'content' 		: '<div class="modal-msg">Operators like <i class="icon-plus-key"></i>'+
												  '<br>are great</div>'+
												  '<div class="modal-msg">But not always'+
												  '<br>needed!</div>',
								'isTutorialMsg' : true 
							});
				}
				else if(this.get('level') === 2 && this.get('modal') === 1){
					return new ModalModel({
								'title'			: 'Tutorial End',
								'content' 		: '<div class="modal-msg">You have completed</div>'+
												  '<div class="modal-msg">the tutorial</div>'+
												  '<div class="modal-msg"><i class="icon-check"></i></div>',
								'isTutorialMsg' : true 
							});
				}
				else if(this.get('level') === 2 && this.get('modal') === 2){
					return new ModalModel({
								'title'			: 'Game On',
								'content' 		: '<div class="modal-msg">For each puzzle</div>'+
												  '<div class="modal-msg">solved the target</div>'+ 
												  '<div class="modal-msg">will increase by 1</div>',
								'isTutorialMsg' : true 
							});
				}
			}	
			else if(this.get('level' ) === 21 && this.get('modal') === 1){
				return new ModalModel({
					'title'			: 'Success',
					'content' 		: 21,
					'isTutorialMsg' : false 
				});
			}
			else if(this.get('level' ) === 21 && this.get('modal') === 2){
				return new ModalModel({
					'title'			: 'New Operators',
					'content' 		: '<div class="modal-msg">You now have some <br> extra operators to <br> help you!!</div>' +
									  '<div class="modal-msg new-symbols"><i class="icon-factorial-key"></i><i class="icon-power-key"></i><i class="icon-square-key"></i></div>',
					'isTutorialMsg' : true 
				});
			}
			else if(this.get('level' ) === 21 && this.get('modal') === 3){
				return new ModalModel({
					'title'			: 'New Operator',
					'content' 		: 	'<div class="modal-msg new-symbol"><i class="icon-factorial-key"></i></div>'+
										'<div class="modal-msg symbol-explain extra-modal-msg">4! = 4×3×2×1 <br>4!! = 8×6×4×2</div>',
					'isTutorialMsg' : true 
				});
			}
			else if(this.get('level' ) === 21 && this.get('modal') === 4){
				return new ModalModel({
					'title'			: 'New Operator',
					'content' 		: 	'<div class="modal-msg new-symbol"><i class="icon-power-key"></i></div>'+
										'<div class="modal-msg symbol-explain">4<sup>4</sup> = 4×4×4×4</div>',
					'isTutorialMsg' : true 
				});
			}
			else if(this.get('level' ) === 21 && this.get('modal') === 5){
				return new ModalModel({
					'title'			: 'New Operator',
					'content' 		: 	'<div class="modal-msg new-symbol"><i class="icon-square-key"></i></div>'+
										'<div class="modal-msg symbol-explain">'+this.rootIcon+'4 = 2</div>',
					'isTutorialMsg' : true 
				});
			}
			else {
				return new ModalModel({
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

	return LevelManagementModel;
});