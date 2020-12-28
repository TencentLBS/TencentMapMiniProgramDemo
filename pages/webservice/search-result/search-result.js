// pages/webservice/reverseGeocoder-result/reverseGeocoder-result.js
import {CDN_PATH, WEBSERVICE_APPID} from '../../../config/appConfig';
Page({

	/**
   * 页面的初始数据
   */
	data: {
		tabList: [{
			id: 0,
			show: true,
			name: '响应结果展示'
		}, {
			id: 1,
			show: false,
			name: '服务请求代码'
		}, {
			id: 2,
			show: false,
			name: '响应结果JSON'
		}]
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		const _this = this;
		const data = {
			keyword: options.keyword,
			boundary: options.boundary
		};

		this.setData({
			requestJson: `wx.serviceMarket.invokeService({
      &nbsp;&nbsp;service: "${WEBSERVICE_APPID}",
      &nbsp;&nbsp;api: "poiSearch",
      &nbsp;&nbsp;data: {
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;keyword:"${options.keyword}",
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boundary:"${options.boundary}"
      &nbsp;&nbsp;}
      }).then( res => {
      &nbsp;&nbsp;console.log(res)
      }).catch( err => {
      &nbsp;&nbsp;console.error(err)
      })`

		});
		wx.serviceMarket.invokeService({
			service: WEBSERVICE_APPID,
			api: 'poiSearch',
			data: data
		}).then(res => {
			const result = (typeof res.data) === 'string' ? JSON.parse(res.data) : res.data;
			const markers = []; //设置marker
			const includePoints = []; //设置包含点
			for (let i = 0; i < result.data.length; i++) {
				markers.push({
					id: i,
					latitude: result.data[i].location.lat,
					longitude: result.data[i].location.lng,
					iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
					width: 34,
					height: 34
				});
				includePoints.push({
					latitude: result.data[i].location.lat,
					longitude: result.data[i].location.lng,
				});
			}
			this.setData({
				markers: markers,
				includePoints: includePoints,
				resultJson: [{
					name: 'pre',
					children: [{
						type: 'text',
						text: (typeof res.data) === 'string' ? res.data : JSON.stringify(res.data, null, '\t')
					}]
				}],
				pois: result.data
			});
		}).catch(err => {
			console.error(err);
		});
	},

	/**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {
		this.mapCtx = wx.createMapContext('map');
	},

	clickTab (event) {
		const id = event.detail.current, list = this.data.tabList;
		for (let i = 0, len = list.length; i < len; ++i) {
			if (list[i].id === id) {
				list[i].show = !list[i].show;
			} else {
				list[i].show = false;
			}
		}
		this.setData({
			tabList: list
		});
	}
});
