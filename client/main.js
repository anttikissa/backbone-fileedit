var app = {
};

_.extend(app, Backbone.Events);

var File = Backbone.Model.extend({
	defaults: {
		name: 'unnamed',
		length: 0,
		content: ''
	},

	initialize: function() {
		this.on('change:content', this.nameChanged);
	},

	nameChanged: function(what, to) {
		this.set('length', to.length);
	},

	idAttribute: 'name'
});

var Files = Backbone.Collection.extend({
	model: File,
	url: '/files'
});

var FilenameView = Backbone.View.extend({
	template: _.template($('#filename-template').html()),

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},

	tagName: 'li',

	render: function() {
		var json = this.model.toJSON();
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var FileContentView = Backbone.View.extend({
	el: '#content',

	initialize: function() {
		this.$name = this.$el.find('.name');
		this.$filename = this.$el.find('.filename');
		this.$textarea = this.$el.find('textarea');
		this.$status = this.$el.find('.status');
		this.setModel(null);
	},

	events: {
		'click .save': 'save',
		'click .refresh': 'refresh'
	},

	setFile: function(name) {
		var model = app.files.findWhere({ name: name });
		this.setModel(model);
	},

	setModel: function(model) {
		if (this.model) {
			this.stopListening(this.model);
		}
		this.model = model;
		if (this.model) {
			this.listenTo(this.model, 'sync', this.render);
		}
		this.render();
	},

	render: function() {
		if (this.model) {
			this.$filename.html(this.model.get('name'));
			this.$textarea.val(this.model.get('content'))
				.attr('readonly', false);
		} else {
			this.$filename.html('(no file)');
			this.$textarea.val('')
				.attr('readonly', true);
		}
		return this;
	},

	save: function() {
		if (this.model) {
			// TODO report "saving..." state
			this.$status.html('Saving...');
			var that = this;
			var xhr = this.model.save({
				content: this.$textarea.val()
			}, {
				wait: true,
			});
			xhr.fail(function(xhr) {
				alert("Error saving file: " + xhr.responseText);
				that.$status.html('Error saving file.');
			});
			xhr.success(function(what) {
				that.$status.html('Saved.');
			});
		}
	},

	refresh: function() {
		if (this.model) {
			console.log("Refreshing. Model is ", this.model);
			var xhr = this.model.fetch();
			xhr.fail(function(xhr) {
				console.log("Failed to refresh", xhr.responseText);
			});
			xhr.success(function(what) {
				console.log("Success", what);
			});
		}
	}

});

var FilesView = Backbone.View.extend({
	el: '#files',

	initialize: function() {
		this.listenTo(app.files, 'reset', this.addAll);
		var xhr = app.files.fetch({ reset: true });
		xhr.error(function(xhr) {
			alert("Error loading files: " + xhr.responseText);
		});
		xhr.success(function(what) {
			app.trigger('initialLoad');
		});
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

var Workspace = Backbone.Router.extend({
	routes: {
		'*name': 'setFile'
	},

	setFile: function(name) {
		app.fileContentView.setFile(name);
	}
});

app.files = new Files();
app.filesView = new FilesView();
app.fileContentView = new FileContentView();
app.router = new Workspace();

app.once('initialLoad', function() {
	Backbone.history.start();
});
