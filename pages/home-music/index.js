// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'

import { getBanners, getSongMenu } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect,1000,{ leading:true,trailing:true })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight:0,

    banners:[],
    hotSongMenu:[],
    recommendSongMenu:[],

    recommandSongs:[],
    rankings:{ 0:{},2:{},3:{} },

    currentSong:{},
    isPlaying:false,
    playAnimState:"paused"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取轮播图\歌单数据
    this.getPageData()
    // 发起共享数据请求
    rankingStore.dispatch('getRankingDataAction')
    
    // 从store获取共享的数据
    this.setupPlayerStoreListener()
  },

  handleMoreClick:function(){
    // console.log("监听到推荐歌曲更多的点击");
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick:function(event){
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage:function(rankingName){
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.recommandSongs)
    playerStore.setState("playListIndex",index)
  },

  getRankingHandler:function(idx){
    return res => {
      //rankings:{ 0:{},2:{},3:{} }
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0,3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = {...this.data.rankings, [idx]:rankingObj}
      this.setData({rankings: newRankings})
    }
  },
  getPageData:function(){
    getBanners().then(res => {
      // setData在设置data数据上, 是同步的
      // 通过最新的数据对wxml进行渲染, 渲染的过程是异步
      // react中 setState是异步的
      this.setData({ banners:res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu:res.playlists })
    })
    getSongMenu('日语').then(res => {
      this.setData({ recommendSongMenu:res.playlists })
    })
  },

  handleSwiperImageLoaded:function(){
    // console.log("图片加载完成");
    // 图片加载完成后计算图片高度，注意这里的高度不是图片本身的高度而是image组件的高度
    throttleQueryRect(".swiper-image").then(res=>{
      const rect = res[0]
      this.setData({ swiperHeight:rect.height })
    })
    // 由于banners中有多张图片，每次图片加载完后调用函数重新计算高度浪费性能，做节流操作
  },

  handleSearchClick:function(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handlePlayBtnClick:function(){
    playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
    
  },
  handlePlayBarClick:function(){
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  setupPlayerStoreListener:function(){
    // 排行榜监听
    rankingStore.onState("hotRanking",(res)=>{
      if(!res.tracks) return
      const recommandSongs = res.tracks.slice(0,6)
      this.setData({recommandSongs})
    })
    rankingStore.onState("newRanking",this.getRankingHandler(0))
    rankingStore.onState("originRanking",this.getRankingHandler(2))
    rankingStore.onState("upRanking",this.getRankingHandler(3))

    // 播放器监听
    playerStore.onStates(["currentSong","isPlaying"],({currentSong,isPlaying})=>{
      if(currentSong) this.setData({currentSong})
      if(isPlaying !== undefined){
        this.setData({
          isPlaying,
          playAnimState:isPlaying ? "running" : "paused"
        })
      }
    })
  }
})