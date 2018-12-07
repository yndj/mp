
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formCommitList: [],
    moneyAmount: 0,
    mendian: null
  },
  toFormRewardList: function (event) {
    console.log('===event===', event)
    let id = event.currentTarget.dataset.id
    var a = "form_reward_list.html?bussinessRecordId=" + id;
    app.linkEvent(a);
  },
  /* 获取数据 */
  getData: function () {
    if (!app.checkIfLogin()) {
      return
    }
    var getParams = {}
    getParams.customFormId =this.params.customFormId
    getParams.page = this.listPage.page;
    var customIndex = app.AddClientUrl("/wx_find_decorate_custom_form_commits.html", getParams)
    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        if(res.data.errcode == 0){
          that.listPage.pageSize = res.data.relateObj.pageSize
          that.listPage.totalSize = res.data.relateObj.totalSize
          let dataArr = that.data.formCommitList
          if ((!res.data.relateObj.result || res.data.relateObj.result.length == 0) || that.listPage.page==1) {
            dataArr=[];
          } 
          dataArr = dataArr.concat(res.data.relateObj.result)
          that.setData({ formCommitList: dataArr })
        }
        console.log('===formCommitList===', that.data.formCommitList);
      },
      complete: function (res) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  params:{},
  onLoad: function (options) {
    console.log('===options===', options)
    this.params=options
    this.getData(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ setting: app.setting })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.reflesh == 1) {
      this.onPullDownRefresh()
    }
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
    this.data.Data = []

    this.listPage.page = 1
    this.getData();
    wx.stopPullDownRefresh()
  },


  listPage: {
    page: 1,
    pageSize: 0,
    totalSize: 0,
    curpage: 1
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('===onReachBottom====')
    var that = this
    if (that.listPage.totalSize > that.listPage.page * that.listPage.pageSize) {
      that.listPage.page++
      this.getData();
    }
  },

})