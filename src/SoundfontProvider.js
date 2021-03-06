// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from "react";
import PropTypes from "prop-types";
import Soundfont from "soundfont-player";

class SoundfontProvider extends React.Component {
  static propTypes = {
    format: PropTypes.oneOf(["mp3", "ogg"]),
    hostname: PropTypes.string.isRequired,
    isPlaying: PropTypes.bool,
    resetPlay: PropTypes.func.isRequired,
    soundfont: PropTypes.oneOf(["MusyngKite", "FluidR3_GM"]),
    isRecording: PropTypes.bool.isRequired,
    setScheduled: PropTypes.func.isRequired,
    audioContext: PropTypes.instanceOf(window.AudioContext),
    selectedSong: PropTypes.object,
    addNodeToSong: PropTypes.func.isRequired,
    setNodeEndTime: PropTypes.func.isRequired,
    instrumentName: PropTypes.string.isRequired,
    render: PropTypes.func,
  };

  static defaultProps = {
    format: "mp3",
    soundfont: "MusyngKite",
    isPlaying: false,
    isRecording: false,
    selectedSong: null,
    instrumentName: "acoustic_grand_piano",
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
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
      }, _ => {
        this.state.instrument.on('ended', (_, id) => {
          if (this.props.isPlaying) {
            this.props.resetPlay(id);
          }
        })
      });
    });
  };

  replaySong = song => {
    const scheduled = this.state.instrument.schedule(0, song);
    this.props.setScheduled(scheduled);
  }

  playNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      if (this.props.isRecording) {
        this.props.addNodeToSong({
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
        this.props.setNodeEndTime(audioNode.id);
      }
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: null
        })
      });
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
