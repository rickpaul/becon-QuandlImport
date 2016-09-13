<?php
	try{
		if(isset($_POST['a']) and isset($_POST['b']))
		{
			$search_term = $_POST['a']."/".$_POST['b'];
			echo $search_term;
		}
		else {
			echo json_encode(42);
		}
	} catch (Exception $e) {

	}
	echo $data;
?>
