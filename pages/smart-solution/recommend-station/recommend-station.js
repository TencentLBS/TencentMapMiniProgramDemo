import {
	uuid
} from '../../../utils/util';
import {
	SMART_SOLUTION_KEY,
	COS_PATH,
	WS_HOST,
} from '../../../config/appConfig';
const regeneratorRuntime = require('../../../utils/runtime');
const FIRST_FENCE = '/ws/tls/v1/tpp/fences'; // 是否命中一级围栏
const SECOND_FENCE = '/ws/tls/v1/tpp/search'; // 命中二级围栏推荐上车点
const COMMON_STATION = '/ws/tpp/v1/search/'; // 普通推荐上车点
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		location: {
			lat: 40.040415,
			lng: 116.273511
		},
		marker: COS_PATH + '/marker-station.png',
		recommendStation: null,
		polygon: [],
		selectList: [],
		selectIndex: null
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		if (!SMART_SOLUTION_KEY) {
			console.error('请输入有效的key');
		}
		// 获取用户当前位置
		wx.getLocation({
			type: 'gcj02',
			success: (res) => {
				const {latitude, longitude} = res;
				this._getRecommendStation({
					latitude,
					longitude
				});
			},
			fail: err => {
				console.error(err)
				const {latitude, longitude} = {
					latitude: 40.040415,
					longitude: 116.273511
				};
				this._getRecommendStation({
					latitude,
					longitude
				});
			}
		})
	},
	// 监听地图拖动事件获取中心点经纬度
	onChangeCenter(evt) {
		if (evt.causedBy === 'drag' && evt.type === 'end') {
			const center = evt.detail.centerLocation;
			this._getRecommendStation(center);
		}
	},
	// 监听修改围栏选择
	async onChangeFence(evt) {
		try {
			const currentIndex = evt.detail.value[0];
			const params = {
				reqid: uuid(),
				reqtime: (new Date().getTime() / 1000).toFixed(0),
				fence_id: this.data.selectList[currentIndex].id,
				key: SMART_SOLUTION_KEY,
				location: this.data.location.lat + ',' + this.data.location.lng
			};
			const res = await this._getData(WS_HOST + SECOND_FENCE, {
				...params
			})
			if (!res.detail) {
				return;
			}
			// 处理数据绘制围栏
			const points = this._formatPolygon(res.detail.polygon);
			if (Array.isArray(res.detail.data) && res.detail.data.length > 0) {
				const currentStation = this._setRecommendStation(res.detail.data);
				this.setData({
					polygon: [{
						points,
						fillColor: '#3875FF33',
						strokeColor: '#3875FF'
					}],
					location: currentStation.location
				});
			}
		} catch (error) {
			console.error(error);
		}

	},
	// 获取推荐上车点
	async _getRecommendStation(location) {
		const {
			latitude,
			longitude
		} = location;
		const params = {
			reqid: uuid(),
			reqtime: (new Date().getTime() / 1000).toFixed(0),
			key: SMART_SOLUTION_KEY,
			location: latitude + ',' + longitude
		}
		try {
			// 获取命中围栏数据
			const res = await this._getData(WS_HOST + FIRST_FENCE, {
				...params
			});

			if (res.detail && res.detail.hit_hub_of_traffic === 0) { // 未命中推荐围栏
				params.user_id = 123;
				// 获取普通推荐上车点位置
				const commonStationList = await this._getData(WS_HOST + COMMON_STATION, {
					...params
				});
				if (!Array.isArray(commonStationList) || commonStationList.length <= 0) {
					wx.showToast({
						title: '附近无推荐上车点',
						icon: 'none'
					});
					return;
				}
				// 对数据按距离排序
				const currentStation = this._setRecommendStation(commonStationList);
				this.setData({
					polygon: [],
					selectList: [],
					location: currentStation.location
				});
			} else { // 命中一级围栏
				let currentIndex = 0; // 当前的围栏索引
				const fenceList = res.detail.data.hit_sub_fence;
				const recommendStationList = res.detail.data.sub_fence; // 推荐上车点列表
				// 对围栏的一个推荐上车点进行距离排序(默认当前为返回的第一个)
				const currentStation = this._setRecommendStation(fenceList[0].data);
				// 匹配默认围栏
				recommendStationList.forEach((item, index) => {
					if (item.id === fenceList[0].id) {
						currentIndex = index;
					}
				})
				// 绘制围栏
				const points = this._formatPolygon(fenceList[0].polygon);
				this.setData({
					polygon: [{
						points,
						fillColor: '#3875FF33', // 是因为polygon不支持rgb格式颜色
						strokeColor: '#3875FF'
					}],
					location: currentStation.location,
					selectList: recommendStationList,
					selectIndex: [currentIndex]
				});
			}
		} catch (error) {
			wx.showToast({
				title: '附近无推荐上车点',
				icon: 'none'
			})
			this.setData({
				polygon: [],
				selectList: []
			});
			console.error(error);
		}

	},
	// 设置推荐上车点
	_setRecommendStation(stationList) {
		const mapCtx = wx.createMapContext('map-container', this);
		const recommendStationMarkers = [];
		// 推荐上车点按距离升序排序
		const recommendStation = stationList.sort((a, b) => {
			return a.distance - b.distance;
		});
		// 处理推荐上车点marker数据
		stationList.forEach((item, index) => {
			recommendStationMarkers.push({
				iconPath: COS_PATH + '/solution-station.png',
				height: 10,
				width: 10,
				anchor: {x: 0.5, y: 0.5},
				latitude: item.location.lat,
				longitude: item.location.lng,
				callout:{
					content: item.title,
					display: 'ALWAYS',
					bgColor: 'transparent',
					color: '#00C562'
				}
			})
		})
		this.setData({
			markers: recommendStationMarkers
		})
		// 吸附至推荐上车点
		mapCtx.moveToLocation({
			latitude: recommendStation[0].location.lat,
			longitude: recommendStation[0].location.lng,
			fail: err => {
				console.error(err);
				this.setData({
					location: {
						latitude: recommendStation[0].location.lat,
						longitude: recommendStation[0].location.lng,
					}
				});
			}
		});
		// 返回最近的推荐上车点数据
		return recommendStation[0];
	},
	// 格式化polygon
	_formatPolygon(polygon) {
		const poiList = polygon.split(';');
		const points = poiList.map(item => {
			const poi = item.split(',');
			return {
				latitude: poi[0],
				longitude: poi[1]
			};
		});
		return points;
	},
	// 封装数据请求
	_getData(url = '', params = {}, header = {}) {
		return new Promise((resolve, reject) => {
			wx.request({
				url: url,
				data: params,
				method: 'GET',
				header: header, // 设置请求的 header
				success: res => {
					if (res.data && res.data.status === 0) {
						resolve(res.data.data);
					}
				},
				fail: error => {
					reject(error);
				}
			});
		});
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
