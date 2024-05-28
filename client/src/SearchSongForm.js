import React, {useState} from 'react';
import axios from 'axios';

function SearchSongForm({onSongFound, onResetSearch, hasResults}) {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleChange = (evt) => {
        setSearchTerm(evt.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`${process.env.REACT_APP_API_URL}`);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/songs/search?name=${searchTerm}`);
            onSongFound(response.data);
        } catch (error) {
            console.error('Error searching songs: ', error.response.data.message);
        }
    };

    const handleReset = () => {
        setSearchTerm('');
        onResetSearch();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={searchTerm} onChange={handleChange} placeholder="search song by name" required />
            <button type="submit">search</button>
            {hasResults && <button type="button" onClick={handleReset}>reset search</button>}
        </form>
    );
}

export default SearchSongForm;
