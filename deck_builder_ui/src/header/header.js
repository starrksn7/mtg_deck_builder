import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Header = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("jwt"));
    const userId = localStorage.getItem("userId");

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("userId");
        setToken(null);
        navigate("/login");
    };

    if (token) {
        return (
            <div>
                <Link to={`/user/${userId}`}>My Decks</Link>
                <Link to="/create">Create</Link>
                <Link   
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}>
                        Logout
                    </Link>

            </div>
        );
    }

    return (
        <div>
            <a href="/login">Login</a>
        </div>
    );
};
