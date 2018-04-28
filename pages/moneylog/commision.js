let App = getApp()

Page({
	data: {
        moneyLog: [],
        page: 1,
        nodata: !1,
	},
	onLoad: function(e){
        var page = this.data.page;
        this.GetUserMoneyLog(page);
    },
    GetUserMoneyLog: function(page){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.GetUserMoneyLog({uid:userId,page:page})
        .then(res=>{
            console.log("GetUserMoneyLog", res);
            if(res.data.state == 0){
                wx.showToast({
                    title: res.msg,
                    icon: 'success',
                    duration: 1000
                })
                this.setData({nodata:!0})
                return !1;
            }
            var moneyLog = this.data.moneyLog;
            var moneyLogx = res.data.moneyLog;
            if(page>1){
                moneyLog = moneyLog.concat(moneyLogx);
            }else{
                moneyLog = moneyLogx;
            }
            this.setData({
                moneyLog: moneyLog,
                page: page
            })
        })
    },
    onReachBottom: function(){
        var page = this.data.page;
        if(!this.data.nodata){
            this.GetTixianList(page + 1);
        }
    },
})