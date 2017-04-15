var wxFerch = require("../../utils/wxFetch");


Page({
  data: {
    query: "",
    books:[],
    CATEGORY_URL: getApp().globalData.hostName+"categorys"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      query: options.query
    })

    wx.showToast({
      title:"正在加载···",
      icon:"loading"
    })

    wxFerch(`https://api.github.com/search/code?q=${this.data.query}%20in:path+filename:introduction.json+repo:kanglinchan/pocketbook`)
      .then(res => {
        var { data: { items: [...list] } } = res;
        
        var books = list.map((el,index, array)=>{
            var book = el['path'].match(/^[-\w]+\/([^\/]+)\/([^\/]+)\/[-\w\.]+$/);
            return {
              category: book[1],
              bookName: book[2],
              index: index
            }
        })
        this.setData({
          books: books
        })
        wx.hideToast();
      
      }).catch(err => {
        console.dir(err);
      })

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
  }
})