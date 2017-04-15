// pages/user/user.js
var translateUserInfo = require("../../utils/translateUserInfo");

var app = getApp();
Page({
  data: {
    userInfo: {},
    count: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    //获取用户信息
    this.getUserInfo();
    //获取收藏数量
  //  this.getcollectCount();

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getcollectCount();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    this.getcollectCount();
    this.getUserInfo();
  },
  getcollectCount: function () {
    try {
      var count = wx.getStorageSync("collect").length || 0;
      this.setData({
        count: count
      })
    } catch (e) {
      console.group("获取收藏数失败");
      console.error("错误名称: " + e.name);
      console.error("错误信息" + e.message);
      console.error("错误号" + e.number || "不存在");
      console.groupEnd();
    }
  },
  getUserInfo: function () {

    wx.showToast({
      title: "加载中",
      icon: "loading"
    })

    var that = this;
    app.getUserInfo(user => {
      that.setData({
        userInfo: new translateUserInfo(user)
      })

      wx.hideToast();
    })

  }
})