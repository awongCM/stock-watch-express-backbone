var stockApp = stockApp || {};

(($) => {
	stockApp.stocksDropDownOptionView = Backbone.View.extend({
        template: _.template($('#optionitem-template').html()),

        parsedModel: function(rawModel) {
            var stockKey = Object.keys(rawModel)[0];
            var stockValue = rawModel[stockKey];
            
            var newModel =  {key: stockKey, value: stockValue};
            return newModel;
        },
        render: function(){
            var self = this;

            //we use our own model parser into valid JSON format
            this.el = this.template(self.parsedModel(this.model));
            return this;
        } 
	});
})(jQuery);
