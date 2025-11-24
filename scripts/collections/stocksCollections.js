var stockApp = stockApp || {};

stockApp.stocksCollection = Backbone.Collection.extend({

	model: stockApp.stocksModel,
  url: "/api/stocks/",
  title: "",
  column_names: [],
  d3_title: "",
  d3_data: [],
  show_table: false,
  show_graph: false,

	parse: function(response) {
    this.title = response.title;
    this.column_names = response.column_names;
    this.models = response.stocks;

    this.parseD3JSON(response);
  },

  parseD3JSON: function(response) {
    this.d3_title = response.title;
    this.d3_data = response.stocks.map(function(item) {
      return stockApp.transform.rowArrayToObject(item);
    });
  },

  fetchResults: function(data) {
    var self = this;
    this.fetch({data: data, success: self.onSuccessHandler, error: self.onErrorHandler});
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

