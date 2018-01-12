//index.js
Page({
  onLoad: function (options){
    if (options.scene == null){
      var that = this;
      wx.showModal({
        title: '未知店铺',
        content: '是否进入测试店铺',
        cancelText: '退出',
        cancelColor: "#3f3f3f",
        confirmText: '确认',
        confirmColor: "#FF0000",
        success: function (res) {
          if (res.confirm) {
            let scene = "store_id=2&desk_id=4";
            that.DealScene(scene);
            that.AutoLogin();
          }
          else
            console.log('退出')
        }
      })
    }
    else{
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      let scene = decodeURIComponent(options.scene);
      this.DealScene(scene);
      this.AutoLogin();
    }
  },
  //请授权动画
  onReady: function () {
    var circleCount = 0;
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000, // 以毫秒为单位
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
    });
    setInterval(function () {
      if (circleCount % 2 == 0)
        this.animationMiddleHeaderItem.scale(1.5).step();
      else
        this.animationMiddleHeaderItem.scale(1.0).step();
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });
      circleCount++;
      if (circleCount == 1000)
        circleCount = 0;
    }.bind(this), 1000);
  },
  DealScene: function (sceneTemp){
    sceneTemp = sceneTemp.split('&')
    let obj = {}
    for (let i = 0; i < sceneTemp.length; i++) {
      let item = sceneTemp[i].split('=')
      obj[item[0]] = item[1]
    }
    getApp().globalData.store_id = obj.store_id;
    getApp().globalData.desk_id = obj.desk_id;
    console.log(obj.store_id + "|" + obj.desk_id)
  },
  AutoLogin:function(){
    wx.showLoading({
      title: '正在登录中',
    }),
    // 登录
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.hideLoading();
          getApp().globalData.code = res.code;
          //------------------------//    
          wx.getUserInfo({
            success: function (res) {
              getApp().globalData.userInfo = res.userInfo
              wx.request({
                url: "https://whitedragoncode.cn/api/v1/small_program/stores/login",
                data: { "code": getApp().globalData.code, "nickname": getApp().globalData.userInfo.nickName, "sex": getApp().globalData.userInfo.gender, "province": getApp().globalData.userInfo.province, "city": getApp().globalData.userInfo.city, "store_id": getApp().globalData.store_id, "desk_id": getApp().globalData.desk_id},
                method: 'POST',
                success: function (res) {
                  console.log(res.data);
                  if(res.data.status_code == 602){
                    wx.showLoading({
                      title: '登录缺少参数',
                    })
                  }
                  else if(res.data.status_code == 603){
                    wx.showLoading({
                      title: '餐桌不存在',
                    })
                  }
                  else{
                    getApp().globalData.user_id = res.data.user_id;
                    wx.navigateTo({
                      url: '/pages/meal/meal'
                      //url: '/pages/payfinish/payfinish?order_code=' + '2018010500006',
                      // url: '/pages/myorder/myorder'
                    })
                  }
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
  }
})