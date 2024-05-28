import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

//sign in
const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};

//sign out
const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};

//attempt to register
const register = (username, password) => {
  return new Promise(async (fulfill, reject) => {
    const findUser = await User.findOne({username: username});
    if(findUser){
      return reject({message: 'USERNAME ALREADY EXISTS'});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);
    const doc = new User({
      username: username,
      password: hashedPw
    });
    //try n save
    try{
      const savedUser = await doc.save();
      fulfill(savedUser);
    }catch(error){
      reject(error);
    }
  });
}

//attempt to login function
const login=(username, password)=>{
  return new Promise(async (fulfill, reject) => {
    const findUser = await User.findOne({username: username});
    if(!findUser){
      return reject({message: "USER NOT FOUND"});
    }
    const matchPw = bcrypt.compareSync(password, findUser.password);
    if(!matchPw){
      return reject({message: "PASSWORDS DO NOT MATCH"});
    }
    fulfill(findUser);
  });
};

export  {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
