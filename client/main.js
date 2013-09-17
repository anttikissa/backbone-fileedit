function init() {
	console.log("Hi!");

	var app = {
	};

	var File = Backbone.Model.extend({
		defaults: {
			name: 'unnamed',
			length: 0
		},

		initialize: function() {
			console.log("file initialize()");
		},

		idAttribute: 'name'
	});

	var Files = Backbone.Collection.extend({
		model: File,
		initialize: function() {
			console.log("files initialize()");
		},
		url: '/files'
	});

	var FilenameView = Backbone.View.extend({
		template: _.template($('#filename-template').html()),

		initialize: function() {
			console.log("filenameview initialize()");
		},

		tagName: 'li',

		events: {
			'click': 'edit'
		},

		render: function() {
			var json = this.model.toJSON();
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		edit: function() {
			console.log("edit triggered!");
			// TODO renaming is a bit trickier, do something else
			// then
			//this.model.set('name', this.model.get('name') + 'x');
			//console.log("saving model", this.model);
			//this.model.save();
		}
	});

	var FilesView = Backbone.View.extend({
		el: '#files',

		initialize: function() {
			this.listenTo(app.files, 'reset', this.addAll);
			app.files.fetch({ reset: true });
		},

		addOne: function(file) {
			var view = new FilenameView({ model: file });
			this.$el.append(view.render().el);
		},

		addAll: function() {
			var that = this;
			this.$el.empty();
			app.files.each(function(file) {
				that.addOne(file);
			});
		}
	});

	app.files = new Files();
	app.filesView = new FilesView();
}

$(init);
