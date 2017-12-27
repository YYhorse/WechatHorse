// var postData = require('../../testjson/testjson.js');
var postData = "";
Page({
  data:{
    CurrentCategoryPostion:0,
    HeadPhotoUrl:"../image/facelogo.png",
    ShopName_txt:"",
    ShopDescription_txt:"",
    ShopActivity_txt:"",
    product_categories:"",
    product_items:"",
    TotalPrice:"￥0.0元",
    TotalCount:0,
    showModalStatus:false,
  },
  onLoad:function(){
    var that = this;  
    wx.setNavigationBarTitle({  title: '小程序点餐' }),
    wx.showLoading({
      title: '菜单拉取中',
    }),
    wx.request({
      url: 'https://whitedragoncode.cn/api/v1/small_program/stores?',
      data: { store_id: 1 },
      header: { "Content-Type": 'application/x-www-form-urlencoded'},
      success: function (res) {
        wx.hideLoading()
        postData = res.data
        console.log(res.data)
        console.log(postData.name + postData.description)
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
  /*  购物车清空事件  */
  ClickCleanBuyCarMethod:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认清空购物车？',
      success:function(res){
        if(res.confirm){
          that.setData({
            TotalCount:0,
            TotalPrice: "￥0元",
            product_categories: postData.product_categories,     //全部商品
            product_items: postData.product_categories[that.data.CurrentCategoryPostion].products
          })
        }
      }
    })
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
    console.log("点击去结算");
    //将商品信息转换成字符串 进行界面跳转
    let productJson = JSON.stringify(this.data.product_categories);
    let activityJson = JSON.stringify(postData.full_cuts);
    // console.log("菜单转JSON="+productJson);
    console.log("活动转JSON=" + activityJson);
    wx.navigateTo({
      url: '/pages/checkorder/checkorder?productJson=' + productJson + '&activityJson=' + activityJson,
      success:function(res){
        console.log("跳转完成")
      },
    })
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

/*
    第一次进入初始化
      wx.showLoading({
        title: '菜单拉取中',     //wx.hideLoading()
      })
      wx.request({
        url: 'http://111.231.113.11/api/v1/stores?',
        data:{
          token:'9f00ed4206b4c8f3b8805478701b2667'
        },
        header: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        success:function(res){
          wx.hideLoading(),
          console.log(res.data)
        }
      })
*/