// pages/home/home.js
var CATEGORY_URL = getApp().globalData.hostName + 'categorys'

Page({
  data: {
    library: [],
    currentEvent: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.getLibrary();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  removeBook: function (key) {
    wx.showModal({
      title: '提示',
      content: '是否移除小书',
      success:  (res) =>{
        if (res.confirm) {
          try {
            var library = wx.getStorageSync("library") || {};
          } catch (e) {
            console.dir(e);
          }
          
          var newLibrary = {};
          for (var attr in library) {
            if (library.hasOwnProperty(attr)) {
              console.dir(  key);
              console.dir(attr);
              if( attr !== key ){
                newLibrary[attr] = library[attr];
              }
            }
          }

          wx.setStorage({
            key: "library",
            data: newLibrary,
            fail: (e) => { console.error(e) },
            success: () => { this.getLibrary() }
          })
        }
      }
    })

    return false;
  },


  startHandle: function (event) {
    console.dir(event);
    this.setData({
      currentEvent: {
        timeStamp: event.timeStamp,
        currentTarget: event.currentTarget
      }
    })
  },
  endHandle: function (event) {
    console.dir(event);
    var startEvent = this.data.currentEvent;
    if (typeof startEvent == "object" && startEvent) {
      if (event.currentTarget.id === startEvent.currentTarget.id) {
        if (event.timeStamp - startEvent.timeStamp < 400) {
          this.toArticle(event.currentTarget.dataset.url);
        } else {
          console.dir(event.currentTarget  );
          this.removeBook(event.currentTarget.dataset.key);
        }
      }
    }
  },



  toFind: function () {
    wx.switchTab({
      url: "/pages/find/find"
    })
  },

  toArticle: function (url) {
    wx.navigateTo({
      url: url
    })
  },

  getLibrary: function (complate = () => { }) {
    wx.showToast({
      title: '加载中',
      icon: "loading"
    });

    new Promise((resolve, reject) => {
      wx.getStorage({
        key: "library",
        success: res => resolve(res),
        fail: error => reject(error)
      })
    }).then(result => {

      var oLibrary = result.data || {};
      var library = [];
      for (var key in oLibrary) {
        if (oLibrary.hasOwnProperty(key)) {
          var book = oLibrary[key];
          book['coverUrl'] = `${CATEGORY_URL}/${book.category}/${book.bookName}/cover.jpg`;
          book['unique_key'] = `${book.category}-${book.bookName}`;
          library.push(book);
        }
      }
      this.setData({
        library: library
      })
      wx.hideToast();
      complate.apply();
    }).catch(e => {
      console.error(e);
    })
  },

  onPullDownRefresh: function () {
    this.getLibrary(wx.stopPullDownRefresh.bind(wx));
  }

})
