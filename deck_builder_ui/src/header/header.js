import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../login/AuthContext";

export const Header = () => {
    const navigate = useNavigate();
    const { token, userId, logout } = useAuth();

    if (token) {
        return (
            <div>
                <Link to={`/user/${userId}`}>My Decks</Link>
                <Link to="/create">Create</Link>
                <Link   
                    to="#"
                    onClick={(e) => {
                        e.preventDefault();
                        logout();
                        navigate("/login");
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
