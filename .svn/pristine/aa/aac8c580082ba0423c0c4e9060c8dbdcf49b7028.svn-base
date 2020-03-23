import Api from "../../../api/api.js"
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		listItem: '',
		studentInfo: {}, //学生信息
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getStuScore(options.listitem)
		this.setInfo()
	},

	//全局头部信息 
	setInfo() {
		this.setData({
			studentInfo: app.globalData.studentInfo,
		})
		console.log(this.data.studentInfo)
	},


	//获取单次考试列表数据
	getStuScore(list) {
		this.setData({
			listItem: JSON.parse(list)
		})
		// 设置头部标题
		wx.setNavigationBarTitle({
			title: this.data.listItem.examName
		})
	},

	
})