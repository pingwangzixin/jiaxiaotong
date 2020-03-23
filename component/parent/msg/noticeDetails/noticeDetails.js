
const app = getApp()
import Api from "../../../api/api.js"
Page({

	data: {
		swiperList: [],
		curIndex: 0,
		noticeIndex: 7,
		noticeName: [{'name':'校园公告','cur':'7'},{'name':'班级公告','cur':'8'}],
		leftOpacity: 0,
		rightOpacity: 0
	},

	//设置数据
	setInfo() {
		this.setData({
			studentInfo: app.globalData.studentInfo,
			noticeList: app.globalData.noticeList,
		})
	},

	changeSwiper(e){
		if(e){
			this.setData({
				curIndex: e.detail.current
			})
		}
		if(this.data.curIndex == 0 && this.data.swiperList.length > 1){ /* 开始第一条数据 */
			console.log("开始第一条数据")
			this.setData({
				rightOpacity : 1,
				leftOpacity : 0
			})
		}else if(0 < this.data.curIndex  && this.data.curIndex < this.data.swiperList.length-1){ /* 中间数据 */
			console.log("中间数据")
			this.setData({
				rightOpacity : 1,
				leftOpacity : 1
			})
		}else if(this.data.curIndex > 0 && this.data.curIndex == this.data.swiperList.length-1){  /* 最后一条数据 */
			console.log("最后一条数据")
			this.setData({
				rightOpacity : 0,
				leftOpacity : 1
			})
		}else if(this.data.curIndex == 0 && this.data.swiperList.length == 1){ /* 一条时数据 */
			console.log("一条时数据")
			this.setData({
				rightOpacity : 0,
				leftOpacity : 0
			})
		}

		
	},

	 // 获取公告详情接口数据
	 getNotice(options) {
    app.fetch(Api.noticeList, {
      officeId: this.data.studentInfo.officeId,
			classId: this.data.studentInfo.classId,
			type: options.type
    }, "GET", res => {
			if(res.data.code == 200){
				this.setData({
					swiperList: res.data.data.list,
					noticeIndex: options.type
				})

				this.data.swiperList.findIndex((ele, index) => {
					if (ele.id == options.id) {
						this.setData({
							curIndex: index
						})
					}
				})
				this.changeSwiper()
			}
    })
  },



	onLoad: function (options) {
		this.setInfo(options);
		this.getNotice(options);
	},

	// 点击切换
	tabNotice(e){
		this.setData({
			curIndex: 0,
			noticeIndex : e.currentTarget.dataset.type
		})
		this.getNotice(e.currentTarget.dataset)
	}

})