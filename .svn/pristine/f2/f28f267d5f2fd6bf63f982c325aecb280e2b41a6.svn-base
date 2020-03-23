import * as echarts from '../../../../ec-canvas/echarts';
import Api from "../../../api/api.js"
const app = getApp()
//折线图数据
var classArr = []
var gradeArr = []
var stuArr = []
var xArr = []
var Chart = null;

Page({
	data: {
		singleExamAnalysis: [], //单次考试分析数组
		scoreList:[],
		scoreFlag: false,
		ecLine: {
			lazyLoad: true // 延迟加载
		}
	},
	//跳转到考试排名
	toRank(e) {
		wx.navigateTo({
			url: `../rank/rank?listitem=${JSON.stringify(e.currentTarget.dataset.listitem)}`
		})
	},
	//是否显示表格
	scoreTableShow() {
		this.setData({
			scoreFlag: !this.data.scoreFlag
		})
	},
	//页面加载
	onLoad() {
		this.setInfo()
		this.echartsComponnet = this.selectComponent('#mychart');
		this.getStuScore()
	},
	//页面卸载
	onUnload: function () {
		classArr = []
		gradeArr = []
		stuArr = []
		xArr = []
		Chart = null;
	},
	//设置信息
	setInfo() {
		this.setData({
			studentInfo: app.globalData.studentInfo,
			parentInfo: app.globalData.parentInfo,
		})
	},
	//获取考试成绩
	getStuScore() {
		console.log(this.data.parentInfo)
		app.fetch(Api.stuScore, {
			gradeNo: this.data.studentInfo.gradeName,
			analysisStuNum: this.data.studentInfo.stuNo,
		}, "GET", res => {
			if(res.data.code == 200){
				var arr = res.data.data
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
					singleExamAnalysis: arr,
					scoreList: _data
				})
				arr.forEach((item) => {
					xArr.push(item.examName)
					classArr.push(item.classAvgScore)
					gradeArr.push(item.gradeAvgScore)
					stuArr.push(item.studentScore)
				})
				this.init_echarts()
			}
		})
	},
	//初始化图表
	init_echarts: function () {
		this.echartsComponnet.init((canvas, width, height) => {
			// 初始化图表
			Chart = echarts.init(canvas, null, {
				width: width,
				height: 150
			});
			// Chart.setOption(this.getOption());
			this.setOption(Chart);
			// 注意这里一定要返回 chart 实例，否则会影响事件处理等
			return Chart;
		});
	},
	setOption: function (Chart) {
		Chart.clear();  // 清除
		Chart.setOption(this.getOption());  //获取新数据
	},
	getOption: function () {
		// 指定图表的配置项和数据


		var option = {
			//提示框
			color: ["#1c8ff2", "#925dff", "#47cc66"],
			tooltip: {
				trigger: "axis",
				position: function (pos, params, dom, rect, size) {
					return [pos[0] - 35, '10%'];
				}
			},
			//网格区域
			grid: {
				show: true,
				top: 10,
				bottom: 40,
				borderColor: "transparent",
			},
			textStyle: {
				color: "#000",
			},
			legend: {
				left: 'center',
				bottom: -25,
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: xArr,
				axisTick: {
					alignWithLabel: true,
					inside: true
				},
				axisLine: {
					lineStyle: {
						color: "#b5bfcd",
					},
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
			},
			yAxis: {
				x: 'center',
				type: 'value',
				axisTick: {
					show: false
				},
				splitLine: {
					lineStyle: {
						color: "#b5bfcd"
					}
				},
				axisLine: {
					lineStyle: {
						color: "#b5bfcd",
					},
				},
			},
			series: [{
				name: '班级均分',
				type: 'line',
				symbol: "diamond",
				data: classArr,
			},
			{
				name: '年级均分',
				type: 'line',
				symbol: "rect",
				data: gradeArr,
			},
			{
				name: '我的分数',
				type: 'line',
				data: stuArr,
			}
			]
		};

		return option;
	}
})