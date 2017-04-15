Page({
    data: {
        inputShowed: false,
        inputVal: ""
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    setBookquery: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    searchData:function(event){
        console.dir( this.data.inputVal );
        wx.navigateTo({
            url:`/pages/bookList/bookList?query=${this.data.inputVal}`

        })
    }
});