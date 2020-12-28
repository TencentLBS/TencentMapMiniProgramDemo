// pages/webservice/reverseGeocoder-result/reverseGeocoder-result.js
import {WEBSERVICE_APPID} from '../../../config/appConfig';
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
		}],
	},

	/**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		const _this = this;
		const data = {
			location: options.location
		};
		let dataTxt = '{\n&emsp;&emsp;location:"' + options.location + '",';
		if (options.getPoi === '1') {
			data.get_poi = options.getPoi;
			dataTxt += '\n&emsp;&emsp;get_poi:' + options.getPoi + ',';
		}
		if (options.policy) {
			data.poi_options = 'policy=' + options.policy;
			dataTxt += '\n&emsp;&emsp;poi_options: "policy=' + options.policy + '"';
		}
		this.setData({
			requestJson: `wx.serviceMarket.invokeService({
      &emsp;service: "${WEBSERVICE_APPID}",
      &emsp;api: "rgeoc",
      &emsp;data: ${dataTxt}
      &emsp;}
      }).then( res => {
      &emsp;console.log(res)
      }).catch( err => {
      &emsp;console.error(err)
      })`

		});
		wx.serviceMarket.invokeService({
			service: WEBSERVICE_APPID,
			api: 'rgeoc',
			data: data
		}).then(res => {
			const result = (typeof res.data) === 'string' ? JSON.parse(res.data).result : res.data.result;
			let adInfo = '';
			let businessArea = '';
			let landmark = '';
			let crossroad = '';
			if (result.ad_info) {
				adInfo = result.ad_info.nation || '';
				adInfo += result.ad_info.province ? ',' + result.ad_info.province : '';
				adInfo += result.ad_info.city ? ',' + result.ad_info.city : '';
				adInfo += result.ad_info.district ? ',' + result.ad_info.district : '';
			}
			if (result.address_reference && result.address_reference.business_area) {
				businessArea = result.address_reference.business_area.title || '';
				businessArea += '(' + result.address_reference.business_area._dir_desc + ')';
			}

			if (result.address_reference && result.address_reference.landmark_l1) {
				landmark = result.address_reference.landmark_l1.title || '';
				landmark += '(' + result.address_reference.landmark_l1._dir_desc + ')';
			}
			if (result.address_reference && result.address_reference.crossroad) {
				crossroad = result.address_reference.crossroad.title || '';
				crossroad += '(' + result.address_reference.crossroad._dir_desc + ')';
			}
			_this.setData({
				resultJson: [{
					name: 'pre',
					children: [{
						type: 'text',
						text: (typeof res.data) === 'string' ? res.data : JSON.stringify(res.data, null, '\t')
					}]
				}],
				addressInfo: {
					adcode: result.ad_info && result.ad_info.adcode || '', //行政区划代码
					address: result.address || '',
					businessArea: businessArea, //商圈
					adInfo: adInfo,
					landmark: landmark,
					recommend: result.formatted_addresses && result.formatted_addresses.recommend || '',
					crossroad: crossroad
				},
				pois: result.pois
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
