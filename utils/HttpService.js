import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super();
		this.$$prefix = '';
		this.$$path = {
			uploadImage : 'api/Common/uploadImage',

			wxLogin : 'api/Common/wxLogin',
			getAccessToken : 'api/Common/getAccessToken',
			sendMessage : 'api/Common/sendMessage',

			Regist : 'api/Login/regist',
			Login : 'api/Login/login',
			Findpwd : 'api/Login/findpwd',

			GetUser : 'api/User/center',
			SetUser : 'api/User/userinfo',
			GetUserBank : 'api/User/getbank',
			SetUserBank : 'api/User/bank',
			getPlatformList : 'api/User/getPlatformList',
			getPlatform : 'api/User/getPlatform',
			addPlatform : 'api/User/addPlatform',
			delPlatform : 'api/User/delPlatform',
			SetAvatar : 'api/User/avatarUpload',
			ApplyTixian : 'api/User/tixian',
			GetTixianList : 'api/User/tixianList',
			GetTixianDetail : 'api/User/tixianDetail',
			GetTixianDesc : 'api/User/tixianDesc',
			GetUserMoneyLog : 'api/User/moneyLog',
			GetUserMoneyxLog : 'api/User/moneyxLog',

			getUserOrderList : 'api/Order/index',
			addUserOrder : 'api/Order/addOrder',
			getUserOrderDetail : 'api/Order/getOrderDetail',
			editUserOrder : 'api/Order/editOrder',

			getUserMemberList : 'api/Member/index',

			getMaterialList : 'api/Material/index',
			getMaterialDetail : 'api/Material/detail',
			downloadMaterial : 'api/Material/download',

			getBannerList : 'api/Index/banner',
        };
	}

	//**************************************************************
	// 上传图片
	uploadImage(params) {
		return this.postRequest(this.$$path.uploadImage, params)
	}
	// 微信登录
	wxLogin(params) {
		return this.postRequest(this.$$path.wxLogin, params)
	}
	// 获取token
	getAccessToken(params) {
		return this.postRequest(this.$$path.getAccessToken, params)
	}
	// 发送模板消息
	sendMessage(params) {
		return this.postRequest(this.$$path.sendMessage, params)
	}


	//**************************************************************
	// 会员注册
	Regist(params) {
		return this.postRequest(this.$$path.Regist, params)
	}
	// 会员登录
	Login(params) {
		return this.postRequest(this.$$path.Login, params)
	}
	// 找回密码
	Findpwd(params) {
		return this.postRequest(this.$$path.Findpwd, params)
	}


	// **************************************************************
	// **************************会员管理****************************
	// **************************************************************
	// 获取会员信息
	GetUser(params) {
		return this.getRequest(this.$$path.GetUser, params)
	}
	// 设置会员信息
	SetUser(params) {
		return this.postRequest(this.$$path.SetUser, params)
	}
	// 设置会员头像
	SetAvatar(params) {
		return this.postRequest(this.$$path.SetAvatar, params)
	}
	// 获取用户银行信息
	GetUserBank(params) {
		return this.getRequest(this.$$path.GetUserBank, params)
	}
	// 设置用户银行信息
	SetUserBank(params) {
		return this.postRequest(this.$$path.SetUserBank, params)
	}
	// 获取平台列表
	getPlatformList(params) {
		return this.getRequest(this.$$path.getPlatformList, params)
	}
	// 获取用户平台
	getPlatform(params) {
		return this.getRequest(this.$$path.getPlatform, params)
	}
	// 添加用户平台
	addPlatform(params) {
		return this.postRequest(this.$$path.addPlatform, params)
	}
	// 删除用户平台
	delPlatform(params) {
		return this.postRequest(this.$$path.delPlatform, params)
	}
	// 申请提现
	ApplyTixian(params) {
		return this.postRequest(this.$$path.ApplyTixian, params)
	}
	// 获取提现列表
	GetTixianList(params) {
		return this.getRequest(this.$$path.GetTixianList, params)
	}
	// 获取提现详情
	GetTixianDetail(params) {
		return this.getRequest(this.$$path.GetTixianDetail, params)
	}
	// 获取提现文字说明
	GetTixianDesc(params) {
		return this.getRequest(this.$$path.GetTixianDesc, params)
	}
	// 获取积分变动记录
	GetUserMoneyLog(params) {
		return this.getRequest(this.$$path.GetUserMoneyLog, params)
	}
	// 获取货款变动记录
	GetUserMoneyxLog(params) {
		return this.getRequest(this.$$path.GetUserMoneyxLog, params)
	}


	// **************************************************************
	// **************************会员下级管理****************************
	// **************************************************************
	// 获取下属会员
	getUserMemberList(params) {
		return this.getRequest(this.$$path.getUserMemberList, params)
	}


	// **************************************************************
	// **************************订单管理****************************
	// **************************************************************
	// 订单列表
	getUserOrderList(params) {
		return this.getRequest(this.$$path.getUserOrderList, params)
	}
	// 获取订单详情
	getUserOrderDetail(params) {
		return this.getRequest(this.$$path.getUserOrderDetail, params)
	}
	// 新增订单
	addUserOrder(params) {
		return this.postRequest(this.$$path.addUserOrder, params)
	}
	// 修改订单
	editUserOrder(params) {
		return this.postRequest(this.$$path.editUserOrder, params)
	}


	// **************************************************************
	// **************************素材管理****************************
	// **************************************************************
	// 素材列表
	getMaterialList(params) {
		return this.getRequest(this.$$path.getMaterialList, params)
	}
	// 素材详情
	getMaterialDetail(params) {
		return this.getRequest(this.$$path.getMaterialDetail, params)
	}
	// 下载素材
	downloadMaterial(params) {
		return this.postRequest(this.$$path.downloadMaterial, params)
	}


	// **************************************************************
	// **************************首页管理****************************
	// **************************************************************
	// banner图片
	getBannerList(params) {
		return this.getRequest(this.$$path.getBannerList, params)
	}
}

export default Service