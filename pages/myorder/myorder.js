Page({
  onLoad: function () {
    var that = this;
    wx.setNavigationBarTitle({ title: '店铺订单' }),
    wx.showLoading({  title: '历史订单拉取中',}),
    wx.request({
      url: "https://whitedragoncode.cn/api/v1/small_program/orders/history_order",
      data: { "store_id": "1", "user_id": getApp().globalData.user_id, "page": "0" },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '失败',
        })
        console.log(res.data)
      }
    })  
  }
})