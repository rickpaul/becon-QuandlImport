<html>
<head>
	<meta charset='UTF-8'>
	<meta name='author' content='becon'>
	<meta name='description' content='beconae@gmail.com'>
	<title>Becon | Q.Import</title>
	<link rel='shortcut icon' href='img/favicon.png' width='32px' height='64px'/>
<!-- CSS -->
<!-- CSS / Bootstrap -->
	<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'>
	<link rel='stylesheet' href='/lib/bootstrap/bootstrap.min.css'>
<!-- CSS / Custom -->
	<link rel='stylesheet' type='text/css' href='css/custom.css'>
<!-- JavaScript -->
<!-- JavaScript / jQuery  -->
	<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'></script>
	<script src='/lib/jquery/jquery.min.js'></script>
<!-- JavaScript / Bootstrap -->
	<script src='http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'></script>
	<script src='/lib/bootstrap/bootstrap.min.js'></script>
<!-- JavaScript / D3 -->
	<script src='https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.12/d3.min.js'></script>
	<script src='/lib/d3/d3.v3.min.js'></script>
<!-- JavaScript / D3-Time -->
	<script src='https://d3js.org/d3-time.v0.2.min.js'></script>
	<script src='/lib/d3-time/d3-time.min.js'></script>
<!-- JavaScript / Queue -->
	<script src='https://cdnjs.cloudflare.com/ajax/libs/queue-async/1.0.7/queue.min.js'></script>
	<script src='/lib/queue/queue.min.js'></script>
<!-- JavaScript / Custom / Fade In Script -->
	<script> setTimeout( function(){ $('svg-area').fadeIn(500);}, 100); </script>
</head>
<body>
	<div class='navbar navbar-default navbar-fixed-top  navOp'>
		<div class='container'>
			<div class='navbar-header'>
				<button class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
					<span class='icon-bar'></span>
					<span class='icon-bar'></span>
					<span class='icon-bar'></span>
				</button>
				<div id='cd-logo'><a href='#0'><img src='img/cd-logo.svg' class='img-responsive' alt='Logo'></a>
				</div>
			</div>
			<div class='collapse navbar-collapse'>
				<form class='navbar-form navbar-right'>
					<!-- link to home / check MySQL -->
					<button type='submit' name='sub' value='Home' class='btn btn-success'>Log Out</button>
				</form>
			</div>
		</div>
	</div>
	<div class='row'>
		<div id='chart-holder'>
		</div>
		<div id='cntrl-holder'>
			<form class='form-horizontal' id='form-Quandl-input' role='form' autocomplete='off'>
				<div class='form-group'>
					<label class='control-label col-sm-2' for='form-Quandl-input'>Quandl Database:</label>
					<input class='col-sm-2' for='form-Quandl-input' type='text' id='Quandl-DB-input' placeholder='Quandl Database' required>
					<label class='control-label col-sm-2' for='form-Quandl-input'>Quandl Dataset:</label>
					<input class='col-sm-2' for='form-Quandl-input' type='text' id='Quandl-DS-input' placeholder='Quandl Dataset' required>
					<a id='btn_retrieve_quandl'>
						<input class='col-sm-offset-1' type='button' value='Retrieve Quandl Series' />
					</a>
				</div>
			</form>
			<div class='col-sm-offset-1 col-sm-12' id='Quandl_metadata_1'>
				<p class='p_label'>Name:</p><p id='Q_mdata_name'></p>
				<p class='p_label'>Source:</p><p id='Q_mdata_source'></p>
				<p class='p_label'>DS Start Date:</p><p id='Q_mdata_natural_start'></p>
				<p class='p_label'>DS End Date:</p><p id='Q_mdata_natural_end'></p>
				<p class='p_label'>DS Frequency:</p><p id='Q_mdata_natural_frequency'></p>
				<p class='p_label'>Last Update:</p><p id='Q_mdata_update'></p>
			</div>
			<div class='col-sm-offset-1 col-sm-12' id='Quandl_metadata_2'>
				<p class='p_label'>Column Count:</p><p id='Q_mdata_num_cols'></p>
				<p class='p_label'>Column Name:</p><p id='Q_mdata_col_name'></p>
			</div>
			<div class='spacer'></div>
			<div class='spacer'></div>
			<div class='form-group'>
				<form class='form-horizontal' id='form-save-local' role='form' autocomplete='off'>
					<div class='form-group'>
						<label class='control-label col-sm-2' for='form-save-local'>Local Data Ticker:</label>
						<input class='col-sm-2' for='form-save-local' type='text' id='input-db-dataTicker' placeholder='Local Data Ticker' required>
						<label class='control-label col-sm-2' for='form-save-local'>Local Data Name:</label>
						<input class='col-sm-2' for='form-save-local' type='text' id='input-db-dataName' placeholder='Local Data Name' required>
						<a id='btn_save_quandl'>
							<input class='col-sm-offset-1' type='button' value='Save Quandl Series' />
						</a>
						<a id='btn_save_history'>
							<input class='col-sm-offset-1' type='button' value='Save Series History' />
						</a>
					</div>
				</form>
			</div>
			<div class='spacer'></div>
			<div class='form-group'>
				<div class='radio col-sm-offset-1' id='attribute-input-control'>
					<label class='radio-inline'><input type='radio' name='attribute-input-control' id='attribute-level'checked='checked'> Level</label>
					<label class='radio-inline'><input type='radio' name='attribute-input-control' id='attribute-change'> Rate of Change</label>
				</div>
				<div class='radio col-sm-offset-1'>
					<label class='radio-inline'><input type='radio' name='attribute-unit-control' id='attribute-unit-percent' checked='checked'> Percent Change</label>
					<label class='radio-inline'><input type='radio' name='attribute-unit-control' id='attribute-unit-absolute'> Absolute Change</label>
				</div>
				<div class='radio col-sm-offset-1'>
					<p id='lvl-amt-display'></p>
					<p id='rate-amt-display'></p>
					<p id='rate-time-display'></p>
				</div>
			</div>
		</div>
	</div>
</body>
<!-- JavaScript / Custom -->
	<script src='/lib/_custom/custom_math.js'></script>
	<script src='/js/becon_Quandl/becon_Quandl_Settings.js'></script>
	<script src='/js/becon_Quandl/becon_Quandl_AJAX.js'></script>
	<script src='/js/becon_Quandl/becon_Quandl_Web.js'></script>
	<script src='/js/becon_Quandl/becon_Quandl_Chart.js'></script>
	<script src='/js/becon_Quandl/becon_Quandl.js'></script>
	<script type="text/javascript">
		window.onload = function(){
			$('input[name=attribute-input-control]:radio').on('change', WEB_change_attribute_type);
			$('input[name=attribute-unit-control]:radio').on('change', WEB_change_attribute_unit_type);
			$('#btn_retrieve_quandl').bind('click', WEB_retrieve_Quandl_Data);
			$('#btn_save_quandl').bind('click', WEB_save_Quandl_Series);
			$('#btn_save_history').bind('click', WEB_save_Quandl_History);
		};
	</script>
</html>


