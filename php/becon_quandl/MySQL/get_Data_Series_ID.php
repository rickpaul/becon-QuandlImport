<?php
	require_once "../config.php";

	try {
		// Get POST Variables
		$data_ticker = $_POST["data_ticker"];
		// Create and Execute Query
		$query = "select `int_data_series_ID` from `T_DATA_SERIES` where `txt_data_ticker`='$data_ticker'";
		// Return Found Rows (as success/failure)
		echo mysqli_num_rows($mysqli->query($query));
	} catch (Exception $e) {
		echo 0;
	}
?>