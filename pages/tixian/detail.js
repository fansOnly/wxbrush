let App = getApp()

Page({
	data: {
        id: 0,
        bankname: '',
        bankuname: '',
        bankcard: '',
        tixian: '',
	},
	onLoad: function(e){
        var id = e.id ? e.id : 0;
        this.GetTixianDetail(id);
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
    GetTixianDetail: function(id){
        App.HttpService.GetTixianDetail({id:id})
        .then(res=>{
            console.log("GetTixianDetail", res);
            var tixian = res.data.tixian;
            var time = new Date(tixian.create_time*1000);
            tixian.create_time = App.Tools.formatTime(time,'-');
            if(res.data.state == 1){
                this.setData({
                    tixian: tixian
                })
            }
        })
    },
})