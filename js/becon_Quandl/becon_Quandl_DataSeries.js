var DataSeries = function() {
	// Data Series Data
	this.data_series_in_DB = null;
	this.data_series_ID = null;
	this.data_ticker = null;
	this.data_name = null;
	this.data_start_date = null;
	this.data_end_date = null;

	// Data Series Data

	// Quandl Data
	this.quandl_DS = null;
	this.quandl_DB = null;

	// Quandl Metadata
	this.qndl_natural_start_date = null;
	this.qndl_natural_end_date = null;
	this.qndl_update_date = null;
	this.qndl_update_time = null;
	this.qndl_natural_frequency = null;
	this.qndl_retrieved_frequency = null;
	this.qndl_name = null;
	this.qndl_source = null;
	this.qndl_column_count = null;
	this.qndl_column_name = null;
};
///////////////////////////////////////////////////////////////////////////////
// PROPERTY DEFINITIONS
///////////////////////////////////////////////////////////////////////////////
Object.defineProperty(DataSeries, 'is_updateable', {
	get: function(){};
})
///////////////////////////////////////////////////////////////////////////////
// PROTOTYPE DEFINITIONS
///////////////////////////////////////////////////////////////////////////////
DataSeries.prototype.attempt_data_retrieval = function(q_database, q_dataset) {
	var callback_ = function(error, data) {
		if( error ) { throw error; }
		this.quandl_DB = q_database;
		this.quandl_DS = q_dataset;
		this.qndl_natural_start_date = null;
		this.qndl_natural_end_date = null;
		this.qndl_update_date = null;
		this.qndl_update_time = null;
		this.qndl_natural_frequency = null;
		this.qndl_retrieved_frequency = null;
		this.qndl_name = null;
		this.qndl_source = null;
		this.qndl_column_count = null;
		this.qndl_column_name = null;
		// Display New Metadata
		WEB_display_Quandl_Metadata();
	};
AJAX_retrieve_Quandl_Data_request(q_database, q_dataset, callback_);
};
DataSeries.prototype.check_DataSeries_in_DB = function(q_database, q_dataset) {
	AJAX_check_Quandl_DS_In_DB(q_database, q_dataset, function(){
		
	});
};
