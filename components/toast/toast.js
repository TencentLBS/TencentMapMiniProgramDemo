// pages/components/tab/tab.js
Component({
	/**
	 * 组件的初始数据
	 */
	data: {
		iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/demoCenterImage/warn.png',
		isShow: false,
		content: '',
		type: 'warn',
		duration: 1500
	},
	ready() {
		this.timer = null;
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		showToast({
			type = 'warn',
			content = '',
			duration = 1500,
			image
		}) {
			if (this.timer !== null) return;
			let url;
			if (image) {
				url = image;
			} else {
				switch (type) {
					// 此处可以扩展icon
					case 'warn':
						url = 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/demoCenterImage/warn.png';
						break;
				};
            }
			this.setData({
				isShow: true,
				type,
				content,
				duration,
				iconPath: url
			})
			this.closeCountdown()
		},
		closeCountdown() {
			const {
				duration
			} = this.data;
			this.timer = setTimeout(() => {
				this.timer = null;
				this.setData({
					isShow: false,
				})
			}, duration)
		}
	}
});
