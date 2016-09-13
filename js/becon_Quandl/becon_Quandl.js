var chart;

// // TODO: All wrong.
// function WEB_retrieve_Quandl_Data(){
// // TODO: Grant ability to toggle between columns
// // TODO: Implement Loading Overlay
// 	var q_database = $('#Quandl-DB-input').val().toUpperCase();
// 	var q_dataset = $('#Quandl-DS-input').val().toUpperCase();
// 	AJAX_retrieve_Quandl_Data_request(q_database, q_dataset);
// 	// Remove or Place Save Button, Save Series ID
// 	AJAX_check_Quandl_DS_In_DB(q_database, q_dataset)
// 		.done(function(data){
// 			if(data.error) {
// 				console.log('Data Error'); // DEBUG
// 				console.log(data.error); // TODO: Handle Error
// 				return;
// 			} else if(data.results) {
// 				console.log('Data Found'); // DEBUG
// 				raw_data = data.results; // DEBUG
// 				if (data.results) {
// 					$('#btn_save_quandl').hide();
// 					$('#input-db-dataTicker').val(data.results.txt_data_ticker);
// 					$('#input-db-dataTicker').attr('readonly', true);
// 					$('#input-db-dataName').val(data.results.txt_data_name);
// 					$('#input-db-dataName').attr('readonly', true);
// 				} else {
// 					$('#btn_save_quandl').show();
// 					$('#input-db-dataTicker').val('');
// 					$('#input-db-dataTicker').attr('readonly', false);
// 					$('#input-db-dataName').val('');
// 					$('#input-db-dataName').attr('readonly', false);
// 				}
// 			}
// 		})
// 		.fail(function(error){
// 			// TODO: Handle Error
// 			console.log(error);
// 			console.log(error.responseText);
// 		})
// 	;
// }

document.onload = (function(d3, queue){

	var svg_ = d3.select('#chart-holder')
		.append('svg')
			.attr('class', 'svg-area');
	chart = new Chart(svg_);

	queue()
		.defer(chart.load_chart_data_JSON, 'SP500.json')
		.await(function(error, success){
			if(success) {
				chart.reload_chart();
			}
		})
	;

	window.onresize = function(){chart.update_svg_size();}

})(window.d3, window.queue);