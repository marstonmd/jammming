import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      trackURIs: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if(this.state.playlistTracks.every(playlistTrack => !playlistTrack.id.includes(track.id))) {
      let playlistTracks = this.state.playlistTracks;
      playlistTracks.push(track);
      this.setState({playlistTracks: playlistTracks});
    }
  }
  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    this.setState({playlistTracks: playlistTracks});
  }
  updatePlayListName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => `spotify:track:${track.id}`);
    this.setState({trackURIs: trackURIs},() => {
      Spotify.savePlaylist(this.state.playlistName,this.state.trackURIs);
      // changed below to reset state of playlistTracks to empty array, rather than searchResults
      this.setState({playlistName: 'New Playlist', playlistTracks: []});
    });
  }
  search(term) {
    if(!term) {
      console.log('Submitted empty search result. Cancelling search.')
      return
    };
    //console.log(`Search term searched: ${term}`);
    Spotify.search(term).then(searchResults => this.setState({searchResults: searchResults}));
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlayListName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
