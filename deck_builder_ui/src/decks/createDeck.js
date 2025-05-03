import { SearchBar } from "../search/searchBar"
import { useState } from "react"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')

    return (
        <SearchBar setSearchColor={setSearchColor}/>
    )
}