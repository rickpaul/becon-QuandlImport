


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

// TODO: Make Queue
function WEB_save_Quandl_History(data_series_ID){
	// use + to convert a Date object to time in (milli)seconds
	// epoch_time = +date/1000; 
	if(data_series_ID === undefined){
		return;
	} else {
		console.log('Saving Data History to series ID ' + data_series_ID);
		var now_ = new Date();
		chart_data.forEach(function (d) {
			AJAX_save_Data_Point(
				data_series_ID,
				+d.date/1000,
				d.value,
				false,
				d.date>now_
			);
	});
	}
}

// TODO: All wrong.
function WEB_save_Quandl_Series(){
	var data_ticker = $('#input-db-dataName').val().toUpperCase();
	var data_name = $('#input-db-dataTicker').val().toUpperCase();
	// Check if Data Series Exists
	AJAX_check_Data_Ticker_In_DB(data_ticker)
	// Insert Data Series
	AJAX_save_Data_Series(data_name, data_ticker, callback)
}

function WEB_change_attribute_type(){
	var attribute_radio = $('input[name=attribute-input-control]:checked').attr('id');
	if (attribute_radio === 'attribute-level'){
		chart.attribute_mode = 'level';
	} else if (attribute_radio === 'attribute-change'){
		chart.attribute_mode = 'rate-of-change';
	} else{
		throw new Error('attribute radio input not recognized');
	}
}

function WEB_change_attribute_unit_type(){
	var unit_radio = $('input[name=attribute-unit-control]:checked').attr('id');
	if (unit_radio === 'attribute-unit-absolute'){
		chart.percent_flag = false;
	} else if (unit_radio === 'attribute-unit-percent'){
		chart.percent_flag = true;
	} else{
		throw new Error('attribute unit radio input not recognized');
	}
}










