

const app = getApp()

Page({

  data: {

    setting: null, // setting   
    servantData: [], // 商品数据 
    sysWidth: 320,//图片大小
    positionTab:'',
    /* 显示或影藏 */
    showType: false,
    show0: false,
    show1: false,
    show2: false,
    topName: {
    SearchservantName: "",//头部搜索的
    },
    focusTypeItem: null,
    bindservantTypeIndex: null,

    servantshowWay: 1, // servantshowWay列表显示方法 (默认显示地图)

    typeSearch: '', // typeSearch的字体 
    colorAtive: '#888',

    s_price: {  // 查询的价格 
      startPrice: "",
      endPrice: ""
    },
    localPoint: { longitude: '0', latitude:'0'},
    servantDetail:null,
    markers: [{
      iconPath: "",
      id: 0,
      width:20,
      heigth:20,
      latitude: 26.060701172100124,
      longitude: 119.30130341796878,
    }]
  },
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  toIndex(){
    app.toIndex()
  },
  clickcontrol(e) {//回到定位的
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
    
  },
  getCenterPoint(callback){
    let that = this;
    var mapCtx = wx.createMapContext('map')
    mapCtx.getCenterLocation({
      success: function (res) {
        console.log('res', res)
        that.params.latitude = res.latitude;
        that.params.longitude = res.longitude;
        that.setData({
          params: that.params,
        })
        if (callback){
          callback
        }
      }
    }) //获取当前地图的中心经纬度
  },
  regionchange(e) {
    console.log('===regionchange===',e)
    if (e.type == 'end') {
      if (e.causedBy =='scale'){
        console.log('====scale====')
      } else if(e.causedBy == 'drag') {
        console.log('====drag====');
        this.getCenterPoint(this.getData(this.params, 2));
        }else{
        console.log('====all====');
        this.getCenterPoint(this.getData(this.params, 2));
        }
    }
  },
  markertap(e) {
    console.log(e.markerId)
    this.toservantDetailMap(e.markerId);
  },
  controltap(e) {
    console.log(e)
  },
  hiddenProInfo(e){
    console.log(e)
    this.setData({servantDetail:null})
  },
  /* 点击分类 */
  bindservantType: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    if (index == this.data.bindservantTypeIndex) {
      this.data.showType = false;

      this.setData({
        showType: this.data.showType,
        bindservantTypeIndex: null
      })
    }
    else {
      this.data.showType = true;
      this.data.bindservantTypeIndex = index;
      if (index == 0) {
        this.data.show0 = true;
        this.data.show1 = false;
        this.data.show2 = false;
      }
      else if (index == 1) {
        this.data.show0 = false;
        this.data.show1 = true;
        this.data.show2 = false;
      }
      else if (index == 2) {
        this.data.show0 = false;
        this.data.show1 = false;
        this.data.show2 = true;
      }

      this.setData({
        show0: this.data.show0,
        show1: this.data.show1,
        show2: this.data.show2,
        showType: this.data.showType,
        bindservantTypeIndex: this.data.bindservantTypeIndex
      })

    }

  },

  /* 点击遮罩层 */
  closeZhezhao: function () {
    this.data.showType = false;
    this.setData({ showType: false, bindservantTypeIndex: null })
  },

  /* 点击分类大项 */
  bindTypeItem: function (event) {
    let onId;
    if (event && event.currentTarget){
      onId = event.currentTarget.dataset.type.id
      console.log('====bindTypeItem currentTarget====',onId)
    } else if (event && !event.currentTarget){
      onId = event
      console.log('====bindTypeItem event====',onId)
    }
    console.log(event)
    console.log("this.data.setting.platformSetting",this.data.setting)
    for (let i = 0; i < this.data.setting.platformSetting.categories.length; i++) {
      if (this.data.setting.platformSetting.categories[i].id == onId ) {
        this.data.setting.platformSetting.categories[i].active = true
        console.log(this.data.setting.platformSetting.defaultColor)
        this.data.setting.platformSetting.categories[i].colorAtive =this.data.setting.platformSetting.defaultColor;
      }
      else {
        this.data.setting.platformSetting.categories[i].active = false
        this.data.setting.platformSetting.categories[i].colorAtive = '#888';
      }
    }
    this.setData({
      setting: this.data.setting,
    })

    this.listPage.page = 1
    this.params.page = 1

    if (onId == "all") {

      this.params.categoryId = ''
      this.getData(this.params, 2)
      this.setData({ showType: false, bindservantTypeIndex: null })
    } else {
      this.params.categoryId = onId
      this.getData(this.params, 2)
    }
  },
  ChangeParam: function (params) {
    var returnParam = ""
    for (let i in params) {
      returnParam += "&" + i + "=" + params[i]
    }
    console.log(returnParam)
    return returnParam
  },
  /* 获取数据 */
  getData: function (param, ifAdd) {
    //根据把param变成&a=1&b=2的模式
    if (!ifAdd) {
      ifAdd = 1
    }
    //var postParam = this.ChangeParam(param)
    //param.page = this.listPage.page
    var customIndex = app.AddClientUrl("/wx_find_servants.html", param)
    // wx.showLoading({
    //   title: 'loading'
    // })
    var that = this
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        let resData = res.data.relateObj
        that.listPage.pageSize = resData.pageSize
        that.listPage.curPage = resData.curPage
        that.listPage.totalSize = resData.totalSize
        let dataArr = that.data.servantData
        let tagArray=[];
        if (ifAdd == 2) {
          dataArr = []
        }
        if (!resData.result || resData.result.length == 0) {
          that.setData({ servantData: null })
        } else {
          if (dataArr == null) { dataArr = [] }
          dataArr = dataArr.concat(resData.result)
          for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].tags && dataArr[i].tags!=''){
              tagArray = dataArr[i].tags.slice(1,-1).split("][")
              dataArr[i].tagArray = tagArray;
            }
            // 添加状态图片
            if (dataArr[i].status==1){
              dataArr[i].statusIcon ='http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_727.jpg'
            } else if (dataArr[i].status == 3){
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_724.jpg'
            } else if (dataArr[i].status == 2){
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_716.jpg'
            } else {
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_727.jpg'
            }
          }
          that.setData({ servantData: dataArr })
        }
        that.setData({ markers: that.data.servantData })
        let conut=0;
        if (that.data.markers) {
          for (let i = 0; i < that.data.markers.length; i++) {
            if (that.data.markers[i].categoryIcon) {
              that.downProIcon(that.data.markers[i].categoryIcon,function(url){
                conut++;
                that.data.markers[i].iconPath = url;
                that.data.markers[i].width=32;
                that.data.markers[i].height = 32;
                if (conut == that.data.markers.length) {
                  that.setData({ markers: that.data.markers })
                  console.log('==that.data.markersHave===', that.data.markers);
                }
              })
            } else {
              conut++;
              that.data.markers[i].iconPath = '';
              that.data.markers[i].width = 32;
              that.data.markers[i].height = 32;
              if (conut == that.data.markers.length) {
                that.setData({ markers: that.data.markers })
                console.log('==that.data.markers===', that.data.markers);
              }
            }
            
          }
        }
        // wx.hideLoading()
      },
      fail: function (res) {
        console.log("fail")
        // wx.hideLoading()
        app.loadFail()
      }
    })
  },
  downProIcon:function(url,callback){
    var _this = this;
    if (app.mapProIconArray[encodeURIComponent(url)]){
      console.log('已存在', encodeURIComponent(url))
      callback(app.mapProIconArray[encodeURIComponent(url)])
      return
    }
    wx.downloadFile({ 
      url: url.replace('http', 'https'),
      success: function (res) {
        console.log('下载图片',res)       
        if (res.statusCode == 200) {
          callback(res.tempFilePath);   
          app.mapProIconArray[encodeURIComponent(url)] = res.tempFilePath     
        }      
      }    
    })    
  },
  /* 全部参数 */
  params: {
    categoryId: "",
    platformNo: "",
    belongShop: "",
    typeBelongShop: "",
    page: 1,
    showType: "",
    showColumn: "",
    servantName: "",
    startPrice: "",
    endPrice: "",
    orderType: "",
    saleTypeId: "",
    promotionId: "",
    shopservantType: "",
    latitude:'0',
    longitude:'0',
    searchServantName:'',

  },
  /* 查找商品 */
  getSearchservantName: function (e) {
    console.log(e)
    if (e.detail.value){
      this.params.servantName = e.detail.value
    }else{
      this.params.servantName='';
      this.setData({ searchServantName:''})
    }
    var that = this
    var customIndex = this.more_servant_list_URL(this.params);
    console.log(customIndex)
    wx.showLoading({
      title: 'loading'
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        let resData = res.data.relateObj
        wx.hideLoading()
        if (!resData.result || resData.result.length == 0) {
          that.setData({ servantData: null })
        } else {
          let tagArray;
          for (let i = 0; i < resData.result.length; i++) {
            if (resData.result[i].tags && resData.result[i].tags != '') {
              tagArray = resData.result[i].tags.slice(1, -1).split("][")
              resData.result[i].tagArray = tagArray;
            }
            // 添加状态图片
            if (dataArr[i].status == 1) {
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_727.jpg'
            } else if (dataArr[i].status == 3) {
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_724.jpg'
            } else if (dataArr[i].status == 2) {
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_716.jpg'
            } else {
              dataArr[i].statusIcon = 'http://image1.sansancloud.com/xianhua/2018_11/26/15/17/59_727.jpg'
            }
          }
          that.setData({ servantData: resData.result })
        }

      },
      fail: function () {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  /* 分类查询 */
  searchservant: function (event) {
    var that = this;
    this.setData({ showType: false, bindservantTypeIndex: null })
    console.log(event.currentTarget.dataset)
    var focusKey = event.currentTarget.dataset;
    console.log(this.params)
    for (let i in focusKey) {
      for (let j in this.params) {
        if (i.toLowerCase() == j.toLowerCase()) { this.params[j] = focusKey[i] }
      }
    }
    switch (this.params.orderType) {
      case '0': {
        this.setData({ typeSearch: '默认排序' }); break;
      };
      case '102': {
        this.setData({ typeSearch: '价格升序' }); break;
      };
      case '2': {
        this.setData({ typeSearch: '价格降序' }); break;
      };
      case '104': {
        this.setData({ typeSearch: '上架日期升' }); break;
      };
      case '4': {
        this.setData({ typeSearch: '上架日期降' }); break;
      };
      case '101': {
        this.setData({ typeSearch: '销量升' }); break;
      };
      case '1': {
        this.setData({ typeSearch: '销量降' }); break;
      };
    }

    console.log(this.params)
    this.params.page = 1
    var customIndex = this.more_servant_list_URL(this.params);
    console.log(customIndex)
    wx.showLoading({
      title: 'loading'
    })
    that.listPage.page = 1
    that.params.page = 1
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {

        that.listPage.pageSize = res.data.pageSize
        that.listPage.curPage = res.data.curPage
        that.listPage.totalSize = res.data.totalSize

        console.log(res.data)

        wx.hideLoading()

        if (!res.data.result || res.data.result.length == 0) {
          that.setData({ servantData: null })
          that.setData({ markers:null })
        } else {
          let dataArr = []
          dataArr = dataArr.concat(res.data.result)
          that.setData({ servantData: dataArr })
          that.setData({ markers: that.data.servantData })
          if (that.data.markers) {
            for (let i = 0; i < that.data.markers.length; i++) {
              that.data.markers[i].iconPath = '../../images/icon/mapItem.png'
            }
            that.setData({ markers: that.data.markers })
          }
          console.log('==that.data.markers===', that.data.markers);
        }

        /* if (!res.data.result || res.data.result.length == 0) {
          that.setData({ servantData: null })
        } else {
          that.setData({ servantData: res.data.result })
        } */

      },
      fail: function () {
        wx.hideLoading()
        app.loadFail()
      }
    })
  },

  more_servant_list_URL: function (params) {
    let resule = app.AddClientUrl("/wx_find_servants.html", params)
    return resule;
  },


  /* 价格排序 */
  getStartValue: function (e) {
    this.data.s_price.startPrice = e.detail.value
  },
  getEndValue: function (e) {
    this.data.s_price.endPrice = e.detail.value
  },
  searchservantbyPrice: function () {
    var that = this;
    this.setData({ showType: false, bindservantTypeIndex: null })

    var focusKey = this.data.s_price

    console.log(this.params)
    for (let i in focusKey) {
      for (let j in this.params) {
        if (i.toLowerCase() == j.toLowerCase()) { this.params[j] = focusKey[i] }
      }
    }
    console.log(this.params)

    var customIndex = this.more_servant_list_URL(this.params);
    console.log(customIndex)
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        if (!res.data.result || res.data.result.length == 0) {
          that.setData({ servantData: null })
        } else {
          that.setData({ servantData: res.data.result })
        }
        that.setData({ s_price: that.data.s_price })
      }
    })
  },
  /* 商品显示方法 */

  bindservantshowWay: function () {
    if (this.data.servantshowWay == 1) {
      this.setData({ servantshowWay: 2 })
    } else{
      this.setData({ servantshowWay: 1 })
      
    }

  },


  toservantDetail: function (event) {
    console.log("--------toservantDetail------", event)
    console.log(event.currentTarget.dataset.info)
    var info = event.currentTarget.dataset.info
    let id;
    let belongShopId = info.belongShopId;
    if (info.servantId){
      id = info.servantId
    }else{
      id = info.id
    }
    wx.navigateTo({
      url: '../servantDetail/index?id=' + id + "&addShopId=" + belongShopId,
    })
  },
  toservantDetailMap: function (id) {
    console.log("--------toservantDetailMap------")
    console.log(id)
    var param = { servantId: id}
    let customIndex = app.AddClientUrl("/servant_detail.html", param)

    var that = this
    that.setData({
      servantDetail: null
    })
    wx.request({
      url: customIndex.url,
      header: app.header,
      success: function (res) {
        console.log(res.data)
        that.setData({
          servantDetail: res.data
        })
      },
      fail: function (res) {
        console.log("fail")
        app.loadFail()
      },
      complete: function () {
      },
    })
  },

  listPage: {
    page: 1,
    pageSize: 0,
    totalSize: 0,
    curpage: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.initSetting();
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        that.data.localPoint.latitude = res.latitude
        that.data.localPoint.longitude = res.longitude
        that.params.latitude = res.latitude
        that.params.longitude = res.longitude
        console.log("options", options)
        if (options.servantTypeId) {
          that.setData({ positionTab: options.servantTypeId })
          options.categoryId = options.servantTypeId
          that.bindTypeItem(options.servantTypeId)
        }
        if (!!options.forceSearch && options.forceSearch == 2) {
          that.setData({ servantshowWay: 2 })
        } else {
          that.setData({ servantshowWay: 1 })
        }
        for (let i in options) {
          for (let j in that.params) {
            if (i.toLowerCase() == j.toLowerCase()) { that.params[j] = options[i] }
          }
        }
        that.setData({
          params: that.params,
          localPoint: that.data.localPoint
        })
        console.log(that.params)
        that.getData(that.params, 2);
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  initSetting(){
    this.setData({ setting: app.setting })
    for (let i = 0; i < this.data.setting.platformSetting.categories.length; i++) {
      this.data.setting.platformSetting.categories[i].colorAtive = '#888';
    }
    this.data.setting.platformSetting.categories[0].colorAtive = this.data.setting.platformSetting.defaultColor;
    this.setData({
      setting: this.data.setting,
    })
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


    this.listPage.page = 1
    this.params.page = 1
    this.getData(this.params, 2)

    wx.showNavigationBarLoading()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.listPage.totalSize > that.listPage.curPage * that.listPage.pageSize) {
      that.listPage.page++
      that.params.page++
      this.getData(this.params);
    }
  },

})