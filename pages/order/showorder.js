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
        order_state: 1,
	},
	onLoad: function(e){
        this.$wuxToast = App.wux(this).$wuxToast;
        this.$wuxGallery = App.wux(this).$wuxGallery;

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
                this.setData({
                    order_plate: res.data.order.order_plate,
                    order_no: res.data.order.order_no,
                    order_account: res.data.order.order_account,
                    order_price: res.data.order.order_price,
                    order_date: res.data.order.order_date,
                    order_shop: res.data.order.order_shop,
                    more: res.data.order.more,
                    order_state: res.data.order.state,
                })
            }
        })
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
            // delete: (current, urls) => {
            //     pics.splice(current, 1);
            //     that.setData({
            //         more: pics,
            //     })
            //     return !0
            // },
            callback: () => console.log('Close gallery')
        })
    },
})