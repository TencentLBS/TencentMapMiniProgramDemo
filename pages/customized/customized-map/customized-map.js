// pages/customized/customized-map/customized-map.js
import {MOYUAN_KEY, BAIQIAN_KEY, YULU_KEY, DIFUNI_KEY} from '../../../config/appConfig';
const KEY_MAP = {
	moyuan: MOYUAN_KEY,
	baiqian: BAIQIAN_KEY,
	yulu: YULU_KEY,
	difuni: DIFUNI_KEY
};
const TEXT_MAP = {
	moyuan: '墨渊',
	baiqian: '白浅',
	yulu: '玉露',
	difuni: '蒂芙尼'
};
Page({
	data: {
		key: '',
		text: '',
		mapShow: false
	},
	onLoad: function (options) {
		const {type} = options;
		this.setData({
			mapShow: true,
			key: KEY_MAP[type],
			text: TEXT_MAP[type]
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

	}
});
