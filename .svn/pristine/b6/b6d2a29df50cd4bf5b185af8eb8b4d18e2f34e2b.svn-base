//index.js
//获取应用实例
const app = getApp()
import Api from "../../component/api/api.js"
Page({
  data: {
    user: "",
    psd: "",
    openId: ""

  },
  //用户绑定
  userBind(e) {
    app.fetch(Api.userBind, {
      openId: this.data.openId,
      userName: e.detail.value.user,
      password: e.detail.value.psd,
    }, "GET", res => {
      if (res.data.code == 200) {
				app.globalData.user = e.detail.value.user;
        if (res.data.data.userType == 4) {
          app.globalData.adminInfo = res.data.data;
          app.globalData.adminRole = res.data.data.userRole;
          wx.redirectTo({
            url: '../../component/admin/learn/learn',
          })
        }
        //家长端
        if (res.data.data.userType == 3) {
          app.globalData.studentInfo = res.data.data.children[0];
          app.globalData.parentInfo = res.data.data;
          wx.redirectTo({
            url: '../../component/parent/msg/msg/msg',
          })
        }
      }else{
				wx.showToast({
					title: '账号或者密码错误',
					icon: 'none',
					duration: 1500,
					mask: true,
				})
			}
    })

    this.setData({
      user: "",
      psd: "",
    })
  },



  //验证用户是否绑定
  onLoad: function() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.fetch(Api.isBind, {
          code: res.code
        }, "GET", res => {
          if (res.data.code == 200) {
            this.setData({
              openId: res.data.data.session.openid
            })
						console.log(res)
            if (res.data.data.isBind) {
							app.globalData.user = res.data.data.user.userMobile;
              //如果是领导端
              if (res.data.data.user.userType == 4) {
                app.globalData.adminInfo = res.data.data.user;
                app.globalData.adminRole = res.data.data.user.userRole;
                wx.redirectTo({
                  url: '../../component/admin/learn/learn',
                })
              }
              //家长端
              if (res.data.data.user.userType == 3) {
                app.globalData.studentInfo = res.data.data.user.children[0];
                app.globalData.parentInfo = res.data.data.user;
                wx.redirectTo({
                  url: '../../component/parent/msg/msg/msg',
                })
              }
            }
          } else {
            console.log("未绑定")
          }
        })
      }
    })
  },




  userCancel() {
    this.setData({
      user: ""
    })
  },
  psdCancel() {
    this.setData({
      psd: ""
    })
  }
})