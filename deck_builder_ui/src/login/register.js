import { useState, useEffect } from "react"
import api from "../api/axios";

export function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            setPasswordError(true);
        } else {
            setPasswordMismatch(false);
            setPasswordError(false);
        }
    }, [password, confirmPassword])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwordMismatch) {
            setError("Passwords do not match.");
            return;
        }

        try{ 
            const response = api.post('/register', {
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
                    type="email"
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
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" 
                />
                {passwordMismatch && (
                    <p style={{ color: 'red' }}>Passwords do not match.</p>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={passwordMismatch}>
                    Submit
                </button>
            </form>
        </div>
    )
}