
const util = require('../../../utils/util');
import gps from './data'; // gps轨迹数据
const COORS = [116.308258,39.983701,0,192,17,908,0,0,-179,6,0,-729,-26,-488,-8,-708,44,-399,0,0,-1051,-27,-1140,-55,0,0,-188,-48,89,-1335,80,-887,0,-185,62,-653,170,-2767,44,-688,8,-165,8,-68,98,-1032,116,-715,35,-413,71,-461,161,-1349,98,-1197,0,-82,-17,-137,0,0,-116,-240,-44,-165,98,-220,62,-206,116,-826,233,-1962,134,-736,44,-199,637,-3311,17,-179,17,-963,35,-296,80,-358,314,-1163,359,-1528,197,-964,107,-716,80,-1074,35,-833,179,-2974,17,-282,0,0,242,-495,233,-3002,26,-826,0,-495,8,-454,26,-792,89,-1646,53,-1921,-26,-2541,8,-571,26,-516,44,-2906,-8,-1770,17,-1790,-8,-7997,35,-2053,-80,-2996,17,-744,44,-881,44,-1343,26,-2494,-17,-358,35,-3286,-8,-509,8,-2639,17,-468,-35,-1219,8,-551,8,-1081,0,-289,0,-96,8,-3156,0,0,-125,-186,-8,-937,-8,-1288,0,0,-62,-192,-26,-41,-53,-27,-853,-13,-206,-6,-898,34,-80,34,-71,55,-26,48,0,186,35,55,71,48,206,82,17,34,1742,6,1688,-6,2560,6,0,0,80,-82,71,-6,700,-62,1060,20,3377,6] //静态坐标点串（仿webservice返回）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scale: 14.5,
    location: {
      latitude:39,
      longitude: 116
    },
    markers: [],
    polyline: [],
    isDisabled: false,
    COORS
  },
  
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    this.mapCtx = wx.createMapContext('map-container', this);
    this.moveAlongData = this._formatGPSData(gps);
    this.points = this._formatPolyline(this.data.COORS);
    this.setData({
      polyline: [{
        points:this.points,
        width: 6,
        color: '#05B473',
        arrowLine: true
      }],
      location: {
        latitude: this.points[0].latitude,
        longitude: this.points[0].longitude
      },
      markers: [{
        id: 1,
        latitude: this.points[0].latitude,
        longitude: this.points[0].longitude,
        width: 24,
        height: 30,
        anchor: {
          x: 0.5,
          y: 0.5
        },
        iconPath: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png',
      }],
    });
  },
  // 点串解压并处理成符合小程序的数据格式（如果需要绘制路况线，需要根据路线长度，添加路线长度-1的colorList,级每2个点需要一个color颜色值）
  _formatPolyline(polyline){
    const coors = polyline, pl = [];
    //坐标解压（返回的点串坐标，通过前向差分进行压缩）
    const kr = 1000000;
    for (let i = 2; i < coors.length; i++) {
      coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    }
    //将解压后的坐标放入点串数组pl中
    for (let i = 0; i < coors.length; i += 2) {
      pl.push({ latitude: coors[i + 1], longitude: coors[i] })
    }
    return pl;
  },
  // 执行
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
    if (this.data.isDisabled) {
      return;
    }
    this.setData({
      isDisabled: true
    })
    // 处理安卓和IOS对success回调触发时机不一致问题
    this.timer = setTimeout(() => {
      this.setData({
        isDisabled: false
      })
    },(this.moveAlongData.length - 1) * 1000);
    this.mapCtx.moveAlong({
      markerId: 1,
      path: this.points,
      duration: (this.moveAlongData.length - 1) * 1000,
      autoRotate: true
    });
    let count = 0;
    // 深拷贝路线数据
    const lineData = JSON.parse(JSON.stringify(this.points));
    // 定时器模拟5秒请求一次接口，先将前5秒的点提取出来，真实接口只需要首充请求后，自行轮询数据
    const firstLine = this.moveAlongData.slice(0,6);
    this._clearLine(firstLine,lineData);
    this.interval = setInterval(() => {
      if (count > this.moveAlongData.length) {
        clearInterval(this.interval);
        return;
      }
      count += 5;
      const line = this.moveAlongData.slice(count,count + 5);
      this._clearLine(line,lineData);
    }, 5000);
  },
   // 处理gps数据点,根据自己需求拿到对应的数据点
  _formatGPSData(gps) {
    const data = gps.map(item => {
      const itemArr = item.split(',');
      return {
        latitude: itemArr[1],
        longitude: itemArr[0],
        index: itemArr[8]
      };
    });
    return data;
  },
   /**
    * 轨迹擦除
    * @param {*} line // gps轨迹点数据
    * @param {*} polyline 需要擦除的路线数据
    */
  _clearLine(line,polyline) {
    const indexArr = line.map(item => {
      return item.index
    });
    for(let i = 0; i < indexArr.length; i++) {
        // 每秒清除一次数据
        this.timout = setTimeout(() => {
          const points = polyline.slice(Number(line[i].index) + 1);
          points.unshift({
            latitude: line[i].latitude,
            longitude: line[i].longitude
          });
          this.setData({
            polyline: [{
              points: points,
              width: 6,
              color: '#05B473',
              arrowLine: true
            }],
          });
          clearTimeout(this.timeout);
        }, i * 1000);
    }
  },
  onHide: function() {
    clearInterval(this.interval);
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