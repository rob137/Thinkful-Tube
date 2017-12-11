'use strict'
function handleSearchFormSubmission() { 
	console.log('handleSearchFormSubmission() ran.');
	$("form").submit(event, function() {
		const query = prepareQuery();
		fetchJsonAndLoadHtml(query);	
	});
}

function prepareQuery() {
	console.log('prepareQuery() ran.');
	const queryWithoutSearchTerms = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAwrO9kTCuS6Zimy4p4zCZMa-UUsgJ_7OU&q=';
	const querySearchTerms = $(".js-query").val(); 
	const queryFinal = queryWithoutSearchTerms + querySearchTerms;
	return queryFinal;
}

function fetchJsonAndLoadHtml(query) {
	let searchResult = '';
	$.getJSON(query, function(json) {
		let html = '';
		for (let item in json.items) {
		const videoTitle = json.items[item].snippet.title;
		const videoThumbnail = json.items[item].snippet.thumbnails.medium.url; 
		const videoId = json.items[item].id.videoId;
		let videoUrl = 'https://www.youtube.com/' + videoId
		html+= `<h3>${videoTitle}</h3>
					<a href="${videoUrl}"><img src="${videoThumbnail}""></img></a><br><br>`;
	}
	$(".js-search-results").html(html);	
	});
}

handleSearchFormSubmission();