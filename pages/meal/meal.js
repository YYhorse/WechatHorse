Page({
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '点餐',
    })
  }
})

/*
    第一次进入初始化
      wx.showLoading({
        title: '菜单拉取中',     //wx.hideLoading()
      })
      wx.request({
        url: 'http://111.231.113.11/api/v1/stores?',
        data:{
          token:'9f00ed4206b4c8f3b8805478701b2667'
        },
        header: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        success:function(res){
          wx.hideLoading(),
          console.log(res.data)
        }
      })
*/