var stockApp = stockApp || {};

(($) => {
	stockApp.stocksFormView = Backbone.View.extend({
        el: "#form-container",
        template:  _.template($('#stocksTableView').html()),
        events: {
            "click #submit_button": "submitButton"
        },
        submitButton: function(e){
            console.log("button submitted");
            //TODO - ajax methods for other tabl view
            var self = this;
            e.preventDefault();
            $.ajax({
                url: "/api/stocks/",
                data: {
                    stock_id: $("#stock_id").val(),
                    download_type: $("#download_type").val(),
                    is_table: false
                },
                success: function(response){
                    // console.log("Success!", response);
                    stockApp.stocksModel = response;
                    console.log("Success", stockApp.stocksModel);
                    self.render();
                },
                error: function(xhr){
                    console.log("Failure!", xhr);
                }
            })
        },
        render: function() {
            $('.table-container').html(this.template(stockApp.stocksModel));
        }
	})
})(jQuery);
