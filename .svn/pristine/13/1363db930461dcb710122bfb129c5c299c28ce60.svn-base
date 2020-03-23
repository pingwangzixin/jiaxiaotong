const app = getApp();
import Api from "../../api/api.js"
Page({
  data: {
    navData: [
      {
        name: "教学",
        admin: 1,
        imgSrc: "../../../images/admin_teacher.png",
        fn: 'gotoLearn'
      },
      {
        name: "成绩",
        admin: 1,
        imgSrc: "../../../images/admin_score.png",
        fn: 'gotoScore'
      },
      {
        admin: 1,
        name: "资源",
        imgSrc: "../../../images/admin_resource.png",
        fn: 'gotoResource'
      },
      {
        admin: 1,
        name: "用户",
        imgSrc: "../../../images/admine_user.png",
        fn: 'gotoUser'
      },
      {
        admin: 1,
        name: "我的",
        imgSrc: "../../../images/admin_acMine.png",
        fn: 'gotoMine'
      },
    ],
		statusBarHeight: app.globalData.statusBarHeight,
  

  },
	//意见反馈
	suggestion() {
		wx.navigateTo({
			url: './suggestion/suggestion'
		})
	},
	//关于我们
	aboutUs() {
		wx.navigateTo({
			url: './aboutUs/aboutUs'
		})
	},
  gotoLearn() {
    wx.redirectTo({
      url: '../learn/learn',
    })
  },
  gotoScore() {
    wx.redirectTo({
      url: '../score/score',
    })
  },
  gotoResource() {
    wx.redirectTo({
      url: '../resource/resource',
    })
  },
  gotoUser() {
    wx.redirectTo({
      url: '../user/user',
    })
  },
  gotoMine() {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  onLoad(){
		wx.hideHomeButton();
    this.setData({
      adminInfo: app.globalData.adminInfo
    })
  },
	signOut() {
		wx.showModal({
			title: '提示',
			content: '您确定要退出吗',
			success(res) {
				if (res.confirm) {
					app.fetch(Api.signOut, {
						username: app.globalData.user
					}, "GET", res => {
						console.log(res)
						if (res.statusCode == 200) {
							wx.redirectTo({
								url: '../../../pages/index/index',
							})
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}
})