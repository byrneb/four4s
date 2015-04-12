define([
    'backbone',
    'models/modalmodel',
    'text!../../templates/modal.html'

], function(Backbone, ModalModel, modalTemplate) {	

	ModalView = Backbone.View.extend({

		events: {
			"click" : "triggerEventOnParentView"
		},

		initialize: function(options) {
			_.bindAll(this, "render");
			this.localStore = options.localstore;
			this.template = _.template(modalTemplate);
			var modal = this.localStore.read( 'modal' );
			if(modal !== null){
				this.model = new ModalModel({
					'title'			: modal.title,
					'content' 		: modal.content,
					'isTutorialMsg' : modal.isTutorialMsg 
				});
			}
			else{
				this.model = new ModalModel({
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

	return ModalView;
});