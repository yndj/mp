// pages/fx_qrcode/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    FxImage:""
  },
  saveImageToLocal:function(e){
    let imgSrc = e.currentTarget.dataset.imageurl
    wx.downloadFile({
      url: imgSrc,
      success:
      function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            console.log(data);
            wx.showToast({
              title: '保存成功',
            })
          },
          fail:function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    wx.showToast({
                      title: '获取权限成功,请再次保存图片',
                    })
                  }
                  else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    wx.showToast({
                      title: '获取权限失败',
                      image: '/images/icons/tip.png',
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  get_qrcode:function(){
    console.log('-------获取推广二维码信息--------')
    var customIndex = app.AddClientUrl("/get_qrcode.html")
    var that = this
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        if (res.data.errcode == '0'){
          that.setData({
            FxImage: res.data.relateObj
          })
        }
        else{
          wx.showToast({
            title: res.data.errMsg,
            icon: '/images/icons/tip.png',
            duration: 1500
          })
        }
        console.log(res.data)
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_qrcode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})