Page({
  data: {
    Order_Code:"",
    Order_Info:"",
    Queue_No:"",
    Desk_Name:"",
    Desk_fontSize:30,
    Meanu_info:"",
    Activity_info:"",
    OrderTime:"",
    OrderTotal:"",
    OrderReceivableMoney:"",       //订单应收   
    OrderPaidMoney:"",             //订单实付
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({ title: '下单成功' });
    if(options.order_code!=null){
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
            Order_Info: res.data,
          })
          that.ShowUi();
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
    else if (options.orderJson!=null){
      this.setData({
        Order_Info: JSON.parse(options.orderJson),
      })
      that.ShowUi();
    }
  },
  ShowUi:function(){
    //桌号字体设置
    var size = 30;
    if (this.data.Order_Info.desk_code.length < 4)
      size = 30;
    else if (this.data.Order_Info.desk_code.length >= 4 && this.data.Order_Info.desk_code.length < 8)
      size = 25;
    else
      size = 20;
    this.setData({
      Queue_No: '#' + this.data.Order_Info.queue_no,
      Desk_Name: this.data.Order_Info.desk_code,
      Desk_fontSize: size,
      OrderTime: this.data.Order_Info.created_at,
      Meanu_info: this.data.Order_Info.menu_info,
      OrderReceivableMoney: this.data.Order_Info.origin_total_price,
      OrderPaidMoney: this.data.Order_Info.actual_total_price
    })
  },
  //请授权动画
  onReady: function () {
    var circleCount = 0;
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 500, // 以毫秒为单位
      timingFunction: 'linear',
      delay: 50,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.1).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });
      circleCount++;
      if (circleCount == 500) {
        circleCount = 0;
      }
    }.bind(this), 500);
  },
  ClickContinueShop:function(e){
    wx.navigateTo({
      url: '/pages/meal/meal'
    })
  }
})