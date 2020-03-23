const app = getApp()
import Api from "../../../api/api.js"
var util = require("../../../../utils/util.js");

Page({
  data: {
    classMsg: [],  //课堂记录
    date: '',
    timeFrame: [],
  },
  
  cutTime(obj){
    var arr= []
    obj.forEach((ele)=>{
      var start_time = ele.start_time.split(" ")[1].slice(0,ele.start_time.split(" ")[1].length-3)
      var end_time = ele.end_time.split(" ")[1].slice(0,ele.end_time.split(" ")[1].length-3)
      arr.push(start_time + '-' + end_time)
    })
    this.setData({
      timeFrame : arr
    })
  },

  setInfo() {
    this.cutTime(app.globalData.classMsg);
    this.setData({
      classMsg: app.globalData.classMsg,
    })
  },
  
  // 跳转到测试题
  toTest(e) {
    wx.navigateTo({
      url: '../test/test?items=' + JSON.stringify(e.currentTarget.dataset.items),
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
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    console.log(e.detail.value)
    app.fetch(Api.lessonRecordList, {
      stuId: app.globalData.studentInfo.id,
      classId: app.globalData.studentInfo.classId,
      startTime: this.data.date
    }, "GET", res => {
			if(res.data.code == 200){
				this.setData({
					classMsg: res.data.data
				});
				this.cutTime(res.data.data);
			}
    })
  },

  onLoad() {
    this.setInfo()
    this.getTime()
  },

})