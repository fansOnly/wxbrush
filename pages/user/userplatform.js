let App = getApp()

Page({
	data: {
        user: [],
        platforms: [],
        platinfos: []
	},
	onLoad: function(e){
        this.$wuxToast = App.wux(this).$wuxToast;

        this.getPlatformList();
        this.getPlatform();
    },
    getPlatformList: function(){
        App.HttpService.getPlatformList({})
        .then(res=>{
            console.log("getPlatformList", res);
            this.setData({platforms:res.data.platformList})
        })
    },
    getPlatform: function(){
        var uid = App.WxService.getStorageSync('userId');
        App.HttpService.getPlatform({uid:uid})
        .then(res=>{
            console.log("getPlatform", res);
            var platform = res.data.platform;
            if(!platform.length){
                platform.push({index:1, id:'', platform_name: '', platform_id: '', platform_account: ''});
            }
            this.setData({platinfos:res.data.platform})
        })
    },
    radioChange: function(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        var editid = e.currentTarget.dataset.pid,
            platforms = this.data.platforms,
            platinfos = this.data.platinfos;
        for(var j=0;j<platinfos.length;j++){
            if(j == editid){
                platinfos[j].platform_id = e.detail.value;
                // for(var i=0;i<platforms.length;i++){
                //     if(platforms[i].name == e.detail.value){
                //         platinfos[j].platform_id = platforms[i].id;
                //     }
                // }
            }
        }
        this.setData({
            platinfos: platinfos
        });
    },
    save: function(e){
        var platinfos = this.data.platinfos,
            saveid = e.currentTarget.dataset.pid,
            data = {},
            uid = App.WxService.getStorageSync('userId');
        platinfos.forEach((ele,i)=>{
            if(i == saveid){
                data = { uid: uid, platform: ele }
            }
        })
        if(!data.platform.platform_account || !data.platform.platform_id){
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '请完善平台信息！',
            })
            return;
        }
        App.HttpService.addPlatform(data)
        .then(res=>{
            console.log("addPlatform", res);
            if(res.data.state == 1){
                this.$wuxToast.show({
                    type: 'success',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
            }
        })
    },
    delete: function(e){
        var platinfos = this.data.platinfos,
            delid = e.currentTarget.dataset.pid,
            data = {},
            uid = App.WxService.getStorageSync('userId');
        platinfos.forEach((ele,i)=>{
            if(ele.index == delid){
                data = { uid: uid, id:ele.id };
                platinfos.splice(i,1);
            }
        })
        platinfos.forEach((ele,i)=>{
            ele.index = i +1;
        })
        if(!data.id){
            this.setData({platinfos:platinfos});
        }else{
            App.HttpService.delPlatform(data)
            .then(res=>{
                console.log("delPlatform", res);
                if(res.data.state == 1){
                    this.$wuxToast.show({
                        type: 'success',
                        timer: 1000,
                        color: '#fff',
                        text: res.msg,
                        // success: () => console.log('已完成')
                    })
                    this.setData({platinfos:platinfos});
                }
            })
        }
    },
    add: function(){
        var platinfos = this.data.platinfos;
        if(platinfos.length>=10){
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '您添加的平台已超出限制！',
                // success: () => console.log('已完成')
            })
            return;
        }
        platinfos.push({index:platinfos.length+1, id:'', platform_name: '', platform_id: '', platform_account: ''});
        this.setData({platinfos:platinfos})
    },
    inputTyping: function(e){
        var obj = {},
            pid = e.currentTarget.dataset.pid,
            platinfos = this.data.platinfos;
        platinfos.forEach((ele,i)=>{
            if(i == pid){
                ele.platform_account =e.detail.value;
            }
        })
        this.setData({platinfos:platinfos})
    },
    clearInput: function(e){
        var obj = {},
            pid = e.currentTarget.dataset.pid,
            platinfos = this.data.platinfos;
        platinfos.forEach((ele,i)=>{
            if(i == pid){
                ele.platform_account = '';
            }
        })
        this.setData({platinfos:platinfos})
    },
})