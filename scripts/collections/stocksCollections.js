var stockApp = stockApp || {};

stockApp.stocksCollection = Backbone.Collection.extend({

	model: stockApp.stocksModel,
  url: "/api/stocks/",
  title: "",
  column_names: [],

	parse: function(response) {
    this.title = response.title;
    this.column_names = response.column_names;
		this.models = response.stocks;
  },
  
  onSuccessHandler: function (collection, response) {
    console.log('Success response', response);
    console.log('Success collection', collection);

  },

  onErrorHandler: function (collection, response) {
    console.log('Error response', response);
    console.log('Error collection', collection);
  }
  
});

