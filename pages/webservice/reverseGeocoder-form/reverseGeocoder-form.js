// pages/webservice/reverseGeocoder-form/reverseGeocoder-form.js
import {
	CDN_PATH,
} from '../../../config/appConfig';
Page({
	data: {
		imgs: {
			rightArrow: `${CDN_PATH}/iconArrowRight@3x.png`
		},
		location: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		policyList: [
			{value: 1, title: '侧重于描述当前位置', subtitle: '以地标+主要的路+近距离POI为主'},
			{value: 2, title: '到家场景', subtitle: '筛选合适收货的POI，并会细化收货地址，精确到楼栋'},
			{value: 3, title: '出行场景', subtitle: '过滤掉车辆不易到达的POI(如一些景区内POI)，增加道路出入口、交叉口、大区域出入口类POI，排序会根据真实API大用户的用户点击自动优化'},
			{value: 4, title: '社交签到场景', subtitle: '针对用户签到的热门地点进行优先排序'},
			{value: 5, title: '位置共享场景', subtitle: '用户经常用于发送位置、位置分享等场景的热门地点优先排序'},
		],
		regionCallbackTxt: '拖动地图选择坐标',
		policy: 1,
		animation: false,
		isShowSubpois: true,
		dialogShow: false,
		link: 'https://developers.weixin.qq.com/community/servicemarket/detail/00046c6eed0df09552990112551815'
	},
	// 监听视野变化
	onChangeRegion (event) {
		if (event.type === 'end' && event.causedBy === 'drag') {
			const mapCtx = wx.createMapContext('map', this);
			mapCtx.getCenterLocation({
				success: res => {
					const latitude = res.latitude;
					const longitude = res.longitude;
					this.setData({
						animation: true,
						regionCallbackTxt: latitude.toFixed(6) + ',' + longitude.toFixed(6)
					});
				}
			});
		}
	},
	onMarkerAnimationend () {
		this.setData({
			animation: false
		});
	},
	onChangeShowSubpois (event) {
		const {value} = event.detail;
		this.setData({
			isShowSubpois: value
		});
	},
	onSelectPolicy () {
		wx.navigateTo({
			url: '../policy-list/policy-list?policyList=' + JSON.stringify(this.data.policyList),
		});
	},
	onRun () {
		if (this.data.regionCallbackTxt === '拖动地图选择坐标') {
			wx.showToast({
				title: '请拖动地图选择坐标',
				icon: 'none',
				duration: 1500,
				mask: false
			});
			return;
		}
		wx.navigateTo({
			url: `../reverseGeocoder-result/reverseGeocoder-result?location=${this.data.regionCallbackTxt}&getPoi=${this.data.isShowSubpois ? 1 : 0}&policy=${this.data.policy}`,
		});
	},
	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onWatchDoc () {
		this.setData({
			dialogShow: true
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
