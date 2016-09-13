var Chart = function(svg_) {
	'use strict'
	chart = this;
	// Calibrate SVG Display
	this.svg = svg_;
	this.chart_height = null;
	this.chart_width = null;
	this.update_svg_size();

	// Set Up Queue Functions
	this.async_tasks = 0;

	this.chart_data = [];

	this.svg_height = null;
	this.svg_width = null;
	
	this.bar_group = null;
	this.chart_line = null;

	this.chart_area = svg_
		.append('g')
			.attr('class', 'chart-area')
			.attr('width', this.chart_width)
			.attr('height', this.chart_height)
			.attr('transform', 'translate('+CHART_AXIS_MARGINS.left+','+CHART_AXIS_MARGINS.top+')')
			.on('mousedown', function(d){ chart.handle_change_line_mousedown.call(chart, d); })
			// .on('mouseup', function(d){ chart.hand.call(chart, d); })
			.on('mousemove', function(d){ chart.handle_change_line_mousemove.call(chart, d); })
			.call(
				d3.behavior.drag()
					// .on('dragstart', function(d){console.log('dragstart');}) // DEBUG
					// .on('dragend', function(d){console.log('dragend');}) // DEBUG
					.on('drag', function(d){ chart.handle_level_line_dragmove.call(chart, d);})
			);

	this.chart_area
		.append('svg:marker')
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

	this.change_line = this.chart_area
		.append('svg:path')
			.attr('class', 'change_line dragline hidden')
			.attr('d', 'M0,0L0,0')
			.style('marker-end', 'url(#mark-end-arrow)');

	this._attribute_mode = ATTRIBUTE_MODE_DEFAULT;
	this._percent_flag = PERCENT_FLAG_DEFAULT;
	// Define Attribute Lines
	this.change_line_active = CHANGE_LINE_DEFAULT;
	this.change_end_x = null;
	this.change_start_x = null;
	this.change_end_y = null;
	this.change_start_y = null;
	this.level_line_value = this.chart_height/2;
	this.level_line = this.chart_area.append('svg:path')
		.attr('class', 'level_line dragline')
		.attr('d', this.get_level_line_svg(this.level_line_value));
	// Define Scales
	this.chart_x_scale = d3.time.scale().range([0, this.chart_width]);
	this.chart_y_scale = d3.scale.linear().range([this.chart_height, 0]);
	// Define Axes
	this.chart_x_axis = d3.svg.axis().scale(this.chart_x_scale).orient('bottom');
	this.chart_y_axis = d3.svg.axis().scale(this.chart_y_scale).orient('left');

	// Update for changes in lines
	// this.update_chart();
};

Chart.prototype = {
	////////////////////////////////////////////////////////////////////////////
	// Async Queue Functions
	////////////////////////////////////////////////////////////////////////////
	increment_task_count: function(callback) {
		if(this.async_tasks === 0){
			$('#txt-status').text('Loading...');
		}
		this.async_tasks+=1;
		console.log('++ASYNC TASKS: ' + this.async_tasks);
		if(callback){callback(null, 1);}
	},
	decrement_task_count: function(callback) {
		this.async_tasks-=1;
		if(this.async_tasks === 0){
			$('#txt-status').text('Loaded!');
		}
		console.log('--ASYNC TASKS: ' + this.async_tasks);
		if(callback){callback(null, -1);}
	},
	////////////////////////////////////////////////////////////////////////////
	// Data Load Functions
	////////////////////////////////////////////////////////////////////////////	
	load_chart_data: function(chart_data_) {
		this.chart_data = chart_data_;
	},
	load_chart_data_JSON: function(filename, callback){
		console.log('Loading Chart Data...');
		d3.json('../data/'+filename, function(error, data){
			if (error) callback(error, false);
			var chart_data = [];
			data.forEach(function(d) {
				chart_data.push({
					date: parse_date(d.dt),
					value: +d.vl,
				});
			});
			chart.load_chart_data(chart_data);
			console.log('...Loaded Chart Data (' + chart_data.length + ' points)');
			callback(null, true);
		});
	},
	////////////////////////////////////////////////////////////////////////////
	// Chart Functions
	////////////////////////////////////////////////////////////////////////////
	add_bar_group: function() {
		this.bar_group = this.chart_area
			.append('g')
			.attr('class', 'bar_group_holder')
			.selectAll('rect')
			.data(this.chart_data);
	},
	add_chart_line: function() {
		var chart_x_scale = this.chart_x_scale;
		var chart_y_scale = this.chart_y_scale;
		this.chart_line = d3.svg.line()
			.interpolate('linear')
			.x(function(d){ return chart_x_scale(d.date); })
			.y(function(d){ return chart_y_scale(d.value); });
	},
	plot_chart_data: function() {
		var data_length = this.chart_data.length;
		var chart_x_scale = this.chart_x_scale;
		// var chart_data = this.chart_data;
		// Add and Color Bar Group
		this.bar_group
		.enter()
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
			.attr('height', this.chart_height)
			.attr('width', function(d, i) {
				if(i < (data_length-1)){
					return chart_x_scale(chart_data[i+1].date) - chart_x_scale(chart_data[i].date);
				}else{
					return 0;
				}
			});
		// Add and Color Chart Line
		this.chart_area.append('path')
			.datum(this.chart_data)
			.attr('class', 'chart_line')
			.attr('d', this.chart_line);
	},
	reload_chart: function() {
		this.remove_chart_data();
		this.define_chart_x_scale();
		this.define_chart_y_scale();
		this.add_x_axis(); // need to remove and re-add?
		this.add_y_axis(); // need to remove and re-add?
		this.add_bar_group();
		this.add_chart_line();
		this.plot_chart_data();
		this.update_chart();
	},
	add_x_axis: function() {
		this.chart_area.append('g')
			.attr('class', 'axis')
			.attr('transform', 'translate(0,'+this.chart_height+')')
			.call(this.chart_x_axis);
	},
	add_y_axis: function() {
		this.chart_area.append('g')
			.attr('class', 'axis')
			.call(this.chart_y_axis);
	},
	remove_chart_data: function() {
		this.chart_area.selectAll('.axis').remove(); // need to remove and re-add?
		this.chart_area.selectAll('.bar_group_holder').remove();
		this.chart_area.selectAll('.chart_line').remove();
	},
	define_chart_y_scale: function() {
		this.chart_y_scale.domain(d3.extent(this.chart_data.map(function(d){return d.value;})));
	},
	define_chart_x_scale: function() {
		this.chart_x_scale.domain(d3.extent(this.chart_data.map(function(d){return d.date;})));
	},
	handle_level_line_dragmove: function(d) {
		if(this.attribute_mode !== 'level') {return;}
		var h_ = d3.mouse(this.chart_area.node())[1];
		h_ = Math.min(this.chart_height, h_); // this used to be svg_height. We cool?
		h_ = Math.max(0, h_);
		this.level_line.attr('d', this.get_level_line_svg(h_))
		this.level_line_value = h_;
		this.update_chart();
	},
	handle_change_line_mousedown: function(d) {
		if (this.attribute_mode !== 'rate-of-change') {return;}
		var mouse_pos = d3.mouse(this.chart_area.node());
		if(!this.change_line_active){
			this.change_start_x = mouse_pos[0];
			this.change_start_y = mouse_pos[1];
			this.change_end_x = this.change_start_x;
			this.change_end_y = this.change_start_y;
			this.change_line_active = true;
		} else {
			if (mouse_pos[0] < this.change_start_x) {return;}
			this.change_line_active = false;
		}
		this.change_line.attr('d', this.get_change_line_svg());
	},
	// handle_change_line_mouseout: function(d) { // DEPRECATED. DELETE!
	// 	console.log('handle_change_line_mouseout'); // DEBUG
	// 	if (this.attribute_mode !== 'rate-of-change') {return;}
	// 	var mouse_pos = d3.mouse(this.chart_area.node());
	// 	this.change_end_x = mouse_pos[0];
	// 	this.change_end_y = mouse_pos[1];
	// 	// this.change_line_active = false;
	// },
	handle_change_line_mousemove: function(d) {
		if (this.attribute_mode !== 'rate-of-change') {return;}
		if(!this.change_line_active){return;}
		var mouse_pos = d3.mouse(this.chart_area.node());
		this.change_end_x = mouse_pos[0];
		this.change_end_y = mouse_pos[1];
		this.change_line.attr('d', this.get_change_line_svg());
		if(this.change_end_x > this.change_start_x){
			this.update_chart();
		}
	},
	////////////////////////////////////////////////////////////////////////////
	// Attribute Line Functions
	////////////////////////////////////////////////////////////////////////////
	get attribute_mode() {
		return this._attribute_mode;
	},
	set attribute_mode(value_) {
		if (value_ === 'level'){
			this._attribute_mode = 'level';
			this.level_line.classed('hidden', false);
			this.change_line.classed('hidden', true);
		} else if (value_ === 'rate-of-change'){
			this._attribute_mode = 'rate-of-change';
			this.change_line.classed('hidden', false);
			this.level_line.classed('hidden', true);
		} else{
			throw new Error('attribute mode not recognized');
		}
		this.update_chart();
	},
	get percent_flag() {
		return this._percent_flag;
	},
	set percent_flag(value_) {
		this._percent_flag = value_;
		this.update_chart();
	},
	get_change_line_length_raw: function(){ // Deprecated?
		return this.change_end_x - this.change_start_x;
	},
	get_level_line_height_value: function(){
		return this.chart_y_scale.invert(this.level_line_value);
	},
	get_change_line_length_time: function(){
		return d3_time.timeMonth.count( // Assume months! // TODO: Make programmatic
			this.chart_x_scale.invert(this.change_start_x), 
			this.chart_x_scale.invert(this.change_end_x)
		);
	},
	get_change_line_height_raw: function(){ // Deprecated?
		return this.change_end_y - this.change_start_y;
	},
	get_change_line_height_percent: function(){
		return (-1 * Math.tanh((this.change_end_y-this.change_start_y)/(this.change_end_x-this.change_start_x)));
	},
	get_change_line_height_value: function(){
		return this.chart_y_scale.invert(this.change_end_y) - this.chart_y_scale.invert(this.change_start_y);
	},
	get_level_line_svg: function(h_){
		return 'M0,'+h_+'L'+this.chart_width+','+h_; // this used to be svg_width. We cool?
	},
	get_change_line_svg: function(){
		return 'M'+this.change_start_x+','+this.change_start_y+'L'+this.change_end_x+','+this.change_end_y;
	},
	////////////////////////////////////////////////////////////////////////////
	// Mechanical Functions
	////////////////////////////////////////////////////////////////////////////
	update_svg_size: function(){
		'use strict'
		var	container_ = document.getElementById('chart-holder');
		var w_ = container_.clientWidth;
		var h_ = container_.clientHeight;
		// set svg width and height
		this.svg.attr('width', w_).attr('height', h_);
		this.chart_height = h_ - CHART_AXIS_MARGINS.top - CHART_AXIS_MARGINS.bottom;
		this.chart_width = w_ - CHART_AXIS_MARGINS.left - CHART_AXIS_MARGINS.right;
	},
	////////////////////////////////////////////////////////////////////////////
	//  Functions
	////////////////////////////////////////////////////////////////////////////
	update_attribute_text: function() {
		if(this.attribute_mode==='level'){
			$('#rate-time-display').text('');
			$('#rate-amt-display').text('');
			$('#lvl-amt-display').text(round_(this.chart_y_scale.invert(this.level_line_value),2));
		} else if(this.attribute_mode==='rate-of-change'){
			$('#lvl-amt-display').text('');
			if (this.percent_flag) {
				var percent_diff = this.get_change_line_height_percent();
				$('#rate-amt-display').text(round_(percent_diff*100, 1)+'%');
			} else {
				var value_diff = this.get_change_line_height_value();
				$('#rate-amt-display').text(round_(value_diff, 2));
			}
			var date_diff = this.get_change_line_length_time();
			$('#rate-time-display').text(' over ' + date_diff + ' months.');
		}
	},
	// TODO: ERROR: Won't work with dates that require interpolation (i.e. aren't full).
	update_attribute_highlights: function() {
		if(this.attribute_mode==='level'){
			var value_ = this.get_level_line_height_value();
			this.bar_group
				.classed('true', function(d, i){
					return d.value >= value_;
				})
				.classed('hidden', false);
		} else if(this.attribute_mode==='rate-of-change'){
			var this_ = this;
			var date_diff = this.get_change_line_length_time();
			if (this.percent_flag) {
				var percent_diff = this.get_change_line_height_percent();
				this.bar_group
					.classed('true', function(d, i){
						if(i <= date_diff) {return false;}
						var old_val = this_.chart_data[i-date_diff].value;
						return (d.value - old_val)/old_val >= percent_diff;
					});
			} else {
				var value_diff = this.get_change_line_height_value();
				this.bar_group
					.classed('true', function(d, i){
						if(i <= date_diff) {return false;}
						return (d.value - this_.chart_data[i-date_diff].value) >= value_diff;
					});
			}
			this.bar_group
				.classed('hidden', function(d, i){
					return i <= date_diff;
				});
			
		} else{
			return false;
		}
	},
	update_chart: function() {
		this.update_attribute_text();
		this.update_attribute_highlights();
	},
};

