import * as echarts from '../../../ec-canvas/echarts';
const app = getApp();
//在线时长数据
var stuTimeArr = [];
var teacherTimeArr = [];
var parentTimeArr = [];
var xTimeArr = [];
var timeLine = null;
//平均活跃数据
var stuActArr = [];
var teacherActArr = [];
var parentActArr = [];
var xActArr = [];
var actLine = null;
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
import Api from "../../api/api.js";
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
        imgSrc: "../../../images/admin_resource.png",
        fn: 'gotoResource'
      },
      {
        admin: 1,
        name: "用户",
        imgSrc: "../../../images/admin_acUser.png",
        fn: 'gotoUser'
      },
      {
        admin: 1,
        name: "我的",
        imgSrc: "../../../images/admin_mine.png",
        fn: 'gotoMine'
      },
    ],
    statusBarHeight: app.globalData.statusBarHeight,
		registerInfo:{},
    activeData:{
      flag: false,
      fn: "showActiveTable",
      tableData:[
      ]
    },
    onlineTimeData: {
      flag: false,
      fn: "showTimeTable",
      tableData: [
      ]
    },
		timeLine: {
			lazyLoad: true // 延迟加载
		},
		actLine: {
			lazyLoad: true // 延迟加载
		}
  },
	onLoad() {
		this.init_actLine();
		this.init_timeLine();
		this.setInfo();
		this.getLoginNum();
		this.getActiveRate();
		this.getBehavior()
	},

	//表格开关
  showTimeTable() {
    var flag = !this.data.onlineTimeData.flag
    var data = Object.assign({}, this.data.onlineTimeData, { flag: flag })
    this.setData({
      onlineTimeData: data
    })
  },
  showActiveTable() {
    var flag = !this.data.activeData.flag
    var data = Object.assign({}, this.data.activeData, { flag: flag })
    this.setData({
      activeData: data
    })
  },
	//注册总人数
	getLoginNum(){
		app.fetch(Api.loginNum, {
			officeId: this.data.adminInfo.officeId,
		}, "GET", res => {
				this.setData({
					registerInfo:res.data.data
				})
		})
	},
	//获取活跃度
	getActiveRate() {
		app.fetch(Api.activeRate, {
			officeId: this.data.adminInfo.officeId,
		}, "GET", res => {
			if(res.data.code == 200){
				var tableData = {};
				tableData.yearList = res.data.data.categories;
				tableData.parentList = res.data.data.parentActiveList;
				tableData.teacherList = res.data.data.teaActiveList;
				tableData.studentList = res.data.data.stuActiveList;
				var data = Object.assign({}, this.data.activeData, { tableData: tableData })
				this.setData({
					activeData: data
				})
				xActArr = res.data.data.categories;
				parentActArr = res.data.data.parentActiveList;
				teacherActArr = res.data.data.teaActiveList;
				stuActArr = res.data.data.stuActiveList;
				if (!actLine) return
				actLine.setOption(this.getOption(teacherActArr, stuActArr, parentActArr, xActArr, "比率"));  //获取新数据
			}

		})
	},
	//用户在线时长
	getBehavior() {
		app.fetch(Api.behavior, {
			officeId: this.data.adminInfo.officeId,
		}, "GET", res => {
			if(res.data.code == 200){
				var tableData = {};
				tableData.yearList = res.data.data.yearList;
				tableData.parentList = res.data.data.parentAvgList;
				tableData.teacherList = res.data.data.teaAvgList;
				tableData.studentList = res.data.data.stuAvgList;
				var data = Object.assign({}, this.data.onlineTimeData, { tableData: tableData })
				this.setData({
					onlineTimeData: data
				})
				xTimeArr = res.data.data.yearList;
				parentTimeArr = res.data.data.parentAvgList;
				teacherTimeArr = res.data.data.teaAvgList;
				stuTimeArr = res.data.data.stuAvgList;
				if (!timeLine) return
				timeLine.setOption(this.getOption(teacherTimeArr, stuTimeArr, parentTimeArr, xTimeArr));  //获取新数据
			}
		})
	},
	//在线时长折线图
	init_timeLine: function () {
		this.timeLineComponnet = this.selectComponent('#timeLine');
		this.timeLineComponnet.init((canvas, width, height) => {
			// 初始化图表
			timeLine = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			timeLine.setOption(this.getOption(teacherTimeArr, stuTimeArr, parentTimeArr, xTimeArr));  //获取新数据
			return timeLine;
		});
	},
	//平均活跃折线图
	init_actLine: function () {
		this.actLineComponnet = this.selectComponent('#actLine');
		this.actLineComponnet.init((canvas, width, height) => {
			// 初始化图表
			actLine = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			actLine.setOption(this.getOption(teacherActArr, stuActArr, parentActArr, xActArr, "比率"));  //获取新数据
			return actLine;
		});
	},

	//折线图option配置
	getOption(teacher,stu,parent,xArr,yName){
		var option = {
			color: ["#7adfd5", "#4065ee", "#ede124"],
			//提示框
			tooltip: {
				trigger: "axis",
				position: function (pos, params, dom, rect, size) {
					return [pos[0] - 35, '10%'];
				}
			},
			//网格区域
			grid: {
				show: true,
				top: 0,
				bottom: 50,
				right:0,
				borderColor: "transparent",
				backgroundColor: bgcolor
			},
			textStyle: {
				color: "#fff",
			},
			legend: {
				left: 'center',
				bottom:0,
				textStyle: {
					color: "#fff",
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: xArr,
				axisTick: {
					alignWithLabel: true,
					inside: true
				},
				axisLabel: {
					align: "center"
				},
				axisLine: {
					lineStyle: {
						color: "#697082",
					},
				},
			},
			yAxis: {
				x: 'center',
				type: 'value',
				name: yName||"小时",
				nameTextStyle: {
					color: "#fff"
				},
				nameRotate:0,
				nameGap:5,
				nameLocation:"center",
				axisTick: {
					show: false
				},
				splitLine: {
					lineStyle: {
						color: "#47516f"
					}
				},
				axisLine: {
					lineStyle: {
						color: "#697082",
					},
				},
				axisLabel: {
					formatter: function () {
						return "";
					}
				}
			},
	
			series: [
				{
					name: '教师',
					type: 'line',
					smooth: true,
					data: teacher,
					lineStyle : {
						width  : 3
					},
				},
			{
				name: '学生',
				type: 'line',
				smooth: true,
				symbol: "rect",
				data: stu,
				lineStyle: {
					width: 3
				},
			},
				{
					name: '家长',
					type: 'line',
					smooth: true,
					symbol: "diamond",
					data: parent,
					lineStyle: {
						width: 3
					},
				}
			]
		};
		return option
	},





	//将全局数据设置为局部数据
	setInfo() {
		var obj = app.globalData.adminInfo;
		obj.statusBarHeight = app.globalData.statusBarHeight
		this.setData({
			adminInfo: obj,
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


})