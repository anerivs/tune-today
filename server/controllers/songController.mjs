import {Song} from '../db.mjs'

export const addSong = async (req, res) =>{
    try{
        const {name, artist, year, album, dateRecorded} = req.body;
        const newSong = new Song({name, artist, year, album, dateRecorded});
        await newSong.save();
        res.status(201).json(newSong);
    }catch(error){
        res.status(400).json({message: error.message});
    }
};

export const getSong = async (req, res) =>{
    try{
        const song = await Song.findById(req.params.id);
        if(!song){
            return res.status(404).json({message: 'Song not found'});
        }
        res.json(song);
    } catch(error){
        res.status(500).json({message:error.message});
    }
};