import React from 'react';
import ReactDOM from 'react-dom';
import { find } from 'lodash';
import 'react-piano/build/styles.css';

import MyPiano from './Piano';
import SongsList from './SongsList';
import ControlPanel from './ControlPanel';
import SongNameForm from './SongNameForm';
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
      showSaveDialog: false,
      recordStartTime: null,
      showSongNameForm: false,
    };
    this.input = React.createRef();
  }

  componentDidMount = () => {
    this.setState({
      songsList: this.loadSongsFromStorage(),
    });
  }

  songToOptions = song => song.map(s => {
    const adjustDigits = (startTime, endTime) =>
      parseFloat(parseFloat((startTime - endTime) / 1000).toFixed(2));

    let time = adjustDigits(s.startTime, this.state.recordStartTime);
    time = time === -0 ? 0.1 : time;
    time = time < 0 ? 0.1 : time;
    const duration = adjustDigits(s.endTime, s.startTime);

    return {
      midi: s.midi,
      time,
      duration,
    };
  });

  addNodeToSong = ({ id, midi, startTime }) => {
    this.state.song.push({ id, midi, startTime });
  }

  setNodeEndTime = audioNodeId => {
    const updatedSong = [...this.state.song.map(node => {
      if (node.id === audioNodeId) {
        node.endTime = Date.now();
      }
      return node;
    })];
    this.setState({
      song: updatedSong,
    });
  }

  startRecording = () => {
    this.setState({
      isRecording: true,
      recordStartTime: Date.now(),
    });
  }

  stopRecording = () => {
    const hasSong = Boolean(this.state && this.state.song.length);
    this.setState({
      song: this.songToOptions(this.state.song),
      isRecording: !this.state.isRecording,
      showSaveDialog: hasSong,
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
      showSongNameForm: true,
    });
  }

  playSong = () => {
    this.setState({
      isPlaying: true,
    });
  }

  selectSong = name => {
    this.setState({
      selectedSong: find(this.state.songsList, { name }),
    });
  }

  resetPlay = id => {
    const lastId = this.state.scheduled[this.state.scheduled.length - 1].id;
    if (lastId === id) {
      this.setState({
        isPlaying: false,
      })
    }
  }

  loadSongsFromStorage = () => {
    let songs = [];
    try {
      songs = JSON.parse(localStorage.getItem('songs'));
    } catch (e) {
    }
    return songs;
  }

  handleSaveNewSong = event => {
    event.preventDefault();
    const songsListLength = this.state.songsList && this.state.songsList.length ? this.state.songsList.length : 0;
    const name = this.input.current.value || `song-${songsListLength + 1}`
    const newSongsList = [
      {
        name,
        value: this.state.song
      },
      ...(this.state.songsList && this.state.songsList.length
        ? this.state.songsList
        : []),
    ];
    localStorage.setItem(
      'songs',
      JSON.stringify(newSongsList)
    )
    this.setState({
      showSaveDialog: false,
      showSongNameForm: false,
      songsList: newSongsList,
    });
    this.input.current.value = '';
  }

  setScheduled = scheduled => {
    this.setState({
      scheduled,
    });
  }

  stopScheduled = () => {
    this.state.scheduled.forEach(node => {
      if (node && typeof node.stop === 'function') {
        node.stop();
      }
    });
    this.setState({
      isPlaying: false,
    });
  }

  render() {
    const {
      song,
      isPlaying,
      songsList,
      isRecording,
      selectedSong,
      showSaveDialog,
      showSongNameForm,
    } = this.state;

    const {
      playSong,
      resetPlay,
      saveRecord,
      selectSong,
      setScheduled,
      stopScheduled,
      discartRecord,
      stopRecording,
      addNodeToSong,
      startRecording,
      setNodeEndTime,
      handleSaveNewSong,
    } = this;

    return (
      <div className="app">
        <h1>Piano</h1>
        <ControlPanel
          playSong={playSong}
          isPlaying={isPlaying}
          saveRecord={saveRecord}
          isRecording={isRecording}
          selectedSong={selectedSong}
          discartRecord={discartRecord}
          stopRecording={stopRecording}
          stopScheduled={stopScheduled}
          showSaveDialog={showSaveDialog}
          startRecording={startRecording}
        />

        <SongNameForm
          ref={this.input}
          showSongNameForm={showSongNameForm}
          handleSaveNewSong={handleSaveNewSong} />

        <div>
          <MyPiano
            song={song}
            isPlaying={isPlaying}
            resetPlay={resetPlay}
            isRecording={isRecording}
            setScheduled={setScheduled}
            selectedSong={selectedSong}
            addNodeToSong={addNodeToSong}
            showSaveDialog={showSaveDialog}
            setNodeEndTime={setNodeEndTime}
          />
        </div>

        <SongsList songsList={songsList} selectSong={selectSong} selectedSong={selectedSong} />
      </div>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
