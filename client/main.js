function init() {
	console.log("Hi!");
	var File = Backbone.Model.extend({
		defaults: {
			name: 'unnamed',
			length: 0,
			content: ''
		}
	});

	var Files = Backbone.Collection.extend({
		model: File
	});

	var FilenameView = Backbone.View.extend({
		template: _.template($('#filename-template').html()),

		tagName: 'li',

		events: {
			'click': 'edit'
		},

		render: function() {
			var json = this.model.toJSON();
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		initialize: function() {
			this.model.set('length', this.model.get('content').length);
		},

		edit: function() {
			console.log("edit triggered!");
		}
	});

	var f1 = new File({ name: 'file1', content: 'stuff' });
	var f2 = new File({ name: 'file2', content: 'more stuff' });

	var v1 = new FilenameView({ model: f1 });
	var v2 = new FilenameView({ model: f2 });

	$('ul').append(v1.render().$el);
	$('ul').append(v2.render().$el);
}

$(init);
