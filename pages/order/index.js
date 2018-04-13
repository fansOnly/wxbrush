let App = getApp()

Page({
	data: {
        orderList: [],
        platforms: [],
        page: 1,
        nodata: !1,
	},
	onLoad: function(e){
        this.getPlatformList();
        // var page = this.data.page;
        // this.getUserOrderList(page);
    },
    onShow: function(){
        var page = this.data.page;
        this.getUserOrderList(page);
    },
    getUserOrderList: function(page){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.getUserOrderList({userId:userId,page:page})
        .then(res=>{
            console.log("getUserOrderList", res);
            if(res.data.state == 0){
                wx.showToast({
                    title: res.msg,
                    icon: 'success',
                    duration: 1000
                })
                this.setData({nodata:!0})
                return !1;
            }
            var orderList = this.data.orderList;
            var orderListx = res.data.orderList;
            var platforms = this.data.platforms;
            orderListx.forEach(ele=>{
                platforms.forEach(ele2=>{
                    if(ele.order_plateid == ele2.id){
                        ele.order_plate = ele2.name;
                    }
                })
            })
            // var time;
            // orderListx.forEach(ele=>{
            //     time = new Date(ele.order_date*1000);
            //     ele.order_date = App.Tools.formatTime(ele.order_date,'-');
            // })
            if(page>1){
                orderList = orderList.concat(orderListx);
            }else{
                orderList = orderListx;
            }
            this.setData({
                orderList: orderList,
                page: page
            })
        })
    },
    getPlatformList: function(){
        App.HttpService.getPlatformList({})
        .then(res=>{
            console.log("getPlatformList", res);
            this.setData({platforms:res.data.platformList})
        })
    },
    onReachBottom: function(){
        var page = this.data.page;
        if(!this.data.nodata){
            this.getUserOrderList(page + 1);
        }
    },
    // getMore: function(e){
    //     var page = this.data.page;
    //     if(!this.data.nodata){
    //         this.getUserOrderList(page + 1);
    //     }
    // },
})