var stockApp = stockApp || {};

(($) => {
	stockApp.stockNamesDropdownView = Backbone.View.extend({
		el : '#js-stocksdropdown',
		template: _.template($('#stockNamesDropdownView').html()),

		initialize: function () {
			let self = this;
			this.listenTo(this.model, 'change', this.render);
			this.render();
		},

		events: {
			"change #stockNamesSelector": "stockNamesSelected"
		},

		stockNamesSelected: function () {
			alert("You selected a stock!");
		},

		render: function () {
			this.$el.html(this.template);
			return this;
		}
	})
})(jQuery);
