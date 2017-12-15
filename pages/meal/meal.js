var postData = require('../../testjson/testjson.js');
Page({
  data:{
    CurrentCategoryPostion:0,
    ShopName_txt:"",
    ShopDescription_txt:"",
    ShopActivity_txt:"",
    product_categories:"",
    product_items:""
  },
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '点餐',
    }),
    this.setData({
      ShopName_txt: postData.postList.name,
      ShopDescription_txt: postData.postList.description,
      ShopActivity_txt:this.GetActivityInfo(),
      product_categories:postData.postList.product_categories,
      product_items: postData.postList.product_categories[this.data.CurrentCategoryPostion].products
    })
  },
  /* 解析活动信息 */
  GetActivityInfo:function(){
    var temp = "";
    for (var i = 0; i < postData.postList.full_cuts.length;i++){
      if(postData.postList.full_cuts[i].type=="full_cut")
        temp += " 满￥" + postData.postList.full_cuts[i].full + "立减￥" + postData.postList.full_cuts[i].cut;
      else
        temp += " 满￥" + postData.postList.full_cuts[i].full + "赠" + postData.postList.full_cuts[i].cut;
    }
    return temp; 
  },
  ClickCategoryMethod: function (e) {
    var Index = e.currentTarget.dataset.numid;
    console.log("XXXXX" + Index);
    this.setData({
      CurrentCategoryPostion: Index,
      product_items: postData.postList.product_categories[Index].products
    });
  },
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