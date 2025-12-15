export const Header = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');
    
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    }

    if (token){
        return (
            <div>
                <div onClick={handleLogout}>Logout</div>
                <a href={`/user/${userId}`}>My Decks</a>
                <a href="/create">Create</a>
            </div>
        )
    }

    return (
        <div>
            <a href="/login">Login</a>
        </div>
    )
}