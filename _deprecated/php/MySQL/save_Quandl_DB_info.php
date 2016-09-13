<?php
	// require_once "../KLogger.php"; // DEBUG
	// $log = new KLogger ( "log.txt" , KLogger::DEBUG ); // DEBUG
	// $insert_series_query = "insert into `T_DATA_SERIES`  ( `txt_data_name`, `txt_data_ticker` )  values  ( $name, $ticker ) ;"
	// $insert_meta_query = "insert into `T_DATA_SERIES_METADATA`  ( `int_data_series_ID` )  values  ( $series_ID ) ;"
	// $insert_data_query = "insert into `T_DATA_HISTORY`  ( `int_data_series_ID`, `dt_date_time`, `flt_data_value`, `bool_is_interpolated`, `bool_is_forecast` )  values  ( $series_ID, $date, $value, $interpolated, $forecast )  on duplicate key update `flt_data_value`=$value , `bool_is_interpolated`=$interpolated , `bool_is_forecast`=$forecast;"

	require_once "../config.php";
	
	$return = array();
	try {
		if(	!isset($_POST["q_database"]) or !isset($_POST["q_dataset"]) or $_POST["q_database"]=="" or $_POST["q_dataset"]=="") {
			$return["error"] = array("User Error", "Quandl Database or Dataset not set.");
		} else if(	!isset($_POST["db_name"]) or !isset($_POST["db_ticker"]) or $_POST["db_name"]=="" or $_POST["db_ticker"]=="") {
			$return["error"] = array("User Error", "Local name or ticker not set.");
		} else {
			$q_database = $_POST["q_database"];
			$q_dataset = $_POST["q_dataset"];

			$query_string = "SELECT s.`int_data_series_ID`, s.`txt_data_name`, s.`txt_data_ticker` ";
			$query_string .= "FROM `T_DATA_SERIES_METADATA` m LEFT JOIN `T_DATA_SERIES` s on s.`int_data_series_ID`=m.`int_data_series_ID` ";
			$query_string .= "WHERE m.`txt_Quandl_Dataset`='$q_dataset' and m.`txt_Quandl_Database`='$q_database';";
			// $log->logDebug($query_string); // DEBUG
			$results = mysqli_fetch_array(mysqli_query($mysqli, $query_string));
			$return["results"] = $results;
			// $log->logDebug(json_encode($return)); // DEBUG
		}
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	echo json_encode($return);
?>