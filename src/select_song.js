import React from 'react';
import ReactDOM from 'react-dom';
import "./select_song.css"

class SelectSong extends React.Component {
    render() {
        return (
            <div className='background-color'>
                <div className='head'>
                    <div className='headline'></div>
                    <div className='headline2'></div>
                    <h1 className='headname'>Select Song</h1>
                </div>
                <div className='body'>
                    <div className='blocksong'>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectSong;