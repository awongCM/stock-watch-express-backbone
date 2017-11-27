var stockApp  = stockApp || {};

(() => {
  stockApp.stocksDropDownList = new stockApp.stocksDropDownCollection();
  new stockApp.stocksDropDownView({collection: stockApp.stocksDropDownList});
  new stockApp.stocksFormView();
  stockApp.stocksModel_instance = new stockApp.stocksModel();
  new stockApp.stocksTableView({model: stockApp.stocksModel_instance});
})();
