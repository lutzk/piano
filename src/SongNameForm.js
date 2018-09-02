import React from "react";

const SongNameForm = React.forwardRef(({ showSongNameForm, handleSaveNewSong }, ref) => {
    if (showSongNameForm) {
        return (
            <div className="songNameForm"> 
                <form onSubmit={handleSaveNewSong}>
                    <input
                        ref={ref}
                        type="text"
                        className="newSongName"
                        placeholder="song name"
                         />
                    <button>save</button>
                </form>
            </div>
        );
    }
    return null;
});

export default SongNameForm;
