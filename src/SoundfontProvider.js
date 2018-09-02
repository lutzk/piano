// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from "react";
import PropTypes from "prop-types";
import Soundfont from "soundfont-player";

class SoundfontProvider extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(["mp3", "ogg"]),
    soundfont: PropTypes.oneOf(["MusyngKite", "FluidR3_GM"]),
    audioContext: PropTypes.instanceOf(window.AudioContext),
    isRecording: PropTypes.bool.isRequired,
    addNoteToSong: PropTypes.func.isRequired,
    selectedSong: PropTypes.object,
    song: PropTypes.array,
    resetPlay: PropTypes.func.isRequired,
    updateSong: PropTypes.func.isRequired,
    recordStartTime: PropTypes.number,
    render: PropTypes.func,
  };

  static defaultProps = {
    format: "mp3",
    soundfont: "MusyngKite",
    instrumentName: "acoustic_grand_piano",
    isRecording: false,
    isPlaying: false,
    song: [],
    selectedSong: null,
    recordStartTime: null
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
      song: [],
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName);
    }

    if (!prevProps.isPlaying && this.props.isPlaying) {
      this.replaySong(this.props.selectedSong.value);
    }

    if (prevProps.isRecording && !this.props.isRecording) {
      this.props.updateSong(this.songToOptions(this.state.song));
    }
  }

  loadInstrument = instrumentName => {
    // Re-trigger loading state
    this.setState({
      instrument: null
    });
    Soundfont.instrument(this.props.audioContext, instrumentName, {
      format: this.props.format,
      nameToUrl: (name, _, format) => {
        return `${this.props.hostname}/${name}-${format}.js`;
      }
    }).then(instrument => {
      this.setState({
        instrument
      });
    });
  };

  addNoteToSong = ({ id, midi, startTime }) => {
    this.state.song.push({ id, midi, startTime })
  }

  songToOptions = song => song.map(s => {
    let time = parseFloat(parseFloat((s.startTime - this.props.recordStartTime) / 1000).toFixed(2));
    time = time === -0 ? 0.1 : time;
    const duration = parseFloat(parseFloat((s.endTime - s.startTime) / 1000).toFixed(2));

    return {
      midi: s.midi,
      time: time < 0 ? 0.1 : time,
      duration,
    }
  });

  replaySong = song => {
    this.state.instrument.schedule(0, song);
    this.props.resetPlay();
  }

  playNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      if (this.props.isRecording) {
        this.addNoteToSong({
          id: audioNode.id,
          midi: midiNumber,
          startTime: Date.now()
        });
      }

      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode
        })
      });
    });
  };

  stopNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();

      if (this.props.isRecording) {
        const updatedSong = [...this.state.song.map(s => {
          if (s.id === audioNode.id) {
            s.endTime = Date.now();
          }
          return s;
        })]

        this.setState({
          song: updatedSong,
          activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
            [midiNumber]: null
          })
        }, _ => {
          this.props.updateSong(this.songToOptions(this.state.song));
        });
      } else {
        this.setState({
          activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
            [midiNumber]: null
          })
        });
      }

    });
  };

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
    this.props.audioContext.resume().then(() => {
      const activeAudioNodes = Object.values(this.state.activeAudioNodes);
      activeAudioNodes.forEach(node => {
        if (node) {
          node.stop();
        }
      });
      this.setState({
        activeAudioNodes: {}
      });
    });
  };

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes
    });
  }
}

export default SoundfontProvider;
