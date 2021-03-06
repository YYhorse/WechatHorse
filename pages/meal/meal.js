var postData = "";      //菜单详情
Page({
  data:{
    CurrentCategoryPostion:0,
    HeadPhotoUrl:"../image/facelogo.png",
    ShopName_txt:"",
    ShopDescription_txt:"",
    ShopActivity_txt:"",
    product_categories:"",
    product_items:"",
    TotalPrice:"￥0.00元",
    TotalCount:0,
    showModalStatus:false,
    hide_good_box: true,    //抛物线小球是否隐藏
  },
  onLoad: function (options){
    wx.setNavigationBarTitle({  title: '小程序点餐' });
    this.busPos = {};
    this.busPos['x'] = 45;//购物车的位置
    this.busPos['y'] = getApp().globalData.hh - 56;
    if (getApp().globalData.continue_buy==false){
      if (options.scene == null) {
        var that = this;
        wx.showModal({
          title: '未知店铺',
          content: '是否进入测试店铺',
          cancelText: '退出',
          cancelColor: "#3f3f3f",
          confirmText: '确认',
          confirmColor: "#FF0000",
          success: function (res) {
            if (res.confirm) {
              let scene = "store_id=2&desk_id=4";
              that.DealScene(scene);
              that.AutoLogin();
            }
            else
              console.log('退出')
          }
        })
      }
      else {
        // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
        let scene = decodeURIComponent(options.scene);
        this.DealScene(scene);
        this.AutoLogin();
      }
    }
    else{
      this.AutoLogin();
    }
  },
  /* 处理扫码进入区分店铺 */
  DealScene: function (sceneTemp) {
    sceneTemp = sceneTemp.split('&')
    let obj = {}
    for (let i = 0; i < sceneTemp.length; i++) {
      let item = sceneTemp[i].split('=')
      obj[item[0]] = item[1]
    }
    getApp().globalData.store_id = obj.store_id;
    getApp().globalData.desk_id = obj.desk_id;
    console.log(obj.store_id + "|" + obj.desk_id)
  },
  /*   自动登录    */
  AutoLogin: function () {
    var that = this;
    wx.showLoading({title: '正在登录中'}),
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.hideLoading();
          getApp().globalData.code = res.code;
          wx.getUserInfo({
            success: function (res) {
              getApp().globalData.userInfo = res.userInfo
              wx.request({
                url: "https://whitedragoncode.cn/api/v1/small_program/stores/login",
                data: { "code": getApp().globalData.code, "nickname": getApp().globalData.userInfo.nickName, "sex": getApp().globalData.userInfo.gender, "province": getApp().globalData.userInfo.province, "city": getApp().globalData.userInfo.city, "store_id": getApp().globalData.store_id, "desk_id": getApp().globalData.desk_id },
                method: 'POST',
                success: function (res) {
                  console.log(res.data);
                  if (res.data.status_code == 602)
                    wx.showLoading({title: '登录缺少参数',})
                  else if (res.data.status_code == 603)
                    wx.showLoading({title: '餐桌不存在',})
                  else {
                    getApp().globalData.user_id = res.data.user_id;
                    that.GetShopInfo(); 
                  }
                },
                fail: function () { wx.showToast({title: '登陆失败',})}
              })
            },
            fail: function () { wx.showToast({title: "获取信息失败!",})}
          })
        } 
        else
          console.log('获取用户登录状态失败' + res.errMsg)
      }
    })
  },
  /* 获取店铺信息 */
  GetShopInfo:function(){
    var that = this;
    wx.showLoading({title: '菜单拉取中'}),
    wx.request({
      url: 'https://whitedragoncode.cn/api/v1/small_program/stores?',
      data: { store_id: getApp().globalData.store_id },
      header: { "Content-Type": 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideLoading()
        postData = res.data
        console.log(res.data)
        console.log(postData.name + postData.description)
        getApp().globalData.shop_name = postData.name
        getApp().globalData.shop_head = postData.avatar
        that.setData({
          ShopName_txt: postData.name,
          ShopDescription_txt: postData.description,
          HeadPhotoUrl: postData.avatar,
          ShopActivity_txt: that.GetActivityInfo(),
          product_categories: postData.product_categories,     //全部商品
          product_items: postData.product_categories[that.data.CurrentCategoryPostion].products
        })
      }
    })
  },
  /* 解析活动信息 */
  GetActivityInfo:function(){
    var temp = "";
    for (var i = 0; i < postData.full_cuts.length;i++){
      if(postData.full_cuts[i].type=="full_cut")
        temp += " 满￥" + postData.full_cuts[i].full + "立减￥" + postData.full_cuts[i].cut;
      else
        temp += " 满￥" + postData.full_cuts[i].full + "赠" + postData.full_cuts[i].cut;
    }
    return temp; 
  },
  /* 点击单个种类属性 */
  ClickCategoryMethod: function (e) {
    var Index = e.currentTarget.dataset.numid;
    console.log("XXXXX" + Index);
    this.setData({
      CurrentCategoryPostion: Index,
      product_items: this.data.product_categories[Index].products,
    });
  },
  /* 点击单产品添加按钮事件 */
  AddFoodNumMethod:function(e){
    var Index = e.currentTarget.dataset.numid;
    console.log("添加商品:" + this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].name);
    this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].number++;
    console.log("数量为=" + this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].number);
    this.UpdataUi(); 
    //-----抛物线--------//
    if(this.data.hide_good_box==true){
      this.finger = {}; 
      var topPoint = {};
      this.finger['x'] = e.touches["0"].clientX;//点击的位置
      this.finger['y'] = e.touches["0"].clientY;
      if (this.finger['y'] < this.busPos['y'])
        topPoint['y'] = this.finger['y'] - 150;
      else
        topPoint['y'] = this.busPos['y'] - 150;
      topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

      if (this.finger['x'] > this.busPos['x'])
        topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
      else 
        topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
      this.linePos = getApp().bezier([this.busPos, topPoint, this.finger], 30);
      this.startAnimation(e);
    }
  },
  startAnimation: function (e) {
    var index = 0, that = this,
    bezier_points = that.linePos['bezier_points'];
    console.log(bezier_points);
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    this.timer = setInterval(function () {
      index--;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index < 1) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        })
      }
    }, 10);
  },
  /* 点击单产品减少按钮事件 */
  ReduceFoodNumMethod:function(e){
    var Index = e.currentTarget.dataset.numid;
    console.log("减少商品:" + this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].name);
    if (this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].number>0)
      this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].number--;
    else
      this.data.product_categories[this.data.CurrentCategoryPostion].products[Index].number = 0;
    this.UpdataUi(); 
  },
  /* 点击菜单单产品增加按钮事件 */
  AddMenuNumMethod: function (e) {
    var productId = e.currentTarget.dataset.numid;
    for (var i = 0; i < this.data.product_categories.length; i++) {
      for (var j = 0; j < this.data.product_categories[i].products.length; j++) {
        if (this.data.product_categories[i].products[j].id == productId) {
          this.data.product_categories[i].products[j].number++;
          break;
        }
      }
    }
    this.UpdataUi();
  },
  /* 点击菜单单产品减少按钮事件 */
  ReduceMenuNumMethod: function (e) {
    var productId = e.currentTarget.dataset.numid;
    for (var i = 0; i < this.data.product_categories.length; i++) {
      for (var j = 0; j < this.data.product_categories[i].products.length; j++) {
        if (this.data.product_categories[i].products[j].id == productId) {
          this.data.product_categories[i].products[j].number--;
          break;
        }
      }
    }
    this.UpdataUi();
  },  
  /*  点击响应呼叫服务 */
  ClickCallServiceMethod:function(e){
    var that = this;
    wx.showModal({
      title: '呼叫服务',
      content: '是否确认呼叫店铺服务',
      cancelText:'取消',
      cancelColor:"#3f3f3f",
      confirmText:'呼叫',
      confirmColor:"#FF0000",
      success:function(res){
        if(res.confirm){
          wx.vibrateLong({})
          that.CallServiceInface()
        }
        else 
          console.log('用户取消呼叫')
      }
    })
  },
  CallServiceInface:function(){
    //呼叫服务 HTTP请求
    wx.request({
      url: "https://whitedragoncode.cn/api/v1/small_program/call_clerks",
      data: { "store_id": getApp().globalData.store_id, "desk_id": getApp().globalData.desk_id, "nickname": getApp().globalData.userInfo.nickName, "type": "help" },
      method: 'POST',
      success: function (res) {
        wx.showToast({  title: '已为您呼叫成功'})
      },
      fail: function (res) {
        wx.showToast({  title: '呼叫失败'+res.data})
      }
    })
  },
  /*  响应我的订单信息 */
  ClickMyOrderMethod:function(){
    wx.navigateTo({ url: '/pages/myorder/myorder'})
  },
  /*  显示全部活动信息 */
  ClickActivityInfoShowMethod:function(e){
    var temp="";
    for (var i = 0; i < postData.full_cuts.length; i++) {
      if (postData.full_cuts[i].type == "full_cut")
        temp += "\n满￥" + postData.full_cuts[i].full + "立减￥" + postData.full_cuts[i].cut;
      else
        temp += "\n满￥" + postData.full_cuts[i].full + "赠" + postData.full_cuts[i].cut;
    }
    wx.showModal({
      title: '店铺活动',
      content: temp,
    })
  },
  /*  购物车清空事件  */
  ClickCleanBuyCarMethod:function(e){
    var that = this;
    if (this.data.TotalPrice.substring(1, this.data.TotalPrice.length - 1) != "0.00") {
      wx.showModal({
        title: '提示',
        content: '确认清空购物车？',
        success:function(res){
          if(res.confirm){
            that.setData({
              TotalCount:0,
              TotalPrice: "￥0.00元",
              product_categories: postData.product_categories,     //全部商品
              product_items: postData.product_categories[that.data.CurrentCategoryPostion].products
            })
          }
        }
      })
    }
    else
      wx.showToast({ title: '购物车已为空！', })
  },
  /* 刷新菜单和其他UI  */
  UpdataUi: function () {
    var count = 0;
    var money = 0;
    for (var i = 0; i < this.data.product_categories.length; i++) {
      for (var j = 0; j < this.data.product_categories[i].products.length; j++) {
        if (this.data.product_categories[i].products[j].number != 0) {
          count++;
          money += this.data.product_categories[i].products[j].number * this.data.product_categories[i].products[j].origin_price;
        }
      }
    }
    this.setData({
      TotalPrice: "￥" + money.toFixed(2) + "元",
      TotalCount: count,
      product_items: this.data.product_categories[this.data.CurrentCategoryPostion].products,
      product_categories: this.data.product_categories
    })
  },
  /*  点击响应去结算 */
  ClickCheckOrderMethod:function(e){
    console.log("点击去结算" + this.data.TotalPrice.substring(1, this.data.TotalPrice.length-1));
    if (this.data.TotalPrice.substring(1, this.data.TotalPrice.length - 1)!="0.00"){
      //将商品信息转换成字符串 进行界面跳转
      let productJson = JSON.stringify(this.data.product_categories);
      let activityJson = JSON.stringify(postData.full_cuts);
      // console.log("菜单转JSON="+productJson);
      console.log("活动转JSON=" + activityJson);
      wx.navigateTo({
        url: '/pages/checkorder/checkorder?productJson=' + productJson + '&activityJson=' + activityJson,
      })
    }
    else
      wx.showToast({title: '请先选购商品'})
  },
  /* 显示购物车  */
  showModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  /*  隐藏购物车  */
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }
})