import {
	SMART_SOLUTION_KEY,
	COS_PATH,
	WS_HOST
} from '../../../config/appConfig';
import {
	uuid
} from '../../../utils/util';
const NEARBY_CAR = '/ws/tls/v1/lbs/nearby'; // 周边车辆服务接口
const CAR_ICON = 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png';
const DEFAULT_MARKER = {
	iconPath: CAR_ICON,
	width: 24,
	height: 30,
	anchor: {
		x: 0.5,
		y: 0.5
	},
}
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		location: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		marker: COS_PATH + '/marker-station.png',
		cars: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		if (!SMART_SOLUTION_KEY) {
			console.error('请输入有效的key');
		}
		this.mapCtx = wx.createMapContext('map-container', this);
		this._getNearbyCar(this.data.location);
	},
	onChangeCenter(evt) {
		if (evt.causedBy === 'drag' && evt.type === 'end') {
			const center = evt.detail.centerLocation;
			this._getNearbyCar(center);
		}
	},
	// 获取周边车辆数据
	_getNearbyCar(location) {
		const {
			latitude,
			longitude
		} = location;
		const params = {
			reqid: uuid(),
			reqtime: (new Date().getTime() / 1000).toFixed(0),
			key: SMART_SOLUTION_KEY,
			lat: latitude,
			lng: longitude,
			radius: 3000,
			num: 5,
			mock: 1
		};
		wx.request({
			url: WS_HOST + NEARBY_CAR,
			data: {
				...params
			},
			success: res => {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				const data = res.data.data.drivers;
				const cars = [];
				// 遍历数据，设置marker属性，并附带其他属性方便使用（marker的id需要是number类型，不然moveAlong不识别）
				data.forEach(item => {
					const polyline = this._formatPolyline(item.polyline);
					cars.push({
						id: Number(item.id),
						latitude: item.slat,
						longitude: item.slng,
						polyline,
						duration: item.duration,
						...DEFAULT_MARKER
					});
				});
				this.setData({
					cars
        });
        // setData是同步的，但是页面渲染是异步的，如果不加延时器（具体时长需要自行调整），部分moveAlong拿不到markerId报错，导致小车不移动
				this.timer = setTimeout(res => {
					cars.forEach(item => {
						this.mapCtx.moveAlong({
							markerId: Number(item.id),
							path: item.polyline,
							duration: item.duration * 1000
						});
					});
				}, 1000); // 延时时长：安卓要比IOS长一些，可以通过机型判断特殊处理
			}
		});
	},
	// 处理线数据
	_formatPolyline(polyline) {
		if (polyline.length <= 0) {
			return [];
		}
		const point = [];
		for (let i = 0; i < polyline.length; i += 2) {
			point.push({
				latitude: polyline[i],
				longitude: polyline[i + 1]
			});
		}
		return point;
	},
	onHide: function() {
		clearTimeout(this.timer);
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
