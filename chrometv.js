var chrometvURL = 'chrome://tv'; // use chrome://tv?key=xxx

var currentChannel = -1;

var channels = [];

function Channel(url, timeOnAir) {
	this.url = url;
	this.timeOnAir = timeOnAir * 60 * 1000;
}

function loadChannels(json) {
	var cells = json.feed.entry;
	for (var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		channels[i] = new Channel(cell.gsx$url.$t, cell.gsx$time.$t);
	}
}

function init(setupSpreadsheetKey) {
	$.ajax({
		type : 'GET',
		url : 'https://spreadsheets.google.com/feeds/list/'
				+ setupSpreadsheetKey + '/1/public/values?alt=json',
		dataType : 'json',
		success : function(json) {
			loadChannels(json);
			changeChannel();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			alert('(' + jqXHR.status + ' ' + jqXHR.statusText + ') '
					+ jqXHR.responseText);
		}
	});
}

function changeChannel() {
	currentChannel = (currentChannel + 1) % channels.length;

	var channel = channels[currentChannel];

	chrome.tabs.update({
		url : channel.url
	});

	setTimeout(changeChannel, channel.timeOnAir);
}

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	if (details.url.indexOf(chrometvURL) == 0) {
		chrome.tabs.update(details.tabId, {
			url : 'about:blank'
		});

		init(getURLParameter(details.url, 'key'));
	}
});