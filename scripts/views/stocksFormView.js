var stockApp = stockApp || {};

(($) => {
	stockApp.stocksFormView = Backbone.View.extend({
        el: "#form-container",
        events: {
            "click #submit_button": "submitButton"
        },
        submitButton: function(e){
            e.preventDefault();

            let data = {
                stock_id: $("#stock_id").val(),
                download_type: $("#download_type").val(),
                is_table: $("#is_table").is(":checked")
            };

            let uri = "/api/stocks/";

            if (!data.is_table) {
                //straight download request

                window.location.href = uri + "?stock_id=" + data.stock_id + "&download_type=" + data.download_type + "&is_table=false";

            } else {
                //ajax call with stocksCollection in json

                data.download_type = 'json';
                var this_instance = stockApp.stocksCollection_instance;

                // is this the correct way to handle callbacks??
                stockApp.stocksCollection_instance.fetch({data : data, success: this_instance.onSuccessHandler, error: this_instance.onErrorHandler });

            }
        }
	})
})(jQuery);
