let App = getApp()

Page({
	data: {
        bankname: '',
        bankuname: '',
        bankcard: '',
        money: '',
        total: '',
        desc: ''
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
            money: {
                required: !0,
                number: !0
            },
        }, {
            money: {
                required: '请输入提现金额'
            },
        })
        this.GetUserBank();
        this.getUser();
        this.getTixianDesc();
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
    getUser: function(e){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.GetUser({userId:userId})
        .then(res=>{
            console.log("GetUser", res);
            this.setData({
                total:res.data.user.commision,
            })
        })
    },
    getTixianDesc: function(){
        App.HttpService.GetTixianDesc({})
        .then(res=>{
            console.log("GetTixianDesc", res);
            if(res.data.state == 1){
                this.setData({desc:res.data.desc})
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
        var total = this.data.total;
        var money = this.data.money;
        if(money > total){
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '您的积分不足！',
                // success: () => console.log('已完成')
            })
            return !1;
        }
        this.ApplyTixian();
    },
    ApplyTixian: function(){
        var money = this.data.money;
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.ApplyTixian({uid:userId,money:money})
        .then(res=>{
            console.log("ApplyTixian", res);
            if(res.data.state == 1){
                this.$wuxToast.show({
                    type: 'success',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
            }else{
                this.$wuxToast.show({
                    type: 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
            }
        })
    }
})