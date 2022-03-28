// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
const playerStore = new HYEventStore({
  state:{

    isFirstPlay:true,
    isStoping:false,

    id:0,
    currentSong:{},
    durationTime:0,
    lyricInfos:[],

    currentTime:0,
    currentLyricText:"",
    currentLyricIndex:0,

    isPlaying:true,
    playModeIndex:0,

    playListSongs:[],
    playListIndex:0
  },
  actions:{
    // { id }是直接对id进行了解构
    playMusicWithSongIdAction(ctx, {id,isRefresh=false}){
      if(ctx.id === id && !isRefresh){
        // this.dispatch("changeMusicPlayStatusAction",ctx.isPlaying)
        this.dispatch("changeMusicPlayStatusAction",true)
        return
      }
      ctx.id = id

      // 0.清空上次播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.currentTime = 0
      ctx.lyricInfos = []
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''
      
      // 1.网络请求
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyricInfos = parseLyric(lyricString)
        ctx.lyricInfos = lyricInfos
      })
      // 2.设置音乐开始播放
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      audioContext.title = id

      // 3.对音乐播放做监听处理,同一个audioContext不需要加多次监听
      if(ctx.isFirstPlay){
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
      
    },

    setupAudioContextListenerAction(ctx){

      // 监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
  
      // 监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000

        // 2.根据当前时间修改currentTime
        ctx.currentTime = currentTime

        // 3.根据当前时间查找设置歌词
        let i = 0
        if(!ctx.lyricInfos.length) return
        for(;i < ctx.lyricInfos.length;i++){
          const lyricInfo = ctx.lyricInfos[i]
          if(currentTime < lyricInfo.time){
            break
          }
        }
        const currentIndex = i-1
        if(ctx.currentLyricIndex !== currentIndex){
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricText = currentLyricInfo.text
          ctx.currentLyricIndex = currentIndex
        }
      })

      audioContext.onPlay(()=>{
        // 不需要dispatch changeMusicPlayStatusAction原因
        // 歌曲的播放状态已经处于play状态了没必要再设置一次
        ctx.isPlaying = true
      })

      audioContext.onPause(() => {
        ctx.isPlaying = false
      })

      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })

      // 监听歌曲播放完成
      audioContext.onEnded(()=>{
        this.dispatch("changeNewMusicAction")
      })

    },
    changeMusicPlayStatusAction(ctx,isPlaying=true){
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying && ctx.isStoping){
        audioContext.src =  `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        ctx.isStoping = false
      }
      // 因为是异步的，所以放在action里面
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx,isNext=true){
      // 1.获取当前索引
      let index = ctx.playListIndex
      // 2.根据不同模式，获取下一首歌的索引
      switch(ctx.playModeIndex){
        case 0://顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length -1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1://单曲循环
          break
        case 2://随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length) 
          break
      }
      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if(!currentSong){
        currentSong = ctx.currentSong
      }else{
        ctx.playListIndex  = index
      }
      // 4.播放新的歌曲
      this.dispatch("playMusicWithSongIdAction",{id:currentSong.id,isRefresh:true})
    }
  }
})
export {
  audioContext,
  playerStore
}