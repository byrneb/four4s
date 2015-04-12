require.config({
    paths:{
        jquery:'lib/jquery',
        underscore:'lib/underscore',
        backbone:'lib/backbone',
        text: 'lib/text'
    },

    shim: {
        backbone: {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        }
    }
});

require(['router',
		 'lib/fastclick',
		 'lib/viewport-units-buggyfill',
		 'lib/viewport-units-buggyfill.hacks'
		], function (Router, FastClick, buggyfill, buggyfillHack) {

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

	buggyfill.init({
	  hacks: buggyfillHack
	});

    window.addEventListener("load", function() {
		FastClick.attach(document.body);
	}, false);

	new Router();
	Backbone.history.start();
});