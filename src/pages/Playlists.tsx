const Playlists = () => {
  return (
    <div>
      <h1 className="text-3xl w-full text-center my-6">
        Playlists Page-Coming Soon!!!
      </h1>
      <div className="text-center">
        <p>This page might follow this structure:</p>
        <div>Create Playlist-button</div>
        <ul>
          <li>
            <h2>Your Playlists</h2>
            <div>(You can make your playlist private or public)</div>
            <div>
              (Might also add a button to save the songs maximum 10 or 20 to
              local storage for listening it without internet)
            </div>
            <ul>
              <li>My Playlist 1</li>
              <li>My Playlist 2</li>
              <li>My Playlist 3</li>
              <li>My Playlist 4</li>
            </ul>
          </li>
          <li>
            <h2>Public Playlists</h2>
            <ul>
              <li>Playlist 1</li>
              <li>Playlist 2</li>
              <li>Playlist 3</li>
              <li>Playlist 4</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Playlists;
