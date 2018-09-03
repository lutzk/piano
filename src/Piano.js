import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import SoundfontProvider from './SoundfontProvider';

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'http://localhost:3000';

const noteRange = {
    first: MidiNumbers.fromNote('c3'),
    last: MidiNumbers.fromNote('f4'),
};

const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: noteRange.first,
    lastNote: noteRange.last,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const MyPiano = ({
    song,
    resetPlay,
    isPlaying,
    isRecording,
    selectedSong,
    setScheduled,
    addNodeToSong,
    showSaveDialog,
    setNodeEndTime,

}) => {
    return (
        <SoundfontProvider
            song={song}
            hostname={soundfontHostname}
            resetPlay={resetPlay}
            isPlaying={isPlaying}
            isRecording={isRecording}
            audioContext={audioContext}
            selectedSong={selectedSong}
            setScheduled={setScheduled}
            addNodeToSong={addNodeToSong}
            setNodeEndTime={setNodeEndTime}
            instrumentName="acoustic_grand_piano"
            render={({ isLoading, playNote, stopNote }) => (
                <Piano
                    width={500}
                    noteRange={noteRange}
                    onPlayNote={playNote}
                    onStopNote={stopNote}
                    disabled={isLoading || showSaveDialog}
                    keyboardShortcuts={keyboardShortcuts}
                />
            )}
        />
    );
}

export default MyPiano;
