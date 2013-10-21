function getURLParameter(url, name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
			+ '([^&;]+?)(&|#|;|$)').exec(url) || [ , "" ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}