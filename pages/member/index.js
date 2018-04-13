let App = getApp()

Page({
	data: {
        memberList: [],
        page: 1,
        nodata: !1,
	},
	onLoad: function(e){
        var page = this.data.page;
        this.getUserMemberList(page);
    },
    getUserMemberList: function(page){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.getUserMemberList({userId:userId,page:page})
        .then(res=>{
            console.log("getUserMemberList", res);
            if(res.data.state == 0){
                wx.showToast({
                    title: res.msg,
                    icon: 'success',
                    duration: 1000
                })
                this.setData({nodata:!0})
                return !1;
            }
            var memberList = this.data.memberList;
            var memberListx = res.data.MemberList;
            memberList = memberList.concat(memberListx);
            this.setData({
                memberList: memberList,
                page: page
            })
        })
    },
    onReachBottom: function(){
        var page = this.data.page;
        if(!this.data.nodata){
            this.getUserMemberList(page + 1);
        }
    },
    // getMore: function(e){
    //     var page = this.data.page;
    //     if(!this.data.nodata){
    //         this.getUserOrderList(page + 1);
    //     }
    // },
})