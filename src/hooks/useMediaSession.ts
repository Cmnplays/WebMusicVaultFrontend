import {useAppSelector} from "../store/hook.ts"
function useMediaSession(controllers){
const playingSong=useAppSelector(state=>state.song.playingSong)
if(!"medisession" in navigator){
    return
}
navigator.mediaSession.metadata= new MediaMetaData({
   title: playingSong.title
})
navigator.mediaSession.setActionHandler("nexttrack",controllers.moveToNextSong)
navigator.mediaSession.setActionHandler("previoustrack",controllers.moveToPreviousSong)
}
export default useMediaSession