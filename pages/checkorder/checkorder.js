Page({
  data: {
    // text:"这是一个页面"  
    product_categories: "",
    activity_info:"",
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
  /*   获取订单应收金额  */
  GetRealOrderTotalMoney:function(){
    var money = 0;
    for (var i = 0; i < this.data.product_categories.length; i++) {
      for (var j = 0; j < this.data.product_categories[i].products.length; j++) {
        if (parseInt(this.data.product_categories[i].products[j].number) != 0) {
          console.log("数量不为0");
          money += parseInt(this.data.product_categories[i].products[j].number) * parseInt(this.data.product_categories[i].products[j].origin_price);
        }
      }
    }
    this.setData({  OrderReceivableMoney: money })
  },
  /*  获取满足条件的满减活动 */
  GetUsableCutActivity: function () {
    var temp = 0;
    for (var i = 0; i < this.data.activity_info.length; i++) {
      if (this.data.activity_info[i].type == "full_cut" 
        && this.data.OrderReceivableMoney >= parseInt(this.data.activity_info[i].full)) {
        // console.log("满减活动有:" + this.data.activity_info[i].full + "减" + this.data.activity_info[i].cut);
        //获取最优满减
        if (parseInt(this.data.activity_info[i].cut)>temp)
          temp = parseInt(this.data.activity_info[i].cut);
      }
    }
    console.log("最优满减="+temp);
    this.setData({
      OrderCutActivity: temp != 0 ?"减￥"+temp+"元":"无",
      OrderPaidMoney: this.data.OrderReceivableMoney - temp,
    })
  },
  /*   获取满足条件的满赠活动 */
  GetUsableGiftActivity:function(){
    var temp = 0;
    var temp2 = "无";
    for (var i = 0; i < this.data.activity_info.length; i++) {
      if (this.data.activity_info[i].type == "full_gift"
        && this.data.OrderReceivableMoney >= parseInt(this.data.activity_info[i].full)) {
        // console.log("满赠活动有:" + this.data.activity_info[i].full+ "赠" + this.data.activity_info[i].cut);
        //获取最优满减
        if (temp < parseInt(this.data.activity_info[i].full)){
          temp = parseInt(this.data.activity_info[i].full);
          temp2 = this.data.activity_info[i].cut;
        }
      }
    }
    console.log("最优满赠=" + temp2);
    this.setData({
      OrderGiftActivity: temp!=0?"赠送" + temp2:"无",
    })
  }
})