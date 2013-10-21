var CHROMETV_URL = 'chrome.tv'; // use chrome.tv?key=xxx

var WAIT_LOAD_DELAY = 70 * 1000;

var currentChannel = -1;

var channels = [];

var currentTab = -1;

var tabs = [];

function Channel(url, timeOnAir) {
	this.url = url;
	this.timeOnAir = (timeOnAir * 60 * 1000) + WAIT_LOAD_DELAY;
}

function loadChannels(json) {
	var cells = json.feed.entry;
	for (var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		channels[i] = new Channel(cell.gsx$url.$t, cell.gsx$time.$t);
	}
}

function initChannels(setupSpreadsheetKey) {
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
	var channel = nextChannel();
	var tab = nextTab();

	chrome.tabs.update(tab.id, {
		url : channel.url
	});

	setTimeout(changeTab, WAIT_LOAD_DELAY);
	setTimeout(changeChannel, channel.timeOnAir);
}

function changeTab() {
	var tab = tabs[currentTab];
	chrome.tabs.update(tab.id, {
		active : true
	});
}

function nextChannel() {
	currentChannel = (currentChannel + 1) % channels.length;
	return channels[currentChannel];
}

function nextTab() {
	currentTab = (currentTab + 1) % tabs.length;
	return tabs[currentTab];
}

function initTabs(currentTabId) {
	chrome.tabs.get(currentTabId, function(tab) {
		tabs.push(tab);
	});

	chrome.tabs.create({
		active : false
	}, function(tab) {
		tabs.push(tab);
	});
}

function init(tabId, url) {
	if (!isChromeTV(url)) {
		return;
	}

	chrome.tabs.update(tabId, {
		url : 'about:blank'
	});

	initTabs(tabId);
	initChannels(getURLParameter(url, 'key'));
}

function isChromeTV(url) {
	return url.indexOf('//' + CHROMETV_URL + '/') != -1;
}

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	init(details.tabId, details.url);
});

chrome.runtime.onStartup.addListener(function() {
	alert('x');
	chrome.tabs.getSelected(function(tab) {
		alert('url: ' + tab.url);
		init(tab.id, tab.url);
	});
});