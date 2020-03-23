const app = getApp()
Page({

	data: {
		showType: '',
		videoSrc: '',
		htmlSrc: ''
  },
  getDetail(items) {
		this.setData({
			showType: JSON.parse(items).type,
			videoSrc: JSON.parse(items).uri,
			htmlSrc: JSON.parse(items).uri.replace('.quz','.html')
		})
		console.log(this.data.htmlSrc)
  },
  onLoad(options){
    this.getDetail(options.items)
  },
})