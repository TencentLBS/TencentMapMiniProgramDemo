// pages/plugin/route-plan.js
import {CDN_PATH, MOYUAN_KEY, BAIQIAN_KEY, YULU_KEY, DIFUNI_KEY, REFERER} from '../../../config/appConfig';
Page({
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`
		},
		modes: [
			{text: '驾车', value: 'driving'},
			{text: '公交', value: 'transit'},
			{text: '步行', value: 'walking'}
		],
		modeIndex: 0,
		startPoint: null,
		endPoint: null,
		isNavigate: false,
		showCustomActionsheet: false,
		customStyles: [
			{text: '墨渊', value: MOYUAN_KEY, icon: `${CDN_PATH}/iconMapMoyuan@3x.png`},
			{text: '白浅', value: BAIQIAN_KEY, icon: `${CDN_PATH}/iconMapBaiqian@3x.png`},
			{text: '玉露', value: YULU_KEY, icon: `${CDN_PATH}/iconMapYulu@3x.png`},
			{text: '自定义', value: DIFUNI_KEY}
		],
		keyIndex: 0
	},
	onChooseStartPoint () {
		wx.chooseLocation({
			success: (res) => {
				this.setData({
					startPoint: res
				});
			}
		});
	},
	onChooseEndPoint () {
		wx.chooseLocation({
			success: (res) => {
				this.setData({
					endPoint: res
				});
			}
		});
	},
	onSelectMode (event) {
		const {index} = event.currentTarget.dataset;
		if (index === this.data.modeIndex) {
			return;
		}
		this.setData({
			modeIndex: index
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
	onWatchDemo () {
		if (!this.data.endPoint) {
			wx.showToast({
				title: '请选择终点位置',
				icon: 'none',
				duration: 1500,
				mask: false
			});
			return;
		}
		const key = this.data.customStyles[this.data.keyIndex].value;
		const referer = REFERER;
		const endPoint = JSON.stringify(this.data.endPoint);
		const startPoint = this.data.startPoint ? JSON.stringify(this.data.startPoint) : '';
		const mode = this.data.modes[this.data.modeIndex].value;
		const navigation = this.data.isNavigate ? 1 : 0;
		let url = 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +
		'&mode=' + mode + '&navigation=' + navigation;
		if (startPoint) {
			url += '&startPoint=' + startPoint;
		}
		wx.navigateTo({
			url
		});
	},
	onWatchDoc () {
		wx.navigateTo({
			url: '../document/document?type=routePlan'
		});
	},
	onChangeNavigate (event) {
		this.setData({
			isNavigate: event.detail.value
		});
	},
	onShareAppMessage: function () {

	}
});
