// pages/customized/customized.js
import {CDN_PATH} from '../../../config/appConfig';
Page({

	/**
   * 页面的初始数据
   */
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`,
			moyuan: `${CDN_PATH}/iconMap80Moyuan@3x.png`,
			baiqian: `${CDN_PATH}/iconMap80Baiqian@3x.png`,
			yulu: `${CDN_PATH}/iconMap80Yulu@3x.png`
		}
	},
	onWatchMap (event) {
		const {type} = event.currentTarget.dataset;
		wx.navigateTo({
			url: '../customized-map/customized-map?type=' + type
		});
	},
	onShareAppMessage: function () {

	}
});
