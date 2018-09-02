import React from "react";

const SongNameForm = React.forwardRef(({ showSongNameForm, handleSaveNewSong }, ref) => {
    if (showSongNameForm) {
        return (
            <div>
                <form onSubmit={handleSaveNewSong}>
                    <input type="text" placeholder="song name" ref={ref} />
                    <button>save</button>
                </form>
            </div>
        );
    }
    return null;
});

export default SongNameForm;
