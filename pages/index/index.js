//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    message:'Hello CG!',
    // array:[1,2,3,4,5],
    iconSize: [20, 30, 40, 50, 60, 70],
    count:1
  },
  tapName:function(e){
    console.log('被电击了')
  },
  CheckMethod:function(e){
    wx.showToast({
      title: '点击',
      icon: 'success',
      duration: 1000
    })
  },
  CheckButton:function(e){
    this.setData({
      count:this.data.count + 1,
      message: this.data.count
    })
  }
})
