const citySelector = requirePlugin('citySelector');
import {
	PLUGIN_KEY,
	WEBSERVICE_APPID,
	COS_PATH
} from '../../../config/appConfig';
const ONLINECAR = { // 网约车策略场景
  PICKUP: 10,
  DROPOFF: 11
};
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		city: {
			name: '北京',
			location: {
				latitude: 39.90469,
				longitude: 116.40717
			},
			id: "110000"
		},
		suggestionData: [],
		inputChangeShow: false,
		keyword: '',
		searchValue: '',
		searchData: [],
		searchFocus: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.type = options.type;
		this.policy = options.type === 'start' ? ONLINECAR.PICKUP : ONLINECAR.DROPOFF; // const 常量
	},
	onShow: function () {
		const city = citySelector.getCity();
		if (!city) {
			return;
		}
		this.setData({
			city
		})
	},
	onUnload() {
		// 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
		citySelector.clearCity();
	},
	// 调用城市选择器插件
	onChooseCity() {
		if (!PLUGIN_KEY) {
			console.error('请传入有效的key');
			return;
		}
		wx.navigateTo({
			url: `plugin://citySelector/index?key=${PLUGIN_KEY}&referer=demoCenter`,
		})
	},

	/**
	 * 输入框值改变时
	 */
	onInputChange(e) {
		this.keyword = e.detail.value || '';
		if (e.detail.keyCode === undefined) { //处理点击删除按钮，还会触发inputchange问题
			this.keyword = '';
			this.setData({
				searchValue: '',
				searchFocus: true,
			});
		}
		if (this.keyword.trim() === '') {
			this.setData({
				keyword: '',
				suggestionData: [],
				inputChangeShow: false
			});
			return;
		} else if (this.keyword === this.data.keyword) { //解决重新点击输入框，会再次请求sug数据的情况
			return;
		} else {
			this.setData({
				keyword: this.keyword,
				inputChangeShow: true,
				searchContentShow: 'suggestion',
				searchFocus: true,
			});
		}
		const options = {
			region: this.data.city.name,
			keyword: this.keyword,
			get_subpois: 1,
			policy: this.policy,
			output: 'json'
		};
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = setTimeout(() => {
			this._getSuggestions(options);
		}, 200);
	},

	/**
	 * 获取suggestion数据
	 */
	async _getSuggestions(options) {
		wx.serviceMarket.invokeService({
			service: WEBSERVICE_APPID,
			api: 'poiSuggestion',
			data: {
				...options
			}
		}).then(res => {
			const suggestion = (typeof res.data) === 'string' ? JSON.parse(res.data) : res.data;
			const pois = suggestion.data;
			const subPois = suggestion.sub_pois;
			subPois.forEach(subPoi => {
				const parentId = subPoi.parent_id;
				for (const poi of pois) {
					if (poi.id === parentId) {
						poi.subPois = poi.subPois || [];
						subPoi.allTitle = `${poi.title}-${subPoi.title}`;
						poi.subPois.push(subPoi);
						break;
					}
				}
			});
			//返回数据为空处理
			if (suggestion && suggestion.count <= 0) {
				this.setData({
					inputChangeShow: true,
					suggestionData: [],
					searchContentShow: 'empty'
				});
				return;
			}
			const suggestionData = suggestion.data;
			suggestionData.forEach(item => {
				if (item.subPois) {
					item.subPois.forEach(subPoisItem => {
						subPoisItem.province = item.province;
						subPoisItem.district = item.district;
					});
				}
				// 处理子点数据
				item.subArray = [];
				if (item.subPois && item.subPois.length >= 3) {
					for (let i = 0; i < item.subPois.length; i += 3) {
						item.subArray.push(item.subPois.slice(i, i + 3));
					}
				} else if (item.subPois && item.subPois.length < 3) {
					item.subArray.push(item.subPois);
				}
				if (item.type === 2) { //地铁站
					const subwayArr = [];
					item.address.split(',').forEach(subway => {
						subwayArr.push(subway.replace('地铁', ''));
					});
					item.address = subwayArr;
				}
			});
			if (this.keyword === '') { //解决删除输入框内容后 会再次请求sug搜索的情况
				this.setData({
					inputChangeShow: false,
					suggestionData: [],
				});
				return;
			} else {
				this.setData({
					inputChangeShow: true,
					suggestionData,
					searchContentShow: 'suggestion'
				});
			}
		});
	},

	/**
	 * 点击sug搜索item
	 */
	onClickListItem(e) {
		let curItem = {};
		if (e.currentTarget.dataset.sugindex !== undefined) {
			const sugIndex = e.currentTarget.dataset.sugindex;
			curItem = this.data.suggestionData[sugIndex];
		} else if (e.currentTarget.dataset.searchindex !== undefined) {
			const searchIndex = e.currentTarget.dataset.searchindex;
			curItem = this.data.searchData[searchIndex];
		} else if (e.currentTarget.dataset.historyindex !== undefined) {
			const historyIndex = e.currentTarget.dataset.historyindex;
			curItem = this.data.historyPoi[historyIndex];
		}
		const jsonItem = JSON.stringify({
			...curItem
		});
		this._backToIndex(jsonItem);
	},
	/**
	 * 选择子点
	 */
	onClickSubPoi(e) {
		let curItem = {};
		if (e.currentTarget.dataset.subpoi !== undefined) {
			curItem = e.currentTarget.dataset.subpoi;
		} else if (e.currentTarget.dataset.historysubpoi !== undefined) {
			curItem = e.currentTarget.dataset.historysubpoi;
		}
		const jsonItem = JSON.stringify({
			...curItem
		});
		this._backToIndex(jsonItem);
	},

	/**
	 * 清空输入框内容
	 */
	onClearInput() {
		this.keyword = '';
		this.setData({
			searchFocus: true,
			searchValue: '',
			inputChangeShow: false,
			keyword: '',
			suggestionData: []
		});
	},
	/**
	 * 返回到首页
	 * @param point 改变的起终点值
	 */
	_backToIndex(point) {
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2]; //上一个页面
		if (prevPage) {
			const parsedPoint = JSON.parse(point);
			parsedPoint.title = parsedPoint.allTitle || parsedPoint.title;
			// 根据传入的type类型，返回到上一页对应的起终点数据里
			if (this.type === 'start') {
				prevPage.setData({
					start: {
						...parsedPoint
					},
					'markers[0]': {
						latitude: parsedPoint.location.lat,
						longitude: parsedPoint.location.lng,
						iconPath: COS_PATH + '/marker-start.png',
						height: 54,
						width: 32
					}
				});
			} else {
				prevPage.setData({
					end: {
						...parsedPoint
					},
					'markers[1]': {
						latitude: parsedPoint.location.lat,
						longitude: parsedPoint.location.lng,
						iconPath: COS_PATH + '/marker-end.png',
						height: 54,
						width: 32
					}
				});
			}
		}
		wx.navigateBack({
			delta: 1
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
});
