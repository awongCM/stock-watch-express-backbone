var stockApp = stockApp || {};

stockApp.stocksDropDownCollection = Backbone.Collection.extend({
    model: stockApp.stocksDropDownModel,
    // TODO
    // localStorage: new Backbone.LocalStorage('stocksDropDownCollection-localstorage'),

    url: "/api/available-stocks",

    initialize: function() {
        this.fetch({ success: this.onSuccessHandler, error: this.onErrorHandler});
    },

    onErrorHandler: function(collection, response) {
        console.log('Error response', response);
        console.log('Error collection', collection);

        //return a empty collection
        collection.models = [];
    },

    onSuccessHandler: function(collection, response) {
        
        console.log("Success response", response);
        console.log("Success collection", collection);
        
        //overwrite collection models with our custom model
        collection.models = response.available_stocks;

    }
});
