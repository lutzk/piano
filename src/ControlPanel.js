import React from "react";

const ControlPanel = ({
    playSong,
    isPlaying,
    saveRecord,
    isRecording,
    selectedSong,
    discartRecord,
    stopRecording,
    stopScheduled,
    showSaveDialog,
    startRecording,
}) => {
    return (
        <div className="controlPanel">
            {!showSaveDialog && isRecording &&
                <button
                    onClick={stopRecording}
                    disabled={showSaveDialog}>stop record </button>}

            {!isPlaying && !showSaveDialog && !isRecording &&
                <button
                    onClick={startRecording}
                    disabled={showSaveDialog}>start record</button>}

            {!isPlaying && !showSaveDialog && !isRecording && selectedSong &&
                <button
                    onClick={playSong}
                    disabled={showSaveDialog}>play song</button>}

            {isPlaying &&
                <button
                    onClick={stopScheduled}
                    disabled={showSaveDialog}>stop song</button>}

            {showSaveDialog && <div className="saveDialog">
                {<button onClick={saveRecord}>save record</button>}
                {<button onClick={discartRecord}>discart record</button>}
            </div>}

            {isRecording && <div className="recordIndicator">
                <span className="recordIndicator__text">recording</span>
                <span className="recordIndicator__light"></span></div>}
        </div>);
};

export default ControlPanel;
