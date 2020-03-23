import Api from "../../api/api.js";
import * as echarts from '../../../ec-canvas/echarts';
const app = getApp()
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
//及格率和均分图数据
var avgChart = null;
var nameArr = [];
var avgArr = [];
var passArr = [];
//优良率数据
var wellChart = null;
var youArr = [];
var liangArr = [];
var zhongArr = [];
var guanArr = [];
Page({

  data: {
    //路由数据
    navData: [{
        name: "教学",
        admin: 1,
        imgSrc: "../../../images/admin_teacher.png",
        fn: 'gotoLearn'
      },
      {
        name: "成绩",
        admin: 1,
        imgSrc: "../../../images/admin_acScore.png",
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
    grad: [], //年级选择数据
    scrollIndex: "a", //当前年级
    scrollFlag: false, //选择年级框
    //图表显示开关
    analysisData: {
      flag: false,
      fn: "showanalysisTable",
    },
    activeIndex: 0, //echarts当前选择项
    examList: [], //考试列表 
    avgChart: {
      lazyLoad: true //平均分图
    },
		wellChart: {
			lazyLoad: true //及格率图
		},

  },
  onLoad() {
		this.init_avgChart()
    this.setInfo();
  },
	onUnload(){
		wellChart = null
	},
  //点击按钮切换
  btnClick(e) {
		if (e.currentTarget.dataset.index == this.data.activeIndex) return
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
		if (e.currentTarget.dataset.index == 0) {
			avgChart.setOption(this.getLineOption(nameArr, avgArr, "分数")); //获取新数据
		}
		if (e.currentTarget.dataset.index==2){
			avgChart.setOption(this.getLineOption(nameArr, passArr, "及格率")); //获取新数据
		}
		if (e.currentTarget.dataset.index == 1){
			this.init_wellChart()
		}
	}, 
	 //年级选择
	gardClick(e) {
		if (e.currentTarget.dataset.id == this.data.scrollIndex){
			this.setData({
				scrollFlag: false
			})
			return
		}
		youArr = [];
		liangArr = [];
		zhongArr = [];
		guanArr = [];
		avgArr = [];
		wellChart = null;
		this.setData({
			scrollIndex: e.currentTarget.dataset.id,
			scrollFlag: false,
			activeIndex: 0
		})
		this.getExamList(e.currentTarget.dataset.index)
	},
  //获取年级列表
  getGradeList() {
		var uid = this.data.adminInfo.id.split("_").pop()
    app.fetch(Api.gradeList, {
			uid,
    }, "GET", res => {
			console.log(res)
			if(res.data.code == 200){
			//给年级加上字母标识
				var num = 97
				var arr = []
				res.data.data.grades.forEach((item) => {
					var obj = {};
					obj.text = item;
					var str = String.fromCharCode(num);
					obj.id = str
					num++;
					arr.push(obj)
				})
				this.setData({
					grad: arr,
					schoolId: res.data.data.schoolId
				})
				this.getExamList();
			}
    })
  },
  //获取均分及格率列表
  getExamList(index) {
		var str = index ? this.data.grad[index].text: this.data.grad[0].text
    app.fetch(Api.examList, {
			gradeName: str,
			schoolId: this.data.schoolId,
      pageNo: 1,
      pageSize: 5,
		}, "GET", res => {
			console.log(res)
			if(res.data.code == 200){
				var arr = res.data.data.examList
				var num = 0;
				var _data = [];
				var proportion = 3;
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
					examListArr: _data,
					examList: res.data.data.examList
				})
				avgArr = [];
				nameArr = [];
				passArr = [];

				youArr = res.data.data.excellentRateData.level1;
				liangArr = res.data.data.excellentRateData.level2;
				zhongArr = res.data.data.excellentRateData.level3;
				guanArr = res.data.data.excellentRateData.level4;
				arr.forEach((item) => {
					avgArr.push(item.gradeAvgScore);
					nameArr.push(item.examName);
					passArr.push(item.passNumLv);
				})
				avgChart.setOption(this.getLineOption(nameArr, avgArr, "分数")); //获取新数据
			}
  
    })
  },
	//进去考试分析页面
	toAnalysis(e) {
		var index = e.currentTarget.dataset.index;
		var str = JSON.stringify(this.data.examList[index], ["examName", "exam_date", "passNumLv", "gradeAvgScore", "max", "examInfoId"])
		wx.navigateTo({
			url: './analysis/analysis?exam=' + str,
		})
	},
  //分析表格开关
  showanalysisTable() {
    this.data.analysisData.flag = !this.data.analysisData.flag;
    this.setData({
      analysisData: this.data.analysisData
    })
  },
  //年级选择是否展示
  scrollFlagChange() {
    this.setData({
      scrollFlag: !this.data.scrollFlag
    })
  },


  //将全局数据设置为局部数据
  setInfo() {
    var obj = app.globalData.adminInfo;
    obj.statusBarHeight = app.globalData.statusBarHeight
    this.setData({
      adminInfo: obj,
    })
		console.log(this.data.adminInfo)
  },
	//优良率柱状图
	init_wellChart() {
		if(wellChart) return
		this.wellChartComponnet = this.selectComponent('#wellChart');
		this.wellChartComponnet.init((canvas, width, height) => {
			// 初始化图表
			wellChart = echarts.init(canvas, null, {
				width: width,
				height: height,
			});
			wellChart.setOption(this.getWellOption()); //获取新数据
			return wellChart;
		});
	},
	getWellOption() {
		var option = {
			color: ["#4d5673", "#e2a123", "#4ceb8c", "#73ffe4"],
			textStyle: {
				color: "#fff",
			},
			// tooltip: {
			// 	position: function (pos, params, dom, rect, size) {
			// 		return [pos[0] - 35, '10%'];
			// 	}
			// },
			grid: {
				show: true,
				top: 30,
				bottom: 75,
				left: 40,
				right: 0,
				borderColor: "transparent",
				backgroundColor: bgcolor,
			},
			xAxis: {
				type: 'category',
				axisLine: {
					lineStyle: {
						color: "#697082",
					}
				},
				axisLabel: {
					align: "center",
					fontSize: 10,
					formatter: function (params) {
						var newParamsName = "";// 最终拼接成的字符串
						var paramsNameNumber = params.length;// 实际标签的个数
						var provideNumber = 7;// 每行能显示的字的个数
						var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
						/**
						 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
						 */
						// 条件等同于rowNumber>1
						if (paramsNameNumber > provideNumber) {
							/** 循环每一行,p表示行 */
							for (var p = 0; p < rowNumber; p++) {
								var tempStr = "";// 表示每一次截取的字符串
								var start = p * provideNumber;// 开始截取的位置
								var end = start + provideNumber;// 结束截取的位置
								// 此处特殊处理最后一行的索引值
								if (p == rowNumber - 1) {
									// 最后一次不换行
									tempStr = params.substring(start, paramsNameNumber);
								} else {
									// 每一次拼接字符串并换行
									tempStr = params.substring(start, end) + "\n";
								}
								newParamsName += tempStr;// 最终拼成的字符串
							}
						} else {
							// 将旧标签的值赋给新标签
							newParamsName = params;
						}
						//将最终的字符串返回
						return newParamsName
					}
				},
				axisTick: {
					show: false,
					splitNumber: 10,
					alignWithLabel: true,
					interval: 0,
				},
				data: nameArr
			},
			yAxis: {
				type: 'value',
				max: 100,
				name: "比率",
				nameTextStyle: {
					color: "#a4a4ae"
				},
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
			legend: {
				left: 'center',
				bottom: 0,
				textStyle: {
					color: "#fff",
				},
				data: ['优秀', '良好', '中等', '关注']
			},
			series: [{
				name: '关注',
				barMaxWidth:30,
				type: 'bar',
				stack: '总量',
				data: guanArr
			},
			{
				name: '中等',
				barMaxWidth: 30,
				type: 'bar',
				stack: '总量',
				data: zhongArr
			},
			{
				name: '良好',
				barMaxWidth: 30,
				type: 'bar',
				stack: '总量',
				data: liangArr
			},
			{
				name: '优秀',
				barMaxWidth: 30,
				type: 'bar',
				stack: '总量',
				data: youArr
			},
			]
		};
		return option
	},


  //均分折线图
  init_avgChart() {
    this.avgChartComponnet = this.selectComponent('#avgChart');
    this.avgChartComponnet.init((canvas, width, height) => {
      // 初始化图表
      avgChart = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
			this.getGradeList();
      return avgChart;
    });
		
  },

  getLineOption(xData, data,yName) {
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
        bottom: 60,
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
          fontSize: 10,
					formatter: function (params) {
						var newParamsName = "";// 最终拼接成的字符串
						var paramsNameNumber = params.length;// 实际标签的个数
						var provideNumber = 7;// 每行能显示的字的个数
						var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
						/**
						 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
						 */
						// 条件等同于rowNumber>1
						if (paramsNameNumber > provideNumber) {
							/** 循环每一行,p表示行 */
							for (var p = 0; p < rowNumber; p++) {
								var tempStr = "";// 表示每一次截取的字符串
								var start = p * provideNumber;// 开始截取的位置
								var end = start + provideNumber;// 结束截取的位置
								// 此处特殊处理最后一行的索引值
								if (p == rowNumber - 1) {
									// 最后一次不换行
									tempStr = params.substring(start, paramsNameNumber);
								} else {
									// 每一次拼接字符串并换行
									tempStr = params.substring(start, end) + "\n";
								}
								newParamsName += tempStr;// 最终拼成的字符串
							}
						} else {
							// 将旧标签的值赋给新标签
							newParamsName = params;
						}
						//将最终的字符串返回
						return newParamsName
					}
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
				name: yName,
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

 

  // 模拟tabar
  gotoLearn() {
    wx.redirectTo({
      url: '../learn/learn',
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