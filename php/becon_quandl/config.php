<?php
	// Set Timezone
	date_default_timezone_set('UTC');
	// Set Up Logger
	require_once "KLogger.php";
	// This path is relative from the 'require_once' caller.
	$log = new KLogger ("../../../_logfiles/config.log", KLogger::DEBUG); // DEBUG
	// MYSQL
	$EMF_mysqli = new mysqli("localhost", "root", "[]{}[]", "EMF_Temp");
	if ($EMF_mysqli->connect_errno) {
		$log->logError("Failed to connect to EMF MySQL: (" . $EMF_mysqli->connect_errno . ") " . $mysqli->connect_error);
	} else {
		$log->logDebug("EMF MySQL Login Successful!");
	}
	// QUANDL API
	$api_key = "pmM4BUFqzx1FetXxbj1x";
?>