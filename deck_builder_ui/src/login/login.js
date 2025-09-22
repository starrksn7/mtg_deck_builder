import { useState } from "react"
import api from "../api/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{ 
            const response = await api.post('/login', {
                email,
                password
            })
            console.log(response)
            const token = response.data.token
            const userId = response.data.user.id

            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Login successful.')
            navigate(`/user/${userId}`)
        } catch (err){
            setError('Login failed.')
            console.error(err)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email" 
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                />
                <button type="submit">Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}