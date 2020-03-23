// component/parent/suggestion/suggestion.js
import Api from "../../../api/api.js";
var app = getApp();
Page({
	data:{
		textData:""
	},
  bindFormSubmit(e){
		if (!e.detail.value.textarea) return
		app.fetch(Api.opinion, {
			content: e.detail.value.textarea,
			createBy: app.globalData.adminInfo.id,
			type: 2
		}, "GET", res => {
			this.setData({
				textData:""
			})
		})
    wx.showToast({
      title: '感谢您的意见',
      icon: 'success',
      duration: 2000,
      mask:true,
    })
  }
})