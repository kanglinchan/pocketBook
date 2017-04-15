// pages/detail/detail.js
var wxFetch = require("../../utils/wxFetch")
var CATALOG_URL = getApp().globalData.hostName + "categorys"

Page({
  data: {
    bookInfo: null,
    bookName: "",
    category: "",
   image:""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      bookName: options.bookName,
      category: options.category,
      image:`${CATALOG_URL}/${options.category}/${options.bookName}/cover.jpg`
    });
    //获取目录数据
    this.getintroductionData();
  },
  toArticle: function () {
    wx.navigateTo({
      url: `/pages/article/article?category=${this.data.category}&bookName=${this.data.bookName}`
    })
  },
  saveBook: function () {

    try {
      var library = wx.getStorageSync("library") || {};
    } catch (e) {
      console.error(e);
    }

    var unique_key = `${this.data.category}-${this.data.bookName}`;
    library[unique_key] = {
      category: this.data.category,
      bookName: this.data.bookName,
    }


    wx.setStorage({
      key: "library",
      data: library,
      success: () => {
        wx.showToast({
          "title": "添加成功",
          icon: "success",
          duration: 1000
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })



  },
  getintroductionData: function (complete = () => { }) {
    wx.showToast({
      title: "正在加载",
      icon: "loading"
    });
    wxFetch(`${CATALOG_URL}/${this.data.category}/${this.data.bookName}/introduction.json`)
      .then(res => {
        this.setData({
          bookInfo: res.data
        });
        console.dir( this.data );
        wx.hideToast();
        complete.call(wx);
      })
  },
  onPullDownRefresh: function () {
    this.getintroductionData(wx.stopPullDownRefresh.bind(wx));

  }
})