import React from "react";

const SongsList = ({ songsList, selectSong }) => {
    if (songsList && songsList.length) {
        return (
            songsList.map(s => {
                return (
                    <div
                        key={s.name + s.value[1].duration}
                        onClick={_ => selectSong(s.name)}
                        title="click to play">
                        {s.name}
                    </div>)
            }));
    }
    return null;
};

export default SongsList;
