let App = getApp()

const uploadImageUrl = App.Config.basePath + 'api/Common/uploadImage'

Page({
	data: {
        order_id: '',
        order_plate: '',
        order_no: '',
        order_account: '',
        order_price: '',
        order_shop: '',
        order_date: '',
        order_time: '',
        more: [],
        start_date: '',
        end_date: '',
        platinfos: [],
        platforms: [],
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

        var order_id = e.order_id ? e.order_id : 0;

        var date = new Date(),
            startMonth = App.Tools.formatTime(new Date(date.setDate(1)),'-'),
            endMonth = App.Tools.formatTime(new Date(),'-'),
            now = App.Tools.formatTime(new Date(),'-',":");
        this.setData({
            start_date:startMonth,
            end_date:endMonth,
            order_id:order_id,
            order_date:now.split(' ')[0],
            order_time:now.split(' ')[1]
        })
        this.getPlatformList();
        this.getPlatform();
        this.getUserOrderDetail();

    },
    getUserOrderDetail: function(e){
        var id = this.data.order_id;
        App.HttpService.getUserOrderDetail({id:id})
        .then(res=>{
            console.log("getUserOrderDetail", res);
            if(res.data.state == 0){
                this.$wuxToast.show({
                    type: 'cancel',
                    timer: 1000,
                    color: '#fff',
                    text: res.msg,
                    // success: () => console.log('已完成')
                })
                return !1;
            }else{
                var platforms = this.data.platforms;
                var order_plateid = res.data.order.order_plateid;
                var order_plate = '';
                platforms.forEach(ele=>{
                    if(order_plateid==ele.id){
                        order_plate = ele.name;
                    }
                })
                this.setData({
                    order_plate: order_plate,
                    order_plateid: order_plateid,
                    order_no: res.data.order.order_no,
                    order_account: res.data.order.order_account,
                    order_price: res.data.order.order_price,
                    order_shop: res.data.order.order_shop,
                    order_date: res.data.order.order_date,
                    more: res.data.order.more,
                })
            }
        })
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
            console.log(res)
            App.WxService.showToast({
                title: '上传中',
                icon: 'loading',
                duration: 500
            })
            this.uploadImage(res.tempFilePaths);
        })
    },
    uploadImage(filePaths){
        var userId = App.WxService.getStorageSync('userId');
        var token  = App.WxService.getStorageSync('token');
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
                console.log(res);
                var obj = JSON.parse(res.data);
                var url = App.renderImage(obj.data.file);
                var pics = this.data.more;
                pics.push({id: i+1, pic: url});
                this.setData({
                    more: pics
                })
            })
        }
    },
    showGallery(e) {
        const that = this;
        const current = e.currentTarget.dataset.current;
        var pics = this.data.more;
        var urls = [];
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
        var order_date = this.data.order_date;
        var more = this.data.more;
        if(!order_date){
            this.$wuxToast.show({
                type: 'cancel',
                timer: 1000,
                color: '#fff',
                text: '请选择订单日期',
                // success: () => console.log('已完成')
            })
            return !1;
        }
        if(!more){
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
        this.editUserOrder();
    },
    editUserOrder: function(){
        var order_id = this.data.order_id;
        var order_plateid = this.data.order_plateid;
        var order_no = this.data.order_no;
        var order_shop = this.data.order_shop;
        var order_account = this.data.order_account;
        var order_price = this.data.order_price;
        var order_date = this.data.order_date;
        var more = this.data.more;
        var userId = App.WxService.getStorageSync('userId');
        App.HttpService.editUserOrder({userId:userId,id:order_id,order_plateid:order_plateid,order_no:order_no,order_account:order_account,order_shop:order_shop,order_price:order_price,order_date:order_date,more:more})
        .then(res=>{
            console.log("editUserOrder", res);
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