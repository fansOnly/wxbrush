let App = getApp()

Page({
	data: {
        material: [],
        page: 1,
        nodata: !1,
	},
	onLoad: function(e){
    },
    onShow: function(){
        var page = this.data.page;
        this.getMaterialList(page);
    },
    getMaterialList: function(page){
        App.HttpService.getMaterialList({page:page})
        .then(res=>{
            console.log("getMaterialList", res);
            if(res.data.state == 0){
                wx.showToast({
                    title: res.msg,
                    icon: 'success',
                    duration: 1000
                })
                this.setData({nodata:!0})
                return !1;
            }
            var material = this.data.material;
            var materialx = res.data.materialList;
            materialx.forEach(ele=>{
                ele.pic = App.renderImage(ele.pic);
            })
            if(page>1){
                material = material.concat(materialx);
            }else{
                material = materialx;
            }
            this.setData({
                material: material,
                page: page
            })
        })
    },
    // getMore: function(e){
    //     var page = this.data.page;
    //     this.getMaterialList(page + 1);
    // },
    onReachBottom: function(){
        var page = this.data.page;
        if(!this.data.nodata){
            this.getMaterialList(page + 1);
        }
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
                    App.WxService.reLaunch('../login/login',{});
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
})