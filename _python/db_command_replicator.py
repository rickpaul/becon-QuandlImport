# from lib_DB			import SQLITE_MODE, MYSQL_MODE
# from lib_EMF		import TEMP_MODE, TEST_MODE, QA_MODE, PROD_MODE
# from util_EMF		import get_DB_Handle
# from	util_QuandlAPI	import codify_periodicity, stringify_periodicity
# from	util_TimeSet 	import dt_str_Y_M_D_to_epoch as YMD_to_epoch
# from	util_TimeSet 	import dt_epoch_to_str_Y_M_D as epoch_to_YMD
# from	util_TimeSet 	import str_Y_M_D_is_end_of_month as YMD_is_EoM

# import lib_DBInstructions as lib_DB_Inst

# db_handl = get_DB_Handle(EMF_mode=TEMP_MODE, DB_mode=MYSQL_MODE, allow_delete=False)

import util_DB as DB_util


def get_insert_DataSeriesID_Statement(name, ticker): # from lib_DBInstructions
	table = 'T_DATA_SERIES'
	columns = ['txt_data_name', 'txt_data_ticker']
	values = [name, ticker]
	return DB_util.generateInsertStatement(table, columns, values)
def get_insert_DataSeriesID_Metadata(seriesID): # from lib_DBInstructions
	table = 'T_DATA_SERIES_METADATA'
	columns = ['int_data_series_ID']
	values = [seriesID]
	return DB_util.generateInsertStatement(table, columns, values)
def get_insertOrUpdateDataPoint_DataHistoryTable_Statement(seriesID, date, value, interpolated, forecast):
	table = 'T_DATA_HISTORY'
	insert_columns = ['int_data_series_ID', 'dt_date_time', 'flt_data_value', 'bool_is_interpolated', 'bool_is_forecast']
	insert_values = [seriesID, date, value, int(interpolated), int(forecast)]
	update_columns = ['flt_data_value', 'bool_is_interpolated', 'bool_is_forecast']
	update_values = [value, int(interpolated), int(forecast)]
	return DB_util.generateInsertOrUpdateStatement_MySQL(table, insert_columns, insert_values, update_columns, update_values)


def get_retrieve_DataSeriesMetaData_Statement(seriesID, columnName): # from lib_DBInstructions
	table = DataColumnTableLink[columnName]
	sC = [columnName]
	wC = ['int_data_series_ID']
	wV = [seriesID]
	wO = ['=']
	return DB_util.generateSelectStatement(	table, 
											whereColumns=wC, 
											whereValues=wV, 
											whereOperators=wO,
											selectColumns=sC)

def get_update_DataSeriesMetaData_Statement(seriesID, columnName, value): # from lib_DBInstructions
	table = DataColumnTableLink[columnName]
	setColumns = [columnName]
	setValues = [value]
	whereColumns = ['int_data_series_ID']
	whereValues = [seriesID]
	return DB_util.generateUpdateStatement(table, setColumns, setValues, whereColumns, whereValues)

if __name__ == '__main__':
	print get_insertOrUpdateDataPoint_DataHistoryTable_Statement(*range(0,5))


