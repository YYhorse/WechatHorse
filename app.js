//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success:function(res){
        if(res.code){
          getApp().globalData.code = res.code;
          wx.getUserInfo({
            success:function(res){
              getApp().globalData.userInfo = res.userInfo
              wx.showModal({
                title: '提示',
                content: res.userInfo.nickName + '欢迎您！'+res.userInfo.acatarUrl+"\n"+res.userInfo.gender+"\n"+res.userInfo.province+"\n"+res.userInfo.city,
              })
            },
            fail:function(){
              wx.showToast({
                title: "获取信息失败!",
              })
            },
          })
        } else {
          console.log('获取用户登录状态失败'+res.errMsg)
        }
      }
    })
  },
  globalData: {
    code:null,
    userInfo: null
  }
})