import { useState } from "react"
import axios from "axios"
import { RenderColorOptions } from "../search/renderColorOptions"
import { getBaseColors } from "../helperFunctions"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:8080/card/searchForCommander', 
            {keyword: searchInput, colors: searchColor})
    }

    const handleChange = (e) => {
        let colors = getBaseColors(e.target.value)
        setSearchInput(colors)
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
                <RenderColorOptions setColorIdentity={setSearchColor}/>
                <button>Find A Commander</button>
            </form>
        </div>
    )
}