//index.js
import {CDN_PATH} from '../../config/appConfig';
Page({
	data: {
		CDN_PATH,
		imgs: {
			downArrow: `${CDN_PATH}/iconArrowDown@3x.png`,
			upArrow: `${CDN_PATH}/iconArrowUp@3x.png`,
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`,
		},
		menuList: [
			{
				id: 'map',
				name: 'Map 组件',
				open: false,
				img: `${CDN_PATH}/iconMapmodule@3x.png`,
				pages: [{
					name: '地图显示',
					url: '../map/show/show',
				}, {
					name: '地图视野控制',
					url: '../map/view/view'
				}, {
					name: '地图控件',
					url: '../map/control/control'
				}, {
					name: '标注点',
					url: '../map/marker/marker'
				}, {
					name: '覆盖物',
					url: '../map/overlay/overlay'
				}, {
					name: '触发事件',
					url: '../map/event/event'
				}]
			},
			{
				id: 'plugin',
				name: '小程序插件',
				open: false,
				img: `${CDN_PATH}/iconMiniprogram@3x.png`,
				pages: [{
					name: '路线规划插件',
					url: '../plugin/route-plan/route-plan'
				},{
					name: '地图选点插件',
					url: '../plugin/location-picker/location-picker'
				},{
					name: '地铁图插件',
					url: '../plugin/subway/subway'
				}]
			},
			{
				id: 'custom',
				name: '个性化地图',
				open: false,
				url: '../customized/customized-index/customized-index',
				img: `${CDN_PATH}/iconMap@3x.png`,
				pages: []
			}
		],
		dialogShow: false,
		link: 'https://github.com/TencentLBS/TencentMapMiniProgramDemo'
	},
	onListToggle: function (e) {
		const id = e.currentTarget.id, list = this.data.menuList;
		for (let i = 0, len = list.length; i < len; ++i) {
			if (list[i].id === id) {
				if (list[i].url) {
					wx.navigateTo({
						url: list[i].url,
					});
				}
				list[i].open = !list[i].open;
			} else {
				list[i].open = false;
			}
		}
		this.setData({
			menuList: list
		});
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	watchCode () {
		this.setData({
			dialogShow: true
		});
	},
	onShareAppMessage: function () {

	}
});
