// pages/customized/customized.js
import {CDN_PATH, COS_PATH} from '../../../config/appConfig';
Page({

	/**
   * 页面的初始数据
   */
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`,
			wxshense: `${COS_PATH}/iconMap_wxshense@3x.png`,
			chuxing: `${COS_PATH}/iconMap_chuxing@3x.png`,
			danyue: `${COS_PATH}/iconMap_danyue@3x.png`,
			yulu: `${COS_PATH}/iconMap_yulu@3x.png`,
			yancui: `${COS_PATH}/iconMap_yancui@3x.png`
		},
		dialogShow: false,
		link: 'https://github.com/TencentLBS/TencentMapMiniProgramDemo'
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onShowSoluteStyle () {
    this.setData({
			dialogShow: true,
			link: 'https://lbs.qq.com/product/miniapp/customized/?adtag=wx.slzx.gxhdt'
		});
  },
  onShowManageStyle () {
		this.setData({
			dialogShow: true,
			link: 'https://lbs.qq.com/dev/console/custom/mapStyle?adtag=wx.slzx.gxhdt'
		});
	},
	onWatchMap (event) {
		const {type} = event.currentTarget.dataset;
		wx.navigateTo({
			url: '../customized-map/customized-map?type=' + type
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
