var app = getApp();
var api = {
	//用户登录验证  /wx/user/{appid}/checkLogin
	isBind: app.globalData.apiHost + '/miniapp/wx/user/wx942453966fb252c8/checkLogin',
	//用户绑定
	userBind: app.globalData.apiHost + '/miniapp/wx/user/wx942453966fb252c8/login',
//意见反馈GET /api/opinion
	opinion: app.globalData.apiHost + '/miniapp/api/opinion',
//退出登录GET /wx/user/{appid}/delete
	signOut: app.globalData.apiHost + '/miniapp/wx/user/wx942453966fb252c8/delete',
	//家长端

  //课堂记录
  lessonRecordList: app.globalData.apiHost + "/miniapp/api/lessonRecord/lessonRecordList",
  //导学作业
	msgList: app.globalData.apiHost +"/miniapp/api/msg/msgList",
	//导学详情
  detailList: app.globalData.apiHost +"/miniapp/api/msg/resourceInfo",
  //获取公告
  noticeList: app.globalData.apiHost + "/miniapp/api/notice/noticeList",
  //作业列表
	homeworkList: app.globalData.apiHost + "/miniapp/api/homework/homeworkList",
	// 作业详情
  homeworkDetail: app.globalData.apiHost + "/miniapp/api/homework/homeworkDetails",
	//学生成绩    /api/analysis/exam
	stuScore: app.globalData.apiHost + "/miniapp/api/analysis/exam",




	//领导端 

	//首页  课堂  
	lessonRecordData: app.globalData.apiHost + '/miniapp/api/lessonRecord/lessonRecordData',
	//首页 作业  
	homeworkData: app.globalData.apiHost + '/miniapp/api/homework/homeworkData',
	//首页 教案
	teachingPlan: app.globalData.apiHost + '/miniapp/api/teaching/teachingPlan',
	// 首页  教研活动    
	teachingActivity: app.globalData.apiHost + '/miniapp/api/teaching/teachingActivity',

	// 成绩页
	//通过用户ID获取年级信息 
	gradeList: app.globalData.apiHost + '/miniapp/api/analysis/findGradeListByUid',
	// 通过年级名称、学校ID获取成绩列表 
	examList: app.globalData.apiHost + '/miniapp/api/analysis/examList',
	//单次考试获取离均差率
	avgDeviation: app.globalData.apiHost + '/miniapp/api/analysis/avgDeviation',
	//单次考试获取优良率
	excellentRate: app.globalData.apiHost + '/miniapp/api/analysis/excellentRate',
	//单次考试获取及格率
	qualifiedRate: app.globalData.apiHost + '/miniapp/api/analysis/qualifiedRate',

	// 资源页

	//获取资源上传量  
	resource: app.globalData.apiHost + '/miniapp/api/teaching/resource',
	//按学科获取资源  
	resourceSubj: app.globalData.apiHost + '/miniapp/api/teaching/resourceSubj',
	//按学科获取试题  
	quzSubj: app.globalData.apiHost + '/miniapp/api/teaching/quzSubj',

	// 用户页

	//领导端注册总人数
	loginNum: app.globalData.apiHost + '/miniapp/api/user/registerOffice',
	//用户活跃度
	activeRate: app.globalData.apiHost + '/miniapp/api/user/activeRate',
	//用户在线时长
	behavior: app.globalData.apiHost + '/miniapp/api/user/behavior',



}
module.exports = api;