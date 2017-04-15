// pages/test/test.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var App = getApp();
var HOST_URL = App.globalData.hostName;
var CONFIG_URL = HOST_URL + "configure/config.json"

var wxFetch = require("../../utils/wxFetch")


Page({
    data: {
        tabs: [],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        cacheData: [],
        CATEGORYS_URL: HOST_URL + "categorys"
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });


        wx.setNavigationBarTitle({
            title: '当前页面'
        })

        //设置数据
        wx.showToast({
            title: "加载中···",
            icon: "loading"
        });
        this.initPageData(wx.hideToast.bind(wx));
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,

        });
        wx.showToast({
            title: "加载中···",
            icon: "loading"
        });
        this.getList(wx.hideToast.bind(wx));

    },
    toSearch: function (event) {
        wx.navigateTo({
            "url": "/pages/search/search"
        });
    },
    getList: function (complate = () => { }) {

        var categoryName = this.data.tabs[this.data.activeIndex].category;
        if (typeof this.data.cacheData[this.data.activeIndex] === "undefined") {
            //请求分类数据;
            var introductionURL = `${HOST_URL}categorys/${categoryName}/find-index.json`;
            wxFetch(introductionURL).then((res) => {
                var list = [];
                list[this.data.activeIndex] = res.data;
                this.setData({
                    cacheData: Object.assign(this.data.cacheData, list)
                })
                complate.apply(this);
            });
        } else {
            complate.apply(this);
        }


    },
    //初始化页面数据
    initPageData: function (complate = () => { }) {
        wxFetch(CONFIG_URL)
            .then((res) => {
                this.setData({ tabs: res.data });
                this.getList(complate);
            })
    },
    onPullDownRefresh: function () {
        wx.showToast({
            title: "加载中···",
            icon: "loading"
        });
        this.initPageData(() => {
            wx.stopPullDownRefresh();
            wx.hideToast();
        });
    }

});