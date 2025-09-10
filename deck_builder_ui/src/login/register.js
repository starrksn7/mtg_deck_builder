import { useState } from "react"
import axios from "axios";

export function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null);
    const [passwordMismatch, setPasswordMismatch] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        try{ 
            const response = axios.post('http://localhost:8080/register', {
                email,
                username,
                password
            })

            const token = response.data

            localStorage.setItem('jwt', token)
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Password" 
                />
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                />
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Password" 
                />
                <button type="submit">Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    )
}