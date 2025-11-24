var stockApp = stockApp || {};

// Shared transformation utilities to normalize raw Quandl row arrays.
stockApp.transform = {
  // Full object mapping with all indices preserved.
  rowArrayToObject: function(rawRow) {
    // Format numeric fields to 2 decimals (legacy behavior in table row view)
    rawRow = rawRow.map(function(item) {
      return typeof item === 'number' ? item.toFixed(2) : item;
    });
    return {
      date: rawRow[0],
      open: rawRow[1],
      high: rawRow[2],
      low: rawRow[3],
      close: rawRow[4],
      volume: rawRow[5],
      ex_dvd: rawRow[6],
      split_ratio: rawRow[7],
      adj_open: rawRow[8],
      adj_high: rawRow[9],
      adj_low: rawRow[10],
      adj_close: rawRow[11], // Correct index for adjusted close
      adj_vol: rawRow[12]
    };
  },
  // Minimal subset for graph consumption.
  rowArrayToGraphDatum: function(rawRow) {
    return {
      date: rawRow[0],
      open: rawRow[1],
      close: rawRow[4]
    };
  }
};
