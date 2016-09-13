<?php

require_once "../config.php";

date_default_timezone_set('UTC');

class EMF_DB_Handle {
	// public static function Quandl_Dataset_Exists($mysqli, $Quandl_DB, $Quandl_DS) {
	// 	$query = "select int_data_series_ID from T_DATA_SERIES_METADATA where txt_Quandl_dataset='$Quandl_DB' and txt_Quandl_database='$Quandl_DS';";
	// 	return (mysqli_num_rows($query) > 0);
	// }
	// public static function EMF_Name_Ticker_Exists($mysqli, $EMF_Name, $EMF_Ticker) {
	// 	$query = mysqli_query($mysqli, "select int_data_series_ID from T_DATA_SERIES where txt_data_name=$EMF_Name or txt_data_ticker=$EMF_Ticker;");
	// 	return (mysqli_num_rows($query) > 0);
	// }

// 	public static function perform_insert_or_update($mysqli, $query) {
// 		$return = array();
// 		try {
// 			// Fetch Query Results
// 			$query_result = $mysqli->query($query);
// 			// Return Affected Rows (as success/failure)
// 			// (Note: Will return 0 if nothing is changed.)
// 			if ($mysqli->affected_rows != -1) {
// 				$return["results"] = $mysqli->affected_rows;
// 			} else {
// 				$return["error"] = array("MySQL Error", $mysqli->error);
// 			}
// 		} catch (Exception $e) {
// 			$return["error"] = array("Unknown PHP Error", $e);
// 		}
// 		return $return;
// 	}
// 	public static function perform_retrieval_multi_row($mysqli, $query) {
// 		$return = array();
// 		try {
// 			// Fetch Query Results
// 			$query_result = $mysqli->query($query);
// 			// Parse Results Into Array
// 			$results_array = array();
// 			while ($row = $query_result->fetch_assoc()) {
// 				$results_array[] = $row;
// 			}
// 			$return["results"] = $results_array;
// 		} catch (Exception $e) {
// 			$return["error"] = array("Unknown PHP Error", $e);
// 		}
// 		return $return;
// 		mysqli_free_result($query_result);
// 	}
// 	public static function perform_retrieval_single_row($mysqli, $query) {
// 		$return = array();
// 		try {
// 			// Fetch Query Results
// 			$query_result = $mysqli->query($query);
// 			// Parse Results Into Array
// 			$results = $query_result->fetch_assoc();
// 			$return["results"] = $results;
// 		} catch (Exception $e) {
// 			$return["error"] = array("Unknown PHP Error", $e);
// 		}
// 		return $return;
// 		mysqli_free_result($query_result);
// 	}
// }


	public static function perform_retrieval_single_row($mysqli, $stmt, $log = null) {
		$return = array();
		try {
			// Fetch Query Results
			$stmt->execute();
			$query_result = $stmt->get_result();
			// Parse Results Into Array
			$return["results"] = $query_result->fetch_array(MYSQL_ASSOC);
		} catch (Exception $e) {
			$return["error"] = array("Unknown PHP Error", $e);
		}
		$stmt->close();
		return $return;
	}
	public static function prepare_statement($mysqli, $query, $log = null) {
		$stmt = $mysqli->stmt_init();
		if(!$stmt->prepare($query) && $log !== null)
		{
			$log->logError("SQL Error: Statement query could not be prepared.");
		}
		return $stmt;
	}

}

	


?>
