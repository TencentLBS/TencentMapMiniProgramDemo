const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
};
/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
	return function (obj = {}) {
		return new Promise((resolve, reject) => {
			obj.success = function (res) {
				resolve(res);
			};

			obj.fail = function (res) {
				reject(res);
			};

			fn(obj);
		});
	};
};
const compareVersion = (v1, v2) => {
	v1 = v1.split('.');
	v2 = v2.split('.');
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 > num2) {
			return 1;
		} else if (num1 < num2) {
			return -1;
		}
	}

	return 0;
};
module.exports = {
	formatTime: formatTime,
	wxPromisify: wxPromisify,
	compareVersion: compareVersion
};
