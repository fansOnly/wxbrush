let App = getApp()

Page({
	data: {
        tixianList: [],
        page: 1,
        nodata: !1,
	},
	onLoad: function(e){
        var page = this.data.page;
        this.GetTixianList(page);
    },
    GetTixianList: function(page){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.GetTixianList({uid:userId,page:page})
        .then(res=>{
            console.log("GetTixianList", res);
            if(res.data.state == 0){
                wx.showToast({
                    title: res.msg,
                    icon: 'success',
                    duration: 1000
                })
                this.setData({nodata:!0})
                return !1;
            }
            var tixianList = this.data.tixianList;
            var tixianListx = res.data.tixianList;
            var time;
            tixianListx.forEach(ele=>{
                time = new Date(ele.create_time*1000);
                ele.create_time = App.Tools.formatTime(ele.create_time,'-');
            })
            if(page>1){
                tixianList = tixianList.concat(tixianListx);
            }else{
                tixianList = tixianListx;
            }
            this.setData({
                tixianList: tixianList,
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
    // getMore: function(e){
    //     var page = this.data.page;
    //     if(!this.data.nodata){
    //         this.getUserOrderList(page + 1);
    //     }
    // },
})