import { useState } from "react"
import axios from "axios"
import { RenderColorOptions } from "../search/renderColorOptions"
import { getBaseColors } from "../helperFunctions"
import { CascadingDropdown } from "../search/cascadingDropdown"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState([])


    const findCommanderWithSearch = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8080/card/searchForCommanderByName', 
            {keyword: searchInput})
        
        const resultsArray = response.data.map(entry => JSON.parse(entry));
        setSearchResults(resultsArray);
    }

    const findCommanderByColor = async (searchColor) => {
        const color = getBaseColors(searchColor.toLowerCase());
        console.log("XXXXXXXXX")
        console.log(searchColor)
        console.log(color)
        console.log("XXXXXXXXX")
        const response = await axios.post('http://localhost:8080/card/searchForCommanderByColors',
            {colorIdentity: searchColor}
        )

        const resultsArray = response.data.map(entry => JSON.parse(entry));
        setSearchResults(resultsArray);
    }

    const handleDropdownSelection = (selectedColor) => {
        setSearchColor(selectedColor);
        findCommanderByColor(selectedColor);
    }

            
    return (
        <div>
            <form onSubmit={findCommanderWithSearch}>
                <input
                    type="text"
                    placeholder="Commander Search"
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                />
                <button type="submit">Find A Commander</button>
            </form>
            <CascadingDropdown onColorSelect={handleDropdownSelection} />
        </div>
    )
}