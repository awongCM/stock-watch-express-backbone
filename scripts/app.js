var stockApp  = stockApp || {};

(() => {
  stockApp.stocksDropDownList = new stockApp.stocksDropDownCollection();
  new stockApp.stocksDropDownView({collection: stockApp.stocksDropDownList});
  new stockApp.stocksFormView();
  // TODO use collections for rendering data
  stockApp.stocksModel_instance = new stockApp.stocksModel();
  stockApp.stocksCollection_instance = new stockApp.stocksCollection();
  new stockApp.stocksTableView({collection: stockApp.stocksCollection_instance});

})();
