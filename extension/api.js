(function () {
	'use strict';

	var xhr = (function () {
		var xhr = new XMLHttpRequest();
		return function (method, url, callback) {
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					callback(xhr.responseText, xhr.status);
				}
			};
			xhr.open(method, url);
			xhr.send();
		};
	})();

	window.GitHubNotify = (function () {
		var defaults = {
			notificationUrl: 'https://coding.net/api/user/unread-count',
			useParticipatingCount: false
		};

		var api = {
			settings: {
				get: function (name) {
					var item = localStorage.getItem(name);
					if (item === null) {
						return ({}.hasOwnProperty.call(defaults, name) ? defaults[name] : void 0);
					} else if (item === 'true' || item === 'false') {
						return (item === 'true');
					}
					return item;
				},
				set: localStorage.setItem.bind(localStorage),
				reset: function () {
					Object.keys(localStorage).forEach(api.settings.revert);
				},
				revert: localStorage.removeItem.bind(localStorage)
			}
		};

		return api;
	})();

	window.gitHubNotifCount = function (callback) {

		xhr('GET', GitHubNotify.settings.get('notificationUrl'), function (data, status) {
			data = JSON.parse(data);
			if (status >= 400) {
				callback(-1);
				return;
			}
			if(data['code'] != 0) {
				return callback(-2);
			}
			var total = 0;
			Object.keys(data['data']).forEach(function(key){
				total += data['data'][key];
			});
			callback(total + '');
		});
	};
})();
