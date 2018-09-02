import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import SoundfontProvider from './SoundfontProvider';

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
    updateSong,
    isRecording,
    audioContext,
    selectedSong,
    addNoteToSong,
    showSaveDialog,
    recordStartTime,
    soundfontHostname,
}) => {
    return (
        <SoundfontProvider
            song={song}
            hostname={soundfontHostname}
            resetPlay={resetPlay}
            isPlaying={isPlaying}
            updateSong={updateSong}
            isRecording={isRecording}
            audioContext={audioContext}
            selectedSong={selectedSong}
            addNoteToSong={addNoteToSong}
            instrumentName="acoustic_grand_piano"
            recordStartTime={recordStartTime}
            render={({ isLoading, playNote, stopNote }) => (
                <Piano
                    width={300}
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
