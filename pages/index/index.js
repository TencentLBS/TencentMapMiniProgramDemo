//index.js
import {CDN_PATH, COS_PATH} from '../../config/appConfig';
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
        img: `${CDN_PATH}/iconMapmodule@3x.png?cache=0`,
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
				id: 'mapApi',
				name: 'Map API',
				open: false,
        img: `${COS_PATH}/iconMapapi@3x.png?cache=0`,
				pages: [{
					name: 'includePoints',
					url: '../mapApi/include-points/include-points'
				},{
					name: 'moveAlong',
					url: '../mapApi/move-along/move-along'
				},{
					name: 'translateMarker',
					url: '../mapApi/translate-marker/translate-marker'
				},
				{
					name: 'initMarkerCluster',
					url: '../mapApi/init-marker-cluster/init-marker-cluster'
				},{
					name: 'openMapApp',
					url: '../mapApi/open-map-app/open-map-app'
				}]
			},
			{
				id: 'plugin',
				name: '小程序插件',
				open: false,
        img: `${CDN_PATH}/iconMiniprogram@3x.png?cache=0`,
				pages: [{
					name: '路线规划插件',
					url: '../plugin/route-plan/route-plan'
				},{
					name: '地图选点插件',
					url: '../plugin/location-picker/location-picker'
				},{
					name: '地铁图插件',
					url: '../plugin/subway/subway'
				},{
					name: '城市选择器插件',
					url: '../plugin/city-select/city-select'
				}]
			},
			{
				id: 'custom',
				name: '个性化地图',
				open: false,
				url: '../customized/customized-index/customized-index',
        img: `${CDN_PATH}/iconMap@3x.png?cache=0`,
				pages: []
			},
			{
				id: 'webservice',
				name: '接口能力',
				open: false,
        img: `${CDN_PATH}/iconPort@3x.png?cache=0`,
				pages: [{
					name: '逆地址解析',
					url: '../webservice/reverseGeocoder-form/reverseGeocoder-form'
				},{
					name: '地点搜索',
					url: '../webservice/search-form/search-form'
				}]
			},
			{
				id: 'smartSolution',
				name: '出行解决方案',
				open: false,
        img: `${COS_PATH}/index_smartSolution@2x.png?cache=0`,
				pages: [{
					name: '周边车辆',
					url: '../smart-solution/nearby-car/nearby-car'
				},{
					name: '推荐上车点',
					url: '../smart-solution/recommend-station/recommend-station'
				},{
					name: '地点检索',
					url: '../smart-solution/location-search/location-search'
				},{
					name: '司乘同显-乘客端',
					url: '../smart-solution/move-along/move-along'
				}]
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
			dialogShow: true,
			link: 'https://github.com/TencentLBS/TencentMapMiniProgramDemo'
		});
	},
	// 链接到lbs官网
	onLinkLBS () {
		this.setData({
			dialogShow: true,
			link: 'https://lbs.qq.com/miniSolution?adtag=wx.slzx.sy'
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
