let App = getApp()

Page({
	data: {
        banner: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true,
        uname: '',
        upass: '',
        isPassword: !0,
        isTelFocus: !1,
        isPwdFocus: !1,
	},
	inputTyping: function(e){
        var obj = {}
        obj[e.currentTarget.id] = e.detail.value
        this.setData(obj)
    },
    inuputBlur: function(e){
        var tar = e.currentTarget.id
        if(tar=="mobile"){
            this.setData({
                isTelFocus: !1
            })
        }else if(tar=="upass"){
            this.setData({
                isPwdFocus: !1
            })
        }
    },
    inputFocus: function(e){
        var tar = e.currentTarget.id
        if(tar=="mobile"){
            this.setData({
                isTelFocus: !0
            })
        }else if(tar=="upass"){
            this.setData({
                isPwdFocus: !0
            })
        }
    },
    clearInput: function(e){
        var obj = {};
        obj[e.currentTarget.dataset.for] = '';
        this.setData(obj);
    },
    showPass: function(e){
        this.setData({
            isPassword: !this.data.isPassword
        })
    },
    onLoad: function(e){
        this.$wuxToast = App.wux(this).$wuxToast;

        this.WxValidate = App.WxValidate({
            mobile: {
                required: !0,
                tel: !0,
            },
            upass: {
                required: !0,
            },
        }, {
            mobile: {
                required: '请输入手机号',
            },
            upass: {
                required: '请输入密码',
            },
        })

        this.getBanner();
    },
    onShow: function(e){
    },
    getBanner: function(){
        App.HttpService.getBannerList({})
        .then(res=>{
            console.log("getBannerList", res);
            var banner = res.data.banner;
            banner.forEach(ele=>{
                ele.image = App.renderImage(ele.image);
            })
            this.setData({banner:banner})
        })
    },
    formSubmit: function(e){
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: `${error.msg}`,
                // success: () => console.log('已完成')
            })
            return !1;
        }
        this.login();
    },
    login: function(){
        var data = { mobile:this.data.mobile, user_pass: this.data.upass }
        App.HttpService.Login(data)
        .then(res=>{
            console.log("login", res);
            if(res){
                var state = res.data.state;
                this.$wuxToast.show({
                    type: state == 1 ? 'success' : 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
                if(state == 1){
                    App.WxService.setStorageSync('userId',res.data.userId);
                    App.WxService.setStorageSync('token',res.data.token);
                    setTimeout(()=>{
                        App.WxService.switchTab('/pages/user/center',{});
                    },1200)
                }
            }
        })
        .catch(err=>{
            console.log(err);
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: err,
                // success: () => console.log('已完成')
            })
        })
    }
})