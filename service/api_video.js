import lcRequest from './index'

export function getTopMV(offset,limit=10){
  return lcRequest.get("/top/mv",{offset,limit})
}

/**
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id){
  return lcRequest.get("/mv/url",{id})
}

 /**
  * 请求MV的详情
  * @param {number} mvid MV的id
  */
 export function getMVDetail(mvid){
   return lcRequest.get("/mv/detail",{mvid})
 }

/**
 * 请求MV的相关
 */
export function getRelatedVideo(id){
  return lcRequest.get("/related/allvideo",{
    id
  })
}