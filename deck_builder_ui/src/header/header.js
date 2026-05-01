import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../login/AuthContext";
import '../css/header.css'

export const Header = () => {
  const navigate = useNavigate();
  const { token, userId, username, logout } = useAuth();

  console.log("username = ", username)
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
              <Link to="" className="account_link">
                {username}
              </Link>
              <button
                className="header__link header__logout"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
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
