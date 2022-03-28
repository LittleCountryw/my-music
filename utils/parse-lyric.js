export function parseLyric(lyricString) {
  // 使用正则匹配出歌曲时间
  const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  const lyricStrings = lyricString.split('\n')
  const lyricInfos = []
  for(const lineString of lyricStrings){
    const timeResult = timeRegExp.exec(lineString)
    // console.log(timeResult);
    if(!timeResult) continue
    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecondTime = timeResult[3]
    const millsecond = millsecondTime.length === 2 ? millsecondTime * 10 : millsecondTime * 1
    const time = minute + second + millsecond
    
    // 2.获取歌词文本
    const text = lineString.replace(timeRegExp,'')
    // const text = lineString.replace(timeResult[0],'')
    lyricInfos.push({time,text})
  }
  return lyricInfos
}