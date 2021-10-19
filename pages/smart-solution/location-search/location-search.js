import {
	COS_PATH,
	WEBSERVICE_APPID
} from '../../../config/appConfig';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		start: {},
		end: {},
		location: {
			lat: null,
			lng: null
		},
		markers: [{
			latitude: null,
			longitude: null
		}, {
			latitude: null,
			longitude: null
		}]
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			mask: true
		})
		// 获取当前定位点
		wx.getLocation({
			type: 'gcj02',
			success: res => {
				const {
					latitude,
					longitude
				} = res;
				this._getGeocoder(latitude, longitude);
			},
			fail: err => {
				console.error(err);
				const {
					latitude,
					longitude
				} = {
					latitude: 40.040415,
					longitude: 116.273511
				};
				this._getGeocoder(latitude, longitude);
			}
		})
	},
	onShow: function () {
		// 将起终点进行fit到视野中
		const mapCtx = wx.createMapContext('map-container', this);
		if (this.data.markers[0].latitude && this.data.markers[1].latitude) {
			mapCtx.includePoints({
				points: this.data.markers,
				padding: [100, 20, 100, 20]
			});
		} else if (this.data.markers[0].latitude) {
			this.setData({
				location: {
					lat: this.data.markers[0].latitude,
					lng: this.data.markers[0].longitude
				}
			})
		}
	},
	_getGeocoder(latitude, longitude) {
		// 逆地址解析
		wx.serviceMarket.invokeService({
			service: WEBSERVICE_APPID,
			api: 'rgeoc',
			data: {
				location: latitude + ',' + longitude
			}
		}).then(res => {
			const result = (typeof res.data) === 'string' ? JSON.parse(res.data).result : res.data.result;
			const title = (result.formatted_addresses && result.formatted_addresses.recommend || result.formatted_addresses.rough) || result.address;
			const start = {
				title,
				location: result.location,
				address: result.address
			};
			this.setData({
				start,
				location: {
					...start.location
				},
				'markers[0]': {
					latitude: start.location.lat,
					longitude: start.location.lng,
					iconPath: COS_PATH + '/marker-start.png',
					height: 54,
					width: 32
				}
			});
			wx.hideLoading();
		}).catch(err => {
			console.error(err);
			wx.showToast('服务异常，请稍后再试！')
		});
	},
	onSearchPoi(evt) {
		const type = evt.target.dataset.type;
		wx.navigateTo({
			url: '../suggest/suggest?type=' + type
		})
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
})
