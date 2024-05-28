import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Profile(){
    const [playlists, setPlaylists] = useState([]);

    useEffect(()=>{
        const fetchPlaylists=async ()=>{
            try{
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`);
                setPlaylists(response.data);
            }catch(error){
                console.error('Error fetching playlists:', error);
            }
        };

        fetchPlaylists();
    }, []);

    return(
        <div>
            <h2>your playlists</h2>
            {playlists.map(playlist => (
                <div key={playlist._id}>
                    <h3>{playlist.name}</h3>
                </div>
            ))}
        </div>
    );
}

export default Profile;
