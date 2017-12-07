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
    this.d3_data = response.stocks.map( (item) => {
      let data = {};
      
      //??
      data.date = item[0];
      data.open = item[1];
      data.high = item[2];
      data.low = item[3];
      data.close = item[4];
      data.volume = item[5];
      data.ex_dvd = item[6];
      data.split_ratio = item[7];
      data.adj_open = item[8];
      data.adj_high = item[9];
      data.adj_low = item[10];
      data.adj_close = item[11];
      data.adj_vol = item[12];

      return data;
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

