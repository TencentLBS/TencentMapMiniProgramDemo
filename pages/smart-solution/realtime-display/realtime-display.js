const util = require('../../../utils/util');
import dataList from './dataList'; // gps轨迹数据

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		location: {
			latitude: 39,
			longitude: 116
		},
		markers: [],
		polyline: [],
		isDisabled: false,
		duration: 4000,
		speed: 400
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.count = 0;
		this.cycleCount = 0;
		this.mapCtx = wx.createMapContext('map-container', this);
		this.customizeToast = this.selectComponent('#customize-toast')
		// 格式化数据
		this.dataList = dataList.map(item => {
			return JSON.parse(item.data)
		})
		// 全程路线
		this.points = this._formatPolyline(this.dataList[0].routes.polyline);
		// 当前小车坐标
		this.carData = {
			id: 1,
			latitude: this.points[0].latitude,
			longitude: this.points[0].longitude,
			width: 24,
			height: 30,
			anchor: {
				x: 0.5,
				y: 0.5
			},
			iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
		};
		this.setData({
			polyline: [{
				points: this.points,
				width: 6,
				arrowLine: true,
				id: 0,
				style: 4
			}],
			location: {
				latitude: this.points[0].latitude,
				longitude: this.points[0].longitude
			},
			markers: [this.carData]
		});
		// 订单排序
		this.formatChildOrder(this.dataList[0]);
		// 添加途径点
		this.addWaypoint();
	},
	// 结合相同子订单并排序
	formatChildOrder(data) {
		const waypoint = {};
		data.routes.sub_orders.forEach(item => {
			waypoint[item.orderid] = {
				orderid: item.orderid,
				startPointIndex: item.point_type === 1 ? item.point_index : waypoint[item.orderid]?.startPointIndex,
				endPointIndex: item.point_type === 2 ? item.point_index : waypoint[item.orderid]?.endPointIndex,
			}
		})
		const transformArray = Object.keys(waypoint).map((item) => ({
			...waypoint[item],
		}));
		this.userWaypointInfo = transformArray.sort((a, b) => {
            switch(true){
                case a.startPointIndex > b.startPointIndex: return 1;
                case a.startPointIndex === b.startPointIndex: return 0;
                case a.startPointIndex < b.startPointIndex: return -1;
            }
		}).map((item, index) => {
			item.userIndex = index;
			return item;
		});
	},
	markerData(latlng, type, text) {
		let url;
		switch (type) {
			case 1:
				url = 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/demoCenterImage/waypoint.png';
				break;
			case 2:
				url = 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/demoCenterImage/start.png';
				break;
			case 3:
				url = 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/demoCenterImage/end.png';
				break;
		};
		const obj = {
			latitude: latlng.latitude,
			longitude: latlng.longitude,
			width: 29,
			height: 34,
			anchor: {
				x: 0.5,
				y: 1
			},
			iconPath: url,
		};
		if (text) {
			obj.label = {
				content: text,
				textAlign: 'center'
			};
		}
		return obj;
	},
	// 添加司机视角途径点
	addWaypoint() {
		const markerList = this.userWaypointInfo.map((item, index) => {
			const temp = [];
			if ((this.points.length - item.endPointIndex) < 5) {
				temp.push(this.markerData(this.points[item.startPointIndex], 1, `乘客${index + 1}起点`))
			} else {
				temp.push(
					this.markerData(this.points[item.startPointIndex], 1, `乘客${index + 1}起点`),
					this.markerData(this.points[item.endPointIndex], 1, `乘客${index + 1}终点`))
			}
			return temp
		})
		this.setData({
			markers: [
				this.carData,
				...markerList.flat(Infinity),
				this.markerData(this.points[0], 2),
				this.markerData(this.points[this.points.length - 1], 3, '乘客1终点'),
			],
		});
	},
	// 点串解压并处理成符合小程序的数据格式
	_formatPolyline(polyline) {
		const coors = polyline,
			pl = [];
		//坐标解压（返回的点串坐标，通过前向差分进行压缩）
		for (let i = 2; i < coors.length; i++) {
			coors[i] = Number(coors[i - 2]) + Number(coors[i]);
		}
		//将解压后的坐标放入点串数组pl中
		for (let i = 0; i < coors.length; i += 2) {
			pl.push({
				latitude: coors[i],
				longitude: coors[i + 1]
			})
		}
		return pl;
	},
	// 更换乘客视角
	changePassengerView(event) {
		const index = Number(event.currentTarget.dataset.index);
		let flag = false;
		this.userWaypointInfo.forEach(item => {
			if (item.endPointIndex <= this.count && item.userIndex === index) {
				flag = true;
                this.customizeToast.showToast({
                    content: `乘客${index + 1}已下车`,
                    duration: 1500
                });
			}
		});
		if (flag) return;
		this.userIndex = index;
		const {
			startPointIndex,
			endPointIndex
		} = this.userWaypointInfo[index]
		const line = this.points.slice(this.count, endPointIndex + 1);
		const waypoint = this.userWaypointInfo.map(item => {
			const temp = [];
			const addItem = (poiIndex) => {
				temp.push(this.markerData(this.points[poiIndex], 1));
			}
			if (index !== item.userIndex) {
				if (startPointIndex < item.startPointIndex && endPointIndex > item.startPointIndex) {
					addItem(item.startPointIndex);
				}
				if (startPointIndex < item.endPointIndex && endPointIndex > item.endPointIndex) {
					addItem(item.endPointIndex);
				}
				return temp;
			}
		}).flat(Infinity).filter(item => !!item);
		this.setData({
			markers: [
				this.carData,
				...waypoint,
				this.markerData(this.points[startPointIndex], 2),
				this.markerData(this.points[endPointIndex], 3),
			],
			location: {
				latitude: this.points[startPointIndex].latitude,
				longitude: this.points[startPointIndex].longitude
			},
		});
		this.mapCtx.includePoints({
			points: line,
			padding: [30, 30, 30, 30]
		});
	},
	// 更换司机视角
	changeDriverView() {
		const points = this.points.slice(this.count);
		this.setData({
			location: {
				latitude: this.points[0].latitude,
				longitude: this.points[0].longitude
			},
		})
		this.addWaypoint();
		this.mapCtx.includePoints({
			points: points,
			padding: [10, 10, 10, 10]
		});
	},
	getLocation() {
		// 模拟获取实时定位，小车两点之间移动时长 duration 秒，每 speed 秒获取一次小车移动的位置更新路线
		this.cycleCount++;
		const {
			duration,
			speed
		} = this.data;
		const time = duration / speed;
		const data = this.points.slice(this.count, this.count + 2);
		if (this.cycleCount >= time) {
			this.cycleCount = 0;
		}
		const dataDiff = {
			latitude: (this.points[this.count].latitude + ((data[1].latitude - data[0].latitude) / time) * this.cycleCount).toFixed(7),
			longitude: (this.points[this.count].longitude + ((data[1].longitude - data[0].longitude) / time) * this.cycleCount).toFixed(7),
		}
		return dataDiff
	},
	// 执行movealong
	onRunApi() {
		const version = wx.getSystemInfoSync().SDKVersion

		if (util.compareVersion(version, '2.13.0') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
				icon: 'none'
			})
			return;
		}
		if (this.data.isDisabled) {
			return;
		}
		this.setData({
			isDisabled: true
		});
		this.mapCtx.includePoints({
			points: this.points,
			padding: [10, 10, 10, 10]
		});
		const {
			duration,
			speed
		} = this.data;
		this.timer = setTimeout(() => {
			this.setData({
				isDisabled: false
			})
		}, this.points.length * duration);

		this.count = 0;
		this.cycleCount = 0;
		// 计时器会延后，这里先执行一次
		this.mapCtx.moveAlong({
			markerId: 1,
			path: this.points.slice(this.count, this.count + 2),
			duration: duration,
			autoRotate: true
		});
		// 模拟获取小车实时位置
		this.getLocationInterval = setInterval(() => {
			const data = this.getLocation();
			this.clearLine(data);
		}, speed)

		// 真实情况下只需要获取司机当前的point_idx即可
		this.moveAlongInterval = setInterval(() => {
			if (this.count >= this.points.length - 1) {
				clearInterval(this.moveAlongInterval);
				clearInterval(this.getLocationInterval);
				return;
			}
			this.count += 1;
			this.mapCtx.moveAlong({
				markerId: 1,
				path: this.points.slice(this.count, this.count + 2),
				duration: duration,
				autoRotate: true
			});
		}, duration);
	},
	// 去除已驶过路线
	clearLine(currentLocation) {
		this.mapCtx.eraseLines({
			lines: [{
				id: 0,
				index: this.count,
				point: {
					latitude: currentLocation.latitude,
					longitude: currentLocation.longitude
				},
				clear: false
			}],
			success: function (res) {}
		})
	},
	onHide: function () {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
})
