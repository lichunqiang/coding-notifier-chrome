(function () {
	'use strict';

	function render(badge, color, title) {
		chrome.browserAction.setBadgeText({
			text: badge
		});

		chrome.browserAction.setBadgeBackgroundColor({
			color: color
		});

		chrome.browserAction.setTitle({
			title: title
		});
	}

	function update() {
		notifyCount(function (count) {
			if (count < 0) {
				var text;
				if (count === -1) {
					text = 'You have to be connected to the internet and logged into Coding.net';
				} else if (count === -2) {
					text = 'Unable to find count on page';
				}
				render('?', [166, 41, 41, 255], text);
			} else {
				if (count > 9999) {
					count = '∞';
				}
				render(count, [65, 131, 196, 255], 'Coding Notifier');
			}
		});
	}

	chrome.alarms.create({periodInMinutes: 1});
	chrome.alarms.onAlarm.addListener(update);
	chrome.runtime.onMessage.addListener(update);

	chrome.browserAction.onClicked.addListener(function (tab) {
		var notifTab = {
			url: 'https://coding.net/user/notifications'
		};
		if (tab.url === '' || tab.url === 'chrome://newtab/' || tab.url === notifTab.url) {
			chrome.tabs.update(null, notifTab);
		} else {
			chrome.tabs.create(notifTab);
		}
	});

	update();
})();
