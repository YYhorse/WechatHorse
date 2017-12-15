//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    // message:'Hello CG!',
    // // array:[1,2,3,4,5],
    // iconSize: [20, 30, 40, 50, 60, 70],
    // count:1
  
    "testData": {
      "a": [{
        "id": "1-1",
        "name": "节点1 - 1"
      }, {
        "id": "1-2",
        "name": "节点1 - 2"
      }],
      "b": [{
        "id": "2-1",
        "name": "节点2 - 1"
      }, {
        "id": "2-2",
        "name": "节点2 - 2"
      }]
    },
    
    "student":[
      {
        "name":"张三",
        "age":"22",
        "sex":"男孩"
      },{
        "name": "李四",
        "age": "24",
        "sex": "女孩"
      }, {
        "name": "王五",
        "age": "25",
        "sex": "男孩"
      }
    ],
    currentItemId: 0,
    totalname:""  
  },
  onLoad: function () {
    this.setData({
      totalname: this.TotalNameMethod()
    })
  },
  clickTap: function (e) {
    var Index = e.currentTarget.dataset.numid;
    console.log("XXXXX"+Index);
    this.setData({
      currentItemId: Index
    });
    wx.showToast({
      title: this.data.student[Index].name,
    })
  },

  TotalNameMethod:function(){
    var temp = "";
    for(var i =0;i<this.data.student.length;i++){
      temp +=this.data.student[i].name;
    }
    return temp;
  }
})
