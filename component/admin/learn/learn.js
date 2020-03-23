// component/admin/learn/learn.js
import * as echarts from '../../../ec-canvas/echarts';
const app = getApp();
import Api from "../../api/api.js";
//课堂折线图数据
var lessonMonthArr = [];
var lessonCountArr = [];
var lessonChart = null;
//作业折线图数据
var workMonthArr = [];
var workCountArr = [];
var workChart = null;
//教案折线图数据
var planMonthArr = [];
var personArr = [];
var teamArr = [];
var planLine = null;
//教研数据
var activeMonthArr = [];
var activeCountArr = [];
var activeChart = null;

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

Page({
  data: {
		schoolInfo: app.globalData.schoolInfo,
    //tabar 数据
    navData: [{
        name: "教学",
        admin: 1,
        imgSrc: "../../../images/admin_acTeacher.png",
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
        imgSrc: "../../../images/admin_mine.png",
        fn: 'gotoMine'
      },
    ],
    tab: ["课堂", "作业", "教案", "教研活动"], //选项卡列表
    tabIndex: 0, //选项卡的默认项
    //教案数据
		personData: [],
    planTotal: 0,
		planLine: {
			lazyLoad: true
		},
    //教研数据
		activeData:[],
    activeTotal: 0,
		activeLine: {
			lazyLoad: true 
		},
    // 课堂数据
    lessonData: [],
    lessonTotal: 0,
    lessonLine: {
      lazyLoad: true 
    },
    //作业数据
    workData: [],
    workTotal: 0,
    workLine: {
      lazyLoad: true 
    }
  },
	onLoad() {
		this.init_lessonChart()
		this.setInfo();
		this.getLesson();
		this.init_workEcharts()
	},
  tabChange(e) {
    if (e.target.id == this.data.tabIndex) return
    this.setData({
      tabIndex: e.target.id
    })
    switch (e.target.id) {
      case "1":
        this.getWork();
        break;
				case "2":
				this.getteachingPlan();
				break;
				case "3":
				this.getteachingActivity();
				break;
    }
  },
  //将全局数据设置为局部数据
  setInfo() {
    var obj = app.globalData.adminInfo;
    obj.statusBarHeight = app.globalData.statusBarHeight
    this.setData({
      adminInfo: obj,
    })
  },
  //课堂数据
  getLesson() {
    app.fetch(Api.lessonRecordData, {
      officeId: this.data.adminInfo.officeId,
      level: ""
    }, "GET", res => {
     if(res.data.code == 200){
			 var arr = res.data.data.monthData
			 var num = 0;
			 var _data = [];
			 var proportion = 4;
			 for (let i = 0; i < arr.length; i++) {
				 if (i % proportion == 0 && i != 0) {
					 _data.push(arr.slice(num, i));
					 num = i;
				 }
				 if ((i + 1) == arr.length) {
					 _data.push(arr.slice(num, (i + 1)));
				 }
			 }
			 this.setData({
				 lessonData: _data,
				 lessonTotal: res.data.data.total
			 })
			 lessonMonthArr = [];
			 lessonCountArr = [];
			 arr.forEach((item) => {
				 lessonMonthArr.push(item.month + "月");
				 lessonCountArr.push(item.count);
			 })
			 if (!lessonChart) return
			 lessonChart.setOption(this.getLineOption(lessonMonthArr, lessonCountArr)); //获取新数据
		 }
    
    })
  },
  //获取作业数据
  getWork() {
    if (this.data.workData.length !== 0) return
    app.fetch(Api.homeworkData, {
      officeId: this.data.adminInfo.officeId,
      level: ""
    }, "GET", res => {
      if(res.data.code == 200){
				var arr = res.data.data.monthData
				var num = 0;
				var _data = [];
				var proportion = 4;
				for (let i = 0; i < arr.length; i++) {
					if (i % proportion == 0 && i != 0) {
						_data.push(arr.slice(num, i));
						num = i;
					}
					if ((i + 1) == arr.length) {
						_data.push(arr.slice(num, (i + 1)));
					}
				}
				this.setData({
					workData: _data,
					workTotal: res.data.data.total
				})
				workMonthArr = [];
				workCountArr = [];
				arr.forEach((item) => {
					workMonthArr.push(item.month + "月");
					workCountArr.push(item.count);
				})
				this.init_workEcharts()
			}

    })

  },
  //获取教案数据
  getteachingPlan() {
		if (this.data.personData.length !== 0) return
    app.fetch(Api.teachingPlan, {
      officeId: this.data.adminInfo.officeId,
      level: ""
    }, "GET", res => {
      if(res.data.code == 200){
				this.setData({
					personData: res.data.data.personMonthData,
					teamData: res.data.data.teamMonthData,
					planTotal: res.data.data.total
				})
				planMonthArr = [];
				personArr = [];
				teamArr = [];
				res.data.data.personMonthData.forEach((item, index) => {
					planMonthArr.push(item.month + "月");
					personArr.push(item.count);
					teamArr.push(res.data.data.teamMonthData[index].count);
				})
				this.init_planLine()
			}

    })

  },
  //教研活动
  getteachingActivity() {
			if (this.data.activeData.length !== 0) return
    app.fetch(Api.teachingActivity, {
      officeId: this.data.adminInfo.officeId,
      level: ""
    }, "GET", res => {
			if(res.data.code == 200){
				var arr = res.data.data.monthData
				var num = 0;
				var _data = [];
				var proportion = 4;
				for (let i = 0; i < arr.length; i++) {
					if (i % proportion == 0 && i != 0) {
						_data.push(arr.slice(num, i));
						num = i;
					}
					if ((i + 1) == arr.length) {
						_data.push(arr.slice(num, (i + 1)));
					}
				}
				this.setData({
					activeData: _data,
					activeTotal: res.data.data.total
				})
				activeMonthArr = [];
				activeCountArr = [];
				arr.forEach((item) => {
					activeMonthArr.push(item.month + "月");
					activeCountArr.push(item.count);
				})
				this.init_activeEcharts()
			}

    })
  },

  //课堂折线图
  init_lessonChart() {
    this.lessonChartComponnet = this.selectComponent('#lessonChart');
    this.lessonChartComponnet.init((canvas, width, height) => {
      // 初始化图表
      lessonChart = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
      lessonChart.setOption(this.getLineOption(lessonMonthArr, lessonCountArr)); //获取新数据
      return lessonChart;
    });
  },
  //作业折线图
  init_workEcharts() {
    this.workEchartsComponnet = this.selectComponent('#workchart');
    this.workEchartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      workChart = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
      workChart.setOption(this.getLineOption(workMonthArr, workCountArr)); //获取新数据
      return workChart;
    });
  },
	//教案折线图
	init_planLine: function () {
		this.planLineComponnet = this.selectComponent('#planLine');
		this.planLineComponnet.init((canvas, width, height) => {
			// 初始化图表
			planLine = echarts.init(canvas, null, {
				width: width,
				height: height
			});
			planLine.setOption(this.getPlanOption(teamArr, personArr, planMonthArr));  //获取新数据
			return planLine;
		});
	},

	//教研折线图
	init_activeEcharts() {
		this.activeEchartsComponnet = this.selectComponent('#activechart');
		this.activeEchartsComponnet.init((canvas, width, height) => {
			// 初始化图表
			activeChart = echarts.init(canvas, null, {
				width: width,
				height: height,
			});
			activeChart.setOption(this.getLineOption(activeMonthArr, activeCountArr)); //获取新数据
			return activeChart;
		});
	},
  getLineOption(xData, data) {
    var lineStyle = {
      color: {
        type: 'linear',
        x: 0,
        x2: 1,
        colorStops: [{
            offset: 0,
            color: "#4a5e6b" // 0% 处的颜色
          }, {
            offset: 0.5,
            color: '#5cd6cb' // 50% 处的颜色
          },
          {
            offset: 1,
            color: '#4a5e6b' // 100% 处的颜色
          },
        ],
        global: false // 缺省为 false
      },
      width: 4
    }
    var option = {
      color: ["#73ffe4"],
      tooltip: {
        trigger: "axis",
        position: function(pos, params, dom, rect, size) {
          return [pos[0] - 35, '10%'];
        }
      },
      grid: {
        show: true,
        borderColor: "transparent",
        backgroundColor: bgcolor,
        top: 30,
        bottom: 20,
        right: 0
      },
      textStyle: {
        color: "#fff",
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisTick: {
          alignWithLabel: true,
          inside: true
        },
        axisLabel: {
          align: "center",
          fontSize: 10
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
        name: "数量",
        nameTextStyle: {
          color: "#a4a4ae"
        },
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
      },
      series: [{
        type: 'line',
        smooth: true,
        data: data,
        lineStyle
      }]
    };

    return option;
  },

	//教案折线图option配置
	getPlanOption(team, person, xArr) {
		var option = {
			color: ["#2852ed", "#7de1d6"],
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
				top: 30,
				bottom: 45,
				right: 0,
				borderColor: "transparent",
				backgroundColor: bgcolor
			},
			textStyle: {
				color: "#fff",
			},
			legend: {
				left: 'center',
				bottom: 0,
				textStyle: {
					color: "#fff",
				},
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
				name: "份数",
				nameTextStyle: {
					color: "#fff"
				},
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
			},

			series: [
				{
					name: '集体教案',
					type: 'line',
					smooth: true,
					data: team,
					lineStyle: {
						width: 3
					},
				},
				{
					name: '个人教案',
					type: 'line',
					smooth: true,
					symbol: "rect",
					data: person,
					lineStyle: {
						width: 3
					},
				}
			]
		};
		return option
	},

































  gotoScore() {
    getCurrentPages().pop();
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