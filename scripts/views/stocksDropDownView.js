var stockApp = stockApp || {};

(($) => {
	stockApp.stocksDropDownView = Backbone.View.extend({
		el : '#js-stocksdropdown',
		template: _.template($('#stockNamesDropdownView').html()),

		initialize: function () {
			//TODO - decide whether to fetch stock quotes name from server
			// let self = this;
			// this.listenTo(this.model, 'change', this.render);
			// this.render();
			// stockApp.stocksDropDownList.fetch();
			this.render();
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
