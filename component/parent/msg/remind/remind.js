
const app = getApp()
import Api from "../../../api/api.js"

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detailList: "",
		grade: "",
		resultGather: []
	},


	// 获取导学详情
	getDetailList(id) {
    app.fetch(Api.detailList, {
			id: id,
    }, "GET", res => {
			if(res.data.code == 200){
				this.setData({
					detailList: res.data.data,
					grade: JSON.parse(res.data.data.mr9).gradeName,
					resultGather: res.data.data.subjNames.split("//")
				})
			}
    })
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getDetailList(options.id);
	},

})