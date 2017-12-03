var stockApp = stockApp || {};

(($) => {
	stockApp.stocksFormView = Backbone.View.extend({
        el: "#form-container",
        events: {
            "click #submit_button": "submitButton"
        },
        submitButton: function(e){
            e.preventDefault();

            let uri = "/api/stocks/";

            // let start_date_day = $('#start-date-select-group [name="day_select"]'),
            //     start_date_month = $('#start-date-select-group [name="month_select"]'),
            //     start_date_year = $('#start-date-select-group [name="year_select"]');

            // let end_date_day = $('#end-date-select-group [name="day_select"]'),
            //     end_date_month = $('#end-date-select-group [name="month_select"]'),
            //     end_date_year =$('#end-date-select-group [name="year_select"]');

            let data = {
                stock_id: $("#stock_id").val(),
                download_type: $("#download_type").val(),
                is_table: $("#is_table").is(":checked"),
                order_by: $("#order_by").val(),
                collapse_by: $("#collapse_by").val()
            };

            if (!data.is_table) {
                //straight download request

                window.location.href = uri + "?stock_id=" + data.stock_id + "&download_type=" + data.download_type + "&is_table=" + data.is_table + "&order_by=" + data.order_by + "&collapse_by=" + data.collapse_by;

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
