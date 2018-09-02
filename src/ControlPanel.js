import React from "react";

const ControlPanel = ({
    playSong,
    saveRecord,
    isRecording,
    selectedSong,
    discartRecord,
    stopRecording,
    showSaveDialog,
    startRecording,
}) => {
    return (
        <div className="controlPanel">
            {!showSaveDialog && isRecording &&
                <button
                    onClick={stopRecording}
                    disabled={showSaveDialog}>stop record </button>}

            {!showSaveDialog && !isRecording &&
                <button
                    onClick={startRecording}
                    disabled={showSaveDialog}>start record</button>}

            {!showSaveDialog && !isRecording && selectedSong &&
                <button
                    onClick={playSong}
                    disabled={showSaveDialog}>play song</button>}

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
