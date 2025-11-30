// TODOS

var stockApp = stockApp || {};

(($) => {
  stockApp.stocksGraphView = Backbone.View.extend({
    el: "#graph-container",
    // D3 config properties
    svg: null, 
    x: null, 
    y: null, 
    parseTime: null, 
    valueline: 0,
    valueline2: 0, 
    margin: 0, 
    width: 0, 
    height: 0, 

    initialize: function () {
      var self = this;
      this.listenTo(this.collection, 'sync', this.onCollectionSync);
    },

    setupD3Config: function() {

      var self = this;

      // set the dimensions and margins of the graph
      this.margin = {top: 20, right: 20, bottom: 30, left: 50};
      this.width = 960 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;

      // parse the date / time
      this.parseTime = d3.timeParse("%Y-%m-%d");

      // set the ranges
      this.x = d3.scaleTime().range([0, this.width]);
      this.y = d3.scaleLinear().range([this.height, 0]);

      // define the 1st line
      this.valueline = d3.line()
      .x(function(d) { return self.x(d.date); })
      .y(function(d) { return self.y(d.close); });

      // define the 2nd line
      this.valueline2 = d3.line()
				.x(function(d) { return self.x(d.date); })
				.y(function(d) { return self.y(d.open); });

      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
			// moves the 'group' element to the top left margin
			if(this.svg === null) {
				this.svg = d3.select("#graph-container").append("svg")
				.attr("width", this.width + this.margin.left + this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom)
				.append("g")
				.attr("transform",
							"translate(" + this.margin.left + "," + this.margin.top + ")");  
			}
    },
    drawGraph: function (data) {
      
      var self = this;
				// format the data
			data.forEach(function(d) {
					d.date = self.parseTime(d.date);
					d.close = +d.close;
					d.open = +d.open;
			});

			// Scale the range of the data
			this.x.domain(d3.extent(data, function(d) { return d.date; }));
			this.y.domain([0, d3.max(data, function(d) {
				return Math.max(d.close, d.open); })]);

			// Add the valueline path.
			this.svg.append("path")
					.data([data])
					.attr("class", "line")
					.attr("d", this.valueline);

			// Add the valueline2 path.
			this.svg.append("path")
					.data([data])
					.attr("class", "line")
					.style("stroke", "red")
					.attr("d", this.valueline2);

			// Add the X Axis
			this.svg.append("g")
					.attr("transform", "translate(0," + this.height + ")")
					.call(d3.axisBottom(this.x));

			// Add the Y Axis
			this.svg.append("g")
					.call(d3.axisLeft(this.y));
    },

    emptyGraphContent: function() {
      this.svg.selectAll("*").remove();  
    },

    onCollectionSync: function(collection, properties) {
			console.log(`onCollectionSync:  `);
			console.log('....', collection);
			console.log('....', properties);

			if(!stockApp.stocksCollection_instance.show_graph) {
				this.emptyGraphContent();
				d3.select("svg").remove();
				this.svg = null;
				return;
			}
			
			this.setupD3Config();
			this.emptyGraphContent();
			this.renderCollection(collection);
    },
    renderCollection: function(collection) {
			var self = this;

			this.drawGraph(collection.d3_data);
			return this;
    }
  });

})(jQuery);
