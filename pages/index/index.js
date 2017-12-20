//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    imgUrls: [
       "../image/1.png",
       "../image/2.png",
       "../image/3.jpg",
       "../image/4.png"
    ],
    userName: "支付0.01元"
  },
  ClickUserNameMethod:function(e){
    var that = this;
    wx.request({
      url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx67d99485486f6d49&secret=a8e46134e42279e3bd1c9c6b1546fa58&js_code=" + app.globalData.code + "&grant_type=authorization_code",
      data:{},
      method:'GET',
      success:function(res){
        console.log('返回openId')
        console.log(res.data)
      },
      fail: function () {
        console.log('失败openId')
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
