define([
    'backbone',
    'models/localstorage',
    'models/levelmanagementmodel',
    'views/buttonsview',
    'views/modalview',
    'views/solutionview',
    'views/headerview',
    'views/hintview',
    'text!../../templates/solution.html'

], function(Backbone, LocalStorageModel, LevelManagementModel, ButtonsView, ModalView, SolutionView, HeaderView,
			HintView, solutionTemplate) {

	PlayScreenView = Backbone.View.extend({
		tagName: "div",
		id: "play-screen",

		initialize: function(options){
			_.bindAll(this, "render");
			this.template = _.template(solutionTemplate);		
			this.localStore = new LocalStorageModel({mode : options.mode});

			this.buttonsView = new ButtonsView({localstore : this.localStore});

			this.modalView = new ModalView({localstore : this.localStore});
			this.listenTo(this.modalView, "clicked:modal", this.onModalClickedSetNextState);

			this.solutionView = new SolutionView();
			this.solutionView.listenTo(this.buttonsView, "clicked:button", this.solutionView.onButtonClickUpdateSolution);

			this.headerView = new HeaderView({localstore : this.localStore});
			this.headerView.listenTo(this.solutionView, "change:total", this.headerView.onTotalChangeCheckSolved);

			this.listenTo(this.headerView, "solved:puzzle", this.onPuzzleSolvedSetNextState);

			var  levelManagementModel = this.localStore.read( 'levelManagementModel' );
			if(levelManagementModel !== null){
				this.model = new LevelManagementModel({
					"level" : levelManagementModel.level,
					"modal" : levelManagementModel.modal,
					"mode"	: levelManagementModel.mode
				});

				if(this.model.get("modal") === 0 )
					this.modalView.$el.css( "display", "none");
			}
			else{
				this.model = new LevelManagementModel({
					"level" : 0,
					"modal" : 1,
					"mode"	: "tutorial"
				});
			}
			this.hintView = new HintView({model: this.model});
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
				Backbone.history.navigate("level-chooser", true);
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
			this.model = new LevelManagementModel({
					"level" : level,
					"modal" : 0,
					"mode"	: "single-play"
				});

			this.headerView.setTarget(level);
			this.modalView.close();
			this.hintView = new HintView({model: this.model});

			this.buttonsView = new ButtonsView({localstore : this.localStore});
			this.solutionView.listenTo(this.buttonsView, "clicked:button", this.solutionView.onButtonClickUpdateSolution);
			this.solutionView.model.cleanUp();

			if( level > 21 )
				this.buttonsView.showExtraButtons();
		}
	});

	return PlayScreenView;
});