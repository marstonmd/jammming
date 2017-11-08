const clientId = '93ad696be10f45899723ddf8bf05cd9d';
const redirectURI = 'http://spammming-jammming.surge.sh';
let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    else {
      const accessTokenReg = window.location.href.match(/access_token=([^&]*)/);
      const expiresInReg = window.location.href.match(/expires_in=([^&]*)/);

      if ( accessTokenReg && expiresInReg ) {
        accessToken = accessTokenReg[1];
        expiresIn = expiresInReg[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      }
      else { //this section could be improved to automatically serve the previously entered search term, instead of forcing the user to re-enter after auth
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        return;
      }
    }
  }, //end getAccessToken()

  search(term) {
    do {
      Spotify.getAccessToken();
    } while(accessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
      }
    });
  }, //end search()
  
  savePlaylist(playlistName,trackURIs) {
    if (!playlistName || !trackURIs) {
      console.log('Error: empty playlistName, trackURIs, or both. Returning without saving.');
      return;
    }
    Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`}
    let userId;
    let playlistId;
    fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(jsonResponse => {
      if (jsonResponse.id) {
        userId = jsonResponse.id;
        return userId;
      };
    }).then(userId => {
      //POST to create new playlist using userId
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName, description: 'Made with Jammming App'})
      }).then(response => response.ok ? response.json() : null
      ).then(jsonResponse => {
        if (jsonResponse) {
          playlistId = jsonResponse.id;
          return playlistId;
        }
      })
    }).then(playlistId => {
      //POST to create new tracks inside of returned new playlistId
      fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: trackURIs})
      })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse);
    });
  } //end savePlaylist()
}; //end Spotify;

export default Spotify;
