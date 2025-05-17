import { useState } from "react"
import axios from "axios"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:8080/card/searchForCommander', 
            {keyword: searchInput, colors: searchColor})
    }

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
            
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Commander Search"
                    onChange={handleChange}
                    value={searchInput}
                />
                <button>Find A Commander</button>
            </form>
        </div>
    )
}