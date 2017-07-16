// TODO: 

var stockApp = stockApp || {};

(($) => {
  stockApp.StocksTableView = Backbone.View.extend({
      el: "#table",
      className: "table",
      // template: _.template($('#stocks-table').html()),
      collection: {},

      initialize: function () {
          var self = this;

          this.collection = new StocksCollection();
          this.listenTo(this.collection, 'reset change', this.render)

          this.collection.fetch(function(error, response){
              if(error){
                  console.log("Error", error);
              }
              else{
                  console.log("Our Response(StocksTableView) is... ", response);
                  that.render();
              }
          });

      },

      render: function () {
          var that = this;

          _.each(this.collection.models, function (item) {
              that.renderRow(item);
          }, this);

          $('#stocks-app').html(this.$el.html());
      },

      renderRow: function (item) {
          var stocksView = new StocksView({model: item});
          this.$el.append(stocksView.render().el);
      }
  });

})(jQuery);
