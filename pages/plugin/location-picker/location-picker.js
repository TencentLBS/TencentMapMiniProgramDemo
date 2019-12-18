// pages/plugin/location-picker/location.js
import {CDN_PATH, MOYUAN_KEY, BAIQIAN_KEY, YULU_KEY, DIFUNI_KEY, REFERER} from '../../../config/appConfig';
Page({
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`
		},
		location: null,
		category: '',
		showCustomActionsheet: false,
		customStyles: [
			{text: '墨渊', value: MOYUAN_KEY, icon: `${CDN_PATH}/iconMapMoyuan@3x.png`},
			{text: '白浅', value: BAIQIAN_KEY, icon: `${CDN_PATH}/iconMapBaiqian@3x.png`},
			{text: '玉露', value: YULU_KEY, icon: `${CDN_PATH}/iconMapYulu@3x.png`},
			{text: '自定义', value: DIFUNI_KEY}
		],
		keyIndex: 0,
		dialogShow: false,
		link: 'https://lbs.qq.com/webservice_v1/guide-appendix.html'
	},
	onChooseLocation () {
		wx.chooseLocation({
			success: (res) => {
				this.setData({
					location: res
				});
			}
		});
	},
	onInputCategory (event) {
		const {value} = event.detail;
		this.setData({
			category: value
		});
	},
	onTriggerActionsheet () {
		this.setData({
			showCustomActionsheet: true
		});
	},
	onSelectCustom (event) {
		const {index} = event.detail;
		this.setData({
			keyIndex: index,
			showCustomActionsheet: false
		});
	},
	onWatchLink () {
		this.setData({
			dialogShow: true
		});
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onWatchDemo () {
		const key = this.data.customStyles[this.data.keyIndex].value;
		const referer = REFERER;
		const location = this.data.location ? JSON.stringify(this.data.location) : '';
		const category = this.data.category;

		let url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer;
		if (location) {
			url += '&location=' + location;
		}
		if (category) {
			url += '&category=' + category;
		}
		wx.navigateTo({
			url
		});
	},
	onWatchDoc () {
		wx.navigateTo({
			url: '../document/document?type=location'
		});
	},
	onShareAppMessage: function () {

	}
});

