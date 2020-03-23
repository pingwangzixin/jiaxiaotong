const app = getApp();
import Api from "../../../api/api.js";
var util = require("../../../../utils/util.js");
Page({
  data: {
    //路由数据
    navData: [{
        parent: 1,
        name: "应用", //文本
        imgSrc: "../../../../images/app.png",
        fn: 'gotoApp' //对应处理函数
      },
      {
        parent: 1,
        name: "消息",
        current: 1,
        imgSrc: "../../../../images/acMsg.png",
        fn: 'gotoMsg'
      },
      {
        parent: 1,
        name: "我的",
        imgSrc: "../../../../images/mine.png",
        fn: 'gotoMine'
      },
    ],
    studentInfo: {}, //学生信息
    parentInfo: {},
    classMsg: [], //课堂记录
    workMsg: [], //作业提醒
    noticeList: [], //学校广告
    userHead: '../../../../images/head.jpg'
  },
  //模拟路由跳转
  gotoApp() {
    wx.redirectTo({
      url: '../../application/application/application',
    });
  },
  //模拟路由跳转
  gotoMine() {
    wx.redirectTo({
      url: '../../mine/mine/mine',
    });
  },
  //更多课堂记录
  toClassMore() {
    wx.navigateTo({
      url: '../../application/classMore/classMore',
    })
  },

  //将全局数据设置为局部数据
  setInfo() {
    this.setData({
      studentInfo: app.globalData.studentInfo,
      parentInfo: app.globalData.parentInfo,
    })
  },

  //课堂记录
  getClass() {
    var time = util.formatTime(new Date());
    app.fetch(Api.lessonRecordList, {
      stuId: this.data.studentInfo.id,
      classId: this.data.studentInfo.classId,
      startTime: time
    }, "GET", res => {
      if (res.data.code == 200) {
				console.log(res.data.data)
        this.setData({
          classMsg: res.data.data
        });
        app.globalData.classMsg = res.data.data;
      }

    })
  },

  //导学作业
  getHomework() {
    app.fetch(Api.msgList, {
      userId: this.data.studentInfo.id,
    }, "GET", res => {
      if (res.data.code == 200) {
        this.setData({
          workMsg: res.data.data
        })
        app.globalData.workMsg = res.data.data;
      }

    })
  },

  // 获取公告
  getNotice() {
    app.fetch(Api.noticeList, {
      officeId: this.data.studentInfo.officeId,
      classId: this.data.studentInfo.classId,
    }, "GET", res => {
      if (res.data.code == 200) {
        this.setData({
          noticeList: res.data.data.list
        })
        app.globalData.noticeList = res.data.data.list;
      }
    })
  },

  //点击获取公告详情
  noticeClick(e) {
    app.globalData.noticeDetails = this.data.noticeList[e.currentTarget.id];
    wx.navigateTo({
      url: `../noticeDetails/noticeDetails?type=${e.currentTarget.dataset.type}&id=${e.currentTarget.dataset.id}`,
    })
  },

  //导学详情
  toRemind(e) {
    console.log(e.currentTarget.dataset.type)
    if (e.currentTarget.dataset.type == 3) {
      wx.navigateTo({
        url: '../../application/homework/homework',
      })
    } else if (e.currentTarget.dataset.type == 11) {
      wx.navigateTo({
        url: '../remind/remind?id=' + e.currentTarget.dataset.id
      })
    }
  },


  onLoad() {
    wx.hideHomeButton();
    this.setInfo();
    this.getClass();
    this.getHomework()
    this.getNotice()
  },
})