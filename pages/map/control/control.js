// pages/map-control/map-control.js
Page({

	/**
   * 页面的初始数据
   */
	data: {
		location: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		isShowScale: false,
		isShowCompass: false,
		isShowPosition: false,
		showActionSheet: false,
	},
	onChangeShowScale (event) {
		this.setData({
			isShowScale: event.detail.value
		});
	},

	// 激活指南针
	onChangeShowCompass (event) {
		this.setData({
			isShowCompass: event.detail.value
		});
	},
	// 激活定位控件
	onChangeShowPosition (event) {
		const {value} = event.detail;
		if (value) {
			wx.getLocation({
				type: 'gcj02',
				success: (res) => {
					const {latitude, longitude} = res;
					this.setData({
						location: {
							latitude,
							longitude
						}
					});
				}
			});
		}
		this.setData({
			showPosition: value
		});
	},
	onShareAppMessage: function () {

	}
});
