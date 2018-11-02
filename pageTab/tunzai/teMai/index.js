const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    promotionStartDate: { time: '2018-10-27 23:59:59', background: '', color: '' },
    promotionInfo:{},
    posterState:false,
    productId:0,
    shopId:0,
    promotionState:false,
  },
  params:{
    belongShop: "",
    page: 1,
    productName: "",
    startPrice: "",
    endPrice: "",
    promotionId: "",
  },
  // 开启活动海报
  shareProductPoster: function (event) {
    console.log('====shareProductPoster====', event)
    this.setData({ posterState: true })
    this.setData({ productId: event.currentTarget.dataset.id })
    let data = { type: event.currentTarget.dataset.type, id: event.currentTarget.dataset.id }
    let qrCodeUrl = app.getQrCode(data)
    console.log('qrCodeUrl===', qrCodeUrl)
    this.setData({
      qrCodeUrl: qrCodeUrl
    })
  },
  getChilrenPoster: function () {
    console.log('colsePoster')
    this.setData({ posterState: false })
  },
  toProductDetail: function (e) {
    console.log(e.currentTarget.dataset.id)
    // product_detail.html?productId= 9219;
    var a = "product_detail.html?productId=" + e.currentTarget.dataset.id;
    app.linkEvent(a);
  },
  /* 获取数据 */
  getProductData: function (param, ifAdd) {
    let that = this;
    if (!ifAdd){
      ifAdd=0;
    }
    console.log("id", this.data.id)
    param.promotionId = this.data.id
    let customIndex = app.AddClientUrl("/more_product_list.html", param, 'get')
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        that.setData({ reqState: true })
        console.log("特卖数据", res.data)
        that.params.pageSize = res.data.pageSize
        that.params.curPage = res.data.curPage
        that.params.totalSize = res.data.totalSize
        let productList = res.data.result
        for(let i=0;i<productList.length;i++){
          if (productList[i].saleCount==0){
            productList[i].stockPercent =0
          }else{
            productList[i].stockPercent = Math.floor(productList[i].saleCount / (productList[i].stock + productList[i].saleCount) * 100)
          }
        }
        if (ifAdd==1){
          that.setData({ productData: productList})
        }else{
          that.setData({ productData: that.data.productData.concat(productList)})
        }
        console.log('that.data.productData', that.data.productData)
        wx.hideLoading()
      },
      fail: function (res) {
        console.log("fail")
        wx.hideLoading()
      }
    })
  },
  getPromotionInfo: function (param){
    let that = this
    console.log("id", this.data.id)
    param.promotionId = this.data.id
    let customIndex = app.AddClientUrl("/get_promotions_detail.html", param, 'get')
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log("getPromotionInfo", res)
        let promotionInfo = res.data.relateObj;
        let nowData = new Date();
        let promotionState=false;
        let startTime = promotionInfo.startDate;
        startTime = startTime.replace(/\-/g, "/");
        startTime = new Date(startTime);
        console.log(nowData, startTime)
        if (startTime >= nowData) {
          console.log('活动未开始')
          promotionState = false;
          promotionInfo['promotionStartDate'] = {
            startTime: promotionInfo.startDate,
            background: '#fff',
            color: that.data.setting.defaultColor,
            fontSize: 20
          };
          if (promotionInfo.content) {
            WxParse.wxParse('article', 'html', promotionInfo.content, that);
          }
        } else {
          console.log('活动已开始')
          promotionState=true
          promotionInfo['promotionEndDate'] = {
            endtTime: promotionInfo.endDate,
            background: '#fff',
            color: that.data.setting.defaultColor,
            fontSize: 20
          };
        }
        that.setData({ promotionInfo: promotionInfo })
        that.setData({ promotionState: promotionState })
        console.log('promotionInfo', that.data.promotionInfo)
        wx.hideLoading()
      },
      fail: function (res) {
        console.log("fail")
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("hahahahahahah这是id", options)
    this.setData({ 
      id: options.promotionId,
      setting: app.setting.platformSetting,
      shopId: app.setting.platformSetting.defaultShopBean.id
    })
    this.getProductData(this.params, 1)
    this.getPromotionInfo(this.params)
  },

  onReady: function () {
    
  },

  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
    var that = this
    if (that.params.totalSize > that.params.curPage * that.params.pageSize) {
      wx.showLoading({
        title:'加载中...'
      })
      that.params.page++
      // 组件内的事件
      this.getProductData(this.params)
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'loading',
        duration: 1000
      })
      console.log('到底了', that.params.curPage)
    }
  },

})