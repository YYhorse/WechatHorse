Page({
  data: {
    HeadPhoto:"",
    UserName:"",
    Order:"",
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarTitle({ title: '店铺订单' }),
    wx.showLoading({  title: '历史订单拉取中',}),
    wx.request({
      url: "https://whitedragoncode.cn/api/v1/small_program/orders/history_order",
      data: { "store_id": getApp().globalData.store_id, "user_id": getApp().globalData.user_id, "page": "0" },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          HeadPhoto: getApp().globalData.userInfo.avatarUrl,
          UserName: getApp().globalData.userInfo.nickName,
          Order: res.data.order,
        });
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({title: '失败'})
        console.log(res.data)
      }
    })  
  },
  ClickOrderMethod:function(e){
    var Index = e.currentTarget.dataset.numid;
    let orderJson = JSON.stringify(this.data.Order[Index]);
    console.log("订单转JSON=" + orderJson);
    wx.navigateTo({ url: '/pages/payfinish/payfinish?orderJson=' + orderJson})
  }
})