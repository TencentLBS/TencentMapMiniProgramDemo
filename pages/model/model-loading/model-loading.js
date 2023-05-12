import {
	CDN_PATH,
	MOYUAN_KEY,
	REFERER,
} from '../../../config/appConfig';
const util = require('../../../utils/util');
const chooseLocation = requirePlugin('chooseLocation');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabList: [{
			id: 0,
			show: true,
			name: '模型加载'
		}, {
			id: 1,
			show: false,
			name: '位置调整',
			dataName: 'location',
		}, {
			id: 2,
			show: false,
			name: '缩放',
			dataName: 'modelScale',
		}, {
			id: 3,
			show: false,
			name: '旋转',
			dataName: 'modelRotation',
		}],
		MOYUAN_KEY,
		location: {
			latitude: 22.5228,
			longitude: 113.93522
		},
		scale: 16.3,
		rotate: 0,
		addressName: '腾讯滨海大厦', // 选点位置名称
		skew: 30,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
		dialogShow: false,
		layerId: '', // 在腾讯位置服务官网新建数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
		loading: true,
		modelScale: 1.0,
		modelRotation: {
			x: 90,
			y: 0,
			z: 0,
		},
		images: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`,
		},
		originScale: 110, // 配置模型图层时初始的缩放大小
		originData: [
			'占位',
			{
				latitude: 22.5228,
				longitude: 113.93522,
				addressName: '腾讯滨海大厦', // 选点位置名称
			},
			1.0,
			{
				x: 90,
				y: 0,
				z: 0,
			}
		],
		category: '公司企业,机构团体,购物'
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
			wx.showToast({
				title: '模型加载成功',
				icon: 'success'
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
	resetModel () {
		const {
			originData,
			tabList,
			originScale,
		} = this.data;
		const [item] = tabList.filter(item => item.show);
		switch (item.dataName) {
			case 'location':
				this.setModelPosition(originData[item.id]);
				this.setData({
					addressName: originData[item.id].addressName
				});
				break;
			case 'modelScale':
				this.setModelScale(originScale);
				break;
			case 'modelRotation':
				this.setModelRotation(originData[item.id]);
				break;
		};
		this.setData({
			[item.dataName]: originData[item.id]
		});
	},
	setModelPosition ({
		latitude,
		longitude
	}) {
		const command = `{"function":"setPosition","params":{"lat":${latitude},"lng":${longitude},"altitude":10}}`;
		this.visualLayerCommand(command);
	},
	setModelScale (scale) {
		const command = `{"function":"setScale","params":{"scale": "${scale}"}}`;
		this.visualLayerCommand(command);
	},
	setModelRotation ({x, y, z}) {
		const command = `{"function":"setRotation","params":{"rotationX" : ${x},"rotationY" : ${y},"rotationZ" : ${z}}}`;
		this.visualLayerCommand(command);
	},
	onChangeModelScale (event) {
		const {
			originScale
		} = this.data;
		const {
			value
		} = event.detail;
		const num = Math.floor(value * 10) / 10;
		const scale = num * originScale;
		this.setData({
			modelScale: num,
		});
		this.setModelScale(scale);
	},
	toLocationPicker () {
		const key = MOYUAN_KEY;
		const referer = REFERER;
		const location = this.data.location ? JSON.stringify(this.data.location) : '';
		const category = this.data.category;
		const scale = this.data.scale;
		let url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&scale=' + scale;
		if (location) {
			url += '&location=' + location;
		}
		if (category) {
			url += '&category=' + category;
		}
		wx.navigateTo({
			url
		});
	},
	onChangeModelRotation (event) {
		const {modelRotation} = this.data;
		const {
			target: {
				dataset: {
					type
				}
			},
			detail: {
				value
			}
		} = event;
		const data = {
			...modelRotation,
			[type]: value,
		};
		this.setData({
			modelRotation: data,
		});
		this.setModelRotation(data);
	},
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
			tabList: list
		});
	},
	onShowDoc () {
		this.setData({
			dialogShow: true,
			link: 'https://lbs.qq.com/'
		});
	},
	// 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
	onShow () {
		const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
		if (!location || !location.latitude || !location.longitude) return;
		const {latitude, longitude, name} = location;
		const command = `{"function":"setPosition","params":{"lat":${latitude},"lng":${longitude},"altitude":0}}`;
		this.visualLayerCommand(command);
		this.setData({
			location: {
				latitude: util.numberToFixed(latitude),
				longitude: util.numberToFixed(longitude)
			},
			addressName: name
		});
	},
	onUnload () {
		// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
		chooseLocation.setLocation(null);
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
