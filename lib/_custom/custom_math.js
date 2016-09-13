function all_true(l_){
	return l_.reduce(function(a,b){return a&b;});
}
function sin_(h_, w_) {
	return h_ / Math.sqrt( Math.pow( h_,2 ) + Math.pow( w_,2 ) );
}
function round_(number_, digits_){
	var digits = digits_ || 0;
	var factor = Math.pow(10, digits);
	var number = Math.round(number_*factor);
	return number/factor;
}