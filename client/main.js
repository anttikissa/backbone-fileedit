function init() {
	var app = {
	};

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

		events: {
			'click': 'edit'
		},

		render: function() {
			var json = this.model.toJSON();
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		edit: function() {
			app.fileContentView.setModel(this.model);
		}
	});

	var FileContentView = Backbone.View.extend({
		el: '#content',

		initialize: function() {
			this.$p = this.$el.find('p');
			this.$filename = this.$p.find('.filename');
			this.$textarea = this.$el.find('textarea');
			this.setModel(null);
		},

		events: {
			'change': 'change'
		},

		setModel: function(model) {
			this.model = model;
			this.render();
		},

		render: function() {
			if (this.model) {
				this.$p.show();
				this.$filename.html(this.model.get('name'));
				this.$textarea.val(this.model.get('content'))
					.attr('readonly', false);
			} else {
				this.$p.hide();
				this.$textarea.empty()
					.attr('readonly', true);
			}
			return this;
		},

		change: function() {
			if (this.model) {
				// TODO report "saving..." state
				var xhr = this.model.save({ 
					content: this.$textarea.val()
				}, {
					wait: true,
				});
				xhr.fail(function(xhr) {
					alert("Error saving file: " + xhr.responseText);
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
	app.fileContentView = new FileContentView();
}

$(init);
