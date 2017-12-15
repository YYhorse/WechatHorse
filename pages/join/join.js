Page({
  data: {
    // text:"这是一个页面"  
    tip: '',
    buttonDisabled: false,
    modalHidden: true,
    show: false
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '加盟',
    })
  },
  showModal: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  },
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
    })
    wx.showToast({
      title: '取消拨打',
      icon: 'success',
      duration:1000
    })
    wx.vibrateLong({
      
    })
  },
  calltel:function(){
     wx.makePhoneCall({
       phoneNumber: '18698711581'
     }),
     this.setData({
       modalHidden: !this.data.modalHidden,
     })
  }
})  