var stockApp = stockApp || {};

stockApp.stocksDropDownCollection = Backbone.Collection.extend({
    model: stockApp.stocksDropDownModel,
    localStorage: new Backbone.LocalStorage('stocksDropDownCollection-localstorage')
});


//instantiate collection list
stockApp.stocksDropDownList = new stockApp.stocksDropDownCollection();

stockApp.stocksDropDownList.add(new stockApp.stocksDropDownModel({key: "AAPL", value:"Apple"}));
stockApp.stocksDropDownList.add(new stockApp.stocksDropDownModel({key: "FB", value:"Facebook"}));
stockApp.stocksDropDownList.add(new stockApp.stocksDropDownModel({key: "GOOGL", value:"Google"}));
