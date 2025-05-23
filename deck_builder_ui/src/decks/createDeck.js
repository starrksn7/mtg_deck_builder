import { useState } from "react"
import axios from "axios"
import { RenderColorOptions } from "../search/renderColorOptions"
import { getBaseColors } from "../helperFunctions"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const findCommanderWithSearch = async () => {
        const response = await axios.post('http://localhost:8080/card/searchForCommander', 
            {keyword: searchInput})
    }

    const findCommanderByColor = async () => {
        const response = await axios.post('http://localhost:8080/card/findCommanderByColors',
            {colorIdentity: searchColor}
        )
    }

    const handleChange = (e) => {
        setSearchInput(e.target.value)
    }
            
    return (
        <div>
            <form onSubmit={findCommanderWithSearch}>
                <input
                    type="text"
                    placeholder="Commander Search"
                    onChange={handleChange}
                    value={searchInput}
                />
                <RenderColorOptions setColorIdentity={setSearchColor}/>
                <button type="submit">Find A Commander</button>
            </form>
        </div>
    )
}