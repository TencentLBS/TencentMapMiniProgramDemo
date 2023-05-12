import {
	MOYUAN_KEY
} from '../../../config/appConfig';
const util = require('../../../utils/util');

const modelLocation = [
	{
		latitude: 22.523070312430152,
		longitude: 113.93556144154017
	},
	{
		latitude: 39.9151,
		longitude: 116.4661
	}
];

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabList: [{
			id: 0,
			show: true,
			name: '曝光度'
		}, {
			id: 1,
			show: false,
			name: '模型换肤',
		}],
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
		layerId: '', // 在腾讯位置服务官网新建3D模型数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
		layerId2: '', // 在腾讯位置服务官网新建数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
		loading: true,
		shoeModelLoading: true,
		exposure: 3,
		materialType: 'Street',
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
		this.mapCtx.addVisualLayer({
			layerId: this.data.layerId2,
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
			errorCode,
			layerId: loadModelId
		} = info;
		const {layerId, layerId2} = this.data;
		if (errorCode === 0) {
			switch(loadModelId) {
				case layerId:
					// 第一个模型加载完成后开启点击模型功能
					this.setData({
						loading: false,
					});
					this.setModelClick({
						detail: {
							value: true
						}
					});
					break;
				case layerId2:
					this.setData({
						shoeModelLoading: false,
					});
					break;
			}
			return;
		}
		wx.showToast({
			title: '模型加载失败',
			icon: 'error',
			duration: 2500
		});
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
	// 曝光度
	onChangeModelExposure (e) {
		const {
			value
		} = e.detail;
		const command = `{"function":"setExposure","params":{"exposure":${value}}}`;
		this.visualLayerCommand(command);
		this.setData({
			exposure: value,
		});
	},
	resetModelExposure () {
		const num = 3;
		const command = `{"function":"setExposure","params":{"exposure":${num}}}`;
		this.visualLayerCommand(command);
		this.setData({
			exposure: num,
		});
	},
	// 材质切换
	setMaterial (index) {
		const command = `{"function":"setMaterialVariant","params":{"index":${index}}}`;
		this.setData({
			location: {
				latitude: 39.9151,
				longitude: 116.4661
			},
		});
		this.visualLayerCommand(command, null, this.data.layerId2);
	},
	onChangeMaterialType (event) {
		const {shoeModelLoading} = this.data;
		if (shoeModelLoading) {
			wx.showToast({
				title: '模型加载中...',
				icon: 'none'
			});
			return;
		}
		const {
			type,
			name
		} = event.currentTarget.dataset;
		this.setData({
			materialType: name,
		});
		this.setMaterial(type);
	},
	// 导航栏切换
	clickTab (event) {
		const id = event.detail.current,
			list = this.data.tabList;
		for (let i = 0, len = list.length; i < len; ++i) {
			if (list[i].id === id) {
				list[i].show = !list[i].show;
			} else {
				list[i].show = false;
			}
		}
		this.setData({
			tabList: list,
			location: modelLocation[id],
		});
	},
	onShowDoc (e) {
		this.setData({
			dialogShow: true,
			link: e.currentTarget.dataset.url
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
