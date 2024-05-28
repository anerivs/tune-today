import React from 'react';
import SearchSongForm from './SearchSongForm';
import AddSongForm from './AddSongForm';

import {useState, useEffect} from 'react';
import axios from 'axios';

function Home({isLoggedIn}){
    const [currentSong, setCurrentSong] = useState(null); 
    const [searchResults, setSearchResults] = useState([]);
    const [songs, setSongs] = useState([]);
    const [username, setUsername] = useState('');

    //fetch da songs
    useEffect(()=>{
        const fetchSongs = async () =>{
        try{
            console.log(`${process.env.REACT_APP_API_URL}`);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/songs`);
            const sortedSongs = response.data.sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded));
            setSongs(sortedSongs);
        }catch(error){
            console.error('error fetching songs', error.response.data.message);
        }
        };

        fetchSongs();

        const user = JSON.parse(localStorage.getItem('user'));
        if(user && user.username){
            setUsername(user.username);
        }
    }, []);

    //what to do when usr submits a song
    const handleSongAdded = (song) => {
        setCurrentSong(song);
        setSongs(prevSongs =>{
        const updatedSongs=[...prevSongs, song];
        return updatedSongs.sort((a, b) => new Date(b.dateRecorded)-new Date(a.dateRecorded));
        });
    };

    //what to do when usr searches for a song --> returns matched array
    const handleSongFound = (songs) => {
        setSearchResults(songs);
    };

    //what to do when usr hits reset search button --> reprints search form and resets song grid
    const handleResetSearch = () => {
        setSearchResults([]);
    }

    return(
        <div>
            <h1>welcome to tuned in today {username ? `, ${username}`:''}!</h1>
            {isLoggedIn && (!currentSong ? 
                <AddSongForm onSongAdded={handleSongAdded}/>:
                <div className="song-details">
                <h2>your song of the day: {currentSong.name} by {currentSong.artist}</h2>
                <p>year: {currentSong.year}</p>
                <p>album: {currentSong.album}</p>
                <p>date recorded: {new Date(currentSong.dateRecorded).toLocaleDateString()}</p>
                </div>
            )}
            <h4>search for a song here:</h4>
                <SearchSongForm onSongFound={handleSongFound} onResetSearch={handleResetSearch} className="searchForm" hasResults={searchResults.length > 0}/>
            {songs.length>0 && (
                <div>
                    <h2>what others are listening to:</h2>
                    <div className="song-grid">
                        {searchResults.length>0 ? ( //map out search results
                            searchResults.map(song =>(
                            <div key={song._id} className="song-box">
                                <h2>{song.name} by {song.artist}</h2>
                                <p>year: {song.year}</p>
                                <p>album: {song.album}</p>
                                <p>date recorded: {new Date(song.dateRecorded).toDateString()}</p>
                            </div>
                            ))
                        ):(
                            songs.map(song => ( //we haven't searched for anything; show everything
                            <div key={song._id} className="song-box">
                                <h2>{song.name} by {song.artist}</h2>
                                <p>Year: {song.year}</p>
                                <p>Album: {song.album}</p>
                                <p>Date recorded: {new Date(song.dateRecorded).toDateString()}</p>
                            </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;