export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')

    return (
        <SearchBar setSearchColor={setSearchColor}/>
    )
}