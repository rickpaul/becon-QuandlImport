<html>
	<script src='/lib/jquery/jquery.min.js'></script>
<script type='text/javascript'>
	$.get('_del_test2.php')
		.done( function(data) { 
			console.log('$.get succeeded');
			console.log(data);
		}, 'json')
	;

	$.post('_del_test2.php',
			{
				'a':'WIKI',
				'b':'AAPL',
			}
		)
		.done(function(data){ 
			console.log('$.post succeeded'); 
			console.log(data);
		}, 'json')
		.fail(function(){ 
			console.log('$.post failed!'); 
		})
	;
</script>
</html>