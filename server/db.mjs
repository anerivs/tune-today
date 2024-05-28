import mongoose from 'mongoose';
const {Schema} = mongoose;

//song schema
const songSchema = new Schema({
    name: {type: String, required: true},
    artist: {type: String, required: true},
    year: {type: String, required: true},
    album: {type: String},
    dateRecorded: {type: Date, required: true}
});

//user schema
const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    slug: {type: String, required: false, unique: true},
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}],
    songOfTheDay: {type: Schema.Types.ObjectId, ref: 'Song'}
});

//playlist schema
const playlistSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: false},
    name: {type: String, required: false},
    slug: {type: String, required: false, unique: true},
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
});

//slug generation
userSchema.pre('save', function(next){
    console.log('slug');
    if (!this.isModified('username')) {
        return next();
    }
    this.slug = this.username.replace(/\s+/g, '-').toLowerCase();
    console.log(this.slug);
    next();
});
playlistSchema.pre('save', function(next){
    this.slug = `${this.creator}-${this.name.replace(/\s+/g, '-').toLowerCase()}`;
});

const User = mongoose.model('User', userSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);
const Song = mongoose.model('Song', songSchema);

export {User, Playlist, Song};