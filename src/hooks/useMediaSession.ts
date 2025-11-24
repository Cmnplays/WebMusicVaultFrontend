
function useMediaSession(controllers){
if(!"medisession" in navigator){
    return
}

navigator.mediaSession.metadata= new MediaMetaData({
   title: playingSong.title
})
}
export default useMediaSession