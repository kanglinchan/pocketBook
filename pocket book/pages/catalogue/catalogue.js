// /pages/catalogue/catalogue.js
var wxFetch = require("../../utils/wxFetch")
var App = getApp();
var CATALOG_URL = App.globalData.hostName + "categorys/";

Page({
  data: {
    sectionList: [],
    category: "",
    bookName: ""
  },
  onLoad: function (options) {
    //设置参数
    this.setData({
      category: options.category,
      bookName: options.bookName
    })
    //获取目录数据

  },
  onShow: function () {
    wx.showToast({
      title: "加载中···",
      icon: "loading"
    });
    this.getCatalogue(wx.hideToast.bind(wx))
  },

  getCatalogue(complate = () => { }) {
    wxFetch(`${CATALOG_URL + this.data.category}/${this.data.bookName}/catalogue.json`)
      .then((res) => {
        this.setData({
          sectionList: res.data
        });
        complate.apply(this);
      })
  },

  onPullDownRefresh: function () {
    wx.showToast({
      title: "加载中···",
      icon: "loading"
    });
    getCatalogue(() => {
      wx.stopPullDownRefresh(wx);
      wx.hideToast();
    })

  }
})