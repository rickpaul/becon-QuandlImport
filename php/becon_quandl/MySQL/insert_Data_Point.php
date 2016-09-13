<?php
	require_once "../config.php";
	require_once "../KLogger.php"; // DEBUG
	$log = new KLogger ( "../../_logfiles/log.log" , KLogger::DEBUG ); // DEBUG
	$log->logDebug('Log Initialized.');
	try {
		// Get POST Variables
		$series_ID = $_POST["series_ID"];
		$date = $_POST["date"];
		$value = $_POST["value"];
		$interpolated = $_POST["interpolated"];
		$forecast = $_POST["forecast"];
		// Create and Execute Query
		$query = "insert into `T_DATA_HISTORY`";
		$query .= " (`int_data_series_ID`, `dt_date_time`, `flt_data_value`, `bool_is_interpolated`, `bool_is_forecast`)"; 
		$query .= " values  ($series_ID, $date, $value, $interpolated, $forecast) ";
		$query .= " on duplicate key update `flt_data_value`=$value, `bool_is_interpolated`=$interpolated, `bool_is_forecast`=$forecast;";
		$log->logDebug($query);
		$mysqli->query($query);
		$log->logDebug($mysqli->affected_rows);
		// Return Affected Rows (as success/failure)
		if ($mysqli->affected_rows > 0) {
			echo 1;
		} else {
			echo 0;
		}
	} catch (Exception $e) {
		$log->logDebug($e);
		echo 0;
	}
?>