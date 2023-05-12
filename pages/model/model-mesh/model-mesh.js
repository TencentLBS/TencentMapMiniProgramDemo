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
			latitude: 22.523070312430152,
			longitude: 113.93556144154017
		},
		scale: 16.5,
		rotate: 0,
		skew: 30,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
		dialogShow: false,
		layerId: '', // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
		layerIdList: [
			'', // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
			'', // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
			'', // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
			'' // 在腾讯位置服务官网新建数据图层获取图层ID: https://lbs.qq.com/dev/console/layers/layerEdit
		],
		loading: true,
		clickable: true,
		modelInfo: {
			position: {
				latitude: '',
				longitude: ''
			},
			name: '',
			id: ''
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
		this.data.layerIdList.forEach(layerItem => {
			this.mapCtx.addVisualLayer({
				layerId: layerItem,
				success: () => {
					console.log('加载模型成功', layerItem);
				},
				fail: (error) => {
					console.error(error);
				},
			});
		});

		this.mapCtx.on('visualLayerEvent', (res) => {
			if (res.eventType === 'onLayerLoadFinishEvent') {
				this.modelLoading(JSON.parse(res.eventInfo));
			}
			if (res.eventType === 'onClickEvent') {
				this.setModelInfo(JSON.parse(res.eventInfo));
			}
		});
	},
	modelLayerReset () {
		// 重置颜色
		const command = '{"function":"resetMonoColor"}';
		// 循环对所有图层重置
		this.data.layerIdList.forEach(layerItem => {
			this.setData({
				layerId: layerItem,
			});
			this.visualLayerCommand(command);
		});
	},
	modelLoading (info) {
		const {
			errorCode,
			layerId,
		} = info;
		if (errorCode === 0) {
			this.setData({
				loading: false,
				layerId,
			});
			this.setModelClick({
				detail: {
					value: true
				}
			});
			return;
		}
		wx.showToast({
			title: '模型加载失败',
			icon: 'error',
			duration: 2500
		});
	},
	setModelInfo (info) {
		const {
			clickedPosition,
			name,
			layerId
		} = info;
		this.modelLayerReset();
		const data = {
			position: {
				latitude: clickedPosition[0].toFixed(6),
				longitude: clickedPosition[1].toFixed(6),
			},
			name,
			id: layerId,
		};
		const r = 56 / 255;
		const g = 255 / 255;
		const b = 64 / 255;
		const command = `{"function":"setMonoColor","params":{"r":"${r}","g":"${g}","b":"${b}"}}`;
		this.setData({
			modelInfo: data,
			layerId,
		});
		this.visualLayerCommand(command);
	},
	visualLayerCommand (command, success = () => {}, layerId = this.data.layerId) {
		this.mapCtx.executeVisualLayerCommand && this.mapCtx.executeVisualLayerCommand({
			layerId,
			command,
			success,
			complete: res => {
				console.log('执行executeVisualLayerCommand回调', res);
			}
		});
	},
	setModelClick (e) {
		const {
			value
		} = e.detail;
		const command = `{"function":"enableClick","params":{"enabled":${value}}}`;
		this.visualLayerCommand(command);
	},
	switchModelClick (e) {
		this.data.layerIdList.forEach(layerItem => {
			this.setData({
				layerId: layerItem,
			});
			this.setModelClick(e);
		});
		this.modelLayerReset();
	},
	resetModel () {
		// 重置颜色
		this.modelLayerReset();
		// 重置输入框
		const data = {
			position: {
				latitude: '',
				longitude: '',
			},
			name: '',
			id: '',
		};
		this.setData({
			modelInfo: data
		});
	},
	onShowDoc (e) {
		this.setData({
			dialogShow: true,
			link: e.currentTarget.dataset.url,
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
