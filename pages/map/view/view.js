// pages/control-view/control-view.js
import {CDN_PATH} from '../../../config/appConfig';
const util = require('../../../utils/util')
Page({

	/**
   * 页面的初始数据
   */
	data: {
		imgs: {
			plus: `${CDN_PATH}/btn_plus@3x.png`,
			minus: `${CDN_PATH}/btn_minus@3x.png`
		},
		setting: { // 使用setting配置，方便统一还原
			rotate: 0,
			skew: 0,
			enableRotate: true,
		},
		location: {
			latitude: 39.918056,
			longitude: 116.397027
		},
		scale: 15,
		isOverLooking: false,
		isGuGong: true,
		is3D: true,
		minScale: 3,
		maxScale: 20,
	},
	onReady() {
		this.slider = this.selectComponent('#slider');
	},
	// 控制地图缩放级别
	onIncreaseScale () {
		// let scale = this.data.scale;
		// if (scale === 20) {
		// 	return ;
		// }
		// scale++;
		this.setData({
			scale: 17
		});
	},
	onDecreaseScale () {
		let scale = this.data.scale;
		if (scale === 3) {
			return;
		}
		scale--;
		this.setData({
			scale: scale
		});
	},

	// 开启俯仰效果
	onChangeOverLooking (event) {
		this.setData({
			isOverLooking: event.detail.value,
			setting: {
				skew: event.detail.value ? 90 : 0
			}
		});
	},

	// 切换地图视野
	onChangeView (event) {
		const mapCtx = wx.createMapContext('map', this);
		if (event.currentTarget.dataset.id === 'gugong') {
			mapCtx.moveToLocation({
				latitude: 39.918056,
				longitude: 116.397027,
				success: () => {
					this.setData({
						isGuGong: true,
						location: {
							latitude: 39.918056,
							longitude: 116.397027
						},
					});
				},
				fail: () => {
					this.setData({
						isGuGong: false,
					});
				}
			});
		} else {
			mapCtx.moveToLocation({
				latitude: 39.992990,
				longitude: 116.272362,
				success: () => {
					this.setData({
						isGuGong: false,
						location: {
							latitude: 39.992990,
							longitude: 116.272362,
						},
					});
				},
				fail: () => {
					this.setData({
						isGuGong: true,
					});
				}
			});
		}
	},
	// 还原初始data参数设置
	onReset () {
		this.setData({
			setting: {
				rotate: 0,
				skew: 0,
				enableRotate: true
			},
			location: {
				latitude: 39.918056,
				longitude: 116.397027
			},
			scale: 16,
			minScale: 3,
			maxScale: 20,
			isOverLooking: false,
			isGuGong: true,
		});
		this.slider.reset();
	},
	onChangeMinScale (e) {
		const version = wx.getSystemInfoSync().SDKVersion

    if (util.compareVersion(version, '2.13.0') >= 0) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showToast({
        title: '当前微信版本过低，无法使用缩放级别功能，请升级到最新微信版本后重试。',
        icon: 'none'
      })
      return;
    }
		this.setData({
			minScale: e.detail.lowValue
		})
	},
	onChangeMaxScale (e) {
		const version = wx.getSystemInfoSync().SDKVersion

    if (util.compareVersion(version, '2.13.0') >= 0) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showToast({
        title: '当前微信版本过低，无法使用缩放级别功能，请升级到最新微信版本后重试。',
        icon: 'none'
      })
      return;
    }
		this.setData({
			maxScale: e.detail.heighValue
		})
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
