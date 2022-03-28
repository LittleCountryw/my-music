const BASE_URL = "http://123.207.32.32:9001"
const LOGIN_BASE_URL = "http://123.207.32.32:3000"
class LCRequest {
  constructor(baseURL){
    this.baseURL = baseURL
  }
  request(url,method,params,header={}){
    return new Promise((resolve,reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        header:header,
        data:params,
        success:function(res){
          resolve(res.data)
        },
        fail:reject
      })
    })
  }
  get(url,params,header){
    return this.request(url,"GET",params,header)
  }
  post(url,data,header){
    return this.request(url,"POST",data,header)
  }
}
const lcRequest = new LCRequest(BASE_URL)
const lcLoginRequest = new LCRequest(LOGIN_BASE_URL)
export default lcRequest
export {
  lcLoginRequest
}