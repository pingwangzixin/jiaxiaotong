const app = getApp();
import Api from "../../../api/api.js";
import * as echarts from '../../../../ec-canvas/echarts';
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
//班级名称
var xArr = [];
//及格率折线图数据
var passArr = [];
//优良率柱图数据
var youArr = [];
var liangArr = [];
var zhongArr = [];
var guanArr = [];
//离均差数据
var avgArr = [] ;
var passChart = null ;
var wellChart = null;
var avgChart = null ;
Page({
  data: {
    activeIndex: 0,
    examInfo: {}, //携带过来的考试信息
    avgList: [], //离均差渲染数组
    youArr: [], //优良率数据	
    passChart: {
      lazyLoad: true 
    },
    wellChart: {
      lazyLoad: true 
    },
		avgChart: {
			lazyLoad: true 
		},
		wellChartFlag:false
  },
  onLoad(props) {
    this.setData({
    	examInfo:JSON.parse(props.exam)
    })
		this.getExcellentRate();
    this.init_passChart();
    this.getQualifiedRate();
  },
	onUnload(){
		wellChart:null
	},
  //点击按钮切换
  btnClick(e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
		if (e.currentTarget.dataset.index == 1){
			if(this.data.wellChartFlag) return
			this.setData({
				wellChartFlag:true
			})
			this.init_wellChart();
		}
		if (e.currentTarget.dataset.index ==2){
			if (this.data.avgList.length!== 0) return
			this.getAvgDeviation()
		}
	

  },
  // 获取离均差率
	getAvgDeviation() {
		app.fetch(Api.avgDeviation, {
			examInfoId: this.data.examInfo.examInfoId
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
				avgArr = []
				arr.forEach((item) => {
					avgArr.push(item.avgDeviation)
				})
				this.setData({
					avgList: _data
				})
				this.init_avgChart()
			}

		})
  },
  //获取优良率
  getExcellentRate() {
    if (this.data.youArr.length !== 0) return
    app.fetch(Api.excellentRate, {
      examInfoId: this.data.examInfo.examInfoId
    }, "GET", res => {
			if (res.data.code == 200){
				var arr0 = res.data.data.data[0].data.slice(1)
				var arr1 = res.data.data.data[1].data.slice(1)
				var arr2 = res.data.data.data[2].data.slice(1)
				var arr3 = res.data.data.data[3].data.slice(1)
				var num = 0;
				var _data0 = [];
				var _data1 = [];
				var _data2 = [];
				var _data3 = [];
				var proportion = 5;
				for (let i = 0; i < arr0.length; i++) {
					if (i % proportion == 0 && i != 0) {
						_data0.push(arr0.slice(num, i));
						_data1.push(arr1.slice(num, i));
						_data2.push(arr2.slice(num, i));
						_data3.push(arr3.slice(num, i));
						num = i;
					}
					if ((i + 1) == arr0.length) {
						_data0.push(arr0.slice(num, (i + 1)));
						_data1.push(arr1.slice(num, (i + 1)));
						_data2.push(arr2.slice(num, (i + 1)));
						_data3.push(arr3.slice(num, (i + 1)));
					}
				}
				this.setData({
					youLv: res.data.data.data[0].data[0].y,
					youArr: _data0,
					liangArr: _data1,
					zhongArr: _data2,
					guanArr: _data3
				})
				youArr = [];
				liangArr = [];
				zhongArr = [];
				guanArr = [];
				res.data.data.data.forEach((item, index) => {
					item.data.forEach((child, idx) => {
						if (idx == 0) return
						if (index == 0) youArr.push(child.y)
						if (index == 1) liangArr.push(child.y)
						if (index == 2) zhongArr.push(child.y)
						if (index == 3) guanArr.push(child.y)
					})
				})
			}
  
    })

  },
  //获取及格率
  getQualifiedRate() {
    app.fetch(Api.qualifiedRate, {
      examInfoId: this.data.examInfo.examInfoId
    }, "GET", res => {
			if(res.data.code == 200){
				var arr = res.data.data.data[0].data.slice(1)
				xArr = res.data.data.categories.slice(1)
				var num = 0;
				var _data = [];
				var _data1 = [];
				var proportion = 5;
				for (let i = 0; i < arr.length; i++) {
					if (i % proportion == 0 && i != 0) {
						_data.push(arr.slice(num, i));
						_data1.push(xArr.slice(num, i));
						num = i;
					}
					if ((i + 1) == arr.length) {
						_data.push(arr.slice(num, (i + 1)));
						_data1.push(xArr.slice(num, (i + 1)));
					}
				}
				this.setData({
					passList: _data,
					classList: _data1
				})
				passArr = [];
				arr.forEach((item) => {
					passArr.push(item.y)
				})
				if (!passChart) return
				passChart.setOption(this.getLineOption(xArr, passArr, "百分比")); //获取新数据
			}
    })
  },





  // 及格率折线图
  init_passChart() {
    this.passChartComponnet = this.selectComponent('#passChart');
    this.passChartComponnet.init((canvas, width, height) => {
      // 初始化图表
      passChart = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
			passChart.setOption(this.getLineOption(xArr, passArr, "百分比")); //获取新数据
      return passChart;
    });
  },
  // 优良率柱状图
  init_wellChart() {
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
	// 离均差柱状图
	init_avgChart() {
		this.avgChartComponnet = this.selectComponent('#avgChart');
		this.avgChartComponnet.init((canvas, width, height) => {
			// 初始化图表
			avgChart = echarts.init(canvas, null, {
				width: width,
				height: height,
			});
			avgChart.setOption(this.getAvgOption()); //获取新数据
			return avgChart;
		});
	},
	// 离均差柱状图配置项
	getAvgOption(){
		var option = {
			color: "#ef5040",
			textStyle: {
				color: "#fff",
			},
			grid: {
				show: true,
				top: 30,
				bottom: 30,
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
				name: "差值",
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
			series: [
				{
					type: 'bar',
					stack: '总量',
					barMaxWidth: 30,
					data:avgArr
				}
			]
		};
		return option
	},
  //折线图配置项
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
        name: "百分比",
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
  getWellOption() {
    var option = {
      color: ["#4d5673", "#e2a123", "#4ceb8c", "#73ffe4"],
      textStyle: {
        color: "#fff",
      },
      tooltip: {
        position: function(pos, params, dom, rect, size) {
          return [pos[0] - 35, '10%'];
        }
      },
      grid: {
        show: true,
        top: 30,
        bottom: 60,
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
				barMaxWidth: 30,
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
  }
})