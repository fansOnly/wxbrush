let App = getApp()

Page({
	data: {
        user: [],
        bankname: '',
        bankuname: '',
        bankcard: '',
	},
    inputTyping: function(e){
        var obj = {}
        obj[e.currentTarget.id] = e.detail.value
        this.setData(obj)
    },
    clearInput: function(e){
        var obj = {};
        obj[e.currentTarget.dataset.for] = '';
        this.setData(obj);
    },
	onLoad: function(e){
        this.$wuxToast = App.wux(this).$wuxToast;

        this.WxValidate = App.WxValidate({
            bankname: {
                required: !0,
                chinese: !0,
            },
            bankuname: {
                required: !0,
                chinese: !0,
            },
            bankcard: {
                required: !0,
                bankcard: !0,
            },
        }, {
            bankname: {
                required: '请输入开户银行',
                chinese: '请输入中文',
            },
            bankuname: {
                required: '请输入开户姓名',
                chinese: '请输入中文',
            },
            bankcard: {
                required: '请输入银行卡号',
                bankcard: '请输入正确的银行卡号',
            },
        })
        this.GetUserBank();
    },
    GetUserBank: function(e){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.GetUserBank({userId:userId})
        .then(res=>{
            console.log("GetUserBank", res);
            if(res.data.state == 1){
                this.setData({
                    bankname: res.data.bank.bankname,
                    bankuname: res.data.bank.bankuname,
                    bankcard: res.data.bank.bankcard,
                })
            }
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
        this.SetUserBank();
    },
    SetUserBank: function(){
        var bankuname = this.data.bankuname;
        var bankname = this.data.bankname;
        var bankcard = this.data.bankcard;
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.SetUserBank({userId:userId,bankuname:bankuname,bankname:bankname,bankcard:bankcard})
        .then(res=>{
            console.log("SetUserBank", res);
            if(res.data.state == 1){
                this.$wuxToast.show({
                    type: 'success',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
            }
        })
    }
})