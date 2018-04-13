//app.js
import polyfill from './utils/polyfill';
import Tools from './utils/Tools';
import WxService from './utils/WxService';
import WxValidate from './utils/WxValidate';
import HttpResource from './utils/HttpResource';
import HttpService from './utils/HttpService';
import Config from './utils/baseUrl';
import wux from './libs/wux';


//注册小程序，接收一个Object参数
App({
	globalData: {
		userInfo: '',
		configWeb: '',
	},
	onLaunch() {
		console.log('onLaunch');
	},
	onShow() {
		console.log('onShow');
	},
	onHide() {
		console.log('onHide');
	},
	getUserInfo() {
	},
	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	renderImage(path) {
        if (!path) return ''
        if (path.indexOf('https') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
    HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
	HttpService: new HttpService,
	WxService: new WxService,
	Tools: new Tools,
	Config: Config,
	wux: wux,
})