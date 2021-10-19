// pages/mapApi/include-points/include-points.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      scale: 15,
      latitude: 40.015433,
      longitude: 116.392593
    },
    markers: [{
      id: 1,
      latitude: 40.040736,
      longitude: 116.273031,
      width: 34,
      height: 34,
      iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
    },{
      id: 2,
      latitude: 39.992553,
      longitude: 116.273117,
      width: 34,
      height: 34,
      iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
    },{
      id: 3,
      latitude: 39.895690,
      longitude: 116.321182,
      width: 34,
      height: 34,
      iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
    },{
      id: 4,
      latitude: 40.015433,
      longitude: 116.392593,
      width: 34,
      height: 34,
      iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
    },{
      id: 5,
      latitude: 39.917548,
      longitude: 116.324959,
      width: 34,
      height: 34,
      iconPath: '../../map/marker/imgs/Marker1_Activated@3x.png'
    }],
    points: [{
      latitude: 40.040736,
      longitude: 116.273031,
    },{
      latitude: 39.992553,
      longitude: 116.273117,
    },{
      latitude: 39.895690,
      longitude: 116.321182,
    },{
      latitude: 40.015433,
      longitude: 116.392593,
    },{
      latitude: 39.917548,
      longitude: 116.324959,
    }],
    dialogShow: false,
    link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
    btnTxt: '执行'
  },
  onRunApi () {
    if (this.data.isDisabled) {
      return;
    }
    this.setData({
      isDisabled: true
    })
    if (!this.isReset) {
      this.isReset = !this.isReset;
      const mapCtx = wx.createMapContext('map', this);
      mapCtx.includePoints({
        points: this.data.points,
        padding: [36, 36, 10, 36]
      })
      setTimeout(() => {
        this.setData({
          btnTxt: '重置',
          isDisabled: false
        })
      },1000)
    } else {
      this.isReset = !this.isReset;
      this.setData({
        setting: {
          scale: 15,
          latitude: 40.015433,
          longitude: 116.392593
        },
      })
      setTimeout(() => {
        this.setData({
          btnTxt: '执行',
          isDisabled: false
        })
      },1000)
    }
  },
  // onReset () {
  //   this.setData({
  //     setting: {
  //       scale: 15,
  //       latitude: 40.015433,
  //       longitude: 116.392593
  //     },
  //   })
  // },
  onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
  onShowCompatibility () {
    this.setData({
			dialogShow: true,
			link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'
		});
  },
  onShowDoc () {
		this.setData({
			dialogShow: true,
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.includePoints.html'
		});
	},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
			title: '腾讯位置服务示例中心'
		};
  }
})