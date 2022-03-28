// pages/music-player/index.js

import { audioContext } from '../../store/index'
import { playerStore } from '../../store/index'

const playModeNames = ['order','repeat','random']

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 上面是需要共享的数据
    id:0,
    // 这部分是网络请求的数据
    currentSong:{},
    durationTime:0,
    lyricInfos:[],
    //这部分是监听歌曲播放的数据 
    currentTime:0,
    currentLyricText:"",
    currentLyricIndex:0,

    // 下面是页面本身要使用的数据 
    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    
    sliderValue:0,
    isSliderChanging:false,
    lyricScrollTop:0,

    isPlaying:true,
    playingName:'pause',

    playModeIndex:0,
    playModeName:'order'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.保存id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    this.calcContentHeight()
  },


  // ====================== 事件处理 ===========================

  handleBackBtnClick:function(){
    wx.navigateBack()
  },

  handleSwiperChange:function(event){
    const current = event.detail.current
    this.setData({ currentPage:current })
  },

  handleSliderChanging:function(event){
    const value = event.detail.value
    const currentTime = this.data.durationTime * (value / 100)
    this.setData({isSliderChanging:true,currentTime})
  },

  handleSliderChange:function(event){
    // 1.获取slider变化的值
    const value = event.detail.value
    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * (value / 100)
    // 3.播放currentTime处的音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // 4.记录最新的sliderValue
    this.setData({ sliderValue:value,isSliderChanging:false })
    // 如果控件之前处于暂停状态，拖动后让其变成播放状态
  },

  handlePlayBtnClick:function(){
    playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
  },
  handleModeBtnClick:function(){
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    // 0 1 2 
    if(playModeIndex > playModeNames.length-1){
      playModeIndex = 0
    }
    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex',playModeIndex)
  },

  handleNextBtnClick:function(){
    playerStore.dispatch("changeNewMusicAction")
  },
  handlePrevBtnClick:function(){  
    playerStore.dispatch("changeNewMusicAction",false)
  },
  // ====================== 页面其他逻辑 ===========================

  calcContentHeight:function(){
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    const deviceRadio = globalData.deviceRadio
    this.setData({ contentHeight, isMusicLyric: (deviceRadio >= 2)})
  },

  // ====================== 数据监听 ===========================
  setupPlayerStoreListener:function(){
    // 1. 监听currentSong duration lyricInfos
    playerStore.onStates(["currentSong","durationTime","lyricInfos"],
    // 传过来的是一个对象，直接解构
      ({currentSong,durationTime,lyricInfos}) => {
        // console.log(currentSong,durationTime,lyricInfos); 某一项数据变化时只将那一项的值传过来，其他都是undefined，所以要if判断
        if(currentSong) this.setData({currentSong})
        if(durationTime) this.setData({durationTime})
        if(lyricInfos) this.setData({ lyricInfos })
      }
    )
    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime","currentLyricText","currentLyricIndex"],
    ({currentTime, currentLyricText, currentLyricIndex})=>{
      if(currentTime && !this.data.isSliderChanging){
        const sliderValue = currentTime / this.data.durationTime * 100
        // 在页面中处理sliderValue
        this.setData({currentTime,sliderValue})
      } 
      if(currentLyricText) this.setData({currentLyricText})
      // 在页面中处理scrollTop
      if(currentLyricIndex){
        this.setData({currentLyricIndex,lyricScrollTop:currentLyricIndex*35})
      }
    })

    // 3.监听是否播放，播放模式
    playerStore.onStates(["isPlaying","playModeIndex"],({isPlaying, playModeIndex})=>{
      // 由于isPlaying是布尔值，所以要判断的是isPlaying与undefined的关系
      if(isPlaying !== undefined){
        this.setData({
          isPlaying,
          playingName: isPlaying ? 'pause' : 'resume'
        })
      }
      // 由于playModeIndex可能为0，所以要判断的是playModeIndex与undefined的关系
      if(playModeIndex !== undefined){
        this.setData({playModeIndex,playModeName:playModeNames[playModeIndex]})
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})