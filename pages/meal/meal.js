var postData = require('../../testjson/testjson.js');
Page({
  data:{
    CurrentCategoryPostion:0,
    ShopName_txt:"",
    ShopDescription_txt:"",
    ShopActivity_txt:"",
    product_categories:"",
    product_items:"",
    productData:postData.postList.product_categories     //全部商品
  },
  onLoad:function(){
    wx.setNavigationBarTitle({  title: '小程序点餐' }),
    this.setData({
      ShopName_txt: postData.postList.name,
      ShopDescription_txt: postData.postList.description,
      ShopActivity_txt:this.GetActivityInfo(),
      product_categories: this.data.productData,
      product_items: this.InitProductNumber(),
      product_items: this.data.productData[this.data.CurrentCategoryPostion].products,
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
  /* 为每个产品增加数量=0属性 */
  InitProductNumber:function(){
    for (var i = 0; i < this.data.productData.length;i++){
      for (var j = 0; j < this.data.productData[i].products.length;j++){
        this.data.productData[i].products[j].number = 0;
      }
    }
  },
  /* 点击单个种类属性 */
  ClickCategoryMethod: function (e) {
    var Index = e.currentTarget.dataset.numid;
    console.log("XXXXX" + Index);
    this.setData({
      CurrentCategoryPostion: Index,
      product_items: this.data.productData[Index].products
    });
  },
  /* 点击单产品添加按钮事件 */
  AddFoodNumMethod:function(e){
    var Index = e.currentTarget.dataset.numid;
    console.log("添加商品:" + this.data.productData[this.data.CurrentCategoryPostion].products[Index].name);
    this.data.productData[this.data.CurrentCategoryPostion].products[Index].number++;
    console.log("数量为=" + this.data.productData[this.data.CurrentCategoryPostion].products[Index].number);
    this.setData({
      product_items: this.data.productData[this.data.CurrentCategoryPostion].products
    })
  },
  /* 点击单产品减少按钮事件 */
  ReduceFoodNumMethod:function(e){
    var Index = e.currentTarget.dataset.numid;
    console.log("减少商品:" + this.data.productData[this.data.CurrentCategoryPostion].products[Index].name);
    if (this.data.productData[this.data.CurrentCategoryPostion].products[Index].number>0)
      this.data.productData[this.data.CurrentCategoryPostion].products[Index].number--;
    else
      this.data.productData[this.data.CurrentCategoryPostion].products[Index].number = 0;
    this.setData({
      product_items: this.data.productData[this.data.CurrentCategoryPostion].products
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