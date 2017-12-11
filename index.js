const queryWithoutSearchTerm = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAwrO9kTCuS6Zimy4p4zCZMa-UUsgJ_7OU&q=';

function handleSearchFormSubmission() { 
	$("form").submit(event, function() {

	});
		
}

$.getJSON('/path/to/file', {param1: 'value1'}, function(json, textStatus) {
		/*optional stuff to do after success */
});	