// pages/plugin/subway/subway.js
import {PLUGIN_KEY, REFERER} from '../../../config/appConfig';
Page({
	data: {

	},
	onWatchDemo () {
		const plugin = requirePlugin('subway');
		const referer = REFERER;
		if (!PLUGIN_KEY || !referer) {
			console.error('请传入有效的key和referer');
			return;
		}
		const url = 'plugin://subway/index?key=' + PLUGIN_KEY + '&referer=' + referer;
		wx.navigateTo({
			url
		});
	},
	onWatchDoc () {
		wx.navigateTo({
			url: '../document/document?type=subway'
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
