let App = getApp()

Page({
	data: {
        bankname: '',
        bankuname: '',
        bankcard: '',
        money: '',
        commision: '',
        totalCommision: '',
        totalMoney: '',
        desc: '',
        tixianType: '',
        tixianTypeId: 1,
        tixianTypes: [
            {id: 1, name:'货款'},
            {id: 2, name:'积分'},
        ]
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
            // console.log("GetUser", res);
            this.setData({
                totalCommision:res.data.user.commision,
                totalMoney:res.data.user.money,
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
    radioChange: function(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        var tixianTypes = this.data.tixianTypes;
        var tixianType = this.data.tixianType;
        var tixianTypeId = this.data.tixianTypeId;
        for(var i=0;i<tixianTypes.length;i++){
            tixianTypes[i].checked = e.detail.value;
            if(tixianTypes[i].id == e.detail.value){
                tixianTypes[i].checked =true;
                tixianTypeId = tixianTypes[i].id;
            }
            // tixianType = tixianTypes[i].name;
            
        }
        this.setData({
            tixianTypes: tixianTypes,
            // tixianType: tixianType,
            tixianTypeId: tixianTypeId,
        });
    },
    formSubmit: function(e){
        var totalCommision = parseFloat(this.data.totalCommision);
        var totalMoney = parseFloat(this.data.totalMoney);
        var money = parseFloat(this.data.money);
        var commision = parseFloat(this.data.commision);
        if(this.data.tixianTypeId == 1){
            if(money <=0 || typeof(money) != 'number'){
                this.$wuxToast.show({
                    type: 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: '请输入正确的数字格式！',
                    // success: () => console.log('已完成')
                })
                return !1;
            }
            if(parseFloat(money) > parseFloat(totalMoney)){
                this.$wuxToast.show({
                    type: 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: '您的货款不足！',
                    // success: () => console.log('已完成')
                })
                return !1;
            }
        }else{
            if(parseFloat(commision) > parseFloat(totalCommision)){
                if(commision <=0 || typeof(commision) != 'number'){
                    this.$wuxToast.show({
                        type: 'cancel',
                        timer: 1000,
                        color: '#fff',
                        text: '请输入正确的数字格式！',
                        // success: () => console.log('已完成')
                    })
                    return !1;
                }
                this.$wuxToast.show({
                    type: 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: '您的积分不足！',
                    // success: () => console.log('已完成')
                })
                return !1;
            }
        }
        this.ApplyTixian();
    },
    ApplyTixian: function(){
        var money = this.data.money;
        var commision = this.data.commision;
        var tixianTypeId = this.data.tixianTypeId;
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.ApplyTixian({uid:userId,money:money,commision:commision,type:tixianTypeId})
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
                this.getUser();
                this.setData({money:'',commision:''})
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
    },
})