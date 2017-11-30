var stockApp = stockApp || {};

(($) => {
	stockApp.stocksTableRowView = Backbone.View.extend({
        template: _.template($('#tablerow-template').html()),

        mapFieldstoModelFields: function(rawModel) {

          rawModel = rawModel.map((item) => 
            typeof item === "number" ? item.toFixed(2) : item
          );

          //very brittle..
          let newModel = {
            date: rawModel[0],
            open: rawModel[1],
            high: rawModel[2],
            low: rawModel[3],
            close: rawModel[4],
            volume: rawModel[5],
            ex_dvd: rawModel[6],
            split_ratio: rawModel[7],
            adj_open: rawModel[8],
            adj_high: rawModel[9],
            adj_low: rawModel[10],
            adj_close: rawModel[1],
            adj_vol: rawModel[12]
          };

          return newModel;
        },
        render: function(){
            var self = this;

            //we use our own model parser into valid JSON format
            this.el = this.template(self.mapFieldstoModelFields(this.model));
            return this;
        } 
	});
})(jQuery);
