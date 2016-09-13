// TODO: Implement use-cache parameters (passed to retrieveQUandl.php)
// TODO: Grant ability to toggle between columns
// TODO: Grant ability to toggle between columns

function WEB_retrieve_Quandl_Data_request() {
	return $.ajax({
		url: '../php/Quandl/retrieveQuandl.php',
		data: {
			'q_database': $('#Quandl-DB-input').val(),
			'q_dataset': $('#Quandl-DS-input').val(),
			'use_cache': false
		},
		type: 'POST',
		dataType: 'JSON',
		cache: false
	});
}

var raw_data; // can be deleted and moved in to function.
var data_natural_start_date;
var data_natural_end_date;
var data_update_date;
var data_update_time;
var data_natural_frequency;
var data_retrieved_frequency;
var data_name;
var data_source;
var data_column_count;
var data_column_name;

function WEB_retrieve_Quandl_Data(){
	console.log('WEB_retrieve_Quandl_Data');
	WEB_retrieve_Quandl_Data_request()
		.done(function(data){
				console.log('WEB_retrieve_Quandl_Data_request SUCCESS');
				console.log(data);
				
				if(data.error){
					// TODO: Handle Error
					console.log(data.error);
					return;
				} else if(data.result) {
					raw_data = JSON.parse(data.result);
					data_retrieved_start_date = null;
					data_retrieved_end_date = null;
					data_retrieved_frequency = null;
					data_natural_start_date = raw_data.from_date;
					data_natural_end_date = raw_data.to_date;
					data_update_date = raw_data.updated_at.slice(0,10);
					data_update_time = raw_data.updated_at.slice(11,19);
					data_natural_frequency = raw_data.frequency;
					data_name = raw_data.name;
					data_source = raw_data.source_name;
					data_column_count = raw_data.column_names.length - 1;
					data_column_name = raw_data.column_names[1];
					WEB_display_Quandl_Metadata();
				}
		})
		.fail(function(error){
				console.log('WEB_retrieve_Quandl_Data_request FAILURE');
				console.log(error);
				console.log(error.responseText);
		})
	;
}

function WEB_display_Quandl_Metadata(){
	$('#Q_mdata_name').text(data_name);
	$('#Q_mdata_source').text(data_source);
	$('#Q_mdata_natural_start').text(data_natural_start_date);
	$('#Q_mdata_natural_end').text(data_natural_end_date);
	$('#Q_mdata_natural_frequency').text(data_natural_frequency);
	$('#Q_mdata_update').text(data_update_date+' : '+data_update_time);
	$('#Q_mdata_num_cols').text(data_column_count);
	$('#Q_mdata_col_name').text(data_column_name);
}

function WEB_change_attribute_type(){}