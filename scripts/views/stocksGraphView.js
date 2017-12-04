// TODOS

var stockApp = stockApp || {};

(($) => {
  stockApp.stocksGraphView = (function(){
     //required variables
      var svg, x, y, parseTime, valueline, valueline2, margin, width, height;

      function setupd3Config() {
       // set the dimensions and margins of the graph
        margin = {top: 20, right: 20, bottom: 30, left: 50};
        width = 960 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

        // parse the date / time
        parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        x = d3.scaleTime().range([0, width]);
        y = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        valueline = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

        // define the 2nd line
        valueline2 = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.open); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        svg = d3.select("#graph-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      }

    
      function draw(data) {

          // var data = data[country];

          // format the data
            data.forEach(function(d) {
              d.date = parseTime(d.date);
              d.close = +d.close;
              d.open = +d.open;
          });

          // Scale the range of the data
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) {
            return Math.max(d.close, d.open); })]);

          // Add the valueline path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .attr("d", valueline);

          // Add the valueline2 path.
          svg.append("path")
              .data([data])
              .attr("class", "line")
              .style("stroke", "red")
              .attr("d", valueline2);

          // Add the X Axis
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // Add the Y Axis
          svg.append("g")
              .call(d3.axisLeft(y));
      }

      //d3 functions here

      setupd3Config();

      // Get the data via AJAX call any time of data

      // d3.csv("data.csv", function(error, data) {
      //     if (error) throw error;

      //     // trigger render
      //     draw(data);
      // });

      d3.json("data.json", function(error, data) {
        if (error) throw error;

        // trigger render
        data = data["StockData"];
        draw(data);
    });

  })();

})(jQuery);
