import './config.mjs';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import express from 'express';
import {User, Playlist, Song} from './db.mjs';
import url from 'url'
import path from 'path'
import cors from 'cors';
import session from 'express-session';
import * as auth from './auth.mjs';


const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3001", 
    credentials: true, 
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

mongoose.connect(`${process.env.DSN}`).then(() => console.log("MongoDB is connected"))
.catch(err => console.error("Failed to connect to MongoDB:", err));

//setup for login
const authReqPaths=['/playlist/:id', '/profile'];
const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short"};

//////////////////////////////////////////
//middlewares
//is usr trying to access an auth page?
app.use((req, res, next)=>{
    if(authReqPaths.includes(req.path)){
        if(!req.session.user){
            console.log('log in');
            res.redirect('/login');
        }else{
            next();
        }
    }else{
        next();
    }
});
app.use((req, res, next)=>{
    res.locals.user = req.session.user;
    next();
});
//not required
app.use((req, res, next)=>{ 
    console.log('middleware: ')
    console.log(req.path.toUpperCase(), req.body);
    next();
});
//////////////////////////////////////

//home page
app.get('/', (req, res)=>{
    res.send('welcome to tuned in today!');
});

//search form
app.get('/api/songs/search', async (req, res)=>{
    const { name } = req.query;
    try {
        const regex = new RegExp(name, 'i'); // i for case insensitive
        const songs = await Song.find({ name: regex });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "we couldn't find any matches for your song :(" + error.message });
    }
});

//add song
app.post('/api/songs', async (req, res)=>{
    try {
        const {name, artist, year, album, dateRecorded, userId} = req.body;
        if(!userId){
            console.log('user id couldn\'t be found')
        }
        const newSong = new Song({name, artist, year, album, dateRecorded});
        const month = new Date(dateRecorded).toLocaleString('default', { month: 'long' });
        const fullYear = new Date(dateRecorded).getFullYear();
        const playlistName = `${month} ${fullYear}`;

        //checking if playlist exists
        // console.log('looking for playlist');
        // let playlist = await Playlist.findOne({name: playlistName, creator: userId});
        // if (!playlist) {
        //     console.log('creating new playlist.  user is ', userId);
        //     //if not, create a new playlist
        //     playlist = new Playlist({
        //         name: playlistName,
        //         creator: userId,
        //         slug: playlistName.toLowerCase().replace(/\s+/g, '-'),
        //         songs: []
        //     });
        //     console.log('creator of playlist', playlist.creator);
        //     console.log('trying again, creator of playlist', userId);
        //     await playlist.save();
        // }
        // console.log('adding song to playlist here p1');
        // //add song to playlist
        // playlist.songs.push(newSong);
        // console.log('adding song to playlist here p2');
        // await playlist.save();
        // console.log('adding song to playlist here p3');
        await newSong.save();
        
        res.status(201).json(newSong);

    } catch (error) {
        res.status(400).json({message: 'couldnt add song: '+error.message});
    }
});
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find({});
        res.json(songs);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/songs/:id', async(req, res)=>{
    try {
        const song = await Song.findById(req.params.id);
        if (!song) {
            return res.status(404).json({message: 'Song not found'});
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//show registration
app.post('/login', async (req, res)=>{
    try{ //successful login
        const user = await auth.login(sanitize(req.body.username), req.body.password);
        await auth.startAuthenticatedSession(req, user);
        res.json({message:'Login successful', user: {id: user._id, username: user.username}}); 
      }catch(err){ //invalid credentials
        console.log(err);
        //res.status(401).json({message: loginMessages[err.message]}); 
        return res.status(401).json({message: "combination not found. please register"});
      }
});

//register usr
app.post('/register', async (req, res)=>{
    try{ //success
        const {username, password}=req.body;
        
        if (!username || !password){
            return res.status(400).json({ message: "Username and password are required" });
        }

        //meets the requirements
        if(username.length < 5 || password.length < 8){
            return res.status(400).json({message: "username must be at least 5 characters, and password must be at least 8"});
        }       

        const newUser = await auth.register(sanitize(req.body.username), req.body.password);
        await auth.startAuthenticatedSession(req, newUser);
        res.status(201).json({message: 'registration successful', user: {id: newUser._id, username:newUser.username}})
      
    }catch(err){ //failure (usr alr exists)
        console.log(err);
        res.status(400).json({message: registrationMessages[err.message]}); 
      }
});

//retrieving the playlists under given profile
app.get('/profile', async (req, res)=>{
    if(!req.session.user){
        return res.status(401).json({message:'you must be logged in to view your profile'});
    }
    try{ //find playlists created by certain user
        const playlists = await Playlist.find({creator: req.session.user._id});
        res.json({user: req.session.user, playlists});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'There was a problem retrieving this profile'});
    }
});

//retrieves certain playlist under current user
app.get('/playlist/:id', async (req, res)=>{
    try{
        const list = await Playlist.findById(req.params.id).populate('songs');
        if(!list){
            res.status(404).json({message: 'playlist not found'});
        }
        res.json(list);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Could not retrieve this playlist'});
    }
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT}`));
