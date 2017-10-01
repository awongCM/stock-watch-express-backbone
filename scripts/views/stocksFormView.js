var stockApp = stockApp || {};

(($) => {
	stockApp.stocksFormView = Backbone.View.extend({
        el: "#form-container",
        events: {
            "click #submit_button": "submitButton"
        },
        submitButton: function(e){
            e.preventDefault();
            
            let check_download_type =  $("#download_type").val();

            let is_table_checked = $("#is_table").is(":checked");

            if (!is_table_checked) {
                //straight download request

                let uri = "/api/stocks/",
                    stock_id = $("#stock_id").val();

                window.location.href = uri + "?stock_id=" + stock_id + "&download_type=" + check_download_type + "&is_table=false";

            } else {
                //ajax call

                $.ajax({
                    url: "/api/stocks/",
                    type: "GET",
                    data: {
                        stock_id: $("#stock_id").val(),
                        download_type: 'json',
                        is_table: true
                    },
                    success: function(response) {                    
                        stockApp.stocksModel_instance.set({title: response.title, column_names: response.column_names, stocks: response.stocks });
                        console.log("Success",  stockApp.stocksModel_instance);    
                    },
                    error: function(xhr){
                        console.log("Failure!", xhr);
                    }
                })    
            }
        }
	})
})(jQuery);
