import React, {useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import AddSongForm from './AddSongForm';
import NavBar from './NavBar.js';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Home from './Home';
import './App.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //fetch da songs
  useEffect(()=>{
    const loggedInUser = localStorage.getItem('user');
    setIsLoggedIn(!!loggedInUser);
     }, []);

  return(
    <div className="App">
      <Router>
        <NavBar isLoggedIn={isLoggedIn}/>
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/add-song" element={<AddSongForm isLoggedIn={isLoggedIn}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;