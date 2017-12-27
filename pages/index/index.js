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
    userName: "支付0.01元",
    totalCount:10,
    totalPrice:123.4
  },
  ClickUserNameMethod:function(e){
    var that = this;
    wx.request({
      url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx67d99485486f6d49&secret=a8e46134e42279e3bd1c9c6b1546fa58&js_code=" + app.globalData.code + "&grant_type=authorization_code",
      data:{},
      method:'GET',
      success:function(res){
        wx.showModal({
          title: '提示',
          content: "Session_key="+res.data.session_key+"\nOpenid="+res.data.openid,
        })
        console.log('返回openId')
        console.log(res.data)
      },
      fail: function () {
        wx.showToast({
          title: '获取openId失败',
        })
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
