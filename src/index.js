import React from 'react';
import ReactDOM from 'react-dom';
import { find } from 'lodash';
import 'react-piano/build/styles.css';

import ControlPanel from './ControlPanel';
import SongsList from './SongsList';
import MyPiano from './Piano';
import './styles.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      song: [],
      songsList: [],
      isPlaying: false,
      isRecording: false,
      selectedSong: null,
      showNameForm: false,
      showSaveDialog: false,
      recordStartTime: null,
    };
    this.input = React.createRef();
  }

  componentDidMount = () => {
    this.setState({
      songsList: this.loadSongsFromStorage(),
    });
  }

  playSong = () => {
    this.setState({
      isPlaying: true,
    });
  }

  addNoteToSong = ({ id, midi, startTime }) => {
    // console.log('ADD:', ({ id, midi, startTime }));
    this.state.song.push({ id, midi, startTime });
    // console.log('ADD:', this.state.song);
  }

  startRecording = () => {
    this.setState({
      isRecording: true,
      recordStartTime: Date.now(),
    });
  }

  stopRecording = () => {
    this.setState({
      isRecording: !this.state.isRecording,
      showSaveDialog: true,
    });
  }

  discartRecord = () => {
    this.setState({
      song: [],
      showSaveDialog: false
    });
  }

  saveRecord = () => {
    this.setState({
      showNameForm: true,
    });
  }

  updateSong = song => {
    this.setState({
      song
    });
  }

  loadSongsFromStorage = () => {
    let songs = [];
    try {
      songs = JSON.parse(localStorage.getItem('songs'));
    } catch (e) {
    }
    return songs;
  }

  handleSubmit = event => {
    event.preventDefault();
    const newSongsList = [
      { name: this.input.current.value, value: this.state.song },
      ...this.state.songsList,
    ];
    localStorage.setItem(
      'songs',
      JSON.stringify(newSongsList)
    )
    this.setState({
      showSaveDialog: false,
      showNameForm: false,
      songsList: newSongsList,
    });
    this.input.current.value = '';
  }

  resetPlay = () => {
    this.setState({
      isPlaying: false,
    })
  }

  selectSong = name => {
    this.setState({
      selectedSong: find(this.state.songsList, { name }),
    });
  }

  render() {
    const {
      song,
      isPlaying,
      songsList,
      isRecording,
      selectedSong,
      showNameForm,
      showSaveDialog,
      recordStartTime,
    } = this.state;

    const {
      playSong,
      resetPlay,
      saveRecord,
      updateSong,
      selectSong,
      discartRecord,
      stopRecording,
      addNoteToSong,
      startRecording,
    } = this;

    return (
      <div>
        <h1>react-piano demos</h1>
        <ControlPanel
          playSong={playSong}
          isPlaying={isPlaying}
          saveRecord={saveRecord}
          isRecording={isRecording}
          selectedSong={selectedSong}
          discartRecord={discartRecord}
          stopRecording={stopRecording}
          showSaveDialog={showSaveDialog}
          startRecording={startRecording}
        />

        {showNameForm &&
          <div>
            <form onSubmit={this.handleSubmit}>
              <input type="text" placeholder="song name" name="songName" ref={this.input} />
              <button>save</button>
            </form>
          </div>}

        <div>
          <MyPiano
            song={song}
            isPlaying={isPlaying}
            resetPlay={resetPlay}
            updateSong={updateSong}
            isRecording={isRecording}
            selectedSong={selectedSong}
            addNoteToSong={addNoteToSong}
            showSaveDialog={showSaveDialog}
            recordStartTime={recordStartTime}
          />
        </div>

        <SongsList songsList={songsList} selectSong={selectSong} />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
