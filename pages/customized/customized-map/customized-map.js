// pages/customized/customized-map/customized-map.js
import {CUSTOM_KEY} from '../../../config/appConfig';
const STYLE_MAP = {
	wxshense: 1,
	chuxing: 2,
	danyue: 3,
	yulu: 4,
	yancui: 5
};
const TEXT_MAP = {
	wxshense: '微信深色',
	chuxing: '出行',
	yulu: '玉露',
	yancui: '烟翠',
	danyue: '澹月',
};
Page({
	data: {
		key: CUSTOM_KEY,
		text: '',
		mapShow: false,
		style: 1
	},
	onLoad: function (options) {
		if (!CUSTOM_KEY) {
			console.error('请输入有效的key');
		}
		const {type} = options;
		this.setData({
			mapShow: true,
			text: TEXT_MAP[type],
			style: STYLE_MAP[type]
		});
	},
	onUnload () {
		this.setData({
			key: '',
			text: '',
			mapShow: false
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
