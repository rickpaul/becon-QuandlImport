'use strict'

var php_raw_data; // DEBUG
var php_raw_error; // DEBUG

////////////////////////////////////////////////////////////////////////////////
// AJAX CODE
////////////////////////////////////////////////////////////////////////////////
var phpMySQLPrefix = '../../php/becon_quandl/MySQL/';
var phpQuandlPrefix = '../../php/becon_quandl/Quandl/';
//////////////////////////////////////////////////////////////////////////////
// Generic Helping Code
//////////////////////////////////////////////////////////////////////////////
function AJAX_TrueFalse_Call(url, data, callback) {
	$.ajax({
			url: url,
			data: data,
			type: 'POST',
			dataType: 'JSON',
			cache: false
		})
		.done(function(data){
			if(data.error){
				php_raw_data = data; // DEBUG
				console.log(data.error);
				callback(data.error, null);
			} else if(typeof(data.results) !== 'undefined') {
				callback(null, data.results); // data results is success is num rows affected. 0/1.
			} else if(typeof(data.results) === 'undefined') {
				console.log('Data Results not recognized');
				callback('Data Results not recognized', null);
			}
		})
		.fail(function(error){
			php_raw_error = error; // DEBUG
			console.log(error);
			callback(error.responseText, null);
		})
	;
}
//////////////////////////////////////////////////////////////////////////////
// Application Specific Code
//////////////////////////////////////////////////////////////////////////////
function AJAX_check_Quandl_DS_In_DB(q_database, q_dataset, callback) {
	// console.log('AJAX_check_Quandl_DS_In_DB'); // DEBUG
	var url = phpMySQLPrefix+'get_Quandl_DB_info.php';
	var data = { 			
		q_database: q_database,
		q_dataset: q_dataset
	};
	AJAX_TrueFalse_Call(url, data, callback);
}


function AJAX_check_Data_Ticker_In_DB(data_ticker, callback) {
	var url = phpMySQLPrefix+'get_Data_Series_ID.php';
	var data = {
		data_ticker: data_ticker
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_retrieve_Quandl_Data_request(q_database, q_dataset, callback) {
// TODO: Implement use-cache parameters (within retrieveQuandl.php)
	return $.ajax({
		url: phpQuandlPrefix+'retrieveQuandl.php',
		data: {
			'q_database': q_database,
			'q_dataset': q_dataset,
			'use_cache': false
		},
		type: 'POST',
		dataType: 'JSON',
		cache: false
	})
		.done(function(data){
			if(data.error){
				// TODO: Handle Error
				console.log(data.error);
				return;
			} else if(data.result) {
				// Load New Metadata
				var raw_data = JSON.parse(data.result);
				var return_data = {};
				data_retrieved_start_date = null;
				data_retrieved_end_date = null;
				data_retrieved_frequency = null;
				return_data.natural_start_date = raw_data.from_date;
				return_data.natural_end_date = raw_data.to_date;
				return_data.natural_frequency = raw_data.frequency;
				return_data.update_date = raw_data.updated_at.slice(0,10);
				return_data.update_time = raw_data.updated_at.slice(11,19);
				return_data.data_name = raw_data.name;
				return_data.data_source = raw_data.source_name;
				return_data.data_column_count = raw_data.column_names.length - 1;
				return_data.data_column_name = raw_data.column_names[1];

				// Load New Data
				chart_data = [];
				raw_data.data.forEach(function(d) {
					chart_data.push({
						date: parse_date(d[0]),
						value: +d[1],
					});
				});
				// Display New Data
				// on_load(data.error, [true]);
			}
		})
		.fail(function(error){
			// TODO: Handle Error
			console.log(error);
			console.log(error.responseText);
		})
	;
}

function AJAX_save_Data_Point(data_series_ID, date, value, interpolated, forecast, callback) {
	var url = phpMySQLPrefix+'insert_Data_Point.php';
	var data = {
		series_ID: data_series_ID,
		date: date,
		value: value,
		interpolated: interpolated || 0,
		forecast: forecast || 0
	};
	AJAX_TrueFalse_Call(url, data, callback);
}

function AJAX_save_Data_Series(data_name, data_ticker, callback) {
	var url = phpMySQLPrefix+'insert_Data_Series.php';
	var data = {
		data_name: data_name,
		data_ticker: data_ticker
	};
	AJAX_TrueFalse_Call(url, data, callback);
}