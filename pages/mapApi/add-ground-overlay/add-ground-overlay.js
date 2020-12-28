const util = require('../../../utils/util');
import {COS_PATH} from '../../../config/appConfig';

Page({

	/**
   * 页面的初始数据
   */
	data: {
		scale: 14.5,
		location: {
			latitude: 34.561904,
			longitude: 112.480425,
		},
		isDisabled: false,
		dialogShow: false,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'
	},

	onShow () {
		const version = wx.getSystemInfoSync().SDKVersion;

		if (util.compareVersion(version, '2.14.0') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
				icon: 'none'
			});
			return;
		}

		const mapCtx = wx.createMapContext('map', this);
		mapCtx.addGroundOverlay({
			id: 1,
			src: `${COS_PATH}/ground_img@2x.png`,
			bounds: {
				southwest: {
					latitude: 34.539463,
					longitude: 112.467556,
				},
				northeast: {
					latitude: 34.574523,
					longitude: 112.494962,
				}
			}
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
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addGroundOverlay.html'
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
