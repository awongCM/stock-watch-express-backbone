var stockApp = stockApp || {};

stockApp.stocksModel = Backbone.Model.extend({
    // Fields representation of stock model
    // ["Date", "Open", "High", "Low", "Close", "Volume", "Ex-Dividend", "Split Ratio", "Adj. Open", "Adj. High", "Adj. Low", "Adj. Close", "Adj. Volume"]
    date: "",
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    ex_dvd: 0,
    split_ratio: 0,
    adj_open: 0,
    adj_high: 0,
    adj_low: 0,
    adj_close: 0,
    adj_vol: 0,

});
