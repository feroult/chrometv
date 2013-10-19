var currentChannel = -1;

var channels = [ 'http://www.google.com', 'http://www.dextra.com.br' ];

var setupSpreadsheetKey = '0AiEZezeUULf3dHVwZi16dmNtTzRRWDVodHNuTnRUdXc';

function Channel(url, timeOnAir) {
	this.url = url;
	this.timeOnAir = timeOnAir;
}

function loadChannels(feedJson) {
	var cells = feedJson.feed.entry;
	for (var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		channels[i] = new Channel(cell.gsx$url.$t, cell.gsx$time.$t);
	}
}

function init() {
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
	
	alert(channel.url);
	
	chrome.tabs.update({
		url : channel.url
	});

	setTimeout(changeChannel, channel.timeOnAir);
}

chrome.runtime.onStartup.addListener(function(x) {
	init();
});
