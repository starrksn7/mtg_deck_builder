import { useState } from "react"
import axios from "axios"
import { RenderColorOptions } from "../search/renderColorOptions"
import { getBaseColors } from "../helperFunctions"

export function CreateDeck(){
    const [searchColor, setSearchColor] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState([])

    const findCommanderWithSearch = async () => {
        const response = await axios.post('http://localhost:8080/card/searchForCommander', 
            {keyword: searchInput})
        
        let resultsArray = [];
        let data = response.data;
        data.forEach(entry => resultsArray.push(JSON.parse(entry)))

        setSearchResults(resultsArray);
    }

    const findCommanderByColor = async () => {
        const response = await axios.post('http://localhost:8080/card/findCommanderByColors',
            {colorIdentity: searchColor}
        )

        let resultsArray = [];
        let data = response.data;
        data.forEach(entry => resultsArray.push(JSON.parse(entry)))

        setSearchResults(resultsArray);
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
                <button type="submit">Find A Commander</button>
            </form>
            <div class="color-filter">
                <button class="dropdown-btn">Select Commander Color</button>
                <div class="dropdown-content">
                    <a href="#" data-color="mono">Mono-Color</a>
                    <a href="#" data-color="2-color">Two-Color</a>
                    <a href="#" data-color="3-color">Three-Color</a>
                    <a href="#" data-color="4-plus-color">Four or More Colors</a>
                </div>
            </div>
        </div>
    )
}