var stockApp  = stockApp || {};

(() => {
  new stockApp.stocksDropDownView();
  new stockApp.stocksFormView();
  stockApp.stocksModel_instance = new stockApp.stocksModel();
  new stockApp.stocksTableView({model: stockApp.stocksModel_instance});
})();
