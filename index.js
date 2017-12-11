
function handleSearchFormSubmission() { 
	query = prepareQuery();
	requestVideos(query);

}

function prepareQuery() {
	$("form").submit(event, function() {
		const queryWithoutSearchTerms = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAwrO9kTCuS6Zimy4p4zCZMa-UUsgJ_7OU&q=';
		const querySearchTerms = $(".js-query").val(); 
		const queryFinal = queryWithoutSearchTerms + querySearchTerms;
		return queryFinal;
	});

}

function requestVideos(query) {
	$.getJSON(query, function(json) {
		console.log(json);
	});	
}

handleSearchFormSubmission();