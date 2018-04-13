let App = getApp()

const SetAvatarUrl = App.Config.basePath + 'api/User/avatarUpload'

Page({
	data: {
        user: [],
        uname: '',
        mobile: '',
        avatar: '',
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

        this.WxValidate = App.WxValidate({
            mobile: {
                required: !0,
                tel: !0,
            },
            uname: {
                required: !0,
            },
        }, {
            mobile: {
                required: '请输入手机号',
            },
            uname: {
                required: '请输入姓名',
            },
        })

        this.getUser();
    },
    getUser: function(e){
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.GetUser({userId:userId})
        .then(res=>{
            console.log("GetUser", res);
            this.setData({
                user:res.data.user,
                uname: res.data.user.user_login,
                mobile: res.data.user.mobile,
                avatar: res.data.user.avatar,
            })
        })
    },
    chooseImage: function(e){
        App.WxService.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        })
        .then(res=>{
            console.log(res)
            App.WxService.showToast({
                title: '上传中',
                icon: 'loading',
                duration: 500
            })
            this.uploadImage(res.tempFilePaths[0])
        })
    },
    uploadImage(filePath){
        var that = this;
        var userId = App.WxService.getStorageSync('userId');
        var token  = App.WxService.getStorageSync('token');
        wx.uploadFile({
            url: SetAvatarUrl,
            filePath: filePath,
            name: 'avatar',
            formData:{
                'PictureId': '0',
                'userId': userId,
                'token': token
            },
            success: function(res){
                console.log(res);
                var data = JSON.parse(res.data);
                var avatar = App.renderImage(data.data.file);
                that.setData({avatar:avatar})
            }
        })
    },
    formSubmit: function(e){
        if (!this.WxValidate.checkForm(e)) {
            const error = this.WxValidate.errorList[0];
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: `${error.msg}`,
                // success: () => console.log('已完成')
            })
            return !1;
        }
        this.SetUser();
    },
    SetUser: function(){
        var user_login = this.data.uname;
        var mobile = this.data.mobile;
        var avatar = this.data.avatar;
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.SetUser({userId:userId,user_login:user_login,mobile:mobile,avatar:avatar})
        .then(res=>{
            console.log("SetUser", res);
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
    }
})