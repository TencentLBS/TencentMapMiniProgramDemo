import {
	MOYUAN_KEY
} from '../../../config/appConfig';
const util = require('../../../utils/util');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		MOYUAN_KEY,
		location: {
			latitude: 39.9155,
			longitude: 116.4596
		},
		scale: 15.8,
		rotate: 0,
		skew: 60,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
		dialogShow: false,
		runBtnDisabled: false,
		layerId: '', // // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
		loading: true,
		autoRotate: true,
		duration: '5',
		polyline: [{
			latitude: 39.9142,
			longitude: 116.4618,
		},
		{
			latitude: 39.913523774,
			longitude: 116.46176433948176,
		},
		{
			latitude: 39.91349005666323,
			longitude: 116.45773369914025,
		},
		{
			latitude: 39.91804958529255,
			longitude: 116.4577823202934,
		},
		],
		polylineData: [],
		markers: [],
	},
	onReady () {
		this.mapCtx = wx.createMapContext('map', this);
		this.version = wx.getSystemInfoSync().SDKVersion;
		if (util.compareVersion(this.version, '2.20.1') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，请升级微信版本后使用本功能。',
				icon: 'none'
			});
			return;
		};
		this.mapCtx.addVisualLayer({
			layerId: this.data.layerId,
			fail: (error) => {
				console.error(error);
			},
		});
		this.mapCtx.on('visualLayerEvent', (res) => {
			if (res.eventType === 'onLayerLoadFinishEvent') {
				this.modelLoading(JSON.parse(res.eventInfo));
			}
			if (res.eventType === 'onTranslateAnimationCompleteEvent') {
				this.animationComplete(JSON.parse(res.eventInfo));
			}
		});
		const points = this.data.polyline;
		const endPoints = points[points.length - 1];
		this.setData({
			polylineData: [{
				points,
				width: 6,
				arrowLine: true,
				id: 0,
				style: 4
			}],
			markers: [{
				latitude: endPoints.latitude,
				longitude: endPoints.longitude,
				width: 29,
				height: 34,
				anchor: {
					x: 0.5,
					y: 1
				},
				iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/demoCenterImage/end.png',
			}]
		});
	},
	animationComplete () {
		const command = '{"function":"stopSkeletonAnimation"}';
		this.visualLayerCommand(command);
		this.setData({
			runBtnDisabled: false
		});
	},
	modelLoading (info) {
		const {
			errorCode
		} = info;
		if (errorCode === 0) {
			this.setData({
				loading: false,
			});
			return;
		}
		wx.showToast({
			title: '模型加载失败',
			icon: 'error',
			duration: 2500
		});
	},
	visualLayerCommand (command, success = () => {}) {
		this.mapCtx.executeVisualLayerCommand && this.mapCtx.executeVisualLayerCommand({
			layerId: this.data.layerId,
			command,
			success,
			complete: res => {
				console.log('执行executeVisualLayerCommand回调', res);
			}
		});
	},
	setModelAnimationAutoRotate (e) {
		const {
			value
		} = e.detail;
		this.setData({
			autoRotate: value,
		});
	},
	onDurationChange (e) {
		const {
			value
		} = e.detail;
		console.log(value);
		this.setData({
			duration: value,
		});
	},
	// 播放跑步动画
	playSkeletonAnimation () {
		const command = '{"function":"playSkeletonAnimation","params":{"index" : 0,"speed" : "1","repeat" : "true"}}';
		this.visualLayerCommand(command);
	},
	// 执行模型平移动画
	runModel () {
		const {
			duration,
			autoRotate,
			polyline
		} = this.data;
		const num = Number(duration);
		if (isNaN(num)) {
			wx.showToast({
				title: '请输入数字',
				icon: 'error'
			});
			return;
		}
		if (!duration) {
			wx.showToast({
				title: '请输入动画时长',
				icon: 'error'
			});
			return;
		}
		const points = polyline.map(item => {
			return [util.numberToFixed(item.latitude), util.numberToFixed(item.longitude)];
		}).flat(Infinity).join(',');
		this.playSkeletonAnimation();
		const command = `{"function":"startTranslateAnimation","params":{"positions":[${points}],"duration":"${duration}","initRotation":180,"needRotate":"${autoRotate}"}}`;
		this.visualLayerCommand(command);
	},
	onShowDoc () {
		this.setData({
			dialogShow: true,
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addVisualLayer.html'
		});
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
