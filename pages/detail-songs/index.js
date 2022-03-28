// pages/detail-songs/index.js
import { rankingStore } from '../../store/index'
import { getSongMenuDetail } from '../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    ranking:"",//当ranking有值时退出页面才需要取消监听，所以保存一下ranking
    songInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    const type = options.type
    this.setData({ type })

    if(type==="menu"){
      // 根据id请求歌单信息
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    }else if(type==="rank"){
      // 从store中取榜单信息
      const ranking = options.ranking
      this.setData({ranking})

      rankingStore.onState(ranking,this.getRankingDataHandler)
    }
    
  },

  getRankingDataHandler:function(res){
    this.setData({ songInfo:res })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.ranking){
      rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
    }
  },

})