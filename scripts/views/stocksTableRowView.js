var stockApp = stockApp || {};

(($) => {
	stockApp.stocksTableRowView = Backbone.View.extend({
        template: _.template($('#tablerow-template').html()),

        mapFieldstoModelFields: function(rawModel) {
          // Delegate to shared transform to eliminate brittle index duplication.
          return stockApp.transform.rowArrayToObject(rawModel);
        },
        render: function(){
            var self = this;

            //we use our own model parser into valid JSON format
            this.el = this.template(self.mapFieldstoModelFields(this.model));
            return this;
        } 
	});
})(jQuery);
