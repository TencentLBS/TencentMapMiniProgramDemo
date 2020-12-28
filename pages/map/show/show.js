import {INDOOR_KEY} from '../../../config/appConfig';
Page({

	/**
   * 页面的初始数据
   */
	data: {
		tabList: [{
			id: 0,
			show: true,
			name: '基础地图'
		},{
			id: 1,
			show: false,
			name: '室内图'
		},{
			id: 2,
			show: false,
			name: '海外地图'
		},{
			id: 3,
			show: false,
			name: '卫星图'
		}],
		is3D: false,
		isRealTraffic: false,
		isShowPoi: false,
		key: INDOOR_KEY
	},
	clickTab (event) {
		const id = event.detail.current,list = this.data.tabList;
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
	onChange3D (event) {
		this.setData({
			is3D: event.detail.value
		});
	},
	onChangeTraffic (event) {
		this.setData({
			isRealTraffic: event.detail.value
		});
	},
	onChangePoi (event) {
		this.setData({
			isShowPoi: event.detail.value
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
