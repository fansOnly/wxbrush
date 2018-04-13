let App = getApp()

Page({
	data: {
        material: {},
        id: 0
	},
	onLoad: function(e){
        this.$wuxGallery = App.wux(this).$wuxGallery;
        var id = e.id ? e.id : 0;
        this.setData({id:id})
        this.getMaterialDetail(id);
    },
    getMaterialDetail: function(id){
        App.HttpService.getMaterialDetail({id:id})
        .then(res=>{
            console.log("getMaterialDetail", res);
            if(res.data.state == 0){
                wx.showToast({
                    title: res.msg,
                    icon: 'success',
                    duration: 1000
                })
                this.setData({nodata:!0})
                return !1;
            }
            if(!res.data.material.more){
            }else{
                var photos = res.data.material.more.photos;
                photos.forEach(ele=>{
                    ele.url = App.renderImage(ele.url);
                })
            }
            this.setData({
                material: res.data.material,
            })
        })
    },
    copy: function(){
        wx.setClipboardData({
            data: this.data.material.content,
            success: function(res) {
                console.log("setClipboardData", res);
                if(res.errMsg == "setClipboardData:ok"){
                    wx.showToast({
                        icon: 'success',
                        title: '复制成功',
                        duration: 1000
                    })
                }
            }
        })
    },
    showGallery(e) {
        const that = this;
        const current = e.currentTarget.dataset.current;
        var pics = this.data.material.more.photos;
        var urls = [];
        var titles = [];
        pics.forEach(ele=>{
            urls.push(ele.url);
            titles.push(ele.name);
        })

        this.$wuxGallery.show({
            current: current,
            urls: urls,
            titles: titles,
            delete: (current, urls) => {
                var pics = that.data.material.more.photos;
                var id= that.data.material.id;
                var url = urls[current];
                that.downloadGallery(id, url);
            },
            callback: () => console.log('Close gallery')
        })
    },
    downloadGallery: function(id, url){
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
        wx.downloadFile({
            url: url,
            success: function(res) {
                console.log("downloadFile", res);
                if (res.statusCode === 200) {
                    that.updateState(id,userId,res.tempFilePath);
                }
            }
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