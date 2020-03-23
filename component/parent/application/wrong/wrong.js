// component/parent/wrong/wrong.js


const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		stuId: '',
		gradeNo: '',
		fullSchoolCode: '',
		htmlSrc: ''
	},

	onLoad() {
		this.setInfo();
		this.setData({
			htmlSrc: "https://parents.mdjedu.org.cn/MdjParents/parents/homework/errorQuestion.do?stuId="+ this.data.stuId +"&gradeNo="+ this.data.gradeNo +"&fullSchoolCode="+ this.data.fullSchoolCode +","
		})
		console.log(this.data.htmlSrc)

		
	},
	
	setInfo(){
		this.setData({
			stuId: app.globalData.parentInfo.children[0].id,
			gradeNo: app.globalData.parentInfo.children[0].gradeNo,
			fullSchoolCode: app.globalData.parentInfo.children[0].cityId,
		})
	},
	
})