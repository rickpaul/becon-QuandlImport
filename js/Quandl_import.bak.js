console.log('Starting Script');

var CONTAINER = 'chart-holder';
var SVG_CLASS = 'svg-area';
var CHART_CLASS = 'chart-area';
var CONTROL_BOX= '#control-box';


function sin_(height, width) {
	return height / Math.sqrt( Math.pow( height,2 ) + Math.pow( width,2 ) );
}

function round_(number_, digits_){
	var digits = digits_ || 0;
	var factor = Math.pow(10, digits);
	var number = Math.round(number_*factor);
	return number/factor;
}

var parse_date = d3.time.format('%Y-%m-%d').parse;

var	container_ = document.getElementById(CONTAINER);
var svg_width = container_.clientWidth;
var svg_height = container_.clientHeight;

var chart_margin = {top: 0, right: 0, bottom: 20, left: 50}; // these margins are actually necessary for axis display
var chart_height = svg_height - chart_margin.top - chart_margin.bottom;
var chart_width = svg_width - chart_margin.left - chart_margin.right;

var chart_x_scale = d3.time.scale().range([0, chart_width]);
var chart_y_scale = d3.scale.linear().range([chart_height, 0]);
function define_chart_x_scale(){
	chart_x_scale.domain(d3.extent(chart_data.map(function(d){return d.date;})));
};
function define_chart_y_scale(){
	chart_y_scale.domain(d3.extent(chart_data.map(function(d){return d.value;})));
};
var chart_x_axis = d3.svg.axis().scale(chart_x_scale).orient('bottom');
var chart_y_axis = d3.svg.axis().scale(chart_y_scale).orient('left');

var chart_area,
		bar_group,
		chart_line,
		change_line,
		change_start_x,
		change_start_y,
		change_end_x,
		change_end_y,
		level_line,
		chart_data,
		chart_periodicity;

var raw_data; // can be deleted // DEBUG
var data_natural_start_date,
		data_natural_end_date,
		data_update_date,
		data_update_time,
		data_natural_frequency,
		data_retrieved_frequency,
		data_name,
		data_source,
		data_column_count,
		data_column_name;

var data_series_ID = null;

var attribute_mode = 'level';
var rate_of_change_mode = 'absolute';
var change_line_active = false;
var level_line_value = svg_height/2;
var percent_flag = true;

function AJAX_check_Quandl_DS_In_DB(q_database, q_dataset) {
	// console.log('AJAX_check_Quandl_DS_In_DB'); // DEBUG
	return $.ajax({
		url: '../php/MySQL/get_Quandl_DB_info.php',
		data: { 			
			q_database: q_database,
			q_dataset: q_dataset
		},
		type: 'POST',
		dataType: 'JSON',
		cache: false
	});
}

function AJAX_check_Data_Ticker_In_DB(data_ticker) {
	// console.log('AJAX_check_Quandl_DS_In_DB'); // DEBUG
	// console.log('../php/MySQL/get_Quandl_DB_info.php'); // DEBUG
	return $.ajax({
		url: '../php/MySQL/get_Data_Series_ID.php',
		data: { 			
			'data_ticker': data_ticker
		},
		type: 'POST',
		dataType: 'JSON',
		cache: false
	});
}

function AJAX_retrieve_Quandl_Data_request(q_database, q_dataset) {
// TODO: Implement use-cache parameters (within retrieveQuandl.php)
	return $.ajax({
		url: '../php/Quandl/retrieveQuandl.php',
		data: {
			'q_database': q_database,
			'q_dataset': q_dataset,
			'use_cache': false
		},
		type: 'POST',
		dataType: 'JSON',
		cache: false
	});
}

function WEB_retrieve_Quandl_Data(){
// TODO: Grant ability to toggle between columns
// TODO: Implement Loading Overlay
	var q_database = $('#Quandl-DB-input').val().toUpperCase();
	var q_dataset = $('#Quandl-DS-input').val().toUpperCase();
	AJAX_retrieve_Quandl_Data_request(q_database, q_dataset)
		.done(function(data){
				if(data.error){
					// TODO: Handle Error
					console.log(data.error);
					return;
				} else if(data.result) {
					// Load New Metadata
					var raw_data = JSON.parse(data.result);
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
					// Display New Metadata
					WEB_display_Quandl_Metadata();
					// Load New Data
					chart_data = [];
					raw_data.data.forEach(function(d) {
						chart_data.push({
							date: parse_date(d[0]),
							value: +d[1],
						});
					});
					// Display New Data
					on_load(data.error, [true]);
				}
		})
		.fail(function(error){
				// TODO: Handle Error
				console.log(error);
				console.log(error.responseText);
		})
	;
	// Remove or Place Save Button, Save Series ID
	AJAX_check_Quandl_DS_In_DB(q_database, q_dataset)
		.done(function(data){
			if(data.error) {
				console.log('Data Error'); // DEBUG
				console.log(data.error); // TODO: Handle Error
				return;
			} else if(data.results) {
				console.log('Data Found'); // DEBUG
				raw_data = data.results; // DEBUG
				if (data.results) {
					$('#btn_save_quandl').hide();
					$('#input-db-dataTicker').val(data.results.txt_data_ticker);
					$('#input-db-dataTicker').attr('readonly', true);
					$('#input-db-dataName').val(data.results.txt_data_name);
					$('#input-db-dataName').attr('readonly', true);
				} else {
					$('#btn_save_quandl').show();
					$('#input-db-dataTicker').val('');
					$('#input-db-dataTicker').attr('readonly', false);
					$('#input-db-dataName').val('');
					$('#input-db-dataName').attr('readonly', false);
				}
			}
		})
		.fail(function(error){
			// TODO: Handle Error
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

function WEB_save_Quandl_History(){
	// use + to convert a Date object to time in (milli)seconds
	// epoch_time = +date/1000; 
	if(!data_series_ID){
		return;
	} else {
		console.log('Saving Data History to series ID ' + data_series_ID);
		var now_ = new Date();
		chart_data.forEach(function (d) {
		WEB_save_Quandl_DataPoint(
			+d.date/1000,
			d.value,
			false,
			d.date>now_
		);
	});
	}

}

function WEB_save_Quandl_DataPoint(date, value, interpolated, forecast){
	console.log('Saving Data Point...');
	$.ajax({
			url: '../php/mySQL/insert_Data_Point.php',
			data: {
				'series_ID': data_series_ID,
				'date': date,
				'value': value,
				'interpolated': interpolated,
				'forecast': forecast
			},
			type: 'POST',
			dataType: 'JSON',
			cache: false,
		})
		.done(function(success){
			if(success){
				console.log('... success');
			} else {
				console.log('... failure');
			}
			return success; // This will be true/false value based on insertion success
		})
		.fail(function(error){
			// TODO: Handle Error
			console.log(error);
			console.log(error.responseText);
			return false;
		})
	;
}

function WEB_save_Quandl_Series(){
	var data_ticker = $('#input-db-dataName').val().toUpperCase();
	var data_name = $('#input-db-dataTicker').val().toUpperCase();
	// Check if Data Series Exists
	AJAX_check_Data_Ticker_In_DB(data_ticker)
		.done(function(data){
			if(data.error){
				// TODO: Handle Error
				console.log(data.error);
				return;
			} else if(data.results) {
				data_series_ID = data.results;
				console.log('Series found in DB'); // DEBUG
				return;
			} else {
				console.log('Series not found in DB'); // DEBUG
			}
		})
		.fail(function(){
				// TODO: Handle Error
				console.log(error);
				console.log(error.responseText);
				return;
		})
	;
	// Insert Data Series
	console.log('Inserting Data Series...')
	$.ajax({
			url: '../php/mySQL/insert_Data_Series.php',
			data: {
				data_name: data_name,
				data_ticker: data_ticker
			}
		})
		.done(function(data){
			if (data) {

			}
			data_series_ID = data;
			return data; // This will be value of seriesID or 0, if not successful
		})
		.fail(function(error){
			console.log('PHP Fail'); // DEBUG
			// TODO: Handle Error
			console.log(error);
			console.log(error.responseText);
		})
	;
}

function WEB_change_attribute_type(){
	var attribute_radio =  $('input[name=attribute-input-control]:checked').attr('id');
	if (attribute_radio === 'attribute-level'){
		attribute_mode = 'level';
		level_line.classed('hidden', false);
		change_line.classed('hidden', true);
	} else if (attribute_radio === 'attribute-change'){
		attribute_mode = 'rate-of-change';
		change_line.classed('hidden', false);
		level_line.classed('hidden', true);
	} else{
		throw new Error('attribute radio input not recognized');
	}
	update_text();
	update_highlights();
}

function WEB_change_attribute_unit_type(){
	var unit_radio =  $('input[name=attribute-unit-control]:checked').attr('id');
	if (unit_radio === 'attribute-unit-absolute'){
		percent_flag = false;
	} else if (unit_radio === 'attribute-unit-percent'){
		percent_flag = true;
	} else{
		throw new Error('attribute unit radio input not recognized');
	}
	update_text();
	update_highlights();
}

function remove_chart_data(){
	chart_area.selectAll('.axis').remove();
	chart_area.selectAll('.bar_group_holder').remove();
	chart_area.selectAll('.chart_line').remove();
}

function add_chart_data(){
	console.log('Plotting Line Data');

	chart_area.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(0,'+chart_height+')')
		.call(chart_x_axis);

	chart_area.append('g')
		.attr('class', 'axis')
		.call(chart_y_axis);

	bar_group = chart_area
		.append('g')
		.attr('class', 'bar_group_holder')
		.selectAll('rect')
		.data(chart_data);

	var data_length = chart_data.length;

	bar_group.enter()
		.append('svg:rect')
		.attr('class', 'highlight-bar')
		.classed('hidden', false)
		.classed('true', true)
		.attr('transform', function(d, i) {
			if(i >= 1){
				return 'translate('+chart_x_scale(d.date)+',0)';
			}else{
				return 'translate(0,0)';
			}
		})
		.attr('height', chart_height)
		.attr('width', function(d, i) {
			if(i < (data_length-1)){
				return chart_x_scale(chart_data[i+1].date) - chart_x_scale(chart_data[i].date);
			}else{
				return 0;
			}
		});

	chart_line = d3.svg.line()
		.interpolate('linear')
		.x(function(d){ return chart_x_scale(d.date); })
		.y(function(d){ return chart_y_scale(d.value); })


	chart_area.append('path')
		.datum(chart_data)
		.attr('class', 'chart_line')
		.attr('d', chart_line);
};

function update_text(){
	if(attribute_mode==='level'){
		$('#rate-time-display').text('');
		$('#rate-amt-display').text('');
		$('#lvl-amt-display').text(round_(chart_y_scale.invert(level_line_value),2));
	} else if(attribute_mode==='rate-of-change'){
		$('#lvl-amt-display').text('');
		if (percent_flag) {
			var percent_diff = -1 * Math.tanh( (change_end_y-change_start_y)/(change_end_x-change_start_x) );
			$('#rate-amt-display').text(round_(percent_diff*100, 1)+'%');
		} else {
			var value_diff = chart_y_scale.invert(change_end_y) - chart_y_scale.invert(change_start_y);
			$('#rate-amt-display').text(round_(value_diff, 2));
		}
		var date_diff = d3_time.timeMonth.count( // Assume months! // TODO: Make programmatic
			chart_x_scale.invert(change_start_x), 
			chart_x_scale.invert(change_end_x)
		);
		$('#rate-time-display').text(' over '+date_diff+' months.');
	}
}

// TODO: ERROR: Won't work with dates that require interpolation (i.e. aren't full).
function update_highlights(){
	if(attribute_mode==='level'){
		bar_group
		.classed('true', function(d, i){
			return d.value>=chart_y_scale.invert(level_line_value);
		})
		.classed('hidden', false);
	} else if(attribute_mode==='rate-of-change'){
		var date_diff = d3_time.timeMonth.count( // Assume months! // TODO: Make programmatic
			chart_x_scale.invert(change_start_x), 
			chart_x_scale.invert(change_end_x)
		);
		if (percent_flag) {
			var percent_diff = -1 * Math.tanh( (change_end_y-change_start_y)/(change_end_x-change_start_x) );
		} else {
			var value_diff = chart_y_scale.invert(change_end_y) - chart_y_scale.invert(change_start_y);
		}
		bar_group
		.classed('true', function(d, i){
			if(i <= date_diff) {return false;}
			if (percent_flag) {
				var old_val = chart_data[i-date_diff].value;
				return (d.value - old_val)/old_val >= percent_diff;
			} else {
				return (d.value - chart_data[i-date_diff].value) >= value_diff;
			}
		})
		.classed('hidden', function(d, i){
			return i <= date_diff;
		});
	} else{
		return false;
	}
}

function get_level_line(pixel_height){
	return 'M0,'+pixel_height+'L'+svg_width+','+pixel_height;
}
function handle_level_line_dragmove(d, i){
	if(attribute_mode !== 'level') {return;}
	var height = d3.mouse(chart_area.node())[1];
	height = Math.min(svg_height, height);
	height = Math.max(0, height);
	level_line.attr('d', get_level_line(height))
	level_line_value = height;
	update_highlights();
	update_text();
};

function get_change_line_length(){
	return change_end_x - change_start_x;
}
function get_change_line_height(){
	return change_end_y - change_start_y;
}
function get_change_line(){
	return 'M'+change_start_x+','+change_start_y+'L'+change_end_x+','+change_end_y;
}
function handle_change_line_mousedown(d,i){
	if (attribute_mode !== 'rate-of-change') {return;}
	var mouse_pos = d3.mouse(chart_area.node());
	if(!change_line_active){
		change_start_x = mouse_pos[0];
		change_start_y = mouse_pos[1];
		change_end_x = change_start_x;
		change_end_y = change_start_y;
		change_line_active = true;
		update_highlights();
		update_text();
	} else {
		if (mouse_pos[0] < change_start_x) {return;}
		change_line_active = false;
		update_highlights();
		update_text();
	}
	change_line.attr('d', get_change_line);
}
function handle_change_line_mouseout(d,i){
	if (attribute_mode !== 'rate-of-change') {return;}
	var mouse_pos = d3.mouse(chart_area.node());
	change_end_x = mouse_pos[0];
	change_end_y = mouse_pos[1];
	change_line_active = false;
}
function handle_change_line_mousemove(d,i){
	if (attribute_mode !== 'rate-of-change') {return;}
	if(!change_line_active){return;}
	var mouse_pos = d3.mouse(chart_area.node());
	change_end_x = mouse_pos[0];
	change_end_y = mouse_pos[1];
	change_line.attr('d', get_change_line);
	if(change_end_x>change_start_x){
		update_highlights();
		update_text();
	}
}

// Deprecated?
// function load_chart_metadata(callback){
// 	console.log('Loading Chart Data');
// 	chart_periodicity = 'monthly';
// };

function load_chart_data_JSON(filename, callback){
	console.log('Loading Chart Data...');
	d3.json('../data/'+filename, function(error, data){
		if (error) callback(error, false);
		// if (error) throw error;
		chart_data = [];
		data.forEach(function(d) {
			chart_data.push({
				date: parse_date(d.dt),
				value: +d.vl,
			});
		});
		console.log('...Loaded Chart Data');
		callback(null, true);
	});
};

function all_true(l){return l.reduce(function(a,b){return a&b;});}
function on_load(error, results){
	if(all_true(results)){console.log('...Chart Data loaded successfuly.');}
	remove_chart_data();
	define_chart_y_scale();
	define_chart_x_scale();
	add_chart_data();
	update_highlights();
	update_text();
}

document.onload = (function(d3, queue){

	var svg_ = d3.select('#chart-holder')
		.append('svg')
			.attr('class', SVG_CLASS)
			.attr('width', svg_width)
			.attr('height', svg_height);

	chart_area = svg_
		.append('g')
			.attr('class', CHART_CLASS)
			.attr('width', chart_width)
			.attr('height', chart_height)
			.attr('transform', 'translate('+chart_margin.left+','+chart_margin.top+')')
			.on('mousedown', handle_change_line_mousedown)
			// .on('mouseup', handle_change_line_mouseup)
			.on('mousemove', handle_change_line_mousemove)
			.call(
				d3.behavior.drag()
					.on('drag', handle_level_line_dragmove)
			);

	chart_area.append('svg:marker')
		.attr('id', 'mark-end-arrow')
		.attr('viewBox', '0 -5 10 10')
		.attr('refX', 7)
		.attr('markerWidth', 3.5)
		.attr('markerHeight', 3.5)
		.attr('orient', 'auto')
		.append('svg:path')
		.attr('d', 'M0,-5L10,0L0,5')
		.style('stroke', '#FFF')
		.style('stroke-width', 2);

	change_line = chart_area.append('svg:path')
		.attr('class', 'change_line dragline hidden')
		.attr('d', 'M0,0L0,0')
		.style('marker-end', 'url(#mark-end-arrow)');

	level_line = chart_area.append('svg:path')
		.attr('class', 'level_line dragline')
		.attr('d', get_level_line(level_line_value));

	queue()
		.defer(load_chart_data_JSON, 'SP500.json')
	// 	.defer(load_historical_data)
	// 	.defer(load_model_metadata)
		.awaitAll(on_load);


})(window.d3, window.queue);