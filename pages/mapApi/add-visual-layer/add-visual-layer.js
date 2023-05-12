// pages/control-view/control-view.js
import {MOYUAN_KEY} from '../../../config/appConfig';
const util = require('../../../utils/util');
const LAYER = {
	arc: '', // 在腾讯位置服务官网新建数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
	heat: '', // 在腾讯位置服务官网新建数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
	grid: '' // 在腾讯位置服务官网新建数据图层获取: https://lbs.qq.com/dev/console/layers/layerEdit
};
const INTRODUCE = {
  arc: '弧线图用以展示两点之间的关联，常用于迁徙图、航线图等表示流向的场景中',
	heat: '经典热力图的表达方式，以颜色来表现数据强弱大小及分布趋势',
	grid: '网格热力图将离散的数据点以六边形或正方形区域进行聚合，根据落入区域内的数据点数量渲染不同颜色'
};
const LOCATION = {
  arc: {
    latitude: 39.918056,
    longitude: 116.397027
  },
  heat: {
    latitude: 22.60939,
    longitude: 114.029381
  },
  grid: {
    latitude: 41.018056,
    longitude: 116.397027
  }
};

const SCALE = {
  arc: 4,
  heat: 10,
  grid: 7
}

Page({

	/**
   * 页面的初始数据
   */
	data: {
    MOYUAN_KEY,
		location: {
			latitude: 39.918056,
			longitude: 116.397027
    },
    introduce: INTRODUCE['arc'],
    scale: 4,
    rotate: 0,
    skew: 30,
		type: 'arc',
    link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html',
    dialogShow: false
	},
	onReady () {
    this.mapCtx = wx.createMapContext('map', this);
		this.version = wx.getSystemInfoSync().SDKVersion;
		if (util.compareVersion(this.version, '2.20.1') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，请升级微信版本后使用本功能。',
				icon: 'none'
			});
			return;
    }
    this.addVisualLayer(LAYER[this.data.type]);
	},

	// 切换数据图层
	onChangeLayerType (event) {
    const {type} = event.currentTarget.dataset;
    if (util.compareVersion(this.version, '2.20.1') < 0) {
			// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
			wx.showToast({
				title: '当前微信版本过低，请升级微信版本后使用本功能。',
				icon: 'none'
			});
			return;
    }
    if ( type === this.data.type ) {
      return;
    }
    this.removeVisualLayer(LAYER[this.data.type]);
    this.setData({
      introduce: INTRODUCE[type],
      type
    })
    this.addVisualLayer(LAYER[type]);
  },
  /**
   * 移除图层
   * @param {*} layerId 图层id
   */
  removeVisualLayer (layerId) {
    this.mapCtx.removeVisualLayer({
      layerId,
      success: () => {
      },
      fail: (error) => {
        console.error(error);
      }
    })
  },
  /**
   * 添加图层
   * @param {*} layerId 图层id
   */
  addVisualLayer(layerId) {
    this.mapCtx.addVisualLayer({
      layerId,
      success: () => {
        this.setData({
          location: {...LOCATION[this.data.type]},
          scale: SCALE[this.data.type],
          skew: 30,
          rotate: 0
        });
      },
      fail: (error) => {
        console.error(error);
      }
    })
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
			link: 'https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.addVisualLayer.html'
		});
  },
  onDialogClose () {
		this.setData({
			dialogShow: false
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});
