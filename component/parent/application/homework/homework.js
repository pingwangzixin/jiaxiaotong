const app = getApp()
import Api from "../../../api/api.js"
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work:[], 
		date: '',
	},
	
	//获取作业列表
  getWorkList(){
    app.fetch(Api.homeworkList, {
			userId: app.globalData.studentInfo.id,
			dateTime: this.data.date
    }, "GET", res => {
			if(res.data.code == 200){
				this.setData({
					work: res.data.data
				})
				app.globalData.workList = res.data.data
			}
    })
	},
	
	//跳转作业详情
	toWorkDetails(e){
		wx.navigateTo({
			url: '../workDetails/workDetails?index=' + e.currentTarget.dataset.index,
		})
	},

	//获取当前日期
	getTime(){
		var time = util.formatTime(new Date());
		this.setData({
			date:time
		})
	},

	//日期选择
	bindDateChange(e){
		this.setData({
			date: e.detail.value
		})
		app.fetch(Api.homeworkList, {
			userId: app.globalData.studentInfo.id,
			dateTime: this.data.date
    }, "GET", res => {
			if(res.data.code == 200){
				app.globalData.workList = res.data.data
				this.setData({
					work: res.data.data
				})
			}
    })
	},

  onLoad(){
		this.getTime()
    this.getWorkList()
  }
 
})