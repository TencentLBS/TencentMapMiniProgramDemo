// pages/plugin/route-plan.js
import {CDN_PATH, MOYUAN_KEY, BAIQIAN_KEY, YULU_KEY, DIFUNI_KEY, REFERER} from '../../../config/appConfig';
const chooseLocation = requirePlugin('chooseLocation');

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
		startPoint: {
			name: '腾讯北京总部大楼',
			latitude: 40.040417,
			longitude: 116.273514
		},
		endPoint: {
			name: '西客站北广场',
			latitude: 39.894806,
			longitude: 116.321592
		},
		isNavigate: false,
		themeColor: '#427CFF',
		showCustomActionsheet: false,
		showThemeColorActionsheet: false,
		customStyles: [
			{text: '墨渊', value: MOYUAN_KEY, icon: `${CDN_PATH}/iconMapMoyuan@3x.png`},
			{text: '白浅', value: BAIQIAN_KEY, icon: `${CDN_PATH}/iconMapBaiqian@3x.png`},
			{text: '玉露', value: YULU_KEY, icon: `${CDN_PATH}/iconMapYulu@3x.png`},
			{text: '自定义', value: DIFUNI_KEY}
		],
		themeColors: [
			{text: '', value: '#427CFF'},
			{text: '', value: '#85d5c8'},
		],
		keyIndex: 0,
		chooseType: ''
	},
	onShow () {
		const location = chooseLocation.getLocation();
		if (location && this.data.chooseType === 'start') {
			this.setData({
				startPoint: location
			});
		} else if (location && this.data.chooseType === 'end') {
			this.setData({
				endPoint: location
			});
		}
	},
	onUnload () {
		chooseLocation.setLocation(null);
	},
	onChooseStartPoint () {
		const key = this.data.customStyles[this.data.keyIndex].value;
		this.setData({
			chooseType: 'start'
		});
		chooseLocation.setLocation(null);
		if (!key || !REFERER) {
			console.error('请输入有效的key和referer');
			return;
		}
		const url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + REFERER;
		wx.navigateTo({
			url
		});
	},
	onChooseEndPoint () {
		const key = this.data.customStyles[this.data.keyIndex].value;
		this.setData({
			chooseType: 'end'
		});
		chooseLocation.setLocation(null);
		if (!key || !REFERER) {
			console.error('请输入有效的key和referer');
			return;
		}
		const url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + REFERER;
		wx.navigateTo({
			url
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
		if (!key || !referer) {
			console.error('请输入有效的key和referer');
			return;
		}
		let url = 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +
		'&mode=' + mode + '&navigation=' + navigation + '&themeColor=' + this.data.themeColor;
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
		return {
			title: '腾讯位置服务示例中心'
		};
	},
	ontriggerSelectThemeColor () {
		this.setData({
			showThemeColorActionsheet: true
		});
	},
	onSelectThemeColor (event) {
		const {value} = event.detail;
		this.setData({
			themeColor: value,
			showThemeColorActionsheet: false
		});
	},
});
