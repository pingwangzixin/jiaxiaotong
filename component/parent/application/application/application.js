const app = getApp()
Page({

  data: {
    navData: [
      {
        parent: 1,
        name: "应用",  //文本
        current: 1,
        imgSrc: "../../../../images/acApp.png",
        fn: 'gotoApp'   //对应处理函数
      },
      {
        parent: 1,
        name: "消息",
        imgSrc: "../../../../images/msg.png",
        fn: 'gotoMsg'
      },
      {
        parent: 1,
        name: "我的",
        imgSrc: "../../../../images/mine.png",
        fn: 'gotoMine'
      },
    ],
  },
	onLoad(){
		wx.hideHomeButton();
	},
  gotoMsg() {
    wx.redirectTo({
			url: '../../msg/msg/msg',
    });
  },
  gotoMine() {
    wx.redirectTo({
			url: '../../mine/mine/mine',
    });
  },
  homeWork(){
    wx.navigateTo({
      url: '../homework/homework',
    });
  },
	wrong() {
		wx.navigateTo({
			url: '../wrong/wrong',
		});
	},
  class(){
    wx.navigateTo({
      url: '../classMore/classMore',
    });
  },
	testScore(){
		wx.navigateTo({
			url: '../score/score',
		});
	}
})