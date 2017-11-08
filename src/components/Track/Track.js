import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }
  addTrack() {
    // Calls .onAdd prop passed through from origin App.js
    // Passes current track prop passed from TrackList.js as argument
    this.props.onAdd(this.props.track);
  }
  removeTrack() {
    // Calls .onRemove prop passed through from origin App.js
    // Passes current track prop passed from TrackList.js as argument
    this.props.onRemove(this.props.track);
  }
  renderAction() {
    // Determines which action symbol and onClick action to render for track
    // from boolean isRemoval prop passed from SearchResults.js or Playlist.js
    return (
      !this.props.isRemoval ?
      <a className="Track-action" onClick={this.addTrack}>+</a>
      :
      <a className="Track-action" onClick={this.removeTrack}>-</a>
    )
  }
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3> {this.props.track.name}</h3>
          <p> {this.props.track.artist} | {this.props.track.album} </p>
        </div>
        {this.renderAction()}
      </div>
    );
  }
};

export default Track;
