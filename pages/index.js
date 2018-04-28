let App = getApp()

Page({
	data: {
        banner: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        circular: true,
        material: [],
        orderList: [],
        access_token: '',
        openid: '',
	},
	onLoad: function(e){
        this.getBanner();
    },
    onShow: function(){
        this.getMaterialList();
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
    getMaterialList: function(){
        App.HttpService.getMaterialList({page:1})
        .then(res=>{
            console.log("getMaterialList", res);
            var material = res.data.materialList;
            material.forEach(ele=>{
                ele.pic = App.renderImage(ele.pic);
            })
            this.setData({
                material: material
            })
        })
    },
    download: function(e){
        var userId = App.WxService.getStorageSync("userId");
        var token = App.WxService.getStorageSync("token");
        if(!userId && !token){
            App.WxService.showModal({
                title: '下载提示',
                content: '您尚未登录，请登录后进行下载',
                confirmText: '登录',
            })
            .then(res=>{
                if(res.confirm){
                    App.WxService.reLaunch('login/login',{});
                }
            })
            return !1;
        }
        var that = this;
        var url = e.currentTarget.dataset.url;
        var id = e.currentTarget.dataset.id;
        wx.downloadFile({
            url: url,
            success: function(res) {
                console.log("downloadFile", res);
                if (res.statusCode === 200) {
                    that.updateState(id, userId, res.tempFilePath);
                }
            }
        })
    },
    updateState: function(id, userId, tempFilePath){
        App.HttpService.downloadMaterial({id:id,userId:userId})
        .then(res=>{
            console.log("downloadMaterial", res);
            if(res.data.state == 1){
                wx.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success: function(res2) {
                        console.log("saveImageToPhotosAlbum", res2);
                        if(res2.errMsg == 'saveImageToPhotosAlbum:ok'){
                            wx.showToast({
                                icon: 'success',
                                title: res.msg,
                                duration: 1000
                            })
                            return !0;
                        }
                    }
                })
            }else{
                wx.showToast({
                    icon: 'success',
                    title: res.msg,
                    duration: 1000
                })
                return !1;
            }
        })
    },
    wxLogin: function(){
        wx.login({
            success: function(res){
                console.log("wx.login", res);
                var code = res.code;
                if(code){
                    return App.HttpService.wxLogin({code:code})
                    .then(res=>{
                        console.log("wxLogin", res);
                        if(res.openid){
                            var openid = res.openid;
                            wx.setStorageSync("openid",res.openid);
                            return App.HttpService.getAccessToken()
                            .then(res=>{
                                console.log("getAccessToken", res);
                                if(res.access_token){
                                    wx.setStorageSync("access_token",res.access_token);
                                    // this.setData({access_token:res.access_token,openid:openid})
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    sendmsg: function(e){
        var data = {
            "keyword1": {
                "value": "170112155582856",
                "color": "#173177"
            },
            "keyword2": {
                "value": "优嘉VIP万达店",
                "color": "#173177"
            },
            "keyword3": {
                "value": "2017-2-16 10:00:00",
                "color": "#173177"
            },
            "keyword4": {
                "value": "查看小程序",
                "color": "#173177"
            },
        }
        var openid = wx.getStorageSync("openid");
        var access_token = wx.getStorageSync("access_token");
        var datax = {access_token:access_token,touser:openid,template_id:'oX2rkk6U27wTO-wxGe2Xnzp6IuCkOmxL2T2lWpoYsGQ',form_id:e.detail.formId,data:data};
        App.HttpService.sendMessage(datax)
        .then(res=>{
            console.log("sendMessage", res);
        })
    }
})