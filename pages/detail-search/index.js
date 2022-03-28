// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords:[],
    suggestSongs:[],
    searchValue:"",
    suggestSongNodes:[],
    resultSongs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取页面数据
    this.getPageData()
  },

  getPageData:function(){
    getSearchHot().then(res => {
      this.setData({ hotKeywords:res.result.hots })
    })
  },

  handleSearchChange:function(event){
    // 1.获取输入的关键字
    const searchValue = event.detail
    // 2.保存关键字
    this.setData({searchValue})
    // 3.关键词为空时
    if(!searchValue.length){
    // 当没有关键字时不搜索，那么就不会更新suggestSongs数据，所以当没有关键字时要清空searchValue
    /* 解决搜索框快速删除时最后依然显示suggestSongs的bug
       原因:做了防抖操作，当快速清除时，最后一次网络请求不会发送但是上一次网络请求的结果仍然会设置到suggestSongs中
       解决方式：使用防抖函数的取消功能
    */
      this.setData({suggestSongs:[],suggestSongNodes:[],resultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return
    }
    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({suggestSongs})
      if(!suggestSongs) return
      // 2.对歌曲名转成nodes
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongNodes = []
      for(const keyword of suggestKeywords){
        const nodes = stringToNodes(keyword,searchValue)
        suggestSongNodes.push(nodes)
      }
      this.setData({suggestSongNodes})
    })
  },

  handleSearchAction:function(){
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs:res.result.songs })
    })
  },

  handleKeywordItemClick(event){
    const keyword = event.currentTarget.dataset.keyword
    this.setData({ searchValue:keyword })
    this.handleSearchAction()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})