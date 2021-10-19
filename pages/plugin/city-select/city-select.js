// pages/plugin/location-picker/location.js
import {PLUGIN_KEY, REFERER} from '../../../config/appConfig';

const citySelector = requirePlugin('citySelector');
const hotCitys = '北京,上海,天津,重庆,广州,深圳';
Page({
	data: {
		type: [{
			name: '页面模式',
			type: 0
		},{
			name: '组件模式',
			type: 1
    }],
    typeIndex: 0,
    componentSelectedCity: '请查看示例选择',
    pluginSelectedCity: '请查看示例选择',
    key: PLUGIN_KEY,
    referer: REFERER,
    hotCitys,
    selectorVisible: false
  },
  // 从城市选择器插件返回后，在页面的onShow生命周期函数中能够调用插件接口，获取cityInfo结果对象
  onShow() {
    const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
    if (!selectedCity) {
      return;
    }
    this.setData({
      pluginSelectedCity: selectedCity.name
    });
  },
  onUnload () {
    // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
    citySelector.clearCity();
  },

	onSelectType(event) {
    const {index} = event.currentTarget.dataset;
		if (index === this.data.polylineTypeIndex) {
			return;
    }
    this.setData({
      typeIndex: index
    })
  },
  onSelectCity(value) {
    const componentSelectedCity = value.detail.city.name;
    this.setData({
      componentSelectedCity
    })
  },
	onWatchDemo () {
    // 判断是组件模式还是插件模式
    if (this.data.typeIndex === 0) {
			if (!this.data.key || !this.data.referer) {
				console.error('请传入有效的key和referer');
				return;
			}
      const url = `plugin://citySelector/index?key=${this.data.key}&referer=${this.data.referer}&hotCitys=${this.data.hotCitys}`;
      wx.navigateTo({
        url
      });
    } else {
      this.setData({
        selectorVisible: true
      })
    }
	},
	onWatchDoc () {
		wx.navigateTo({
			url: '../document/document?type=citySelect'
		});
	},
	onShareAppMessage: function () {
		return {
			title: '腾讯位置服务示例中心'
		};
	}
});

