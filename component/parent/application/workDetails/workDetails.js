const app = getApp()
import Api from "../../../api/api.js"
Page({

  data: {
    workInfo: [],
    workDetail: '',
    htmlSrc: '',
  },

  // 获取接口数据
  getHomeworkDetail() {
    app.fetch(Api.homeworkDetail, {
      id: this.data.workInfo.homeworkId,
      stuId: app.globalData.studentInfo.id
    }, "GET", res => {
      if (res.data.code == 200) {
        var strTitle = res.data.data.type == 1 ? "任务作业" : "测试作业"
        this.setData({
          workDetail: res.data.data,
          htmlSrc: `https://parents.mdjedu.org.cn/MdjParents/parents/homework/taskView.do?homeworkDistributeId=${res.data.data.id}&role=`,
        })
        wx.setNavigationBarTitle({
          title: strTitle
        })
      }
    })
  },


  onLoad(options) {
    this.setData({
      workInfo: app.globalData.workList[Number(options.index)],
    })
    console.log(app.globalData.workList[Number(options.index)])
    this.getHomeworkDetail();
  },

  // 查看答案
  /* 
  answerShowChange(e){
  	var index = e.currentTarget.dataset.index
  	var num = e.currentTarget.dataset.num
  	this.data.workDetail.typeArray[index].questionArray[num].body.isChild = !this.data.workDetail.typeArray[index].questionArray[num].body.isChild
  	this.setData({
  		workDetail: this.data.workDetail
  	})
  } 
  */

})