// pages/collect/collect.js
Page({
  data: {
    sectionList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //获取本地收藏
    this.getSectionsList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getSectionsList: function () {
    try {
      var sectionList = wx.getStorageSync("collect") || [];
      this.setData({
        sectionList: sectionList
      })
      console.dir(sectionList);
    } catch (e) {
      console.group("pages/collect/collect.js");
      console.error("信息: " + e.message);
      console.error("名称: " + e.name);
      console.error("编号:" + e.number || "不存在")
      console.groupEnd();
    }

  },
  onPullDownRefresh:function(){
    this.getSectionsList();
  }
})