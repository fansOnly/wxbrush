let App = getApp()

const uploadImageUrl = App.Config.basePath + 'api/Common/uploadImage'

Page({
	data: {
        order_plate: '',
        order_plateid: 0,
        order_no: '',
        order_account: '',
        order_price: '',
        order_shop: '',
        order_date: '',
        more: [],
        start_date: '',
        end_date: '',
        platinfos: [],
        platforms: [],
        order_time: ''
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
        this.$wuxGallery = App.wux(this).$wuxGallery;
        this.$wuxActionSheet = App.wux(this).$wuxActionSheet;

        this.WxValidate = App.WxValidate({
            order_plate: {
                required: !0,
            },
            order_shop: {
                required: !0,
            },
            order_no: {
                required: !0,
            },
            order_account: {
                required: !0,
            },
            order_price: {
                required: !0,
            },
        }, {
            order_plate: {
                required: '请选择订单平台',
            },
            order_shop: {
                required: '请输入订单店铺',
            },
            order_no: {
                required: '请输入订单编号',
            },
            order_account: {
                required: '请选择平台ID',
            },
            order_price: {
                required: '请输入订单金额',
            },
        })

        var date = new Date(),
            startMonth = App.Tools.formatTime(new Date(date.setDate(1)),'-'),
            endMonth = App.Tools.formatTime(new Date(),'-'),
            now = App.Tools.formatTime(new Date(),'-',":");
        this.setData({start_date:startMonth,end_date:endMonth,order_date:now.split(' ')[0],order_time:now.split(' ')[1]});
        this.getPlatformList();
    },
    onShow: function(){
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
            this.setData({platinfos:res.data.platform})
        })
    },
    choosePlatform:function(){
        var that = this,
            platinfos= this.data.platinfos,
            platforms= this.data.platforms,
            buttons= [];
        platforms.forEach(ele=>{
            platinfos.forEach(ele2=>{
                if(ele.id == ele2.platform_id){
                    ele2.platform_name = ele.name;
                }
            })
        })
        platinfos.forEach(ele=>{
            buttons.push({text:ele.platform_name+':'+ele.platform_account});
        })
        if(!buttons.length){
            this.$wuxActionSheet.show({
                titleText: '选择平台帐号',
                buttons: [{
                    text: '点击前往添加'
                }],
                buttonClicked(index, item) {
                    wx.navigateTo({
                        url: '../user/userplatform'
                    })
                    return true;
                },
                cancelText: '取消',
                cancel() {},
            })
        }else{
            this.$wuxActionSheet.show({
                titleText: '选择平台帐号',
                buttons: buttons,
                buttonClicked(index, item) {
                    // console.log(item);
                    // console.log(index);
                    var order_plate = item.text.split(':')[0];
                    var order_plateid = 0;
                    platforms.forEach(ele=>{
                        if(order_plate == ele.name){
                            order_plateid = ele.id;
                        }
                    })
                    that.setData({
                        order_plateid: order_plateid,
                        order_plate: order_plate,
                        order_account: item.text.split(':')[1],
                    })
                    return true;
                },
                cancelText: '取消',
                cancel() {},
                // destructiveText: '删除',
                // destructiveButtonClicked() {},
            })
        }
    },
    bindDateChange: function(e) {
        this.setData({
            order_date: e.detail.value
        })
    },
    bindTimeChange: function(e) {
        this.setData({
            order_time: e.detail.value
        })
    },
    chooseImage: function(e){
        App.WxService.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        })
        .then(res=>{
            // console.log(res)
            App.WxService.showToast({
                title: '上传中',
                icon: 'loading',
                duration: 500
            })
            this.uploadImage(res.tempFilePaths);
        })
    },
    uploadImage(filePaths){
        var userId = App.WxService.getStorageSync('userId'),
            token  = App.WxService.getStorageSync('token');
        for(var i = 0;i<filePaths.length;i++){
            App.WxService.uploadFile({
                url: uploadImageUrl, //仅为示例，非真实的接口地址
                filePath: filePaths[i],
                name: 'pics',
                formData:{
                    'PictureId': i,
                    'userId': userId,
                    'token': token
                },
            })
            .then(res=>{
                // console.log(res);
                var obj = JSON.parse(res.data);
                var url = App.renderImage(obj.data.file);
                var pics = this.data.more;
                pics.push({pic: url});
                this.setData({
                    more: pics
                })
            })
        }
    },
    showGallery(e) {
        var that = this,
            current = e.currentTarget.dataset.current,
            pics = this.data.more,
            urls = [];
        pics.forEach(ele=>{
            urls.push(ele.pic);
        })

        this.$wuxGallery.show({
            current: current,
            urls: urls,
            delete: (current, urls) => {
                pics.splice(current, 1);
                that.setData({
                    more: pics,
                })
                return !0
            },
            callback: () => console.log('Close gallery')
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
        var order_date = this.data.order_date,
            order_time = this.data.order_time,
            more = this.data.more;
        if(!order_date || !order_time){
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '请选择日期时间',
                // success: () => console.log('已完成')
            })
            return !1;
        }
        if(!more.length){
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '请上传订单截图',
                // success: () => console.log('已完成')
            })
            return !1;
        }
        // if(!App.Tools.betweenTime(order_date, start_date, end_date)){
        //     this.$wuxToast.show({
        //         type: 'cancel',
        //         timer: 1000,
        //         color: '#fff',
        //         text: '订单日期时间错误',
        //         // success: () => console.log('已完成')
        //     })
        //     return !1;
        // }
        this.addUserOrder();
    },
    addUserOrder: function(){
        var order_plateid = this.data.order_plateid,
            order_no = this.data.order_no,
            order_account = this.data.order_account,
            order_shop = this.data.order_shop,
            order_price = this.data.order_price,
            order_date = this.data.order_date + " " + this.data.order_time,
            more = this.data.more,
            userId = App.WxService.getStorageSync('userId');
        App.HttpService.addUserOrder({userId:userId,order_plateid:order_plateid,order_no:order_no,order_account:order_account,order_shop:order_shop,order_price:order_price,order_date:order_date,more:more})
        .then(res=>{
            console.log("addUserOrder", res);
            if(res.data.state == 1){
                this.$wuxToast.show({
                    type: 'success',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
            }else{
                this.$wuxToast.show({
                    type: 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
            }
        })
    }
})