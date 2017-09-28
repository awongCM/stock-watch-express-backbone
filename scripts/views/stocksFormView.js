var stockApp = stockApp || {};

(($) => {
	stockApp.stocksFormView = Backbone.View.extend({
        el: "#form-container",
        events: {
            "click #submit_button": "submitButton"
        },
        submitButton: function(e){
            console.log("button submitted");
            e.preventDefault();
            $.ajax({
                url: "/api/stocks/",
                type: "get",
                data: {
                    stock_id: $("#stock_id").val(),
                    download_type: $("#download_type").val(),
                    is_table: false
                },
                success: function(response){
                    console.log("Success!", response);
                },
                error: function(xhr){
                    console.log("Failure!", xhr);
                }
            })
        }
	})
})(jQuery);
