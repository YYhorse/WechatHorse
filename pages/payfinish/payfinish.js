Page({
  data: {
    Order_Code:"",
    Queue_No:"",
    Desk_Name:""
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({ title: '下单成功' });
    that.setData({
      Order_Code: options.order_code
    })
    wx.showLoading({ title: '订单详情拉取中', }),
    wx.request({
      url: "https://whitedragoncode.cn/api/v1/small_program/orders",
      data: { "store_id": "1", "user_id": getApp().globalData.user_id, "order_code": that.data.Order_Code},
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        that.setData({
          Queue_No: '#'+res.data.queue_no,
          Desk_Name: res.data.desk_code+"包间XXX"
        })
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