import lcRequest from './index'
export function getBanners(){
  return lcRequest.get("/banner",{
    type:2
  })
}
export function getRankings(idx){
  return lcRequest.get("/top/list",{
    idx
  })
}

export function getSongMenu(cat="全部",limit=6,offset=0){
  return lcRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id){
  return lcRequest.get('/playlist/detail/dynamic',{
    id
  })
}