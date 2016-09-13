<?php
	require_once "../KLogger.php"; // DEBUG
	$log = new KLogger ( "log.txt" , KLogger::DEBUG ); // DEBUG
	require_once "../config.php";
	require_once "./Quandl.php";
	// require_once "Quandl_cache_handler.php";
	function tearDown() {
		$this->cache_file and unlink($this->cache_file);
	}
	$log->logDebug(json_encode($_POST)); // DEBUG
	$return = array();
	$is_error = false;
	$collapse_instr = $_POST["options"]["collapse_instr"];
	try {
		$log->logDebug('here2');
		$quandl_handle = new Quandl($api_key, "json");
		$log->logDebug('here3');
		if(isset($_POST["use_cache"]) and $_POST["use_cache"]=="true"){
			//$quandl_handle->cache_handler = array($this, "cacheHandler"); // TODO: FILL
		} else {
			$quandl_handle->cache_handler = null;
		}
		// Check for obvious input errors
		if(!isset($_POST["q_database"]) or !isset($_POST["q_dataset"])) {
			$return["error"] = array("User Error", "Quandl Database or Dataset not set.");
		} elseif ($_POST["q_database"]=="" or $_POST["q_dataset"]=="") {
			$return["error"] = array("User Error", "Quandl Database or Dataset not set.");
		} else {
			$search_term = $_POST["q_database"]."/".$_POST["q_dataset"];
		}
		// Make query
		if(!$return["error"])
		{
			$log->logDebug('here'); // DEBUG
			$return["result"] = $quandl_handle->getSymbol($search_term, [
					// "trim_start" => "today-30 days",
					// "trim_end"   => "today",
					"collapse" => "monthly", // none|daily|weekly|monthly|quarterly|annual
					"order" => "asc", // asc|desc
					// "column_index" => 1,
					// "limit"
				]);
			$log->logDebug($quandl_handle->url); // DEBUG
			if($quandl_handle->error and !$result) {
				$return->error = array("Quandl Error", $quandl_handle->error);
			}
		}
	} catch (Exception $e) {
		$return["error"] = array("Unknown Error", $e);
	}
	echo json_encode($return);
?>