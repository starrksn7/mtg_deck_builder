export const Header = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');


    return (
        <div>
            <a href="/login">Login</a>
            <a href={`/user/${userId}`}>My Decks</a>
            <a href="/create">Create</a>
        </div>
    )
}