import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../login/AuthContext";
import { useState } from "react";
import '../css/header.css';

export const Header = () => {
  const navigate = useNavigate();
  const { token, userId, username, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <nav className="header__nav">
        {token ? (
          <>
            <div className="header__left">
              <Link to={`/user/${userId}`} className="header__link">
                My Decks
              </Link>
              <Link to="/create" className="header__link">
                Create A Deck
              </Link>
            </div>

            <div className="header__right">
              <div 
                className="account_menu"
                onClick={() => setOpen(!open)}
              >
                <div className="account_trigger">
                  <div className="avatar">
                    {username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="username">{username}</span>
                </div>

                {open && (
                  <div className="dropdown">
                    <button
                      className="dropdown_item"
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="header__right">
            <Link to="/login" className="header__link">
              Login/Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};