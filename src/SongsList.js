import React from "react";

const SongsList = ({ songsList, selectSong, selectedSong }) => {
    if (songsList && songsList.length) {
        const baseClassName = 'songsList__song';
        return (
            <div className="songsList">
                {songsList.map(s => {
                    const finalClassName = selectedSong
                        ? `${baseClassName} ${(s.name === selectedSong.name ? baseClassName + '--active' : '')}`
                        : baseClassName;

                    return (
                        <div
                            key={s.name + s.value[1].duration}
                            title="click to play"
                            onClick={_ => selectSong(s.name)}
                            className={finalClassName}>
                            {s.name}
                        </div>)
                })}
            </div>);
    }
    return null;
};

export default SongsList;
