<?php
	// CAN DELETE THIS I THINK! REPLICATED BY get_Quandl_DB_info

	require_once "../KLogger.php"; // DEBUG
	$log = new KLogger ( "log.txt" , KLogger::DEBUG ); // DEBUG
	require_once "../config.php";
	
	$return = array();

	if(	!isset($_POST["q_database"]) or !isset($_POST["q_dataset"]) or 
			$_POST["q_database"]=="" or $_POST["q_dataset"]=="") {
		$return["error"] = array("User Error", "Quandl Database or Dataset not set.");
	} else {
		$q_database = $_POST["q_database"];
		$q_dataset = $_POST["q_dataset"];
		$query_string = "select `int_data_series_ID` from `T_DATA_SERIES_METADATA` where `txt_Quandl_dataset`='$q_database' and `txt_Quandl_database`='$q_dataset';";
		$query = mysqli_query($mysqli, $query_string);
		$return["exists"] = (mysqli_num_rows($query) > 0);
	}
	echo json_encode($return);
?>