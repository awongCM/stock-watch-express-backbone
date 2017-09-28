var stockApp = stockApp || {};

(($) => {
  stockApp.stocksTableView = Backbone.View.extend({
    el: "#table-container",
    template: _.template($('#stocksTableView').html()),
    initialize: function () {
        var self = this;
        this.listenTo(this.model, 'change', this.onModelChange);

    },
    onModelChange: function(model, value) {
        console.log('detect model changed', model);
        this.render();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
  });

})(jQuery);
