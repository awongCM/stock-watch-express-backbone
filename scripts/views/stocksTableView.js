var stockApp = stockApp || {};

(($) => {
  stockApp.stocksTableView = Backbone.View.extend({
    el: "#table-container",
    template: _.template($('#stocksTableView').html()),
    initialize: function () {
        var self = this;
        this.listenTo(this.collection, 'sync', this.onCollectionSync);

    },
    onCollectionSync: function(collection, properties) {
        console.log(`onCollectionSync: ${collection}, ${properties}`);
        if(!stockApp.stocksCollection_instance.show_table) return;
        this.renderCollection(properties);
    },
    addRowItem: function(stocksModel) {
        console.log(`addRowItem: ${stocksModel}`);

        let view = new stockApp.stocksTableRowView({model: stocksModel});
        $('#table-body').append(view.render().el);
    },

    emptyRowItems: function () {
        $('#table-body').empty();
    },

    renderCollection: function(properties) {
        const {title, column_names} = properties;

        this.$el.html(this.template({title: title, column_names: column_names}));
        stockApp.stocksCollection_instance.each(this.addRowItem, this);
        return this;
    }
  });

})(jQuery);
