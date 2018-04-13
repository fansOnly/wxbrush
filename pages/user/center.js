let App = getApp()

Page({
	data: {
        user: [],
        count: 0,
	},
	onLoad: function(e){
        this.$wuxToast = App.wux(this).$wuxToast;
    },
    onShow: function(){
        var userId = App.WxService.getStorageSync('userId');
        var token = App.WxService.getStorageSync('token');
        if(!userId || !token){
            App.WxService.reLaunch('../login/login',{});
        }
        this.getUser();
    },
    getUser: function(e){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.GetUser({userId:userId})
        .then(res=>{
            console.log("GetUser", res);
            this.setData({
                user:res.data.user,
                count: res.data.count
            })
        })
    },
    addorder: function(e){
        var count = this.data.count;
        if(count<5){
            App.WxService.navigateTo('../order/addorder',{})
        }else{
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '您的订单名额已满',
                // success: () => console.log('已完成')
            })
            return !1;
        }
    },
    logout: function(){
        App.WxService.showModal({
            title: '退出登录',
            confirmText: "确定",
            cancelText: "取消",
            confirmColor: '#004098',
        })
        .then(res=>{
            if(res.confirm==1){
                try {
                    wx.clearStorageSync();
                    App.WxService.showToast({
                        title: '退出登录',
                        icon: 'success',
                        duration: 500
                    })
                    setTimeout(()=>{
                        App.WxService.redirectTo('/pages/login/login')
                    },800)
                    console.log("清理成功")
                } catch(e) {
                    console.log("清理失败")
                }
            }else{
                console.log("用户点击了取消")
            }
        })
    }
})