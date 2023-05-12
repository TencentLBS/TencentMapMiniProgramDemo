// pages/control-view/control-view.js
import {
	MOYUAN_KEY
} from '../../../config/appConfig';
const util = require('../../../utils/util');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		MOYUAN_KEY,
		location: {
			latitude: 22.523070312430152,
			longitude: 113.93556144154017
		},
		scale: 16.5,
		rotate: 0,
		skew: 30,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
		dialogShow: false
	},
	onReady () {
		this.mapCtx = wx.createMapContext('map', this);
		this.version = wx.getSystemInfoSync().SDKVersion;
		if (util.compareVersion(this.version, '2.20.1') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，请升级微信版本后使用本功能。',
				icon: 'none'
			});
			return;
		}
		this.mapCtx.addVisualLayer({
			layerId: '', // 在腾讯位置服务官网新建数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
			success: () => {
				this.setData({
					location: {
						latitude: 22.523070312430152,
						longitude: 113.93556144154017
					},
					scale: 16.5,
					skew: 30,
					rotate: 0
				});
			},
			fail: (error) => {
				console.error(error);
			},
		});
	},
	onShowDoc () {
		this.setData({
			dialogShow: true,
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addVisualLayer.html'
		});
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
