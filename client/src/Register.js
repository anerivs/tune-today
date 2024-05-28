import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Register({setIsLoggedIn}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async(event)=>{
        event.preventDefault();
        try{
            console.log(`${process.env.REACT_APP_API_URL}`);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {username, password});
            console.log(response.data);
            setIsLoggedIn(true);
            navigate('/login');  //login after registering
        }catch(error){
            console.error('registration failed:', error.response.data.message);
            setError(error.response.data.message);
        }
    };

    return(
        <div>
            <h2>register here</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">register</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Register;
