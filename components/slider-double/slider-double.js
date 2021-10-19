
const util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    },
    minValue: {
      type: Number
    },
    maxValue: {
      type: Number
    },
    blockColor:{
      type: String
    },
    backgroundColor:{
      type: String
    },
    selectedColor:{
      type: String
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    min: 0,
    max: 100,
    leftValue: 0,
    rightValue: 100,
    totalLength: 0,
    bigLength: 0,
    ratio: 0.5,
    sliderLength: 40,
    containerLeft: 0, //标识整个组件，距离屏幕左边的距离
    hideOption: '', //初始状态为显示组件
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
    * 设置左边滑块的值
    */
    _propertyLeftValueChange: function () {

      let minValue = this.data.minValue / this.data.max * this.data.bigLength
      let min = this.data.min / this.data.max * this.data.bigLength
      this.setData({
        leftValue: minValue - min
      })
    },

    /**
     * 设置右边滑块的值
     */
    _propertyRightValueChange: function () {
      let right = this.data.maxValue / this.data.max * this.data.bigLength + this.data.sliderLength
      this.setData({
        rightValue: right
      })
    },

    /**
     * 左边滑块滑动
     */
    _minMove: function (e) {
      let pagex = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderLength / 2

      if (pagex + this.data.sliderLength >= this.data.rightValue) {
        pagex = this.data.rightValue - this.data.sliderLength
      } else if (pagex <= 0) {
        pagex = 0
      }

      this.setData({
        leftValue: pagex
      })

      let lowValue = parseInt(pagex / this.data.bigLength * parseInt(this.data.max - this.data.min) + this.data.min)
      var myEventDetail = { lowValue: lowValue }
      this.triggerEvent('lowValueChange', myEventDetail)
    },

    /**
     * 右边滑块滑动
     */
    _maxMove: function (e) {

      let pagex = e.changedTouches[0].pageX / this.data.ratio - this.data.containerLeft - this.data.sliderLength / 2
      if (pagex <= this.data.leftValue + this.data.sliderLength) {
        pagex = this.data.leftValue + this.data.sliderLength
      } else if (pagex >= this.data.totalLength) {
        pagex = this.data.totalLength
      }

      this.setData({
        rightValue: pagex
      })

      pagex = pagex - this.data.sliderLength
      let heighValue = parseInt(pagex / this.data.bigLength * (this.data.max - this.data.min) + this.data.min)

      var myEventDetail = { heighValue: heighValue }
      this.triggerEvent('heighValueChange', myEventDetail)
    },

    /**
     * 隐藏组件
     */
    hide: function () {
      this.setData({
        hideOption: 'hide',
      })
    },
    /**
     * 显示组件
     */
    show: function () {
      this.setData({
        hideOption: '',
      })
    },
    /**
    * 重置
    */
    reset: function () {
      this.setData({
        rightValue: this.data.totalLength,
        leftValue: 0,
      })
    },

  },

  ready: function () {
    let that = this;
    util.wxPromisify(wx.getSystemInfo)()
      .then(res => {
        let ratio = res.windowWidth / 750
        that.setData({
          ratio: ratio,
        })
      })
      .then(() => {
        this.createSelectorQuery().select(".slider-double").boundingClientRect(function (res) {
          that.setData({
            totalLength: res.width / that.data.ratio - that.data.sliderLength,
            bigLength: res.width / that.data.ratio - that.data.sliderLength * 2,
            rightValue: res.width / that.data.ratio - that.data.sliderLength,
            containerLeft: res.left / that.data.ratio
          })

        /**
         * 设置初始滑块位置
         */
        that._propertyLeftValueChange()
        that._propertyRightValueChange()
        }).exec()
      })
  }
})
