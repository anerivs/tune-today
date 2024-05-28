import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Login({setIsLoggedIn}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (event)=>{
        event.preventDefault();
        try{
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {username, password});
            console.log('result of trying to log in ', response.data);
            //localStorage.setItem('test', JSON.stringify({hey: "hi"}));
            localStorage.setItem('user', JSON.stringify({
                id: response.data.user.id, 
                username: response.data.user.username
            }));
            setIsLoggedIn(true);
            navigate('/');  //go home after logging in
        }catch (error){
            console.error('Login failed:', error.response.data.message);
            setError(error.response.data.message);
        }
    };

    return(
        <div>
            <h2>login here</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Login;
