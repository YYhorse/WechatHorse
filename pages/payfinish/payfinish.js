Page({
  data: {
    Order_Code:"",
    Order_Info:"",
    Queue_No:"",
    Desk_Name:"",
    Desk_fontSize:30,
    Meanu_info:"",
    Activity_info:"",
    OrderCutActivity:"无",          //满减活动
    OrderGiftActivity:"无",        //满赠活动
    OrderTime:"",
    OrderTotal:"",
    TradingStatus:"",              //订单状态
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
        data: { "store_id": getApp().globalData.store_id, "user_id": getApp().globalData.user_id, "order_code": that.data.Order_Code},
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
    if (this.data.Order_Info.desk_code!=""){
      var size = 30;
      if (this.data.Order_Info.desk_code.length < 4)
        size = 30;
      else if (this.data.Order_Info.desk_code.length >= 4 && this.data.Order_Info.desk_code.length < 8)
        size = 25;
      else
        size = 20;
    }
    //活动选择
    if (this.data.Order_Info.activity_info!=null){
      for (var i = 0; i < this.data.Order_Info.activity_info.length;i++){
        if (this.data.Order_Info.activity_info[i].type =="full_cut"){
          //满减活动
          var temp = this.data.Order_Info.activity_info[i].cut;
          this.setData({
            OrderCutActivity: temp != 0 ? "减￥" + temp + "元" : "无",
          })
        }
        else if (this.data.Order_Info.activity_info[i].type == "full_gift"){
          //满赠活动
          var temp = this.data.Order_Info.activity_info[i].gift;
          this.setData({
            OrderGiftActivity: temp != 0 ? "赠送" + temp : "无",
          })
        }
      }
      //支付状态
      var tradingtemp = "";
      if (this.data.Order_Info.trading_status == 'pending_payment')
        tradingtemp = "待支付"
      else if (this.data.Order_Info.trading_status == 'order_complete')
        tradingtemp = "支付完成"
      else
        tradingtemp = "打印完成" 
    }
    this.setData({
      Queue_No: '#' + this.data.Order_Info.queue_no,
      Desk_Name: this.data.Order_Info.desk_code,
      Desk_fontSize: size,
      OrderTime: this.data.Order_Info.created_at,
      Meanu_info: this.data.Order_Info.menu_info,
      Activity_info: this.data.Order_Info.activity_info,
      TradingStatus: tradingtemp,
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
    getApp().globalData.continue_buy = true;
    wx.navigateTo({
      url: '/pages/meal/meal'
    })
  }
})