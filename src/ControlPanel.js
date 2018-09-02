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
        <div className="ControlPanel">
            ControlPanel
            &nbsp;
            {isRecording &&
                <button
                    onClick={stopRecording}
                    disabled={showSaveDialog}>stop record</button>}

            {!isRecording &&
                <button
                    onClick={startRecording}
                    disabled={showSaveDialog}>start record</button>}

            {!isRecording && selectedSong &&
                <button
                    onClick={playSong}
                    disabled={showSaveDialog}>play song</button>}

            {showSaveDialog && <div className="saveDialog">
                {<button onClick={saveRecord}>save record</button>}
                {<button onClick={discartRecord}>discart record</button>}
            </div>}
        </div>);
};

export default ControlPanel;
