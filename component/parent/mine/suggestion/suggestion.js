import Api from "../../../api/api.js";
var app = getApp();
Page({
	data: {
		textData: ""
	},
  bindFormSubmit(e) {
    if (!e.detail.value.textarea) return
    app.fetch(Api.opinion, {
      content: e.detail.value.textarea,
			createBy: app.globalData.studentInfo.id,
      type: 1
    }, "GET", res => {
      this.setData({
        textData: ""
      })
      console.log(res)
    })
    wx.showToast({
      title: '感谢您的意见',
      icon: 'success',
      duration: 2000,
      mask: true,
    })
  },
	onLoad(){
		console.log(app.globalData.studentInfo)
	}
})