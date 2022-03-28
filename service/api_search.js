import lcRequest from './index'
export function getSearchHot(){
  return lcRequest.get("/search/hot")
}

export function getSearchSuggest(keywords){
  return lcRequest.get("/search/suggest",{
    keywords,
    type:"mobile"
  })
}

export function getSearchResult(keywords){
  return lcRequest.get("/search",{
    keywords
  })
}