// pages/components/tab/tab.js
Component({
	/**
   * 组件的属性列表
   */
	properties: {
		tabList: Array,
		currentTab: {
			type: Number,
			value: 0
		}
	},

	/**
   * 组件的初始数据
   */
	data: {
		currentTab: 0
	},
	created () {
		this.setData({
			currentTab: this.properties.currentTab
		});
	},
	/**
   * 组件的方法列表
   */
	methods: {
		onClickTab: function (event) {
			const current = event.currentTarget.dataset.current;
			if (this.properties.currentTab === current) {
				return false;
			}
			this.setData({
				currentTab: event.currentTarget.dataset.current
			});
			this.triggerEvent('clickTab', {
				current: event.currentTarget.dataset.current
			});
		},

	}
});
