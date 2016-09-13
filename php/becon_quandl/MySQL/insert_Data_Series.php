<?php
	require_once "../config.php";

	try {
		if(	!isset($_POST["data_name"]) or !isset($_POST["data_ticker"]) or $_POST["data_name"]=="" or $_POST["data_ticker"]=="") {
			$return["error"] = array("User Error", "Quandl Database or Dataset not set.");
		} else {
			$name = $_POST["data_name"];
			$ticker = $_POST["data_ticker"];
			$q_database = $_POST["q_database"];
			$q_dataset = $_POST["q_dataset"];
			// Create DATA_SERIES table entry
			$query = "insert into `T_DATA_SERIES`";
			$query .= " (`txt_data_name`, `txt_data_ticker`)  values  ('$name', '$ticker');";
			$result = $mysqli->query($query);
			// Create METADATA table entry
			$series_ID = $mysqli->insert_id;
			$query = "insert into `T_DATA_SERIES_METADATA`";
			$query .= " (`int_data_series_ID`, `txt_Quandl_Database`, `txt_Quandl_Dataset`)"; 
			$query .= " values  ($series_ID, '$q_database', '$q_dataset');";
			$mysqli->query($query);
			// Return Series ID (as success/failure)
			$return["results"]  = $series_ID;
		}
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	echo json_encode($return);
?>