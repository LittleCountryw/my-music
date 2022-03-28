import lcRequest from './index'
import lcResquest from './index'
export function getSongDetail(ids){
  return lcResquest.get('/song/detail',{
    ids
  })
}
export function getSongLyric(id){
  return lcRequest.get('/lyric',{
    id
  })
}