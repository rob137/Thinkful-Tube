'use strict'

// Initial function to catch form submission. Called at the end of this js file.
function handleSearchFormSubmission() { 
	console.log('handleSearchFormSubmission() ran.');
	$("form").submit(event, function(event) {
		event.preventDefault();
		//Get the user's query and use it to create a YouTube API link for json request
		const queryWithSearchTerms = prepareQuery();
		fetchJsonAndRenderHTML(queryWithSearchTerms);
		listenForThumbnailClick();
	});
}

function prepareQuery() {
	console.log('prepareQuery() ran.');
	// Just need to add the user's query onto the end of this link...
	const queryWithoutSearchTerms = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAwrO9kTCuS6Zimy4p4zCZMa-UUsgJ_7OU&q=';
	const searchTerms = $(".js-query").val(); 
	const queryWithSearchTerms = queryWithoutSearchTerms + searchTerms;
	// ... Giving us a link we can use for json requests to the YouTube API.
	return queryWithSearchTerms;
}

// This function gets the json and loads the results html into the div class 'js-search-results'. 
function fetchJsonAndRenderHTML(query) {
	console.log('fetchJsonAndRenderHTML() ran.');
	$.getJSON(query, function(json) {
		generateResultsHtml(json, query);
		generateNextPreviousButtons(json, query);
		// Load the new html into the empty .js-search-results div!
	});
}

function generateResultsHtml(json, query) {
	console.log('generateResultsHtml() ran.');
	let resultsHtml = '';
	for (let item in json.items) {
		// For H2 elements
		const videoTitle = json.items[item].snippet.title;
		// For accompanying img elements
		const videoThumbnail = json.items[item].snippet.thumbnails.medium.url; 
		// Gets the unique identifier for the YouTube video.  Can be 
		// used for all sorts of things (see next comment).
		const videoId = json.items[item].id.videoId;
		// Video channel for link to display beneath video
		const channelId = json.items[item].snippet.channelId;
		// 
		
		let videoUrl = 'https://www.youtube.com/watch/' + videoId;
		resultsHtml+= `<h3>${videoTitle}</h3>
				<img class="thumbnail" id="${videoId}" src="${videoThumbnail}"></img>
				<p class="channel-text">Click <a href="https://www.youtube.com/channel/${channelId}">here</a> to see this video's channel<br><br>`;
	};
	$(".js-search-results").html(resultsHtml);	
}

function generateNextPreviousButtons(json, query) {
	console.log('generateNextPreviousButtons() ran.');
	let nextPreviousButtonsHtml = ''; 
	if (json.prevPageToken) {
		nextPreviousButtonsHtml += `<button class="next-previous-button previous-button">Previous</button>`
	}; 
	nextPreviousButtonsHtml+=`<button class="next-previous-button next-button">Next</button>`
	
	$('.js-next-previous').html(nextPreviousButtonsHtml);

	listenForNextOrPreviousClick(json);
}

function listenForNextOrPreviousClick(json, query) {
	console.log('listenForNextOrPreviousClick() ran.');
	$('.next-button').click(event, function(event) {
		event.stopPropagation();
		const nextPageQuery = '&pageToken=' + json.nextPageToken;
		query += nextPageQuery;
		fetchJsonAndRenderHTML(query);
	});
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
// showLightbox().  Also stops the video.
function handleCloseClick() {
	console.log('handleCloseClick() ran.');
	$('.close').click(event, function(event) {
		event.stopPropagation();
		$('.lightbox-parent').addClass('hidden');
		$('.lightbox-shade').removeClass('lightbox-on');
		$('form, img').removeClass('opaque');
		// Removes the video link from the lightbox, causing buffering and video
		// play to stop when the user clicks 'close video'.
		$('.lightbox').attr('src', "");
	})
}

handleSearchFormSubmission();