//app.js
App({
  onLaunch: function() {
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     } else {

    //     }
    //   }
    // })
  },
  globalData: {
		apiHost: "https://parents.mdjedu.org.cn",
    parentInfo: "",
    studentInfo: '',
    adminInfo: "",
    adminRole: "",
		statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'], //异形屏适配

  },
  //请求的封装
  fetch(url, data, method,callBack) {
    if (method == "GET") {
      var header = {
        'Content-Type': 'application/json'
      }
    } else if (method == "POST") {
      var header = {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
    return wx.request({
      url,
      data: data,
      method: method,
      header: header,
      success: res => { callBack(res)} 
    })
  },
})
