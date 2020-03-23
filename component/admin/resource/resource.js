import Api from "../../api/api.js";
import * as echarts from '../../../ec-canvas/echarts';
//资源饼状图数据
var resourceTeacher = 0;
var resourceStu = 0;
var resourceParent = 0;
var resourcePie = null;
//资源柱状图数据
var resourceSubName = [];
var resourceSubCount = [];
var resourceBar = null;
//试题饼状图数据
var examTeacher = 0;
var examStu = 0;
var examParent = 0;
//试题柱状图数据
var examSubName = [];
var examSubCount = [];
//柱状图背景
var bgcolor = {
	type: 'linear',
	x: 0,
	x2: 1,
	colorStops: [{
		offset: 0,
		color: "#373e51"
	},
	{
		offset: 0.2,
		color: "#373e51"
	},
	{
		offset: 0.2,
		color: '#3c445e'
	},
	{
		offset: 0.35,
		color: '#3c445e'
	},
	{
		offset: 0.35,
		color: '#373e51'
	},
	{
		offset: 0.5,
		color: '#373e51'
	},
	{
		offset: 0.5,
		color: '#3c445e'
	},
	{
		offset: 0.65,
		color: '#3c445e'
	},
	{
		offset: 0.65,
		color: '#373e51'
	},
	{
		offset: 0.8,
		color: '#373e51'
	},
	{
		offset: 0.8,
		color: '#3c445e'
	},
	{
		offset: 1,
		color: '#3c445e'
	},
	],
	global: false // 缺省为 false
}

const app = getApp()


Page({
  data: {
    navData: [{
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
        imgSrc: "../../../images/admin_acResource.png",
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
        imgSrc: "../../../images/admin_mine.png",
        fn: 'gotoMine'
      },
    ],
    tab: ["资源", "试题"],
    tabIndex: 0,
    statusBarHeight: app.globalData.statusBarHeight,

		resPie: {
			lazyLoad: true,
			disableTouch:true
		},
		resBar: {
			lazyLoad: true 
		},
		// 资源及试题总量
		numData: {
			flag: false,
			fn: "showNumTable",
			tableData: []
		},
    //资源学科
    subData: {
      flag: false,
      fn: "showSubTable",
      tableData: []
    },
    //试题学科
    examSubData: {
      flag: false,
      fn: "showExamSubTable",
      tableData: []
    },

  },
	// 选项卡切换
  tabChange(e) {
		if (e.currentTarget.dataset.index == this.data.tabIndex) return 
    this.setData({
			tabIndex: e.currentTarget.dataset.index
    })
		if (e.currentTarget.dataset.index == 1){
			resourcePie.setOption(this.getResPieOption(examTeacher, examStu, examParent));
			resourceBar.setOption(this.getResBarOption(examSubName, examSubCount)); 
		}
		if (e.currentTarget.dataset.index == 0) {
			resourcePie.setOption(this.getResPieOption(resourceTeacher, resourceStu, resourceParent));
			resourceBar.setOption(this.getResBarOption(resourceSubName, resourceSubCount)); 
		}
  },	

  // 资源表格开关
  showNumTable() {
    var flag = !this.data.numData.flag
    var data = Object.assign({}, this.data.numData, {
      flag: flag
    })
    this.setData({
      numData: data
    })
  },
  showSubTable() {
    var flag = !this.data.subData.flag
    var data = Object.assign({}, this.data.subData, {
      flag: flag
    })
    this.setData({
      subData: data
    })
  },


  //将全局数据设置为局部数据
  setInfo() {
		var obj = app.globalData.adminInfo;
		obj.statusBarHeight = app.globalData.statusBarHeight
    this.setData({
      adminInfo: obj,
    })
  },
  //获取资源以及试题数量
  getResource() {
    app.fetch(Api.resource, {
      officeId: this.data.adminInfo.officeId,
    }, "GET", res => {
			if(res.data.code == 200){
				var arr = JSON.parse(JSON.stringify(res.data.data));
				var obj = {
					rolename: "总计"
				}
				obj.resource = res.data.data[0].resource + res.data.data[1].resource + res.data.data[2].resource;
				obj.quz = res.data.data[0].quz + res.data.data[1].quz + res.data.data[2].quz;
				arr.unshift(obj)
				var data = Object.assign({}, this.data.numData, {
					tableData: arr
				})
				this.setData({
					numData: data,
				})
				console.log(res)
				resourceTeacher = res.data.data[0].resource;
				resourceStu = res.data.data[1].resource;
				resourceParent = res.data.data[2].resource;
				examTeacher = res.data.data[0].quz;
				examStu = res.data.data[1].quz;
				examParent = res.data.data[2].quz;
				this.init_resPie()
			}

    })
  },
  //获取资源按学科	
  getSubResource() {
    app.fetch(Api.resourceSubj, {
			officeId: this.data.adminInfo.officeId,
    }, "GET", res => {
			if(res.data.code == 200){
				var arr = res.data.data
				var num = 0;
				var _data = [];
				var proportion = 5;
				for (let i = 0; i < arr.length; i++) {
					if (i % proportion == 0 && i != 0) {
						_data.push(arr.slice(num, i));
						num = i;
					}
					if ((i + 1) == arr.length) {
						_data.push(arr.slice(num, (i + 1)));
					}
				}
				var data = Object.assign({}, this.data.subData, {
					tableData: _data
				})
				this.setData({
					subData: data
				})
				resourceSubName = [];
				resourceSubCount = [];
				arr.forEach((item) => {
					resourceSubName.push(item.subjectName)
					resourceSubCount.push(item.counter)
				})
				this.init_resBar();
			}
  
    })
  },
	
  //获取试题按学科
  quzSubj() {
		app.fetch(Api.quzSubj, {
			officeId: this.data.adminInfo.officeId,
    }, "GET", res => {
			if(res.data.code == 200){
				var arr = res.data.data
				var num = 0;
				var _data = [];
				var proportion = 5;
				for (let i = 0; i < arr.length; i++) {
					if (i % proportion == 0 && i != 0) {
						_data.push(arr.slice(num, i));
						num = i;
					}
					if ((i + 1) == arr.length) {
						_data.push(arr.slice(num, (i + 1)));
					}
				}
				var data = Object.assign({}, this.data.examSubData, {
					tableData: _data
				})
				this.setData({
					examSubData: data
				})
				examSubName = [];
				examSubCount = [];
				arr.forEach((item) => {
					examSubName.push(item.subjectName)
					examSubCount.push(item.quz)
				})
			}
    })
  },



  onLoad() {
    this.setInfo();
    this.getResource();
    this.getSubResource();
		this.quzSubj();
  },
	//资源饼状图
	init_resPie() {
		this.resPieComponnet = this.selectComponent('#resPie');
		this.resPieComponnet.init((canvas, width, height) => {
			// 初始化图表
			resourcePie = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			resourcePie.setOption(this.getResPieOption(resourceTeacher, resourceStu, resourceParent)); //获取新数据
			return resourcePie;
		});	
	},
//饼状图属性
	getResPieOption(teacher,stu,parent){
		var option = {
			//取色
			color: [
				"#676c7b", "#6ab4f5", "#73ffe4", "#fff",
			],
			//图例属性
			legend: {
				orient: "vertical",
				align: "left",
				icon: 'circle',
				x: 'right',
				y: "middle",
				selectedMode: false,
				textStyle: {
					color: "#fff"
				}
			},
			// 饼图属性
			series: [{
				type: 'pie',
				radius: ['55%', '75%'],
				center:["35%","40%"],
				hoverAnimation: false,
				legendHoverLink: false,
				label: {
					show: true,
					position: 'inside',
					formatter: "{d}%",
				},

				data: [{
					value: teacher || "",
					name: '教师'
				},
				{
					value: stu || "",
					name: '学生'
				},
				{
					value: parent || "",
					name: '家长'
				},
				]
			}]
		};
		return option
	},

	//资源柱状图
	init_resBar() {
		this.resBarComponnet = this.selectComponent('#resBar');
		this.resBarComponnet.init((canvas, width, height) => {
			// 初始化图表
			resourceBar = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			resourceBar.setOption(this.getResBarOption(resourceSubName, resourceSubCount)); //获取新数据
			return resourceBar;
		});
	},
	getResBarOption(xArr,yArr){
		var zoom 
		zoom = xArr.length > 8 ?  [{
			showDetail: false,
			borderColor: "#47516f",
			zoomLock: true,
			type: 'slider',
			show: true,
			bottom: 0,
			top: "90%",
			start: 0,
			end: 20 //初始化滚动条
		}]:"";
		var option = {
			textStyle: {
				color: "#fff",
			},
			tooltip: {
				position: function (pos, params, dom, rect, size) {
					return [pos[0] - 35, '10%'];
				}
			},

			dataZoom: zoom,
			grid: {
				show: true,
				top:30,
				bottom:50,
				left:40,
				right:0,
				borderColor: "transparent",
				backgroundColor: bgcolor,
			},
			xAxis: {
				type: 'category',
				axisLine: {
					lineStyle: {
						color: "#697082",
					},
				},
				axisTick: {
					show: false,
					splitNumber: 10,
					alignWithLabel: true,
					interval: 0,
				},

				data: xArr
			},
			yAxis: {
				type: 'value',
				name: "数量",
				splitLine: {
					lineStyle: {
						color: "#47516f"
					}
				},
				axisTick: {
					show: false
				},
				axisLine: {
					lineStyle: {
						color: "#697082",
					},
				},
			},
			series: [{
				data: yArr,
				type: 'bar',
				barWidth: 12,
				itemStyle: {
					color: function (params) {
						var colorList = [
							"#f2513f", '#7f3454'
						]
						var num = params.dataIndex % 2 == 0 ? 0 : 1
						return colorList[num]
					}	
				}
			}]
		};
		return option
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

})