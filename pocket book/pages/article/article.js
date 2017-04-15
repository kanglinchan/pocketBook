// pages/article/article.js
var WxParse = require('../../assets/lib/wxParse/wxParse.js');
var wxFetch = require("../../utils/wxFetch");
var App = getApp();
var CATALOG_URL = App.globalData.hostName + 'categorys/';


Page({
	data: {
		// 确定一个数据名称
		wemark: {},
		animationData: {},
		showConfigureBar: false,
		catalogues: [],
		category: "",
		bookName: "",
		index: null,
		markSource: "",
		stauts: "loading",
		key: "",
		collected: false,
		required_key: null
	},
	onLoad: function (options) {


		//var article = '```html\n<div>我是HTML代码</div>\n```';
		/**
		* WxParse.wxParse(bindName , type, data, target,imagePadding)
		* 1.bindName绑定的数据名(必填)
		* 2.type可以为html或者md(必填)
		* 3.data为传入的具体数据(必填)
		* 4.target为Page对象,一般为this(必填)
		* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
		*/




		//获取目录数据
		wxFetch(`${CATALOG_URL + options.category}/${options.bookName}/catalogue.json`)
			.then(res => {

				var key = options.category + "-" + options.bookName;
				var index = 0;
				if (!options.index) {
					try {
						var value = wx.getStorageSync(key);
					} catch (e) {
						console.error(e);
					}
					index = Number(value) || index;
				} else {
					index = Number(options.index);
				}

				this.setData({
					catalogues: res.data,
					bookName: options.bookName,
					category: options.category,
					index: index,
					key: key,
					required_key: `${options.category}-${options.bookName}-${index}`
				})

				//当前章节存到本地
				this.saveIndex(index);

				//设置标题名称
				this.setNavigationBarTitle();

				//获取文章数据
				this.getSection()
			})

	},
	onReady: function () {

		//设置configure bar动画
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: "ease-in-out"
		})
		this.animation = animation;

	},

	//设置动画
	switchConfigureBar: function (event) {
		this.toggle();
	},

	//阻止冒泡；处理收藏
	collectHandle: function (event) {
		console.dir(event.target.dataset.tag == "collect");
		if (event.target.dataset.tag == "collect") {
			if (this.data.collected) {
				this.removeCollect();
			} else {
				this.addCollection();
			}

		}
	},

	//切换显示configure bar
	toggle: function () {
		//为真时隐藏
		if (this.data.showConfigureBar) {
			this.hide();
			this.data.showConfigureBar = false;
		} else {
			this.show();
			this.data.showConfigureBar = true;
		}
	},

	show: function () {
		this.animation.translateY(0).step();
		this.setData({
			animationData: this.animation.export()
		})
	},

	hide: function () {
		this.animation.translateY(200).step();
		this.setData({
			animationData: this.animation.export()
		})
	},

	//下拉刷新

	setCurrentSection: function (index) {

		if (this.data.stauts == "loading") {
			return false;
		}
		this.setData({
			stauts: "loading"
		})
		//请求下一个章节
		this.setData({
			index: index,
			required_key: `${this.data.category}-${this.data.bookName}-${index}`
		})
		this.getSection();
		this.saveIndex(index);
		this.setNavigationBarTitle();
	},

	lower: function () {
		var next = this.data.index + 1;
		if (next < this.data.catalogues.length) {
			this.setCurrentSection(next);
		} else {
			this.setData({
				stauts: "end"
			})
		}
	},

	upper: function () {
		var previous = this.data.index - 1;
		if (previous >= 0) {
			this.setCurrentSection(previous);
		}
	},

	//获取数据
	getSection() {
		//显示加载
		wx.showToast({
			title: '加载中···',
			icon: "loading"
		})

		var sectionUrl = this.data.catalogues[this.data.index].section_url;
		wxFetch(`${CATALOG_URL + this.data.category}/${this.data.bookName}/${sectionUrl}`)
			.then(res => {
				//更新data数据
				this.setData({
					markSource: res.data,
					stauts: "loaded",
				})

				//编译
				var that = this;
				WxParse.wxParse('section', 'md', this.data.markSource, that, 5);

				this.judgeCollectIcon();
				wx.hideToast();
			}).catch(e => {
				console.error(e);
			});

	},
	//保存当前章节
	saveIndex(index) {
		try {
			wx.setStorageSync(this.data.key, index);
		} catch (e) {
			console.error(e);
		}
	},
	setNavigationBarTitle() {
		wx.setNavigationBarTitle({
			title: this.data.catalogues[this.data.index].section_name
		})
	},
	judgeCollectIcon: function () {
		try {
			var collectList = wx.getStorageSync("collect") || [];
		} catch (e) {
			console.group("get collect list");
			console.error("name: " + e.name);
			console.error("message: " + e.message);
			console.error("number: " + e.number);
			console.groupEnd();
		}
		var exists = collectList.filter(collect => {
			return (collect.required == this.data.required_key)
		});
		if (exists.length) {
			this.setData({
				collected: true
			})
		} else {
			this.setData({
				collected: false
			})
		}
		console.dir(exists);
		console.dir(this.data);
	},
	addCollection: function () {
		try {
			var value = wx.getStorageSync("collect") || [];
		} catch (e) {
			console.group("收藏到本地错误");
			console.error(e);
			console.groupEnd();
		}
		value = value.concat({
			sectionName: this.data.catalogues[this.data.index].section_name,
			bookName: this.data.bookName,
			category: this.data.category,
			index: this.data.index,
			required: this.data.required_key
		});
		JSON.stringify(value);
		wx.setStorageSync("collect", value);
		this.setData({
			collected: true
		});
	},
	removeCollect: function () {
		var value = wx.getStorageSync("collect") || [];
		value = value.filter(collect => {
			if (this.data.required_key == collect.required) {
				return false;
			} else {
				return true;
			}
		})
		JSON.stringify(value);
		wx.setStorageSync("collect", value);
		this.setData({
			collected: false
		});
	}
});
