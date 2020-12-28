
const util = require('../../../utils/util');

Page({

	/**
   * 页面的初始数据
   */
	data: {
		scale: 10.5,
		location: {
			latitude: 39.991104,
			longitude: 116.377503,
		},
		markers: [{
			id: 1,
			latitude: 39.953416,
			longitude: 116.480945,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 2,
			latitude: 39.984104,
			longitude: 116.407503,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 3,
			latitude: 39.908802,
			longitude: 116.497502,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 4,
			latitude: 40.040417,
			longitude: 116.373514,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 5,
			latitude: 39.953416,
			longitude: 116.380945,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 6,
			latitude: 39.984104,
			longitude: 116.307503,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 7,
			latitude: 39.908802,
			longitude: 116.397502,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		},{
			id: 8,
			latitude: 40.040417,
			longitude: 116.273514,
			joinCluster: true,
			width: 24,
			height: 24,
			iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
		}],
		isDisabled: false,
		dialogShow: false,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'
	},

	onShow () {
		const version = wx.getSystemInfoSync().SDKVersion;

		if (util.compareVersion(version, '2.13.0') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
				icon: 'none'
			});
			return;
		}

		const mapCtx = wx.createMapContext('map', this);
		mapCtx.initMarkerCluster({
			gridSize: 30
		});
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
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.initMarkerCluster.html'
		});
	},
	onRunApi () {

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
