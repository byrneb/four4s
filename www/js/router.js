define([
    'backbone',
    'views/homescreenview',
    'views/levelchooserview',
    'views/playscreenview'

], function(Backbone, HomeScreenView, LevelChooserView, PlayScreenView) {

    var AppRouter = Backbone.Router.extend({

        routes: {
            "": "home",
            "play": "play",
            "single-play": "singlePlay",
            "level-chooser": "levelChooser"
        },

        initialize: function() {

            this.playScreenView = new PlayScreenView({
                mode: 'play'
            });

            this.singlePlayView = new PlayScreenView({
                mode: 'single-play'
            });

            this.homeScreenView = new HomeScreenView();

            this.levelChooserView = new LevelChooserView({
                singlePlayView: this.singlePlayView
            });
        },

        home: function() {

            var content = $('#four4sApp');
            content.empty();

            content.append(this.homeScreenView.render().el);
            this.homeScreenView.delegateEvents();
        },

        play: function() {
            var content = $("#four4sApp");
            content.empty();
            content.append(this.playScreenView.render().el);
            this.playScreenView.delegateEvents();
        },

        singlePlay: function() {
            var level = this.levelChooserView.model.get("level");
            this.singlePlayView.setupSingleLevel(level);

            var content = $("#four4sApp");
            content.empty();
            content.append(this.singlePlayView.render().el);
            this.singlePlayView.delegateEvents();
        },

        levelChooser: function() {
            var content = $("#four4sApp");
            content.empty();
            content.append(this.levelChooserView.render().el);
            this.levelChooserView.delegateEvents();
        }
    });

    return AppRouter;
});