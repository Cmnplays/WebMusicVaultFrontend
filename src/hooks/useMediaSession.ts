import { useEffect } from "react";

function useMediaSession(playing, playingSong, controllers) {
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