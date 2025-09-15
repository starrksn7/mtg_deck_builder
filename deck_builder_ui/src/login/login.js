import { useState } from "react"
import api from "../api/axios";

export function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{ 
            const response = await api.post('/login', {
                username,
                password
            })

            const token = response.data

            localStorage.setItem('jwt', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Login successful.')
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
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username" 
                />
                <input
                    type="text"
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