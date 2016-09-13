<?php
	//--------------------------------------------------------------
	// Taken from Quandl Code's Example Cache
	// Some minor changes made, especially around directory
	//--------------------------------------------------------------

	// This function will be called by the Quandl class.
	// When action == "get", you should return a cached
	// object or false.
	// When action == "set", you should perform the save 
	// operation to your cache.
	function cache_handler($action, $url, $data=null, $dir=__DIR__) {
		$cache_key = md5("quandl:$url");
		$cache_file = $dir . "/$cache_key";

		if($action == "get" and file_exists($cache_file)) 
			return file_get_contents($cache_file);
		else if($action == "set") 
			file_put_contents($cache_file, $data);
		
		return false;
	}
?>