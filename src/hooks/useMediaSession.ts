import { useEffect } from "react";
import type { Song } from "../services/song.services";
type controls={
moveToNextSong: ()=>void
,moveToPreviousSong: ()=>void
}
function useMediaSession(playing: boolean, playingSong:Song | null, controllers:controls) {
  useEffect(() => {
    if (!("mediaSession" in navigator) || !playingSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: playingSong.title
 });

    navigator.mediaSession.setActionHandler(
      "nexttrack",
      controllers.moveToNextSong
    );

    navigator.mediaSession.setActionHandler(
      "previoustrack",
      controllers.moveToPreviousSong
    );
  }, [playing, playingSong]);
}

export default useMediaSession;