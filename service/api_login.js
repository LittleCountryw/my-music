import {lcLoginRequest} from './index'
export function getLoginCode(){
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail:err => {
        console.log(err);
        reject(err)
      }
    })
  })
}

export function codeToToken(code){
  return lcLoginRequest.post('/login',{code})
}

export function checkToken(token){
  return lcLoginRequest.post('/auth',{}, {
    token
  })
}

export function checkSession(){
  return new Promise((resolve)=>{
     wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}