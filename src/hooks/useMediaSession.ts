function useMediaSession(playing, playingSong,controllers){

if(!"medisession" in navigator || !playing){
    return
}
navigator.mediaSession.metadata= new MediaMetaData({
   title: playingSong.title
})
navigator.mediaSession.setActionHandler("nexttrack",controllers.moveToNextSong)
navigator.mediaSession.setActionHandler("previoustrack",controllers.moveToPreviousSong)
}
export default useMediaSession