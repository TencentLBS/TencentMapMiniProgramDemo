
const util = require('../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 14.5,
    location: {
      latitude: 40.0370140,
      longitude: 116.271214,
    },
    markers: [{
      id: 1,
      latitude:40.040129,
      longitude: 116.274968,
      width: 16,
      height: 20,
      anchor: {
        x: 0.5,
        y: 0.5
      },
      iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
    }],
    polyline: [{
      points: [{"latitude":40.040129,"longitude":116.274968},{"latitude":40.038974,"longitude":116.275214},{"latitude":40.038974,"longitude":116.275214},{"latitude":40.038565000000006,"longitude":116.272683},{"latitude":40.03848200000001,"longitude":116.27209500000001},{"latitude":40.03836100000001,"longitude":116.27074},{"latitude":40.03832700000001,"longitude":116.270515},{"latitude":40.03807400000001,"longitude":116.268038},{"latitude":40.03801400000001,"longitude":116.26763600000001},{"latitude":40.03801400000001,"longitude":116.26763600000001},{"latitude":40.03790800000001,"longitude":116.267508},{"latitude":40.03450300000001,"longitude":116.270961},{"latitude":40.03419900000001,"longitude":116.271221},{"latitude":40.03396500000001,"longitude":116.271401},{"latitude":40.03245000000001,"longitude":116.272472}],
      color: '#3875FF',
      width: 6
    }],
    isDisabled: false,
    dialogShow: false,
		link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html'
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
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.moveAlong.html'
		});
	},
  onRunApi() {
    const version = wx.getSystemInfoSync().SDKVersion

    if (util.compareVersion(version, '2.13.0') < 0) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showToast({
        title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        icon: 'none'
      })
      return;
    }
   
    const mapCtx = wx.createMapContext('map', this);
    if (this.data.isDisabled) {
      return;
    }
    this.setData({
      isDisabled: true
    })
    this.timer = setTimeout(() => {
      this.setData({
        isDisabled: false
      })
    },10000)
    mapCtx.moveAlong({
      markerId: 1,
      path: this.data.polyline[0].points,
      duration: 10000,
      autoRotate: true
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