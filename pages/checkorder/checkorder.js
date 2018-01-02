var MD5Util = require('../../utils/md5.js');  
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
          money += parseInt(this.data.product_categories[i].products[j].number) * parseInt(this.data.product_categories[i].products[j].origin_price);
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
  },
  /*   立即支付  */
  ClickCheckOutPayMethod: function () {
    // wx.request({
    //   url: "https://whitedragoncode.cn/api/v1/small_program/orders",
    //   data: { "store_id": "1", "desk_id": "1", "user_id": getApp().globalData.user_id, "order": this.data.Menu_info },
    //   method: 'POST',
    //   success: function (res) {
    //     //{status_code: 200, prepay_id: "wx2018010208592704c3a565710965700126", order_code: "2018010200001"}
    //     wx.showToast({
    //       title: '成功',
    //     })
    //     console.log(res.data)
    //   },
    //   fail: function () {
    //     wx.showToast({
    //       title: '失败',
    //     })
    //     console.log(res.data)
    //   }
    // })
    var randomString = this.randomString();//随机字符串
    var timeStamp = this.timeStamp();//时间戳
    var MixedencryMD5 = this.MixedencryMD5("wx20180102164646d66a2cf5e10075006407", randomString, timeStamp);//拼接字符串
    var paysign = MD5Util.MD5(MixedencryMD5).toUpperCase();  //加密MD5
    console.log(MixedencryMD5);
    console.log(paysign);
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: randomString,
      package: 'prepay_id=' + "wx20180102164646d66a2cf5e10075006407",
      signType: 'MD5',
      paySign: paysign,
      success:function(res){
        wx.showToast({
          title: '成功',
        })
        console.log(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: '失败',
        })
        console.log(res.data)
      }
    })
  },
  //================================微信支付================================//
  /* 随机数 */
  randomString:function(){
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = chars.length;
    var pwd = '';
    for(var i = 0; i< 32; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  },
  /* 时间戳 */
  timeStamp:function() {
    return parseInt(new Date().getTime() / 1000) + ''
  },
  /* 调起支付签名 */
  MixedencryMD5: function (res_paydata, randomString, timeStamp){
    return "appId=" + "wx67d99485486f6d49" + "&nonceStr=" + randomString + "&package=prepay_id=" + res_paydata + "&signType=MD5" + "&timeStamp=" + timeStamp + "&key=" + "a8e46134e42279e3bd1c9c6b1546fa58";  
  }
})