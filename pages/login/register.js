let App = getApp()

Page({
	data: {
        uname: '',
        upass: '',
        urepass: '',
        mobile: '',
        ucode: '',
        isPassword: !0,
        isTelFocus: !1,
        isPwdFocus: !1,
        isRePwdFocus: !1,
        isCodeFocus: !1,
        isNameFocus: !1,
	},
	inputTyping: function(e){
        var obj = {}
        obj[e.currentTarget.id] = e.detail.value
        this.setData(obj)
    },
    inuputBlur: function(e){
        var tar = e.currentTarget.id
        if(tar=="uname"){
            this.setData({
                isNameFocus: !1
            })
        }else if(tar=="upass"){
            this.setData({
                isPwdFocus: !1
            })
        }else if(tar=="urepass"){
            this.setData({
                isRePwdFocus: !1
            })
        }else if(tar=="mobile"){
            this.setData({
                isTelFocus: !1
            })
        }else if(tar=="ucode"){
            this.setData({
                isCodeFocus: !1
            })
        }
    },
    inputFocus: function(e){
        var tar = e.currentTarget.id
        if(tar=="uname"){
            this.setData({
                isNameFocus: !0
            })
        }else if(tar=="upass"){
            this.setData({
                isPwdFocus: !0
            })
        }else if(tar=="urepass"){
            this.setData({
                isRePwdFocus: !0
            })
        }else if(tar=="mobile"){
            this.setData({
                isTelFocus: !0
            })
        }else if(tar=="ucode"){
            this.setData({
                isCodeFocus: !0
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
            uname: {
                required: !0,
            },
            mobile: {
                required: !0,
                tel: !0,
            },
            upass: {
                required: !0,
                minlength: 6,
                maxlength: 16,
            },
            urepass: {
                required: !0,
                equalTo: 'upass',
            },
            ucode: {
                required: !0,
            },
        }, {
            uname: {
                required: '请输入登录帐号',
            },
            mobile: {
                required: '请输入手机号',
            },
            upass: {
                required: '请输入密码',
            },
            upass: {
                required: '请再次输入密码',
                equalTo: '两次输入的密码不一致',
            },
            ucode: {
                required: '请输入邀请人姓名',
            },
        })
    },
    onShow: function(e){
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
        this.regist();
    },
    regist: function(){
        var data = { user_login:this.data.uname, user_pass: this.data.upass, mobile:this.data.mobile, user_code: this.data.ucode }
        App.HttpService.Regist(data)
        .then(res=>{
            console.log("regist", res);
            if(res){
                var state = res.data.state;
                this.$wuxToast.show({
                    type: state == 1 ? 'success' : 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                })
                if(state == 1){
                    App.WxService.redirectTo('../index',{})
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