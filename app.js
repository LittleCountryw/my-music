// app.js
import {getLoginCode,codeToToken,checkToken,checkSession} from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'
App({
  globalData:{
    screenWidth:0,
    screenHeight:0,
    statusBarHeight:0,
    navBarHeight:44,
    deviceRadio:0
  },
  onLaunch:async function(){
    //1. 获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio
    
    //2.用户默认登录
    const token = wx.getStorageSync(TOKEN_KEY)
    // 查看token是否过期
    const checkResult = await checkToken(token)
    // 判断session是否过期
    const isSessionExpire = await checkSession()
    if(!token ||checkResult.errorCode ||!isSessionExpire){
      this.loginAction()
    }
  },
  loginAction:async function(){
    // 1.获取code
    const code = await getLoginCode()
    // 2.将code发送给服务器
    const result = await codeToToken(code)
    const token = result.token
    // 3.将token写入缓存
    wx.setStorageSync(TOKEN_KEY,token)
  }
  
})
