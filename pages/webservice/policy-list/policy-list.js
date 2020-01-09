// pages/webservice/policy-list/policy-list.js
Page({
	data: {
		policyList: []
	},
	onLoad (options) {
		this.setData({
			policyList: JSON.parse(options.policyList)
		});
	},
	onSelectPolicy (event) {
		const {value} = event.currentTarget.dataset;
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2]; //上一个页面
		if (prevPage) {
			prevPage.setData({
				policy: value
			});
		}
		wx.navigateBack({
			delta: 1
		});
	}
});
