import { useState, useEffect } from "react"
import api from "../api/axios";
import zxcvbn from "zxcvbn";

export function Register() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(null);

    useEffect(() => {
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            setPasswordError(true);
        } else {
            setPasswordMismatch(false);
            setPasswordError(false);
        }
    }, [password, confirmPassword])

    useEffect(() => {
        if (password) {
            const result = zxcvbn(password);
            setPasswordStrength(result.score); // 0–4
        } else {
            setPasswordStrength(null);
        }

        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            setPasswordError(true);
        } else {
            setPasswordMismatch(false);
            setPasswordError(false);
        }
    }, [password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordMismatch) {
            setError("Passwords do not match.");
            return;
        }

        try{ 
            const response = await api.post('/register', {
                email,
                username,
                password,
                role: "user"
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
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
                    Already have an account? <a href="/login">Login</a>
                </p>
                <h2>Register</h2>
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

                {passwordStrength !== null && (
                    <div className="password-strength">
                        <div className={`strength-bar strength-${passwordStrength}`}></div>
                        <p>
                            {["Very Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength]}
                        </p>
                    </div>
                )}

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password" 
                    className={passwordMismatch ? "input-error" : ""}
                />

                {passwordMismatch && (
                    <p className="error">Passwords do not match.</p>
                )}

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={passwordMismatch}>
                    Submit
                </button>
            </form>
        </div>
    )
}