<?php
	date_default_timezone_set('UTC');
	require_once "../KLogger.php"; // DEBUG
	$log = new KLogger ("../../../_logfiles/get_Quandl_DB_info.log", KLogger::DEBUG); // DEBUG
	$log->logDebug('Log Initialized.'); // DEBUG
	require_once "../config.php";
	require_once "EMF_DB_Handle.php";
	
	$return = array();
	try {
		if(	!isset($_POST["q_database"]) or !isset($_POST["q_dataset"]) or 
				$_POST["q_database"]=="" or $_POST["q_dataset"]=="") {
			$return["error"] = array("User Error", "Quandl Database or Dataset not set.");
		} else {
			$q_database = $_POST["q_database"];
			$q_dataset = $_POST["q_dataset"];
			$query = EMF_DB_Handle::prepare_statement($EMF_mysqli, "
			SELECT 
				s.`int_data_series_ID`, s.`txt_data_name`, s.`txt_data_ticker` 
			FROM
				`T_DATA_SERIES_METADATA` m left join `T_DATA_SERIES` s on s.`int_data_series_ID`=m.`int_data_series_ID` 
			WHERE
				m.`txt_Quandl_Dataset`=? and m.`txt_Quandl_Database`=?;");
			$query->bind_param('ss', $q_dataset, $q_database);
			$return = EMF_DB_Handle::perform_retrieval_single_row($EMF_mysqli, $query, $log);
		}
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	echo json_encode($return);
?>