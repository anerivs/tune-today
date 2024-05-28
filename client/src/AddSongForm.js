import React, {useState, useEffect} from 'react';
import axios from 'axios';

function AddSongForm({onSongAdded}){
    console.log(process.env.REACT_APP_API_URL);
    const [formData, setFormData] = useState({
        name: '',
        artist: '',
        year: '',
        album:'',
        dateRecorded: '',
        userId: ''
    });
    useEffect(()=>{
        const storedData = localStorage.getItem('user');
        const user = storedData ? JSON.parse(storedData).user : null;
        console.log('user (addsongform): ', user.id);
        const userId = user ? user.id : null;
        setFormData(prevFormData => ({
            ...prevFormData,
            userId: userId
        }));
    },[]);
    const handleChange = (evt) =>{
        setFormData({...formData, [evt.target.name]: evt.target.value});
    };
    const handleSubmit = async(e) =>{
        e.preventDefault();
        if(!formData.userId){
            console.error('User not logged in or user ID not found.');
            return; 
        }
        try{
            axios.post(`${process.env.REACT_APP_API_URL}/api/songs`, formData, {
                withCredentials: true
            }).then(response=>{
                onSongAdded(response.data);
            }).catch(error=>{
                console.error('error adding song p1: ', error.response?.data?.message || error.message);
            });            
        }catch(error){
            console.error('error adding song: ', error.response.data.message);
        }
    };
    return(
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="song name" required />
            <input type="text" name="artist" value={formData.artist} onChange={handleChange} placeholder="artist" required />
            <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="year" required />
            <input type="text" name="album" value={formData.album} onChange={handleChange} placeholder="album" required />
            <input type="date" name="dateRecorded" value={formData.dateRecorded} onChange={handleChange} required />
            <button type="submit">add song</button>
        </form>
    );
}

export default AddSongForm;