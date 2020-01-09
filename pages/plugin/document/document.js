// pages/plugin/document/document.js
Page({

	data: {
		docData: {
			routePlan: {
				app: `路线规划 appid：wx50b5593e81dd937a\n// app.json
				{
				&emsp;"plugins": {
				&emsp;&emsp;"routePlan": {
				&emsp;&emsp;&emsp;"version": "1.0.5",
				&emsp;&emsp;&emsp;"provider": "wx50b5593e81dd937a"
				&emsp;&emsp;}
				&emsp;}
				}`,
				location: `路线规划插件需要小程序提供定位授权才能够正常使用定位功能：\n// app.json
				{
				&emsp;"permission": {
				&emsp;&emsp;"scope.userLocation": {
				&emsp;&emsp;&emsp;"desc": "你的位置信息将用于小程序定位"
				&emsp;&emsp;}
				&emsp;}
				}`,
				code: `插件页面调用示例：\nlet plugin = requirePlugin('routePlan');
				let key = ''; //使用在腾讯位置服务申请的key
				let referer = ''; //调用插件的app的名称
				let endPoint = JSON.stringify({ //终点
				&emsp;'name': '吉野家(北京西站北口店)',
				&emsp;'latitude': 39.89631551,
				&emsp;'longitude': 116.323459711
				});
				wx.navigateTo({
				&emsp;url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
				});`,
				link: 'https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx50b5593e81dd937a'
			},
			location: {
				app: `地图选点 appid：wx76a9a06e5b4e693e\n// app.json
				{
				&emsp;"plugins": {
				&emsp;&emsp;"chooseLocation": {
				&emsp;&emsp;&emsp;"version": "1.0.2",
				&emsp;&emsp;&emsp;"provider": "wx76a9a06e5b4e693e"
				&emsp;&emsp;}
				&emsp;}
				}`,
				location: `地图选点插件需要小程序提供定位授权才能够正常使用定位功能：\n// app.json
				{
				&emsp;"permission": {
				&emsp;&emsp;"scope.userLocation": {
				&emsp;&emsp;&emsp;"desc": "你的位置信息将用于小程序定位"
				&emsp;&emsp;}
				&emsp;}
				}`,
				code: `插件页面调用示例：\nconst key = ''; //使用在腾讯位置服务申请的key
				const referer = ''; //调用插件的app的名称
				const location = JSON.stringify({
				&emsp;latitude: 39.89631551,
				&emsp;longitude: 116.323459711
				});
				const category = '生活服务,娱乐休闲';\n
				wx.navigateTo({
				&emsp;url: 'plugin://chooseLocation/index?key=' + key + \n'&referer=' + referer + '&location=' + location + \n'&category=' + category });`,
				link: 'https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx76a9a06e5b4e693e'
			},
			subway: {
				app: `地铁图 appid：wx6aaf93c4435fa1c1\n// app.json
				{
				&emsp;"plugins": {
				&emsp;&emsp;"subway": {
				&emsp;&emsp;&emsp;"version": "1.0.4",
				&emsp;&emsp;&emsp;"provider": "wx6aaf93c4435fa1c1"
				&emsp;&emsp;}
				&emsp;}
				}`,
				location: `地铁图插件需要小程序提供定位授权才能够正常使用定位功能：\n// app.json
				{
				&emsp;"permission": {
				&emsp;&emsp;"scope.userLocation": {
				&emsp;&emsp;&emsp;"desc": "你的位置信息将用于小程序定位"
				&emsp;&emsp;}
				&emsp;}
				}`,
				code: `插件页面调用示例：\n	const plugin = requirePlugin('subway');
				const key = ''; //使用在腾讯位置服务申请的key
				const referer = ''; //调用插件的app的名称
				wx.navigateTo({
				&emsp;url: 'plugin://subway/index?key=' + key + '&referer=' + \nreferer
				});`,
				link: 'https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx6aaf93c4435fa1c1'
			}
		},
		currentPlugin: 'routePlan',
		dialogShow: false
	},

	onLoad: function (options) {
		const {type} = options;
		this.setData({
			currentPlugin: type
		});
	},

	onWatchLink () {
		this.setData({
			dialogShow: true
		});
	},

	onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},

	onShareAppMessage: function () {

	}
});
