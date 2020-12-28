const util = require('../../../utils/util');
import {CDN_PATH, REFERER,PLUGIN_KEY} from '../../../config/appConfig';
const chooseLocation = requirePlugin('chooseLocation');

Page({

	/**
   * 页面的初始数据
   */
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`
		},
		location: {
			name: '天安门广场',
			latitude: 39.903740,
			longitude: 116.397827
		},
		dialogShow: false,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'
	},
	onShow () {
		const location = chooseLocation.getLocation();
		if (location) {
			this.setData({
				location
			});
		}
	},
	onUnload () {
		// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
		chooseLocation.setLocation(null);
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onShowCompatibility () {
		this.setData({
			dialogShow: true,
			link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'
		});
	},
	onShowDoc () {
		this.setData({
			dialogShow: true,
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.openMapApp.html'
		});
	},
	onChooseLocation () {
		const key = PLUGIN_KEY;
		const referer = REFERER;
		const url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&scale=15';
		wx.navigateTo({
			url
		});
	},
	onRunApi () {
		const version = wx.getSystemInfoSync().SDKVersion;

		if (util.compareVersion(version, '2.14.0') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
				icon: 'none'
			});
			return;
		}
		if (!this.data.location) {
			wx.showToast({
				title: '请选择目的地',
				icon: 'none'
			});
			return;
		}
		const mapCtx = wx.createMapContext('map', this);
		mapCtx.openMapApp({
			latitude: this.data.location.latitude,
			longitude: this.data.location.longitude,
			destination: this.data.location.name,
			complete: res => {
				console.log(res);
			}
		});

	},

	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
