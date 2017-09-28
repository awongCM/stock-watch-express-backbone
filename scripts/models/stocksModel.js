var stockApp = stockApp || {};

stockApp.stocksModel = Backbone.Model.extend({
    title: "",
    column_names: [],
    stocks: [],
    //implement model change events
    initialize: function() {
        this.on('change', this.onModelChange);
    },
    onModelChange: function(model, value) {
        console.log('Model stockModel changed, ', model);
    }
});
