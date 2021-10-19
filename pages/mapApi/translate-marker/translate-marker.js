// pages/mapApi/move-along/move-along.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: {
      scale: 11,
      latitude: 40.040353,
      longitude: 116.273503,
    },
    id: 1,
    markers: [{
      id: 1,
      latitude: 40.040353,
      longitude: 116.273503,
      width: 34,
      height: 34,
      iconPath:  '../../map/marker/imgs/Marker1_Activated@3x.png'
    }],
    isDisabled: false,
    dialogShow: false,
    link: 'https://github.com/TencentLBS/TencentMapMiniProgramDemo',
  },
  onShow () {
    this.isReset = false;
  },
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
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.translateMarker.html'
		});
	},
  onRunApi() {
   const mapCtx = wx.createMapContext('map', this);
   if (this.data.isDisabled) {
    return;
    }
    this.setData({
      isDisabled: true
    })
   if (!this.isReset) {
    this.isReset = !this.isReset;
    mapCtx.translateMarker({
      markerId: 1,
      destination: {
        latitude: 39.984212,
        longitude: 116.307449
      },
      success: () => {
        this.setData({
          isDisabled: false
        })
      }
    })
   } else {
    this.isReset = !this.isReset;
    mapCtx.translateMarker({
      markerId: 1,
      destination: {
        latitude: 40.040353,
        longitude: 116.273503
      },
      success: () => {
        this.setData({
          isDisabled: false
        })
      }
    })
   }
   
  },
  onReset () {
    const mapCtx = wx.createMapContext('map', this);
    mapCtx.translateMarker({
       markerId: 1,
       destination: {
        latitude:39.984060,
        longitude: 116.307520,
       },
     }) 
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