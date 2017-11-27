var stockApp = stockApp || {};

(($) => {
	stockApp.stocksDropDownView = Backbone.View.extend({
		el : '#js-stocksdropdown',
		template: _.template($('#stockNamesDropdownView').html()),
		initialize: function () {
			//render collection upon successful http fetch request
			this.listenTo(this.collection, 'sync', this.render);
		},

		events: {
			"change #stock_id": "stockNamesSelected"
		},

		stockNamesSelected: function () {
			console.log("You selected a stock!");
		},

		addDropDownOption: function(stocksDropDownModel) {
			let view = new stockApp.stocksDropDownOptionView({model: stocksDropDownModel});
			$('#stock_id').append(view.render().el);
		},

		render: function () {
			// this.$el.html(this.template);
			// return this;
			this.$el.html(this.template);
			stockApp.stocksDropDownList.each(this.addDropDownOption, this);
			return this;
		}
	})
})(jQuery);
