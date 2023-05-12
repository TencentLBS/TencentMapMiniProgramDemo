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
			latitude: 39.9142,
			longitude: 116.4618
		},
		scale: 16.5,
		rotate: 0,
		skew: 60,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
		dialogShow: false,
		layerId: '', // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
		loading: true,
		animationType: '0',
		speed: 1,
		repeat: true,
		originData: {
			animationType: '0',
			speed: 1,
			repeat: true,
		}
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
			this.runCommand();
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
	setSkeletonAnimation (e) {
		const {loading} = this.data;
		if (loading) {
			wx.showToast({
				title: '模型加载中...',
				icon: 'none'
			});
			return;
		}
		const {
			type
		} = e.target.dataset;
		this.setData({
			animationType: type,
		}, this.runCommand);
	},
	onChangeModelSpeed (e) {
		const {
			value
		} = e.detail;
		const num = Math.floor(value * 10) / 10;
		this.setData({
			speed: num,
		}, this.runCommand);
	},
	setModelAnimationRepeat (e) {
		const {
			value
		} = e.detail;
		this.setData({
			repeat: value,
		}, this.runCommand);
	},
	// 重置数值
	resetModel () {
		const {originData: {animationType, speed, repeat}} = this.data;
		this.setData({
			animationType,
			speed,
			repeat
		}, this.runCommand);
	},
	runCommand () {
		const {
			animationType,
			speed,
			repeat
		} = this.data;
		const command = `{"function":"playSkeletonAnimation","params":{"index" : ${animationType},"speed" : "${speed}","repeat" : "${repeat}"}}`;
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
