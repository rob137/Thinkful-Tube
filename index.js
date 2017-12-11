'use strict'

// Initial function to catch form submission. Called at the end of this js file.
function handleSearchFormSubmission() { 
	console.log('handleSearchFormSubmission() ran.');
	$("form").submit(event, function(event) {
		event.preventDefault();
		//Get the user's query and use it to create a YouTube API link for json request
		const query = prepareQuery();
		fetchJsonAndLoadHtml(query);	
	});
}

function prepareQuery() {
	console.log('prepareQuery() ran.');
	// Just need to add the user's query onto the end of this link...
	const queryWithoutSearchTerms = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAwrO9kTCuS6Zimy4p4zCZMa-UUsgJ_7OU&q=';
	const querySearchTerms = $(".js-query").val(); 
	const queryFinal = queryWithoutSearchTerms + querySearchTerms;
	// ... Giving us a link we can use for json quests to the YouTube API.
	return queryFinal;
}

// This function gets the json and load the relevant results into the html. 
function fetchJsonAndLoadHtml(query) {
	let searchResult = '';
	$.getJSON(query, function(json) {
		let html = '';
		for (let item in json.items) {

		// For H2 elements
		const videoTitle = json.items[item].snippet.title;
		// For accompanying img elements
		const videoThumbnail = json.items[item].snippet.thumbnails.medium.url; 
		// Gets the unique identifier for the YouTube video.  Can be 
		// used for all sorts of things (see next comment).
		const videoId = json.items[item].id.videoId;
		// For example: 
		let videoUrl = 'https://www.youtube.com/watch/' + videoId;
		html+= `<h3>${videoTitle}</h3>
					<img class="thumbnail" id="${videoId}" src="${videoThumbnail}"></img><br><br>`;
		};
		// Load the new html into the empty .js-search-results div!
		$(".js-search-results").html(html);	
	});
	// see next comment!
	listenForThumbnailClick();
}

// Listen out for clicks on thumbnails.  This will be the user prompt to 
// display 'lightbox' embedded videos.
function listenForThumbnailClick() {
	console.log('listenForThumbnailClick() ran');
  $(".js-search-results").click(event, function(event) {
    event.stopPropagation();
    // see next comment!
    showLightbox(event.target);
  });
}

// This does two things as far as the UX/page design is concerned:
// 1. Displays a responsive embedded video in the center of the viewport.
// 2. Dims the rest of the page to create a 'lightbox' effect. 
function showLightbox(target) {
	console.log('showLightbox() ran.');
	const videoId = $(target).attr('id');
  const youtubeEmbedLink = 'https://www.youtube.com/embed/' + videoId;
	$('.lightbox').attr('src', youtubeEmbedLink);
	$('.lightbox-shade').addClass('lightbox-on');
	$('.lightbox-parent').removeClass('hidden');
	$('form, img').addClass('opaque');
	// See next comment!
	handleCloseClick();
}

// Reverses the visual effects described in the description for 
// showLightbox().
function handleCloseClick() {
	console.log('handleCloseClick() ran.');
	$('.close').click(event, function(event) {
		event.stopPropagation();
		$('.lightbox-parent').addClass('hidden');
		$('.lightbox-shade').removeClass('lightbox-on');
		$('form, img').removeClass('opaque');
	})
}

handleSearchFormSubmission();