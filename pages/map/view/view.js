// pages/control-view/control-view.js
import {CDN_PATH} from '../../../config/appConfig';
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
		is3D: true
	},

	// 控制地图缩放级别
	onIncreaseScale () {
		let scale = this.data.scale;
		if (scale === 20) {
			return ;
		}
		scale++;
		this.setData({
			scale: scale
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
			isOverLooking: event.detail.value
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
				latitude: 40.040415,
				longitude: 116.273511,
			},
			scale: 16,
			isOverLooking: false,
			isGuGong: true
		});
	},
	onShareAppMessage: function () {

	}
});
