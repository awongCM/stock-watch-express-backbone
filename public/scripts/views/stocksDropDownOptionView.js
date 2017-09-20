var stockApp = stockApp || {};

(($) => {
	stockApp.stocksDropDownOptionView = Backbone.View.extend({
        template: _.template($('#optionitem-template').html()),
        render: function(){
            this.el = this.template(this.model.toJSON());
            return this;
        }
	})
})(jQuery);
