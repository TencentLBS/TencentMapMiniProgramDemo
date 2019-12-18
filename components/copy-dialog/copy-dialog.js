// components/copy-dialog/copy-dialog.js
Component({
	options: {
		styleIsolation: 'shared'
	},
	/**
   * 组件的属性列表
   */
	properties: {
		link: String,
		show: {
			type: Boolean,
			value: false
		}
	},

	/**
   * 组件的初始数据
   */
	data: {
		buttons: [{text: '取消', extClass: 'cancel-btn'}, {text: '复制链接', extClass: 'confirm-btn'}]
	},

	/**
   * 组件的方法列表
   */
	methods: {
		onTapDialogButton (event) {
			const {index} = event.detail;
			if (index === 1) {
				wx.setClipboardData({
					data: this.properties.link,
					success: ()=>{
						this.triggerEvent('close');
					},
					fail: ()=>{},
					complete: ()=>{}
				});
			} else {
				this.triggerEvent('close');
			}
		}
	}
});
