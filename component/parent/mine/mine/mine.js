// component/parent/mine/mine.js
const app = getApp()
import Api from "../../../api/api.js"
Page({

  data: {
    //路由信息
    navData: [{
        parent: 1,
        name: "应用", //文本
        imgSrc: "../../../../images/app.png",
        fn: 'gotoApp' //对应处理函数
      },
      {
        parent: 1,
        name: "消息",
        imgSrc: "../../../../images/msg.png",
        fn: 'gotoMsg'
      },
      {
        parent: 1,
        name: "我的",
        current: 1,
        imgSrc: "../../../../images/acMine.png",
        fn: 'gotoMine'
      },
    ],
    studentInfo: {}, //学生信息
    statusBarHeight: app.globalData.statusBarHeight,

  },
  //模拟路由跳转
  gotoApp() {
    wx.redirectTo({
      url: '../../application/application/application',
    });
  },
  //模拟路由跳转
  gotoMsg() {
    wx.redirectTo({
      url: '../../msg/msg/msg',
    });
  },
  //意见反馈
  suggestion() {
    wx.navigateTo({
      url: '../suggestion/suggestion'
    })
  },
  //关于我们
  aboutUs() {
    wx.navigateTo({
      url: '../aboutUs/aboutUs'
    })
  },
  //将全局数据设置为局部数据
  setInfo() {
    this.setData({
      studentInfo: app.globalData.studentInfo,
      parentInfo: app.globalData.parentInfo,
    })
  },
  signOut() {
    wx.showModal({
      title: '提示',
      content: '您确定要退出吗',
      success(res) {
        if (res.confirm) {
          app.fetch(Api.signOut, {
            username: app.globalData.user
          }, "GET", res => {
            console.log(res)
            if (res.statusCode == 200) {
              wx.redirectTo({
                url: '../../../../pages/index/index',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad() {
    wx.hideHomeButton();
    this.setInfo()
  }
})