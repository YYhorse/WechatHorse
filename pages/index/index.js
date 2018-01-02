//index.js
Page({
  onLoad:function(){
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          getApp().globalData.code = res.code;
          wx.getUserInfo({
            success: function (res) {
              getApp().globalData.userInfo = res.userInfo
              wx.request({
                url: "https://whitedragoncode.cn/api/v1/small_program/stores/login",
                data: { "code": getApp().globalData.code, "nickname": getApp().globalData.userInfo.nickName, "sex": getApp().globalData.userInfo.gender, "province": getApp().globalData.userInfo.province, "city": getApp().globalData.userInfo.city, "store_id": "1" },
                method: 'POST',
                success: function (res) {
                  getApp().globalData.user_id = res.data.user_id;
                  console.log(res.data);
                  wx.navigateTo({
                    url: '/pages/meal/meal'
                  })
                  wx.showToast({
                    title: getApp().globalData.userInfo.nickName + '欢迎您！',
                  })
                },
                fail: function () {
                  wx.showToast({
                    title: '登陆失败',
                  })
                }
              })
            },
            fail: function () {
              wx.showToast({
                title: "获取信息失败!",
              })
            }
          })
        } else {
          console.log('获取用户登录状态失败' + res.errMsg)
        }
      }
    })
  },
  //请授权动画
  onReady: function () {
    var circleCount = 0;
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000, // 以毫秒为单位
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.scale(1.5).step();
      } else {
        this.animationMiddleHeaderItem.scale(1.0).step();
      }
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);
  }
})

//res.userInfo.nickName + '欢迎您！'+"\n"+res.userInfo.gender+"\n"+res.userInfo.province+"\n"+res.userInfo.city,