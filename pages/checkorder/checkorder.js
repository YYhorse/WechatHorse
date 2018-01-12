Page({
  data: {
    product_categories: "",
    activity_info:"",
    Menu_info:null,
    OrderReceivableMoney:0,       //订单应收   
    OrderPaidMoney:0,             //订单实付
    OrderCutActivity:"无",
    OrderGiftActivity:"无",
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '提交订单' });
    this.setData({
      product_categories: JSON.parse(options.productJson),
      activity_info: JSON.parse(options.activityJson),
    })
    this.GetRealOrderTotalMoney();      //获取订单应收
    this.GetUsableCutActivity();        //获取可用的满减活动
    this.GetUsableGiftActivity();       //获取可用的满赠活动
  },
  /*   获取订单应收金额 + 菜单信息  */
  GetRealOrderTotalMoney:function(){
    var money = 0;
    var menuinfo = "{\"menu_info\":[";
    for (var i = 0; i < this.data.product_categories.length; i++) {
      for (var j = 0; j < this.data.product_categories[i].products.length; j++) {
        if (parseInt(this.data.product_categories[i].products[j].number) != 0) {
          money += parseInt(this.data.product_categories[i].products[j].number) * (this.data.product_categories[i].products[j].origin_price);
          menuinfo += "{\"product_id\":\"" + this.data.product_categories[i].products[j].id + "\",\"product_number\":\"" + this.data.product_categories[i].products[j].number + "\"},"
        }
      }
    }
    menuinfo = menuinfo.substr(0, menuinfo.length - 1) + "]}";
    this.setData({  
      OrderReceivableMoney: money,
      Menu_info:JSON.parse(menuinfo)
    })
    console.log(this.data.Menu_info);
  },
  /*  获取满足条件的满减活动 */
  GetUsableCutActivity: function () {
    var temp = 0;
    for (var i = 0; i < this.data.activity_info.length; i++) {
      if (this.data.activity_info[i].type == "full_cut" 
        && this.data.OrderReceivableMoney >= (this.data.activity_info[i].full)) {
        // console.log("满减活动有:" + this.data.activity_info[i].full + "减" + this.data.activity_info[i].cut);
        //获取最优满减
        if (this.data.activity_info[i].cut>temp)
          temp = this.data.activity_info[i].cut;
      }
    }
    console.log("最优满减="+temp);
    this.setData({
      OrderCutActivity: temp != 0 ?"减￥"+temp+"元":"无",
      OrderPaidMoney: (this.data.OrderReceivableMoney - temp).toFixed(2),
    })
  },
  /*   获取满足条件的满赠活动 */
  GetUsableGiftActivity:function(){
    var temp = 0;
    var temp2 = "无";
    for (var i = 0; i < this.data.activity_info.length; i++) {
      if (this.data.activity_info[i].type == "full_gift"
        && this.data.OrderReceivableMoney >= (this.data.activity_info[i].full)) {
        // console.log("满赠活动有:" + this.data.activity_info[i].full+ "赠" + this.data.activity_info[i].cut);
        //获取最优满减
        if (temp < (this.data.activity_info[i].full)){
          temp = (this.data.activity_info[i].full);
          temp2 = this.data.activity_info[i].cut;
        }
      }
    }
    console.log("最优满赠=" + temp2);
    this.setData({
      OrderGiftActivity: temp!=0?"赠送" + temp2:"无",
    })
  },
  /*   立即支付  */
  ClickCheckOutPayMethod: function () {
    var that = this;
    var Order_code = "";
    wx.request({
      url: "https://whitedragoncode.cn/api/v1/small_program/orders",
      data: { "store_id": getApp().globalData.store_id, "desk_id": getApp().globalData.desk_id,"user_id": getApp().globalData.user_id, "order": that.data.Menu_info },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if (res.data.status_code==200){
          Order_code = res.data.order_code;
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: function (res) {
              wx.showToast({
                title: '支付成功',
              })
              wx.navigateTo({
                url: '/pages/payfinish/payfinish?order_code=' + Order_code,
              })  
            },
            fail: function (res) {
              wx.showToast({
                title: '支付失败',
              })
              console.log(res.data)
            }
          })
        }
        else{
          wx.showToast({
            title: '支付接口返回错误',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '失败',
        })
        console.log(res.data)
      }
    })
  }
})