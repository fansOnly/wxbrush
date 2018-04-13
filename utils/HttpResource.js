import __config from 'baseUrl'
import WxResource from 'WxResource'

class HttpResource {
	constructor(url, paramDefaults, actions, options) {
		Object.assign(this, {
			url,
			paramDefaults,
			actions,
			options,
		})
	}

	/**
	 * 返回实例对象
	 */
	init() {
		const resource = new WxResource(this.setUrl(this.url), this.paramDefaults, this.actions, this.options)
		resource.setDefaults({
			interceptors: this.setInterceptors()
		})
		return resource
	}

	/**
	 * 设置请求路径
	 */
	setUrl(url) {
		return `${__config.basePath}${url}`
	}

	/**
	 * 拦截器
	 */
	setInterceptors() {
		return [{
            request: (request) => {
                request.header = request.header || {}
                request.requestTimestamp = new Date().getTime()
                if (wx.getStorageSync('Token') && wx.getStorageSync('UserId')) {
                    request.header.Authorization = '' + wx.getStorageSync('Token') + wx.getStorageSync('UserId')
                }
                wx.showToast({
                    title: '加载中',
                    icon: 'loading',
                    duration: 10000,
                    mask: !0,
                })
                return request
            },
            requestError: (requestError) => {
                wx.hideToast()
                return requestError
            },
            response: (response) => {
                response.responseTimestamp = new Date().getTime()
                if(response.statusCode === 401) {
                    wx.clearStorageSync()
                    console.log("连接失败")
                    wx.redirectTo({
                        // url: '../pages/login/index'
                    })
                }
                wx.hideToast()
                return response
            },
            responseError: (responseError) => {
                wx.hideToast()
                return responseError
            },
        }]
	}
}

export default HttpResource