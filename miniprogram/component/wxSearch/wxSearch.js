import { getStorage, setStorage, setData } from '../../utils/util';

const app = getApp()

// component/wxSearch.js
module.exports={
  init(that) {
    this._setData(that,{
      'searchList':getStorage('searchList') || []
    })
  },
  bindShowLog(e,that) {
    this.showlog(that)
  },
  bindHideLog(e, that) {
    this._setData(that, {
      'searchIsHidden': true
    })
  },
  bindInputSchool(e, that) {
    var val = e.detail.value;
    this.matchStroage(that,val)
  },
  bindSearchAllShow(e,that){
    this._setData(that,{
      searchAllShow: true
    })
  },
  bindGoSearch(e,that){
    let searchList_stroage = getStorage('searchList') || [];
    searchList_stroage.push(e)

    setStorage('searchList', searchList_stroage)
    this._setData(that, {
      inputVal: ''
    })

    var markText = ''
    var tldrCmdDir = 'https://raw.github.com/tldr-pages/tldr/master/pages/common/'
    var tldrCmdPage = tldrCmdDir.concat(e).concat('.md');
    console.log('tldrCmdPage: ', tldrCmdPage)
    wx.vrequest({
      url: tldrCmdPage,
      success: ret => {
        console.log('success: ', ret.data);
        if (ret.statusCode == 404) {
          markText = 'Not Found: \`'.concat(e).concat('\`');
        } else {
          markText = ret.data
        }
        this._setData(that, {
          mdText: markText
        })
      },
      fail: function (ret) {
        console.log('fail: ', ret.data);
        this._setData(that, {
          mdText: ret.data
        })
      }
    })
  },
  bindDelLog(e, that) {
    let val = e.currentTarget.dataset.item;
    let searchList_stroage = getStorage('searchList') || [];
    let index = searchList_stroage.indexOf(val);
    searchList_stroage.splice(index, 1)
    this.updataLog(that,searchList_stroage)
  },
  bindSearchHidden(that) {
    this._setData(that,{
      searchIsHidden: true
    })
  },
  showlog(that){
    let searchList_stroage = getStorage('searchList') || [];
    let searchList = []
    if (typeof (searchList_stroage) != undefined && searchList_stroage.length > 0) {
      for (var i = 0, len = searchList_stroage.length; i < len; i++) {
          searchList.push(searchList_stroage[i])
      }
    }else {
      searchList = searchList_stroage
    }
    this._setData(that, {
      searchIsHidden: false,
      searchAllShow:false,
      searchList
    })
  },
  matchStroage(that,val) {
    let searchList_stroage = getStorage('searchList') || [];
    let searchList = []
    if (typeof (val) != undefined && val.length > 0 && typeof (searchList_stroage) != undefined && searchList_stroage.length > 0) {
      for (var i = 0, len = searchList_stroage.length; i < len; i++) {
        if (searchList_stroage[i].indexOf(val) != -1) {
          searchList.push(searchList_stroage[i])
        }
      }
    } else {
      searchList = searchList_stroage
    }
    this._setData(that, {
      inputVal: val,
      searchList
    })
  },
  _setData(that, param){
    let tabData = that.data.tabData;
    for (var key in param){
      tabData[key] = param[key];
    }
    that.setData({
      tabData
    })
  },
  updataLog(that, list){
    setStorage('searchList', list)
    this._setData(that,{
      searchList: list
    })
  },
  goSchool(val) {
    wx.showModal({
      title: '调往搜索页面',
      content: `你的传值是${val}，带上它去新页面`,
    })
    console.log(val)
    // wx.redirectTo({
    //   url: `/pages/schools/schools?item=${val}`
    // })
  }
}